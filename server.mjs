import http from 'node:http';
import { readFile, stat, mkdir, appendFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {
  '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml',
  '.gltf':'model/gltf+json','.glb':'model/gltf-binary','.bin':'application/octet-stream','.webmanifest':'application/manifest+json','.xml':'application/xml; charset=utf-8'
};
const recent = new Map();
const allowedReasons = new Set(['new_patient','primary_care','preventive','medication','follow_up','testing_referral','pregnancy_prenatal','other']);
const clean = (v,max=180)=>String(v??'').trim().slice(0,max);
const clinicTodayISO=()=>{const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const m=Object.fromEntries(parts.filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));return `${m.year}-${m.month}-${m.day}`;};
const json = (res,status,body)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(body));};
const requestId = ()=>`CANBY-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

async function readJson(req, limit=16000){
  let size=0, chunks=[];
  for await (const chunk of req){size+=chunk.length;if(size>limit)throw new Error('payload-too-large');chunks.push(chunk)}
  return JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}');
}
function validAppointment(x){
  const required=['first_name','last_name','dob','phone','email','reason','preferred_date','preferred_time'];
  if(required.some(k=>!clean(x[k])))return 'missing-required-fields';
  if(!/^\S+@\S+\.\S+$/.test(clean(x.email,180)))return 'invalid-email';
  if(!allowedReasons.has(clean(x.reason,50)))return 'invalid-reason';
  const dt=new Date(`${clean(x.preferred_date,10)}T12:00:00`);if(Number.isNaN(+dt)||[0,6].includes(dt.getDay()))return 'invalid-date';
  if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(clean(x.preferred_time,5)))return 'invalid-time';
  const t=clean(x.preferred_time,5);if(t<'09:00'||t>'16:30')return 'invalid-time';
  if(clean(x.preferred_date,10)<=clinicTodayISO())return 'invalid-date';
  return '';
}
async function handleAppointment(req,res){
  const ip=clean(req.socket.remoteAddress,80);const now=Date.now();const last=recent.get(ip)||0;if(now-last<2500)return json(res,429,{ok:false,error:'rate-limited'});recent.set(ip,now);
  try{
    const raw=await readJson(req);if(clean(raw.website))return json(res,200,{ok:true,requestId:requestId(),mode:'honeypot'});
    const error=validAppointment(raw);if(error)return json(res,400,{ok:false,error});
    const id=requestId();
    const payload={
      requestId:id,receivedAt:new Date().toISOString(),
      first_name:clean(raw.first_name,80),last_name:clean(raw.last_name,80),dob:clean(raw.dob,10),phone:clean(raw.phone,40),email:clean(raw.email,180),
      reason:clean(raw.reason,50),preferred_date:clean(raw.preferred_date,10),preferred_time:clean(raw.preferred_time,5),language:clean(raw.language,8),
      sourcePath:clean(raw.sourcePath,180),timezone:clean(raw.timezone,80)
    };
    const endpoint=clean(process.env.CANBY_SECURE_APPOINTMENT_ENDPOINT,500);
    if(endpoint && /^https:\/\//i.test(endpoint)){
      const headers={'Content-Type':'application/json','Accept':'application/json'};
      if(process.env.CANBY_SECURE_APPOINTMENT_TOKEN)headers.Authorization=`Bearer ${process.env.CANBY_SECURE_APPOINTMENT_TOKEN}`;
      const r=await fetch(endpoint,{method:'POST',headers,body:JSON.stringify(payload)});
      if(!r.ok)throw new Error(`secure-endpoint-${r.status}`);
      let out={};try{out=await r.json()}catch{}
      return json(res,200,{ok:true,requestId:id,mode:'secure-endpoint',staffUrl:typeof out.staffUrl==='string'?out.staffUrl:''});
    }
    // Local QA only: durable enough for preview testing, never represented as production storage.
    const dir=path.join(root,'.canby-dev');await mkdir(dir,{recursive:true});await appendFile(path.join(dir,'appointment-requests.ndjson'),JSON.stringify(payload)+'\n',{mode:0o600});
    return json(res,200,{ok:true,requestId:id,mode:'local-preview'});
  }catch(err){console.error('appointment request error',err);return json(res,500,{ok:false,error:'submission-failed'});}
}


const volunteerId = ()=>`VOL-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
function validVolunteer(x){
  const required=['application_type','first_name','last_name','email','phone','adult_18_plus','motivation','preferred_daypart','cadence','training_ack'];
  if(required.some(k=>!clean(x[k])))return 'missing-required-fields';
  if(!/^\S+@\S+\.\S+$/.test(clean(x.email,180)))return 'invalid-email';
  if(!['medical','nonmedical'].includes(clean(x.application_type,20)))return 'invalid-application-type';
  const days=Array.isArray(x.availability_days)?x.availability_days:[x.availability_days].filter(Boolean);if(!days.length)return 'availability-required';
  if(x.application_type==='medical'&&!clean(x.professional_role,120))return 'professional-role-required';
  if(x.application_type==='medical'&&!clean(x.scope_ack,20))return 'scope-ack-required';
  return '';
}
async function handleVolunteer(req,res){
  try{
    const raw=await readJson(req,24000);const error=validVolunteer(raw);if(error)return json(res,400,{ok:false,error});
    const id=volunteerId();const days=Array.isArray(raw.availability_days)?raw.availability_days.map(x=>clean(x,20)).slice(0,7):[clean(raw.availability_days,20)].filter(Boolean);
    const payload={applicationId:id,receivedAt:new Date().toISOString(),application_type:clean(raw.application_type,20),first_name:clean(raw.first_name,80),last_name:clean(raw.last_name,80),email:clean(raw.email,180),phone:clean(raw.phone,40),city:clean(raw.city,100),languages:clean(raw.languages,220),adult_18_plus:clean(raw.adult_18_plus,10),professional_role:clean(raw.professional_role,120),specialty:clean(raw.specialty,180),license_number:clean(raw.license_number,120),license_state:clean(raw.license_state,120),license_expiration:clean(raw.license_expiration,20),years_experience:clean(raw.years_experience,10),bls_status:clean(raw.bls_status,20),area_of_interest:clean(raw.area_of_interest,180),experience:clean(raw.experience,700),motivation:clean(raw.motivation,700),resume_url:clean(raw.resume_url,350),availability_days:days,preferred_daypart:clean(raw.preferred_daypart,30),cadence:clean(raw.cadence,40),training_ack:clean(raw.training_ack,20),scope_ack:clean(raw.scope_ack,20),language:clean(raw.language,8),sourcePath:clean(raw.sourcePath,180),timezone:clean(raw.timezone,80)};
    // Local preview only. Production Vercel function sends this screening to the configured clinic inbox.
    const dir=path.join(root,'.canby-dev');await mkdir(dir,{recursive:true});await appendFile(path.join(dir,'volunteer-applications.ndjson'),JSON.stringify(payload)+'\n',{mode:0o600});
    return json(res,200,{ok:true,applicationId:id,mode:'local-preview'});
  }catch(err){console.error('volunteer screening error',err);return json(res,500,{ok:false,error:'submission-failed'});}
}

