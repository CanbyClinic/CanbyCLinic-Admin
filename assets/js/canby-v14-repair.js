/* CANBY PREMIUM V14 — surgical behavior repairs. No theme redesign. */
(() => {
  'use strict';
  const d=document, qa=(s,r=d)=>[...r.querySelectorAll(s)], q=(s,r=d)=>r.querySelector(s);
  d.body.dataset.build='premium-v20-medical-release-20260819';
  d.body.dataset.siteVersion='premium-v20-medical-release-20260819';
  const isoLocal=dt=>{const x=new Date(dt);x.setMinutes(x.getMinutes()-x.getTimezoneOffset());return x.toISOString().slice(0,10)};
  const nextClinicWeekday=()=>{const x=new Date();x.setHours(12,0,0,0);do{x.setDate(x.getDate()+1)}while(x.getDay()===0||x.getDay()===6);return x};
  const minDate=isoLocal(nextClinicWeekday());

  // Desktop navigation: exactly one menu can be open; moving to another menu closes the previous one.
  const items=qa('.cf-main-nav .cf-nav-item');
  const closeMenus=(except=null)=>items.forEach(item=>{if(item!==except){item.classList.remove('is-open');q('.cf-nav-trigger',item)?.setAttribute('aria-expanded','false')}});
  const openMenu=item=>{closeMenus(item);const panel=q('.cf-mega',item);if(panel)panel.style.setProperty('--cf-owner-left',`${item.getBoundingClientRect().left}px`);item.classList.add('is-open');q('.cf-nav-trigger',item)?.setAttribute('aria-expanded','true');q('.cf-language')?.classList.remove('is-open');q('.cf-language-button')?.setAttribute('aria-expanded','false')};
  items.forEach(item=>{
    const trigger=q('.cf-nav-trigger',item); if(!trigger)return;
    item.addEventListener('pointerenter',()=>{if(matchMedia('(min-width:1041px)').matches)openMenu(item)});
    item.addEventListener('pointerleave',()=>{if(matchMedia('(min-width:1041px)').matches){item.classList.remove('is-open');trigger.setAttribute('aria-expanded','false')}});
    item.addEventListener('focusin',()=>{if(matchMedia('(min-width:1041px)').matches)openMenu(item)});
    trigger.addEventListener('click',e=>{if(!matchMedia('(min-width:1041px)').matches)return; e.preventDefault(); const was=item.classList.contains('is-open');closeMenus();if(!was)openMenu(item)});
  });
  q('.cf-language-button')?.addEventListener('click',()=>closeMenus());
  d.addEventListener('pointerdown',e=>{if(!e.target.closest('.cf-main-nav,.cf-language'))closeMenus()});
  d.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenus()});

  // Appointment request is for the next available future clinic weekday; 10 AM remains the default.
  qa('form[data-appointment-form], .v9-booking-form').forEach(form=>{
    const date=form.elements?.preferred_date, time=form.elements?.preferred_time;
    if(date){
      date.min=minDate;
      const invalid=()=>!date.value||date.value<minDate||[0,6].includes(new Date(`${date.value}T12:00:00`).getDay());
      if(invalid())date.value=minDate;
      const check=()=>date.setCustomValidity(invalid()?'Please choose a future Monday–Friday date.':'');
      date.addEventListener('change',check);date.addEventListener('input',check);check();
      qa('.v10-date-chip',form).forEach(b=>{if((b.dataset.date||'')<minDate){b.disabled=true;b.setAttribute('aria-disabled','true')}});
    }
    if(time&&!time.value)time.value='10:00';
  });
})();

/* Replace the retired Terminal film with one self-contained procedural homepage hero. */
(() => {
  'use strict';
  const oldHero=document.querySelector('[data-terminal-film]');
  if(!oldHero)return;
  const language=document.documentElement.lang||'en';
  const localized={
    en:{care:'Care that spreads within the community.',visit:'Come visit Canby Community Clinic.',now:'Get real care now.',book:'Book appointment',call:'Call clinic',appointment:'appointments.html#book'},
    es:{care:'Cuidado que se extiende por la comunidad.',visit:'Visite Canby Community Clinic.',now:'Reciba atención real ahora.',book:'Reservar cita',call:'Llamar a la clínica',appointment:'es-citas.html#book'},
    hy:{care:'Խնամք, որը տարածվում է համայնքում։',visit:'Այցելեք Canby Community Clinic։',now:'Ստացեք իրական խնամք հիմա։',book:'Ամրագրել այց',call:'Զանգահարել կլինիկա',appointment:'hy-appointments.html#book'}
  };
  const copy=localized[language]||localized.en;
  oldHero.className='cell-division-hero';
  oldHero.id='cellDivisionHero';
  oldHero.removeAttribute('data-terminal-film');
  oldHero.removeAttribute('data-manifest');
  oldHero.setAttribute('data-cell-hero','');
  oldHero.setAttribute('aria-label',copy.care);
  oldHero.innerHTML=`<div class="cell-division-hero__sticky">
    <canvas class="cell-division-hero__canvas" data-cell-canvas aria-hidden="true"></canvas>
    <div class="cell-division-hero__atmosphere" aria-hidden="true"></div>
    <div class="cell-division-hero__handoff" aria-hidden="true"></div>
    <div class="cell-division-hero__ui">
      <div class="cell-division-hero__copy">
        <div class="cell-division-hero__beat is-active" data-cell-beat>
          <h1>${copy.care}</h1>
        </div>
        <div class="cell-division-hero__beat" data-cell-beat>
          <h2>${copy.visit}</h2>
          <p class="cell-division-hero__address">7601 Canby Ave #6B · Reseda, CA 91335</p>
        </div>
        <div class="cell-division-hero__beat" data-cell-beat>
          <h2>${copy.now}</h2>
          <div class="cell-division-hero__actions"><a data-book-appointment href="${copy.appointment}">${copy.book}</a><a href="tel:+18186744414">${copy.call}</a></div>
        </div>
      </div>
    </div>
  </div>`;
  oldHero.classList.add('is-ready');
  const runtime=document.createElement('script');
  runtime.src='assets/js/canby-cell-hero.js?v=20260819-v21-2-smooth';
  runtime.defer=true;
  document.body.append(runtime);
})();
