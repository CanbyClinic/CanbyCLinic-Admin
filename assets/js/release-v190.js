
(()=>{
  const reveal=()=>document.querySelectorAll('[data-release-reveal]').forEach(el=>el.classList.add('is-visible'));
  if(!('IntersectionObserver' in window)){reveal();return}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -40px'});
  document.querySelectorAll('[data-release-reveal]').forEach(el=>io.observe(el));
  document.querySelectorAll('[data-account-step-next]').forEach(btn=>btn.addEventListener('click',()=>{
    const cur=btn.closest('[data-account-step]'); if(!cur)return;
    const required=[...cur.querySelectorAll('[required]')];
    if(required.some(x=>!x.checkValidity())){required.find(x=>!x.checkValidity())?.reportValidity();return}
    cur.hidden=true; const next=document.querySelector(`[data-account-step="${Number(cur.dataset.accountStep)+1}"]`); if(next){next.hidden=false;next.querySelector('input,select,button')?.focus();scrollTo({top:0,behavior:'smooth'})}
  }));
  document.querySelectorAll('[data-account-step-back]').forEach(btn=>btn.addEventListener('click',()=>{
    const cur=btn.closest('[data-account-step]'); if(!cur)return;cur.hidden=true;const prev=document.querySelector(`[data-account-step="${Number(cur.dataset.accountStep)-1}"]`);if(prev){prev.hidden=false;prev.querySelector('input,select,button')?.focus();scrollTo({top:0,behavior:'smooth'})}
  }));
  const staticHost=location.hostname.endsWith('github.io')||location.protocol==='file:'||location.hostname==='127.0.0.1'||location.hostname==='localhost';
  const login=document.querySelector('#patientLogin');
  if(login) login.addEventListener('submit',async e=>{e.preventDefault();const s=document.querySelector('#loginStatus');const fd=new FormData(login);if(staticHost){s.textContent='Protected sign-in requires the clinic production server. Please use the published secure portal or call the clinic.';return}s.textContent='Signing in…';try{const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:fd.get('email'),password:fd.get('password')})});const d=await r.json();if(!r.ok)throw new Error(d.message||'Sign in failed.');location.href='patient-dashboard.html'}catch(err){s.textContent=err.message}});
  const intake=document.querySelector('#patientIntake');
  if(intake) intake.addEventListener('submit',async e=>{e.preventDefault();const status=document.querySelector('#intakeStatus');const fd=new FormData(intake);if(staticHost){status.textContent='Protected registration requires the clinic production server. Please call the clinic.';return}if(fd.get('password')!==fd.get('passwordConfirm')){status.textContent='Passwords do not match.';return}status.textContent='Submitting securely…';const obj=Object.fromEntries(fd.entries());delete obj.passwordConfirm;try{const r=await fetch('/api/patient-intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(obj)});const d=await r.json();if(!r.ok)throw new Error(d.message||'Submission could not be completed.');status.textContent=d.message||'Registration received. Check your email to continue.';intake.querySelector('button[type=submit]').disabled=true}catch(err){status.textContent=err.message}});
  const callback=document.querySelector('#appointmentRequest');
  if(callback) callback.addEventListener('submit',async e=>{e.preventDefault();const fd=new FormData(callback);const status=document.querySelector('#requestStatus');if(staticHost){status.textContent='Online callback requests require the clinic production server. Please call (818) 674-4414.';return}status.textContent='Sending…';try{const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(fd.entries()))});const d=await r.json();if(!r.ok)throw new Error(d.message||'Request could not be sent.');status.textContent='Request received. The clinic will follow up using your selected method.';callback.reset()}catch(err){status.textContent=err.message}});
})();
