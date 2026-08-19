const crypto = require('node:crypto');
const clean=(v,max=700)=>String(v??'').trim().slice(0,max);
const appId=()=>`VOL-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
function bodyOf(req){if(req.body&&typeof req.body==='object')return req.body;if(typeof req.body==='string')return JSON.parse(req.body||'{}');return {}}
function validate(x){
  const required=['application_type','first_name','last_name','email','phone','adult_18_plus','motivation','preferred_daypart','cadence','training_ack'];
  if(required.some(k=>!clean(x[k])))return 'missing-required-fields';
  if(!/^\S+@\S+\.\S+$/.test(clean(x.email,180)))return 'invalid-email';
  if(!['medical','nonmedical'].includes(clean(x.application_type,20)))return 'invalid-application-type';
  const days=Array.isArray(x.availability_days)?x.availability_days:[x.availability_days].filter(Boolean);if(!days.length)return 'availability-required';
  if(x.application_type==='medical'&&!clean(x.professional_role,120))return 'professional-role-required';
  if(x.application_type==='medical'&&!clean(x.scope_ack,20))return 'scope-ack-required';
  return '';
}
function safePayload(raw,id){
  const days=Array.isArray(raw.availability_days)?raw.availability_days.map(x=>clean(x,20)).slice(0,7):[clean(raw.availability_days,20)].filter(Boolean);
  return {applicationId:id,receivedAt:new Date().toISOString(),application_type:clean(raw.application_type,20),first_name:clean(raw.first_name,80),last_name:clean(raw.last_name,80),email:clean(raw.email,180),phone:clean(raw.phone,40),city:clean(raw.city,100),languages:clean(raw.languages,220),adult_18_plus:clean(raw.adult_18_plus,10),professional_role:clean(raw.professional_role,120),specialty:clean(raw.specialty,180),license_number:clean(raw.license_number,120),license_state:clean(raw.license_state,120),license_expiration:clean(raw.license_expiration,20),years_experience:clean(raw.years_experience,10),bls_status:clean(raw.bls_status,20),area_of_interest:clean(raw.area_of_interest,180),experience:clean(raw.experience,700),motivation:clean(raw.motivation,700),resume_url:clean(raw.resume_url,350),availability_days:days,preferred_daypart:clean(raw.preferred_daypart,30),cadence:clean(raw.cadence,40),training_ack:clean(raw.training_ack,20),scope_ack:clean(raw.scope_ack,20),language:clean(raw.language,8),sourcePath:clean(raw.sourcePath,180),timezone:clean(raw.timezone,80)};
}
async function sendEmail(payload){
  const apiKey=clean(process.env.CANBY_RESEND_API_KEY,500),to=clean(process.env.CANBY_VOLUNTEER_NOTIFICATION_EMAIL||process.env.CANBY_APPOINTMENT_NOTIFICATION_EMAIL||'info@puravidacc.org',300),from=clean(process.env.CANBY_RESEND_FROM_EMAIL,300);
  if(!apiKey||!to||!from)return false;
  const rows=[
    ['Application ID',payload.applicationId],['Type',payload.application_type],['Name',`${payload.first_name} ${payload.last_name}`],['Email',payload.email],['Phone',payload.phone],['City',payload.city],['Languages',payload.languages],['18+',payload.adult_18_plus],
    ['Professional role',payload.professional_role],['Specialty',payload.specialty],['License / certification',payload.license_number],['State / issuer',payload.license_state],['License expiration',payload.license_expiration],['Years experience',payload.years_experience],['CPR / BLS',payload.bls_status],['Area of interest',payload.area_of_interest],['Relevant experience',payload.experience],['Motivation',payload.motivation],['Resume / profile',payload.resume_url],['Available days',payload.availability_days.join(', ')],['Preferred daypart',payload.preferred_daypart],['Cadence',payload.cadence],['Language',payload.language]
  ].filter(([,v])=>String(v||'').trim());
  const text=['New Canby volunteer screening','',...rows.map(([k,v])=>`${k}: ${v}`),'','This is an initial volunteer screening only. Complete any required interview, credentialing, background, confidentiality, training, or health-clearance steps separately before placement.'].join('\n');
  const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],subject:`Canby volunteer screening — ${payload.application_type} — ${payload.applicationId}`,text})});
  if(!r.ok)throw new Error(`volunteer-email-${r.status}`);return true;
}
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='POST')return res.status(405).json({ok:false,error:'method-not-allowed'});
  try{const raw=bodyOf(req);const error=validate(raw);if(error)return res.status(400).json({ok:false,error});const id=appId();const payload=safePayload(raw,id);const sent=await sendEmail(payload);if(!sent)return res.status(503).json({ok:false,error:'volunteer-email-not-configured'});return res.status(200).json({ok:true,applicationId:id,mode:'email'});}catch(err){console.error(err);return res.status(500).json({ok:false,error:'submission-failed'})}
};
