
(() => {
  'use strict';
  const q=(s,p=document)=>p.querySelector(s), qa=(s,p=document)=>[...p.querySelectorAll(s)];
  function nav(){
    const groups=qa('.nav-group');
    groups.forEach(g=>{const b=q('.nav-trigger',g); if(!b)return; b.addEventListener('click',e=>{e.stopPropagation(); const open=!g.classList.contains('is-open'); groups.forEach(x=>{x.classList.remove('is-open');q('.nav-trigger',x)?.setAttribute('aria-expanded','false')}); if(open){g.classList.add('is-open');b.setAttribute('aria-expanded','true')}})});
    document.addEventListener('click',()=>groups.forEach(x=>{x.classList.remove('is-open');q('.nav-trigger',x)?.setAttribute('aria-expanded','false')}));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){groups.forEach(x=>{x.classList.remove('is-open');q('.nav-trigger',x)?.setAttribute('aria-expanded','false')});q('.publish-mobile-panel')?.classList.remove('is-open')}});
    const toggle=q('.publish-menu-toggle'), panel=q('.publish-mobile-panel');
    toggle?.addEventListener('click',()=>{const open=panel?.classList.toggle('is-open');toggle.setAttribute('aria-expanded',open?'true':'false')});
  }
  function motion(){
    const els=qa('[data-publish-motion]');
    if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('is-visible'));return}
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.14,rootMargin:'0px 0px -55px'});els.forEach(e=>io.observe(e));
  }
  function classify(){
    qa('main > section:not(.terminal-ambulance-hero)').forEach((s,i)=>{if(i<5&&!s.hasAttribute('data-publish-motion'))s.setAttribute('data-publish-motion','')});
  }
  function intake(){
    const form=q('#patientIntake'); if(!form)return;
    const pw=q('#intakePassword'), confirm=q('#intakePasswordConfirm'), status=q('#intakeStatus');
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      if(pw.value!==confirm.value){status.textContent='Passwords do not match.';confirm.focus();return}
      const staticHost=location.hostname.endsWith('github.io')||location.protocol==='file:'||location.hostname==='127.0.0.1'||location.hostname==='localhost';
      if(staticHost){status.textContent='Form design is ready, but protected intake submission is disabled until the clinic secure backend is connected. No information was sent or saved.';return}
      status.textContent='Submitting securely…';
      try{const res=await fetch('/api/patient-intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form).entries()))});if(!res.ok)throw new Error();form.reset();status.textContent='Intake received. Check your email for account verification.'}catch(err){status.textContent='Secure intake could not be submitted. Please call the clinic.'}
    });
  }
  function login(){
    const form=q('#patientLogin'),status=q('#loginStatus');if(!form)return;
    form.addEventListener('submit',async e=>{e.preventDefault();const staticHost=location.hostname.endsWith('github.io')||location.protocol==='file:'||location.hostname==='127.0.0.1'||location.hostname==='localhost';if(staticHost){status.textContent='Secure authentication backend is not connected on this preview. No credentials were sent.';return}status.textContent='Signing in…';try{const res=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form).entries()))});if(!res.ok)throw new Error();location.href='patient-dashboard.html'}catch(err){status.textContent='Sign-in failed. Check your information or contact the clinic.'}})
  }
  document.addEventListener('DOMContentLoaded',()=>{nav();classify();motion();intake();login()});
})();
