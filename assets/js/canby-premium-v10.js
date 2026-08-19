
(() => {
  'use strict';
  const d=document,q=(s,r=d)=>r.querySelector(s),qa=(s,r=d)=>[...r.querySelectorAll(s)];
  const locale=(d.body?.dataset.language||d.documentElement.lang||'en').slice(0,2);
  const copy={
    en:{sent:'Screening received.',thanks:'Thank you. Our team will review your screening and contact you if we would like to schedule an in-person interview.',sending:'Sending screening…',error:'We could not submit the screening. Please check the fields or call the clinic.'},
    es:{sent:'Evaluación recibida.',thanks:'Gracias. Nuestro equipo revisará su evaluación y se comunicará con usted si queremos programar una entrevista en persona.',sending:'Enviando evaluación…',error:'No pudimos enviar la evaluación. Revise los campos o llame a la clínica.'},
    hy:{sent:'Հարցաշարը ստացվել է։',thanks:'Շնորհակալություն։ Մեր թիմը կվերանայի հարցաշարը և կապ կհաստատի, եթե ցանկանա կազմակերպել անձնական հարցազրույց։',sending:'Հարցաշարն ուղարկվում է…',error:'Չհաջողվեց ուղարկել հարցաշարը։ Ստուգեք դաշտերը կամ զանգահարեք կլինիկա։'}
  }[locale]||null;
  // Remove any old meter that was injected before V10 loaded.
  qa('.v10-booking-form .aw-form-meter,.v10-volunteer-form .aw-form-meter').forEach(m=>{const n=m.nextElementSibling;if(n&&n.tagName==='SMALL')n.remove();m.remove()});
  // Make volunteer navigation current on both screening subpages.
  if(/volunteer|voluntario|voluntariado/.test(location.pathname.toLowerCase()))qa('.cf-main-nav a,.cf-mobile-panel a').forEach(a=>{if(/volunteer\.html|voluntariado\.html/.test(a.getAttribute('href')||''))a.setAttribute('aria-current','page')});
  qa('[data-v10-volunteer-form]').forEach(form=>form.addEventListener('submit',async e=>{
    e.preventDefault();const status=q('[data-volunteer-status]',form),err=q('[data-volunteer-error]',form),button=q('button[type="submit"]',form);if(err){err.hidden=true;err.textContent=''};if(!form.reportValidity())return;
    const days=qa('input[name="availability_days"]:checked',form).map(x=>x.value);if(!days.length){if(err){err.textContent=locale==='es'?'Seleccione al menos un día disponible.':locale==='hy'?'Ընտրեք առնվազն մեկ հասանելի օր։':'Choose at least one day you are usually available.';err.hidden=false}return}
    const data=Object.fromEntries(new FormData(form).entries());data.availability_days=days;data.language=locale;data.sourcePath=location.pathname;data.timezone=Intl.DateTimeFormat().resolvedOptions().timeZone||'';
    button.disabled=true;if(status)status.textContent=copy.sending;
    try{const r=await fetch('/api/volunteer',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data),credentials:'same-origin'});const out=await r.json().catch(()=>({}));if(!r.ok||!out.ok)throw new Error(out.error||String(r.status));const success=d.createElement('div');success.className='v10-vol-success';success.setAttribute('role','status');success.innerHTML=`<h2>${copy.sent}</h2><p>${copy.thanks}</p><p><strong>${out.applicationId||''}</strong></p>`;form.replaceWith(success);success.scrollIntoView({behavior:'smooth',block:'center'})}catch(ex){if(err){err.textContent=copy.error;err.hidden=false}if(status)status.textContent='';console.warn('Volunteer screening failed',ex?.message||ex)}finally{button.disabled=false}
  }));
})();
