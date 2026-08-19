const crypto = require('node:crypto');
const allowedReasons = new Set(['new_patient','primary_care','preventive','medication','follow_up','testing_referral','pregnancy_prenatal','other']);
const allowedInsurance = new Set(['medi_cal','medicare','private','none','other']);
const clean=(v,max=180)=>String(v??'').trim().slice(0,max);
const clinicTodayISO=()=>{const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const m=Object.fromEntries(parts.filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));return `${m.year}-${m.month}-${m.day}`;};
const id=()=>`CANBY-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
function bodyOf(req){if(req.body&&typeof req.body==='object')return req.body;if(typeof req.body==='string')return JSON.parse(req.body||'{}');return {}}
function validate(x){const required=['first_name','last_name','dob','phone','email','reason','insurance_type','preferred_date','preferred_time'];if(required.some(k=>!clean(x[k])))return 'missing-required-fields';if(!/^\S+@\S+\.\S+$/.test(clean(x.email)))return 'invalid-email';if(!allowedReasons.has(clean(x.reason,50)))return 'invalid-reason';if(!allowedInsurance.has(clean(x.insurance_type,30)))return 'invalid-insurance';const dt=new Date(`${clean(x.preferred_date,10)}T12:00:00`);if(Number.isNaN(+dt)||[0,6].includes(dt.getDay()))return 'invalid-date';if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(clean(x.preferred_time,5)))return 'invalid-time';const t=clean(x.preferred_time,5);if(t<'09:00'||t>'16:30')return 'invalid-time';if(clean(x.preferred_date,10)<=clinicTodayISO())return 'invalid-date';return ''}
async function notifyMinimal(payload, staffUrl){
  const apiKey=clean(process.env.CANBY_RESEND_API_KEY,500),to=clean(process.env.CANBY_APPOINTMENT_NOTIFICATION_EMAIL,300),from=clean(process.env.CANBY_RESEND_FROM_EMAIL,300);
  if(!apiKey||!to||!from)return;
  const safeStaff=/^https:\/\//i.test(staffUrl||'')?staffUrl:'';
  const text=[`A new appointment request was received.`,`Request ID: ${payload.requestId}`,`Preferred date: ${payload.preferred_date}`,`Preferred time: ${payload.preferred_time}`,`Language: ${payload.language||'not specified'}`,safeStaff?`Open secure request: ${safeStaff}`:'Open the clinic-approved secure scheduling system to view patient details.'].join('\n');
  const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],subject:`New Canby appointment request — ${payload.requestId}`,text})});
  if(!r.ok)console.error('minimal notification email failed',r.status);
}
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='POST')return res.status(405).json({ok:false,error:'method-not-allowed'});
  try{
    const raw=bodyOf(req);if(clean(raw.website))return res.status(200).json({ok:true,requestId:id(),mode:'honeypot'});
    const error=validate(raw);if(error)return res.status(400).json({ok:false,error});
    const requestId=id();const payload={requestId,receivedAt:new Date().toISOString(),first_name:clean(raw.first_name,80),last_name:clean(raw.last_name,80),dob:clean(raw.dob,10),phone:clean(raw.phone,40),email:clean(raw.email,180),reason:clean(raw.reason,50),insurance_type:clean(raw.insurance_type,30),preferred_date:clean(raw.preferred_date,10),preferred_time:clean(raw.preferred_time,5),language:clean(raw.language,8),sourcePath:clean(raw.sourcePath,180),timezone:clean(raw.timezone,80)};
    const endpoint=clean(process.env.CANBY_SECURE_APPOINTMENT_ENDPOINT,500);if(!/^https:\/\//i.test(endpoint))return res.status(503).json({ok:false,error:'secure-appointment-endpoint-not-configured'});
    const headers={'Content-Type':'application/json','Accept':'application/json'};if(process.env.CANBY_SECURE_APPOINTMENT_TOKEN)headers.Authorization=`Bearer ${process.env.CANBY_SECURE_APPOINTMENT_TOKEN}`;
    const r=await fetch(endpoint,{method:'POST',headers,body:JSON.stringify(payload)});if(!r.ok)throw new Error(`secure-endpoint-${r.status}`);
    let out={};try{out=await r.json()}catch{}const staffUrl=typeof out.staffUrl==='string'&&/^https:\/\//i.test(out.staffUrl)?out.staffUrl:'';
    await notifyMinimal(payload,staffUrl);
    return res.status(200).json({ok:true,requestId,mode:'secure-endpoint'});
  }catch(err){console.error(err);return res.status(500).json({ok:false,error:'submission-failed'})}
}