const server = http.createServer(async (req,res) => {
  try {
    const url=new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if(req.method==='POST' && url.pathname==='/api/appointments')return handleAppointment(req,res);
    if(req.method==='POST' && url.pathname==='/api/volunteer')return handleVolunteer(req,res);
    if(req.method==='OPTIONS' && (url.pathname==='/api/appointments'||url.pathname==='/api/volunteer')){res.writeHead(204,{'Allow':'POST, OPTIONS'});return res.end()}
    if(req.method!=='GET' && req.method!=='HEAD'){res.writeHead(405,{'Allow':'GET, HEAD, POST'});return res.end('Method not allowed')}
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') pathname = '/index.html';
    const candidate = path.resolve(root, '.' + pathname);
    if (!candidate.startsWith(root + path.sep) && candidate !== path.join(root,'index.html')) throw new Error('bad path');
    let target = candidate;
    const s = await stat(target);
    if (s.isDirectory()) target = path.join(target,'index.html');
    const data = await readFile(target);
    res.writeHead(200, {
      'Content-Type': types[path.extname(target).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': pathname.includes('/assets/hero/terminal-canby/') ? 'public, max-age=31536000, immutable' : 'no-cache',
      'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()','X-Frame-Options':'SAMEORIGIN'
    });
    if(req.method==='HEAD')return res.end();res.end(data);
  } catch {
    res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); res.end('Not found');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Canby site: http://127.0.0.1:${port}`));
