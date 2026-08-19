(() => {
  'use strict';
  const d=document, q=(s,r=d)=>r.querySelector(s), qa=(s,r=d)=>[...r.querySelectorAll(s)];
  const locale=(d.body?.dataset.language||d.documentElement.lang||'en').slice(0,2);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const routes={en:{appointment:'appointments.html',intake:'new-patient.html'},es:{appointment:'es-citas.html',intake:'es-nuevo-paciente.html'},hy:{appointment:'hy-appointments.html',intake:'hy-new-patient.html'}}[locale]||{appointment:'appointments.html',intake:'new-patient.html'};
  const copy={
    en:{title:'Request an appointment',intro:'Tell us when you would like to visit. Our scheduling team will call to confirm the appointment.',details:'Your details',visit:'Your visit',first:'First name',last:'Last name',dob:'Date of birth',phone:'Phone',email:'Email',reason:'Reason for visit',choose:'Choose the closest match',reasons:[['new_patient','New patient visit'],['primary_care','Primary care'],['preventive','Preventive care / screening'],['medication','Medication question'],['follow_up','Follow-up visit'],['testing_referral','Testing / referral question'],['pregnancy_prenatal','Pregnancy / prenatal question'],['other','Other / not sure']],date:'Preferred date',time:'Preferred time',send:'Request appointment',privacy:'Do not include detailed medical records, Social Security numbers, or insurance documents in this request.',notConfirmed:'This is a request. A member of our scheduling team will call to confirm the appointment.',call:'Call (818) 674-4414',sending:'Sending your request…',error:'We could not send the request. Please check the fields or call (818) 674-4414.',weekend:'Please choose a Monday–Friday date.',success:'Appointment request received.',thanks:'One of our technicians will contact you to confirm your appointment.',preferred:'Preferred visit',requestId:'Request ID',setup:'Complete short patient setup',done:'Done for now',secureMissing:'The secure patient intake connection is not active yet. Please call the clinic.',intakeSaved:'Your pre-visit information was submitted securely.',intakeSending:'Submitting securely…'},
    es:{title:'Solicitar una cita',intro:'Díganos cuándo desea venir. Nuestro equipo de programación le llamará para confirmar la cita.',details:'Sus datos',visit:'Su visita',first:'Nombre',last:'Apellido',dob:'Fecha de nacimiento',phone:'Teléfono',email:'Correo electrónico',reason:'Motivo de la visita',choose:'Elija la opción más cercana',reasons:[['new_patient','Paciente nuevo'],['primary_care','Atención primaria'],['preventive','Prevención / examen'],['medication','Pregunta sobre medicamentos'],['follow_up','Seguimiento'],['testing_referral','Pruebas / referencia'],['pregnancy_prenatal','Embarazo / prenatal'],['other','Otro / no estoy seguro']],date:'Fecha preferida',time:'Hora preferida',send:'Solicitar cita',privacy:'No incluya expedientes médicos detallados, números de Seguro Social ni documentos de seguro.',notConfirmed:'Esta es una solicitud. Nuestro equipo le llamará para confirmar la cita.',call:'Llamar al (818) 674-4414',sending:'Enviando su solicitud…',error:'No pudimos enviar la solicitud. Revise los campos o llame al (818) 674-4414.',weekend:'Elija una fecha de lunes a viernes.',success:'Solicitud de cita recibida.',thanks:'Uno de nuestros técnicos se comunicará con usted para confirmar su cita.',preferred:'Visita preferida',requestId:'ID de solicitud',setup:'Completar información breve',done:'Terminar por ahora',secureMissing:'La conexión segura del paciente aún no está activa. Llame a la clínica.',intakeSaved:'Su información previa fue enviada de forma segura.',intakeSending:'Enviando de forma segura…'},
    hy:{title:'Ուղարկել այցի հարցում',intro:'Նշեք, թե երբ եք ցանկանում այցելել։ Մեր ժամադրությունների թիմը կզանգահարի այցը հաստատելու համար։',details:'Ձեր տվյալները',visit:'Ձեր այցը',first:'Անուն',last:'Ազգանուն',dob:'Ծննդյան ամսաթիվ',phone:'Հեռախոս',email:'Էլ․ փոստ',reason:'Այցի պատճառ',choose:'Ընտրեք ամենամոտ տարբերակը',reasons:[['new_patient','Նոր պացիենտ'],['primary_care','Առաջնային խնամք'],['preventive','Կանխարգելիչ խնամք / ստուգում'],['medication','Դեղորայքի հարց'],['follow_up','Հետագա այց'],['testing_referral','Թեստ / ուղղորդում'],['pregnancy_prenatal','Հղիություն / նախածննդյան հարց'],['other','Այլ / վստահ չեմ']],date:'Նախընտրելի օր',time:'Նախընտրելի ժամ',send:'Ուղարկել հարցումը',privacy:'Մի ներառեք մանրամասն բժշկական գրառումներ, Սոցիալական ապահովության համարներ կամ ապահովագրական փաստաթղթեր։',notConfirmed:'Սա հարցում է։ Մեր ժամադրությունների թիմը կզանգահարի այցը հաստատելու համար։',call:'Զանգահարել (818) 674-4414',sending:'Հարցումն ուղարկվում է…',error:'Չհաջողվեց ուղարկել հարցումը։ Ստուգեք դաշտերը կամ զանգահարեք (818) 674-4414։',weekend:'Ընտրեք երկուշաբթիից ուրբաթ օր։',success:'Այցի հարցումը ստացվել է։',thanks:'Մեր տեխնիկական թիմի աշխատակիցներից մեկը կկապվի ձեզ հետ՝ այցը հաստատելու համար։',preferred:'Նախընտրելի այց',requestId:'Հարցման ID',setup:'Լրացնել կարճ տվյալները',done:'Ավարտել հիմա',secureMissing:'Անվտանգ պացիենտի համակարգը դեռ միացված չէ։ Զանգահարեք կլինիկա։',intakeSaved:'Նախայցային տվյալները անվտանգ ուղարկվել են։',intakeSending:'Անվտանգ ուղարկվում է…'}
  }[locale]||null;

  if(copy){Object.assign(copy, locale==='es'?{schedule:'Horario preferido',otherDate:'Elegir otro día entre semana',timeHelp:'Confirmaremos la hora exacta por teléfono.',insurance:'Tipo de seguro',insuranceChoose:'Elija una opción',insurancePrivate:'Seguro privado',insuranceNone:'Sin seguro',insuranceOther:'Otro / no estoy seguro'}:locale==='hy'?{schedule:'Նախընտրելի ժամանակը',otherDate:'Ընտրել մեկ այլ աշխատանքային օր',timeHelp:'Ճշգրիտ ժամը կհաստատենք հեռախոսով։',insurance:'Ապահովագրության տեսակ',insuranceChoose:'Ընտրեք տարբերակը',insurancePrivate:'Մասնավոր ապահովագրություն',insuranceNone:'Ապահովագրություն չունեմ',insuranceOther:'Այլ / վստահ չեմ'}:{schedule:'Preferred schedule',otherDate:'Choose another weekday',timeHelp:'We will confirm the exact time by phone.',insurance:'Insurance type',insuranceChoose:'Choose one',insurancePrivate:'Private insurance',insuranceNone:'No insurance',insuranceOther:'Other / not sure'});}
  const escapeHTML=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const today=()=>{const x=new Date();x.setMinutes(x.getMinutes()-x.getTimezoneOffset());return x.toISOString().slice(0,10)};
  const formatDate=s=>{if(!s)return '';const dt=new Date(`${s}T12:00:00`);try{return new Intl.DateTimeFormat(locale==='hy'?'hy-AM':locale==='es'?'es-US':'en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'}).format(dt)}catch{return s}};
  const formatTime=s=>{if(!s)return '';const [h,m]=s.split(':').map(Number);const dt=new Date(2000,0,1,h,m);try{return new Intl.DateTimeFormat(locale==='hy'?'hy-AM':locale==='es'?'es-US':'en-US',{hour:'numeric',minute:'2-digit'}).format(dt)}catch{return s}};

  function appointmentMarkup(){
    const options=copy.reasons.map(([v,l])=>`<option value="${v}">${escapeHTML(l)}</option>`).join('');
    const slots=[];for(let h=9;h<17;h++){for(const m of [0,30]){const v=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;const label=formatTime(v);slots.push(`<option value="${v}" ${v==='10:00'?'selected':''}>${escapeHTML(label)}</option>`)}}
    return `<form class="v9-booking-form v10-booking-form" data-appointment-form data-language="${locale}" novalidate>
      <div class="v10-form-note"><span>${escapeHTML(copy.notConfirmed)}</span><a href="tel:+18186744414">${escapeHTML(copy.call)}</a></div>
      <fieldset class="v10-form-section"><legend><span>01</span>${escapeHTML(copy.details)}</legend><div class="v10-field-grid">
        <label class="v10-field"><span>${escapeHTML(copy.first)}</span><input name="first_name" autocomplete="given-name" required></label>
        <label class="v10-field"><span>${escapeHTML(copy.last)}</span><input name="last_name" autocomplete="family-name" required></label>
        <label class="v10-field"><span>${escapeHTML(copy.dob)}</span><input name="dob" type="date" autocomplete="bday" required></label>
        <label class="v10-field"><span>${escapeHTML(copy.phone)}</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" required></label>
        <label class="v10-field v10-span-2"><span>${escapeHTML(copy.email)}</span><input name="email" type="email" autocomplete="email" required></label>
      </div></fieldset>
      <fieldset class="v10-form-section"><legend><span>02</span>${escapeHTML(copy.visit)}</legend><label class="v10-field"><span>${escapeHTML(copy.reason)}</span><select name="reason" required><option value="">${escapeHTML(copy.choose)}</option>${options}</select></label><label class="v10-field v14-insurance-field"><span>${escapeHTML(copy.insurance)}</span><select name="insurance_type" required><option value="">${escapeHTML(copy.insuranceChoose)}</option><option value="medi_cal">Medi-Cal</option><option value="medicare">Medicare</option><option value="private">${escapeHTML(copy.insurancePrivate)}</option><option value="none">${escapeHTML(copy.insuranceNone)}</option><option value="other">${escapeHTML(copy.insuranceOther)}</option></select></label></fieldset>
      <fieldset class="v10-form-section"><legend><span>03</span>${escapeHTML(copy.schedule)}</legend><div class="v10-schedule-grid">
        <div class="v10-date-control"><span class="v10-control-label">${escapeHTML(copy.date)}</span><div class="v10-date-options" data-v10-date-options></div><label class="v10-other-date"><span>${escapeHTML(copy.otherDate)}</span><input name="preferred_date" type="date" required></label></div>
        <label class="v10-time-control"><span class="v10-control-label">${escapeHTML(copy.time)}</span><select name="preferred_time" required>${slots.join('')}</select><small>${escapeHTML(copy.timeHelp)}</small></label>
      </div></fieldset>
      <input type="text" name="website" tabindex="-1" autocomplete="off" class="v9-honeypot" aria-hidden="true">
      <p class="v9-privacy-note">${escapeHTML(copy.privacy)}</p><div class="v9-form-error" data-booking-error role="alert" hidden></div>
      <button class="v9-submit" type="submit"><span>${escapeHTML(copy.send)}</span><i aria-hidden="true">↗</i></button><div class="v9-form-status" data-booking-status role="status" aria-live="polite"></div>
    </form>`;
  }

  function buildDrawer(){
    if(q('[data-v9-booking-drawer]')) return q('[data-v9-booking-drawer]');
    const wrap=d.createElement('div');wrap.className='v9-booking-drawer';wrap.hidden=true;wrap.dataset.v9BookingDrawer='';
    wrap.innerHTML=`<div class="v9-booking-backdrop" data-v9-booking-close></div><section class="v9-booking-panel" role="dialog" aria-modal="true" aria-labelledby="v9-booking-title"><div class="v9-booking-panel-head"><span>CANBY / APPOINTMENTS</span><button class="v9-booking-close" type="button" data-v9-booking-close aria-label="Close">×</button></div><div class="v9-booking-panel-body"><h2 id="v9-booking-title">${escapeHTML(copy.title)}</h2><p class="v9-drawer-intro">${escapeHTML(copy.intro)}</p>${appointmentMarkup()}</div></section>`;
    d.body.appendChild(wrap); wireAppointmentForms(wrap); return wrap;
  }
  let drawer=null,lastFocus=null,closeTimer=0;
  function resetDrawerIfNeeded(){
    if(!drawer||q('[data-appointment-form]',drawer))return;
    const body=q('.v9-booking-panel-body',drawer);if(!body)return;
    body.innerHTML=`<h2 id="v9-booking-title">${escapeHTML(copy.title)}</h2><p class="v9-drawer-intro">${escapeHTML(copy.intro)}</p>${appointmentMarkup()}`;
    wireAppointmentForms(body);
  }
  function openDrawer(trigger){
    drawer ||= buildDrawer();resetDrawerIfNeeded();
    const form=q('[data-appointment-form]',drawer); if(form) applyContext(form,trigger);
    lastFocus=trigger||d.activeElement;clearTimeout(closeTimer);drawer.hidden=false;requestAnimationFrame(()=>drawer.classList.add('is-open'));d.body.classList.add('v9-drawer-open');
    setTimeout(()=>q('input,select,button',q('.v9-booking-panel',drawer))?.focus(),reduced?0:180);
  }
  function closeDrawer(){if(!drawer)return;drawer.classList.remove('is-open');d.body.classList.remove('v9-drawer-open');let closed=false;const done=()=>{if(closed)return;closed=true;drawer.hidden=true;drawer.removeEventListener('transitionend',done);lastFocus?.focus?.()};if(reduced)done();else{drawer.addEventListener('transitionend',done);closeTimer=setTimeout(done,650)}}
  d.addEventListener('click',e=>{const trigger=e.target.closest('[data-book-appointment]');if(trigger){e.preventDefault();openDrawer(trigger);return}if(e.target.closest('[data-v9-booking-close]'))closeDrawer()});
  d.addEventListener('keydown',e=>{if(e.key==='Escape'&&drawer&&!drawer.hidden)closeDrawer();if(e.key==='Tab'&&drawer&&!drawer.hidden){const f=qa('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])',drawer).filter(x=>!x.disabled&&x.offsetParent!==null);if(!f.length)return;const first=f[0],last=f[f.length-1];if(e.shiftKey&&d.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&d.activeElement===last){e.preventDefault();first.focus()}}});

  function applyContext(form,trigger){
    const service=trigger?.dataset.bookService||trigger?.closest('[data-book-service]')?.dataset.bookService||'';
    const path=location.pathname.split('/').pop();
    const map={'primary-care.html':'primary_care','preventive-screenings.html':'preventive','medication-support.html':'medication','testing-referral-support.html':'testing_referral','new-patient.html':'new_patient','pregnancy-first-weeks-prenatal-care.html':'pregnancy_prenatal'};
    const reason=map[path]||'';
    const select=form.elements.reason;if(select&&reason)select.value=reason;
    if(select&&service&&!select.value){const lower=service.toLowerCase();if(lower.includes('primary'))select.value='primary_care';else if(lower.includes('prevent'))select.value='preventive';else if(lower.includes('medication'))select.value='medication';}
  }

  function showFieldError(field,msg){field.setAttribute('aria-invalid','true');field.addEventListener('input',()=>field.removeAttribute('aria-invalid'),{once:true});return msg}
  function validateForm(form){
    qa('[aria-invalid="true"]',form).forEach(x=>x.removeAttribute('aria-invalid'));
    if(!form.reportValidity())return copy.error;
    const date=form.elements.preferred_date?.value;if(date){const day=new Date(`${date}T12:00:00`).getDay();if(day===0||day===6)return showFieldError(form.elements.preferred_date,copy.weekend)}
    return '';
  }
  function nextWeekdayFrom(base,offset=1){const d=new Date(base);d.setHours(12,0,0,0);let added=0;while(added<offset){d.setDate(d.getDate()+1);if(![0,6].includes(d.getDay()))added++}return d}
  function localISO(dt){const x=new Date(dt);x.setMinutes(x.getMinutes()-x.getTimezoneOffset());return x.toISOString().slice(0,10)}
  function setupDateChoices(form){const date=form.elements.preferred_date;if(!date)return;const now=new Date(),min=today(),first=nextWeekdayFrom(now,1);date.min=min;if(!date.value)date.value=localISO(first);const wrap=q('[data-v10-date-options]',form);if(wrap){wrap.innerHTML='';for(let i=1;i<=4;i++){const dt=nextWeekdayFrom(now,i),value=localISO(dt),b=d.createElement('button');b.type='button';b.className='v10-date-chip';b.dataset.date=value;b.innerHTML=`<small>${escapeHTML(new Intl.DateTimeFormat(locale==='hy'?'hy-AM':locale==='es'?'es-US':'en-US',{weekday:'short'}).format(dt))}</small><strong>${escapeHTML(new Intl.DateTimeFormat(locale==='hy'?'hy-AM':locale==='es'?'es-US':'en-US',{month:'short',day:'numeric'}).format(dt))}</strong>`;b.addEventListener('click',()=>{date.value=value;paintDateChoices(form)});wrap.appendChild(b)}}paintDateChoices(form);date.addEventListener('change',()=>paintDateChoices(form));}
  function paintDateChoices(form){const date=form.elements.preferred_date;qa('.v10-date-chip',form).forEach(b=>b.classList.toggle('is-selected',b.dataset.date===date?.value))}
  function prefillMinDates(form){const min=today();setupDateChoices(form);const time=form.elements.preferred_time;if(time&&!time.value)time.value='10:00';const dob=form.elements.dob;if(dob){dob.max=min}}

  async function submitAppointment(form){
    const error=q('[data-booking-error]',form),status=q('[data-booking-status]',form),button=q('button[type="submit"]',form);
    if(error){error.hidden=true;error.textContent=''}
    const problem=validateForm(form);if(problem){if(error){error.textContent=problem;error.hidden=false}return}
    const data=Object.fromEntries(new FormData(form).entries());if(data.website)return;
    data.language=locale;data.sourcePath=location.pathname;data.timezone=Intl.DateTimeFormat().resolvedOptions().timeZone||'';
    button.disabled=true;status.textContent=copy.sending;
    if(location.protocol==='file:'){const requestId=`PREVIEW-${Date.now().toString(36).toUpperCase()}`;renderSuccess(form,{...data,requestId,mode:'local-preview'});return}
    try{
      const r=await fetch('/api/appointments',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data),credentials:'same-origin'});
      const out=await r.json().catch(()=>({}));if(!r.ok||!out.ok)throw new Error(out.error||String(r.status));
      const requestId=out.requestId||`CANBY-${Date.now().toString(36).toUpperCase()}`;
      try{sessionStorage.setItem('canbyAppointmentPrefill',JSON.stringify({request_id:requestId,first_name:data.first_name,last_name:data.last_name,dob:data.dob,phone:data.phone,email:data.email}))}catch{}
      renderSuccess(form,{...data,requestId,mode:out.mode||''});
    }catch(err){if(error){error.textContent=copy.error;error.hidden=false}status.textContent='';console.warn('Appointment request failed:',err?.message||err)}finally{button.disabled=false}
  }
  function renderSuccess(form,data){
    const parent=form.parentElement;const preferred=`${formatDate(data.preferred_date)} · ${formatTime(data.preferred_time)}`;
    const success=d.createElement('div');success.className='v9-booking-success';success.setAttribute('role','status');success.innerHTML=`<div class="v9-success-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M7 16.5l6 6L25 9.5"/></svg></div><h3>${escapeHTML(copy.success)}</h3><p>${escapeHTML(copy.thanks)}</p>${data.mode==='local-preview'?'<p class="v14-preview-note">Local preview only — no appointment request was sent.</p>':''}<div class="v9-success-summary"><div><span>${escapeHTML(copy.preferred)}</span><strong>${escapeHTML(preferred)}</strong></div><div><span>${escapeHTML(copy.requestId)}</span><strong>${escapeHTML(data.requestId)}</strong></div></div><div class="v9-success-actions"><a href="${routes.intake}" data-patient-setup-link>${escapeHTML(copy.setup)}</a><button class="secondary" type="button" data-v9-booking-close>${escapeHTML(copy.done)}</button></div>`;
    form.replaceWith(success);success.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
  }
  function wireAppointmentForms(root=d){qa('[data-appointment-form]',root).forEach(form=>{if(form.dataset.v9Wired)return;form.dataset.v9Wired='1';prefillMinDates(form);form.addEventListener('submit',e=>{e.preventDefault();submitAppointment(form)})})}
  wireAppointmentForms();

  // Care discovery drives the same appointment product with the selected context.
  const careBook=q('[data-care-book]');
  function syncCareBook(item){if(!careBook||!item)return;careBook.dataset.bookService=item.dataset.title||item.textContent.trim();qa('.cf-care-item').forEach(x=>x.classList.toggle('is-active',x===item))}
  qa('.cf-care-item').forEach(item=>{item.addEventListener('mouseenter',()=>syncCareBook(item));item.addEventListener('focus',()=>syncCareBook(item));item.addEventListener('click',()=>syncCareBook(item))});syncCareBook(q('.cf-care-item'));

  // First-visit story: one active step follows reading position, reversible with scroll.
  const visitSteps=qa('.v9-visit-step');if(visitSteps.length){
    const activate=step=>visitSteps.forEach(x=>x.classList.toggle('is-v9-active',x===step));activate(visitSteps[0]);
    if(!reduced&&'IntersectionObserver'in window){const io=new IntersectionObserver(entries=>{const hit=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(hit)activate(hit.target)},{threshold:[.2,.45,.7],rootMargin:'-18% 0px -34%'});visitSteps.forEach(x=>io.observe(x))}
  }

  // Short patient setup: prefill from this tab only; medical answers remain out of sessionStorage.
  const prefill=(()=>{try{return JSON.parse(sessionStorage.getItem('canbyAppointmentPrefill')||'{}')}catch{return {}}})();
  qa('[data-prefill]').forEach(el=>{const v=prefill[el.dataset.prefill];if(v&&!el.value)el.value=v});
  qa('[data-progressive-question]').forEach(block=>{const radios=qa('input[type="radio"]',block),detail=q('.v9-progressive-detail',block);const paint=()=>{const yes=radios.find(r=>r.checked)?.value==='yes';if(detail)detail.hidden=!yes};radios.forEach(r=>r.addEventListener('change',paint));paint()});
  qa('[data-v9-secure-intake]').forEach(form=>form.addEventListener('submit',async e=>{
    e.preventDefault();const error=q('[data-intake-error]',form),status=q('[data-intake-status]',form),button=q('button[type="submit"]',form);if(error){error.hidden=true;error.textContent=''}
    if(!form.reportValidity())return;
    const endpoint=String(window.CANBY_CONFIG?.secureIntakeUrl||'').trim();if(!/^https:\/\//i.test(endpoint)){if(error){error.textContent=copy.secureMissing;error.hidden=false}return}
    button.disabled=true;status.textContent=copy.intakeSending;
    try{const payload=Object.fromEntries(new FormData(form).entries());payload.language=locale;const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),credentials:'omit'});if(!r.ok)throw new Error(String(r.status));status.textContent=copy.intakeSaved;form.reset()}catch{if(error){error.textContent=copy.error;error.hidden=false}status.textContent=''}finally{button.disabled=false}
  }));

  // Current-page state: quiet underline instead of another UI badge.
  const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  qa('.cf-nav a[href],.cf-mobile-panel a[href]').forEach(a=>{const href=(a.getAttribute('href')||'').split('#')[0].split('?')[0].toLowerCase();if(href&&href===current)a.setAttribute('aria-current','page')});

  // If an appointment page is loaded with #book, focus it without opening another drawer.
  if(location.hash==='#book'&&q('.v9-appointment-page'))setTimeout(()=>q('.v9-booking-form input')?.focus(),150);
})();
