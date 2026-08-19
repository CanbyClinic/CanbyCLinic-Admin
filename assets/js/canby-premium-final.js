
/* Legacy canby-scroll-hero removed 2026-08-17: production hero uses terminal-film sequence. */

/* ===== canby-flagship-final.js ===== */
(() => {
  'use strict';
  const d = document;
  const q = (s, r=d) => r.querySelector(s);
  const qa = (s, r=d) => [...r.querySelectorAll(s)];
  const lang = (d.documentElement.lang || 'en').toLowerCase();
  const locale = lang.startsWith('es') ? 'es' : lang.startsWith('hy') ? 'hy' : 'en';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const copy = {
    en:{intake:'Secure intake is not connected yet. Do not enter private medical information on this public website. Call (818) 674-4414.', sent:'Your email application is ready. Review it before sending.', formError:'Please complete the required fields.'},
    es:{portal:'El portal seguro del paciente todavía no está conectado a este sitio web. Llame al (818) 674-4414 para acceso del paciente.', intake:'La admisión segura todavía no está conectada. No ingrese información médica privada en este sitio web público. Llame al (818) 674-4414.', sent:'Su solicitud por correo está lista. Revísela antes de enviarla.', formError:'Complete los campos obligatorios.'},
    hy:{portal:'Պացիենտի անվտանգ պորտալը դեռ միացված չէ այս կայքին։ Պացիենտական հասանելիության համար զանգահարեք (818) 674-4414։', intake:'Անվտանգ ընդունման համակարգը դեռ միացված չէ։ Հանրային կայքում մի մուտքագրեք անձնական բժշկական տեղեկություն։ Զանգահարեք (818) 674-4414։', sent:'Ձեր էլ․ փոստի դիմումը պատրաստ է։ Ուղարկելուց առաջ ստուգեք այն։', formError:'Խնդրում ենք լրացնել պարտադիր դաշտերը։'}
  }[locale];

  // page curtain
  const curtain = d.createElement('div');
  curtain.className = 'cf-page-curtain';
  curtain.setAttribute('aria-hidden','true');
  d.body.append(curtain);
  d.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const raw = a.getAttribute('href') || '';
    if (!raw || raw.startsWith('#') || raw.startsWith('tel:') || raw.startsWith('mailto:') || a.target === '_blank' || a.hasAttribute('download')) return;
    let url; try { url = new URL(raw, location.href); } catch { return; }
    if (url.origin !== location.origin || !(/\.html$/.test(url.pathname) || url.pathname.endsWith('/'))) return;
    e.preventDefault();
    d.body.classList.add('is-leaving');
    setTimeout(() => location.assign(url.href), reduced ? 0 : 390);
  });
  addEventListener('pageshow', () => d.body.classList.remove('is-leaving'));

  // header menu and languages
  const menuButton = q('.cf-menu-button');
  const closeMenu = () => { d.body.classList.remove('menu-open'); menuButton?.setAttribute('aria-expanded','false'); };
  const closeDesktopMenus = () => { qa('.cf-nav-item.is-open').forEach(item => { item.classList.remove('is-open'); item.querySelector('.cf-nav-trigger')?.setAttribute('aria-expanded','false'); }); };
  const closeLanguage = () => { const button=q('.cf-language-button'); q('.cf-language')?.classList.remove('is-open'); button?.setAttribute('aria-expanded','false'); };
  menuButton?.addEventListener('click', () => {
    const open = !d.body.classList.contains('menu-open');
    d.body.classList.toggle('menu-open', open); menuButton.setAttribute('aria-expanded', String(open));
  });
  qa('.cf-mobile-panel a').forEach(a => a.addEventListener('click', closeMenu));
  const langWrap = q('.cf-language');
  q('.cf-language-button')?.addEventListener('click', e => {
    e.stopPropagation(); const open = !langWrap?.classList.contains('is-open'); langWrap?.classList.toggle('is-open',open); e.currentTarget.setAttribute('aria-expanded',String(open));
  });
  qa('.cf-nav-trigger').forEach(trigger => {
    trigger.addEventListener('click', e => {
      if (trigger.tagName === 'A' && trigger.getAttribute('href')) return;
      e.stopPropagation(); const item = trigger.closest('.cf-nav-item'); const open = !item.classList.contains('is-open');
      closeDesktopMenus(); item.classList.toggle('is-open',open); trigger.setAttribute('aria-expanded',String(open));
    });
  });
  d.addEventListener('click', () => { closeLanguage(); closeDesktopMenus(); });
  d.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); closeLanguage(); closeDesktopMenus(); } });

  // Header state
  const header = q('.cf-header');
  const paintHeader = () => header?.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', paintHeader, {passive:true}); paintHeader();

  // home chapter index — event driven; no perpetual loop
  const sceneLinks=qa('[data-scene-link]');
  if(sceneLinks.length && 'IntersectionObserver' in window){
    const byId=new Map(sceneLinks.map(a=>[a.dataset.sceneLink,a]));
    const sceneObserver=new IntersectionObserver(entries=>{
      const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      sceneLinks.forEach(a=>a.classList.toggle('is-active',a.dataset.sceneLink===visible.target.id));
    },{rootMargin:'-28% 0px -50% 0px',threshold:[0,.1,.35,.6]});
    byId.forEach((_,id)=>{const el=d.getElementById(id);if(el)sceneObserver.observe(el);});
    sceneLinks[0]?.classList.add('is-active');
  }

  // one-time reveals — progressive enhancement: content stays visible if JS fails.
  d.body.classList.add('motion-ready');
  const reveal = qa('main section, [data-reveal], .card, .service-card, .article-card, .volunteer-path-card');
  reveal.forEach(el => { if (!el.closest('.terminal-film-hero')) el.setAttribute('data-reveal',''); });
  if (reduced || !('IntersectionObserver' in window)) reveal.forEach(el=>el.classList.add('is-visible'));
  else {
    const io = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); } }), {threshold:.06,rootMargin:'0px 0px -6% 0px'});
    reveal.forEach(el=>io.observe(el));
  }

  // scroll media motion — event driven, no perpetual animation loop
  const media = qa('.page-hero-visual img,.media-frame img,.article-hero-image img,.cf-story-media img');
  let mediaQueued = false;
  const paintMedia = () => {
    mediaQueued = false; if (reduced) return; const vh = innerHeight || 1;
    media.forEach(img => { const box = img.parentElement?.getBoundingClientRect(); if (!box || box.bottom < -100 || box.top > vh + 100) return; const t=(vh-box.top)/(vh+box.height); const y=Math.max(-30,Math.min(30,(t-.5)*-48)); img.style.setProperty('--media-y',`${y.toFixed(1)}px`); });
  };
  const queueMedia = () => { if (!mediaQueued) { mediaQueued=true; requestAnimationFrame(paintMedia); } };
  addEventListener('scroll',queueMedia,{passive:true}); addEventListener('resize',queueMedia,{passive:true}); paintMedia();

  // home care switcher
  const careItems = qa('[data-care-key]');
  const careImages = qa('[data-care-image]');
  const careTitle = q('[data-care-title]'); const careText=q('[data-care-text]'); const careLink=q('[data-care-link]');
  const careData = {};
  careItems.forEach(item => { careData[item.dataset.careKey] = {title:item.dataset.title||'', text:item.dataset.text||'', href:item.dataset.href||'#'}; });
  const setCare = key => {
    careItems.forEach(x=>x.classList.toggle('is-active',x.dataset.careKey===key)); careImages.forEach(x=>x.classList.toggle('is-active',x.dataset.careImage===key));
    const data=careData[key]; if (data) { if(careTitle)careTitle.textContent=data.title;if(careText)careText.textContent=data.text;if(careLink)careLink.href=data.href; }
  };
  careItems.forEach(item => { item.addEventListener('mouseenter',()=>setCare(item.dataset.careKey)); item.addEventListener('focus',()=>setCare(item.dataset.careKey)); item.addEventListener('click',()=>setCare(item.dataset.careKey)); });
  if (careItems[0]) setCare(careItems[0].dataset.careKey);

  // portal tabs
  const portalTabs=qa('[data-portal-tab]'), portalPanes=qa('[data-portal-pane]');
  const openPortal = name => { portalTabs.forEach(t=>t.classList.toggle('active',t.dataset.portalTab===name)); portalPanes.forEach(p=>p.classList.toggle('active',p.dataset.portalPane===name)); };
  portalTabs.forEach(t=>t.addEventListener('click',()=>openPortal(t.dataset.portalTab)));
  if (new URLSearchParams(location.search).get('mode')==='signup') openPortal('signup');
  qa('[data-open-signup]').forEach(b=>b.addEventListener('click',()=>openPortal('signup')));
  qa('[data-toggle-password]').forEach(button=>button.addEventListener('click',()=>{const input=button.parentElement?.querySelector('input');if(!input)return;const show=input.type==='password';input.type=show?'text':'password';button.textContent=locale==='hy'?(show?'Թաքցնել':'Ցույց տալ'):locale==='es'?(show?'Ocultar':'Mostrar'):(show?'Hide':'Show');}));

  // Patient authentication is handed off only to configured approved portal URLs; credentials are never processed locally.
  const portalMessage=q('[data-portal-message]');
  const securePortalUrl=String(window.CANBY_CONFIG?.portalLoginUrl||'').trim();
  const secureSignupUrl=String(window.CANBY_CONFIG?.portalSignupUrl||'').trim();
  const secureResetUrl=String(window.CANBY_CONFIG?.portalResetUrl||'').trim();
  const safeHttps = raw => { try { const u=new URL(raw,location.href); return u.protocol==='https:' ? u.href : ''; } catch { return ''; } };
  qa('[data-demo-login]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const target=safeHttps(securePortalUrl);if(target){location.assign(target);return;}if(portalMessage){portalMessage.textContent=copy.portal;portalMessage.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});}}));
  qa('[data-demo-signup]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const target=safeHttps(secureSignupUrl);if(target){location.assign(target);return;}if(portalMessage){portalMessage.textContent=copy.portal;portalMessage.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});}}));
  qa('[data-forgot-password],[data-send-reset]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();const target=safeHttps(secureResetUrl);if(target){location.assign(target);return;}if(portalMessage){portalMessage.textContent=copy.portal;portalMessage.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});}}));

  // secure intake endpoints
  qa('[data-secure-intake], .secure-intake').forEach(form=>form.addEventListener('submit',async e=>{
    e.preventDefault(); const status=q('[data-intake-status]',form)||q('[data-intake-message]',form)||form.querySelector('[role="status"]');
    if(!form.reportValidity()){if(status)status.textContent=copy.formError;return;}
    const endpoint=String(window.CANBY_CONFIG?.secureIntakeUrl||'').trim();
    if(!endpoint){if(status)status.textContent=copy.intake;return;}
    const button=form.querySelector('button[type="submit"]');button?.setAttribute('disabled','');if(status)status.textContent=locale==='hy'?'Անվտանգ ուղարկվում է…':locale==='es'?'Enviando de forma segura…':'Submitting securely…';
    try{const payload=Object.fromEntries(new FormData(form).entries());const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),credentials:'omit'});if(!res.ok)throw new Error(String(res.status));form.reset();if(status)status.textContent=locale==='hy'?'Տեղեկությունն ուղարկվել է։':locale==='es'?'Información enviada.':'Information submitted.';}catch{if(status)status.textContent=locale==='hy'?'Ուղարկումը չավարտվեց։ Զանգահարեք (818) 674-4414։':locale==='es'?'No se pudo enviar. Llame al (818) 674-4414.':'Submission failed. Call (818) 674-4414.';}finally{button?.removeAttribute('disabled');}
  }));

  // Administrative forms collect no medical details. Use a configured HTTPS endpoint when available, with an email fallback.
  const clinicEmailRaw=String(window.CANBY_CONFIG?.clinicEmail||'info@puravidacc.org').trim();
  const clinicEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clinicEmailRaw)?clinicEmailRaw:'info@puravidacc.org';
  const mailto = (form, subject) => {
    if(!form.reportValidity()) return false;
    const lines=[]; new FormData(form).forEach((value,key)=>{if(value && String(value).trim()) lines.push(`${key}: ${String(value).trim()}`);});
    location.href=`mailto:${clinicEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`; return true;
  };
  const postAdministrative = async (form,endpoint,kind) => {
    const target=safeHttps(endpoint); if(!target)return false;
    const payload=Object.fromEntries(new FormData(form).entries()); payload.requestType=kind; payload.language=locale;
    const res=await fetch(target,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),credentials:'omit'}); if(!res.ok)throw new Error(String(res.status)); return true;
  };
  qa('[data-mail-form="appointment"]').forEach(form=>form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const subject=locale==='hy'?'Հանդիպման հարցում':locale==='es'?'Solicitud de cita':'Appointment request';let sent=false;try{sent=await postAdministrative(form,String(window.CANBY_CONFIG?.secureCallbackUrl||''),'appointment');}catch{}if(!sent)mailto(form,subject);const modal=q('[data-appointment-modal]');if(modal){modal.hidden=false;d.body.classList.add('modal-open');}}));
  qa('[data-mail-form="contact"]').forEach(form=>form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const subject=locale==='hy'?'Կայքի հարցում':locale==='es'?'Consulta del sitio web':'Website inquiry';let sent=false;try{sent=await postAdministrative(form,String(window.CANBY_CONFIG?.secureCallbackUrl||''),'contact');}catch{}if(!sent)mailto(form,subject);}));
  qa('[data-close-modal]').forEach(b=>b.addEventListener('click',()=>{const modal=q('[data-appointment-modal]');if(modal){modal.hidden=true;d.body.classList.remove('modal-open');}}));

  // volunteer chooser + email preparation
  qa('[data-volunteer-path]').forEach(button=>button.addEventListener('click',()=>{
    const key=button.dataset.volunteerPath;qa('[data-volunteer-path]').forEach(b=>b.classList.toggle('active',b===button));qa('[data-volunteer-form]').forEach(f=>{const active=f.dataset.volunteerForm===key;f.hidden=!active;f.classList.toggle('active',active);});
  }));
  qa('[data-volunteer-form]').forEach(form=>form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const subject=locale==='hy'?'Կամավորի դիմում':locale==='es'?'Solicitud de voluntariado':'Volunteer application';const endpoint=String(window.CANBY_CONFIG?.volunteerFormEndpoint||'');let sent=false;try{sent=await postAdministrative(form,endpoint,'volunteer');}catch{}if(!sent)mailto(form,subject);const status=q('[data-volunteer-status]',form);if(status)status.textContent=sent?(locale==='hy'?'Դիմումն ուղարկվել է։':locale==='es'?'Solicitud enviada.':'Application submitted.'):copy.sent;}));

  // dashboard prototype navigation only; never stores fake patient data
  qa('[data-dashboard-tab]').forEach(button=>button.addEventListener('click',()=>{
    const key=button.dataset.dashboardTab;qa('[data-dashboard-tab]').forEach(b=>b.classList.toggle('active',b.dataset.dashboardTab===key));qa('[data-dashboard-pane]').forEach(p=>p.classList.toggle('active',p.dataset.dashboardPane===key));
  }));
  qa('[data-dashboard-go]').forEach(button=>button.addEventListener('click',()=>q(`[data-dashboard-tab="${button.dataset.dashboardGo}"]`)?.click()));
  qa('[data-demo-profile]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const status=q('[data-profile-message]',form);if(status)status.textContent=copy.portal;}));

  // donations — every amount/frequency control resolves to a real next step
  const donationButtons=qa('[data-donation-frequency]');
  const donationLinks=qa('[data-donation-amount]');
  const applyDonationFrequency=frequency=>{
    d.body.dataset.donationFrequency=frequency;
    donationLinks.forEach(a=>{const amount=a.dataset.donationAmount;const baseUrl=/^(?:https?|file):/.test(location.protocol)?location.href:'https://local.invalid/';const u=new URL(a.getAttribute('href')||'donation-options.html',baseUrl);if(amount)u.searchParams.set('amount',amount);u.searchParams.set('frequency',frequency);a.setAttribute('href',u.pathname.split('/').pop()+'?'+u.searchParams.toString());});
  };
  donationButtons.forEach(button=>button.addEventListener('click',()=>{const frequency=button.dataset.donationFrequency||'once';donationButtons.forEach(b=>b.classList.toggle('active',b===button));applyDonationFrequency(frequency);}));
  if(donationButtons.length)applyDonationFrequency(q('[data-donation-frequency].active')?.dataset.donationFrequency||'once');
  const amountOut=q('[data-selected-amount]');
  if(amountOut){const params=new URLSearchParams(location.search),amount=params.get('amount'),freq=params.get('frequency');amountOut.textContent=amount&&/^\d+(?:\.\d{1,2})?$/.test(amount)?`$${amount}${freq==='monthly'?(locale==='hy'?' / ամիս':locale==='es'?' / mes':' / month'):''}`:(locale==='hy'?'ձեր ընտրած գումարը':locale==='es'?'la cantidad que elija':'the amount you choose');}
  const checkout=q('[data-donation-checkout]');
  const checkoutUrl=String(window.CANBY_CONFIG?.donationCheckoutUrl||'').trim();
  if(checkout&&checkoutUrl){try{const u=new URL(checkoutUrl,location.href);if(u.protocol==='https:'){checkout.href=u.href;checkout.target='_blank';checkout.rel='noopener noreferrer';}}catch{}}

  // generic card links without nesting anchors
  qa('[data-card-href]').forEach(card=>{card.tabIndex=card.tabIndex>=0?card.tabIndex:0;const go=()=>{const href=card.dataset.cardHref;if(href)location.assign(href)};card.addEventListener('click',e=>{if(!e.target.closest('a,button,input,select,textarea'))go();});card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('a,button,input,select,textarea')){e.preventDefault();go();}});});

  // reading progress
  if(d.body.dataset.pageKind==='article'){
    const bar=q('.reading-progress')||(()=>{const el=d.createElement('div');el.className='reading-progress';d.body.prepend(el);return el;})();
    let queued=false;const paint=()=>{queued=false;const max=Math.max(1,d.documentElement.scrollHeight-innerHeight);d.documentElement.style.setProperty('--reading-progress',`${Math.min(100,scrollY/max*100).toFixed(2)}%`);};addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(paint)}},{passive:true});paint();
  }
})();


/* ===== canby-release-20260815.js ===== */
(()=>{
  'use strict';

  const hero=null; // legacy WebGL hero permanently retired
  const body=document.body;

  function heroProgressPast(){
    if(!hero) return;
    const rect=hero.getBoundingClientRect();
    const past=rect.bottom<=Math.max(84,window.innerHeight*.12);
    if(hero.classList.contains('hero-no-webgl')||hero.classList.contains('hero-resilience-fallback')){
      body.classList.toggle('terminal-past',past);
    }
  }

  if(hero){
    const loader=hero.querySelector('.terminal-load-cover');
    const copySteps=[...hero.querySelectorAll('.terminal-copy-step')];
    const showFallback=(reason)=>{
      if(hero.classList.contains('hero-3d-ready')) return;
      hero.classList.add('hero-resilience-fallback');
      hero.dataset.heroStatus=reason||'static-fallback';
      loader?.classList.add('is-ready');
      copySteps.forEach((step,i)=>{
        step.style.opacity=i===0?'1':'';
        step.style.transform=i===0?'none':'';
      });
      heroProgressPast();
    };

    // The cinematic module owns the WebGL path. This watchdog only prevents a failed
    // model/texture/GPU load from becoming a blank or obviously broken first screen.
    const watchdog=window.setTimeout(()=>showFallback('load-timeout'),12000);

    const observer=new MutationObserver(()=>{
      if(hero.classList.contains('hero-3d-ready')){
        window.clearTimeout(watchdog);
        hero.classList.remove('hero-resilience-fallback');
        hero.dataset.heroStatus='interactive-3d';
      }else if(hero.classList.contains('hero-no-webgl')){
        window.clearTimeout(watchdog);
        showFallback('webgl-fallback');
      }
    });
    observer.observe(hero,{attributes:true,attributeFilter:['class']});
    window.addEventListener('scroll',heroProgressPast,{passive:true});
    window.addEventListener('resize',heroProgressPast,{passive:true});
    heroProgressPast();
  }

  // Visit-path progress: the page now has one dominant scroll story instead of
  // three equally weighted static rows.
  const steps=[...document.querySelectorAll('.cf-step')];
  const stepsWrap=document.querySelector('.cf-steps');
  if(steps.length&&stepsWrap&&'IntersectionObserver' in window){
    const stepObserver=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting)
        .sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible) return;
      const index=steps.indexOf(visible.target);
      steps.forEach((step,i)=>step.classList.toggle('is-current',i===index));
      const progress=steps.length>1?(index/(steps.length-1))*100:100;
      stepsWrap.style.setProperty('--visit-progress',String(progress));
    },{rootMargin:'-30% 0px -42% 0px',threshold:[.15,.45,.75]});
    steps.forEach(step=>stepObserver.observe(step));
    steps[0]?.classList.add('is-current');
    stepsWrap.style.setProperty('--visit-progress','0');
  }

  // Small, medium and major motion are assigned intentionally. This makes the
  // hierarchy legible to the existing reveal system without adding random effects.
  document.querySelectorAll('[data-reveal]').forEach((el,i)=>{
    if(el.closest('.page-hero,.terminal-film-hero,.cf-home-section')) el.dataset.motionLevel='2';
    else el.dataset.motionLevel=(i%3===0?'2':'1');
  });
  document.querySelectorAll('.cf-home-section,.page-hero').forEach(el=>el.dataset.motionLevel='3');


  // Keep navigation state explicit on every page, including keyboard/screen-reader users.
  const currentFile=(location.pathname.split('/').pop()||'index.html').split('?')[0];
  document.querySelectorAll('a[href]').forEach(link=>{
    const href=(link.getAttribute('href')||'').split('#')[0].split('?')[0];
    if(href===currentFile || (currentFile==='index.html'&&href==='index.html')){
      link.setAttribute('aria-current','page');
      link.closest('.cf-nav-item')?.classList.add('is-current-section');
    }
  });

  // Long medical articles get a quiet reading-progress rule. It is functional, not decorative.
  const article=document.querySelector('.article-body');
  if(article){
    const progress=document.createElement('div');
    progress.className='article-read-progress';
    progress.setAttribute('aria-hidden','true');
    progress.innerHTML='<i></i>';
    document.body.appendChild(progress);
    const bar=progress.firstElementChild;
    const updateArticleProgress=()=>{
      const rect=article.getBoundingClientRect();
      const start=window.scrollY+rect.top-window.innerHeight*.25;
      const distance=Math.max(1,article.offsetHeight-window.innerHeight*.5);
      const value=Math.max(0,Math.min(1,(window.scrollY-start)/distance));
      bar.style.transform=`scaleX(${value.toFixed(4)})`;
    };
    window.addEventListener('scroll',updateArticleProgress,{passive:true});
    window.addEventListener('resize',updateArticleProgress,{passive:true});
    updateArticleProgress();
  }

  // Image failures should never collapse layout or expose a broken-image icon.
  document.querySelectorAll('img').forEach(img=>{
    img.addEventListener('error',()=>{
      img.dataset.imageFailed='true';
      img.removeAttribute('srcset');
      img.style.visibility='hidden';
      img.parentElement?.classList.add('image-fallback-surface');
    },{once:true});
  });
})();


/* ===== canby-awwwards-20260815.js ===== */
(() => {
  'use strict';
  const d=document;
  const body=d.body;
  if(!body)return;
  const q=(s,r=d)=>r.querySelector(s);
  const qa=(s,r=d)=>[...r.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse=matchMedia('(pointer: coarse)').matches;
  const lang=(d.documentElement.lang||'en').toLowerCase();
  const locale=lang.startsWith('es')?'es':lang.startsWith('hy')?'hy':'en';
  const file=(location.pathname.split('/').pop()||'index.html').split('?')[0];
  const slug=file.replace(/\.html$/,'')||'index';
  body.dataset.awPage=slug;

  /* 1. Full-page progress gives orientation on every long route. */
  const pageProgress=d.createElement('div');
  pageProgress.className='aw-page-progress';
  pageProgress.setAttribute('aria-hidden','true');
  pageProgress.innerHTML='<i></i>';
  body.appendChild(pageProgress);
  let scrollQueued=false,lastY=scrollY,lastDirectionY=scrollY;
  const header=q('.cf-header');
  const paintScroll=()=>{
    scrollQueued=false;
    const max=Math.max(1,d.documentElement.scrollHeight-innerHeight);
    const progress=Math.max(0,Math.min(1,scrollY/max));
    d.documentElement.style.setProperty('--aw-page-progress',progress.toFixed(4));
    const delta=scrollY-lastDirectionY;
    if(header && innerWidth>760 && Math.abs(delta)>18 && scrollY>180 && !body.classList.contains('menu-open')){
      header.classList.toggle('is-aw-hidden',delta>0);
      lastDirectionY=scrollY;
    }else if(scrollY<80){ header?.classList.remove('is-aw-hidden'); lastDirectionY=scrollY; }
    lastY=scrollY;
  };
  const queueScroll=()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(paintScroll)}};
  addEventListener('scroll',queueScroll,{passive:true});addEventListener('resize',queueScroll,{passive:true});paintScroll();
  header?.addEventListener('focusin',()=>header.classList.remove('is-aw-hidden'));
  header?.addEventListener('mouseenter',()=>header.classList.remove('is-aw-hidden'));

  /* 2. Give every page a neutral, non-template identity marker. */
  const hero=q('.page-hero');
  if(hero){
    const index=d.createElement('div');
    index.className='aw-hero-index';
    const kind=(body.dataset.pageKind||'page').replace(/-/g,' ');
    index.textContent=`CANBY / ${kind}`;
    hero.querySelector('.page-hero-grid>div:first-child')?.appendChild(index);
    hero.classList.add('is-aw-visible');
  }

  /* 3. Every photograph has its own composition/reveal treatment. */
  const photoParents=[];
  qa('img[data-photo-id]').forEach((img,i)=>{
    const parent=img.parentElement;
    if(!parent)return;
    parent.classList.add('aw-media-parent');
    parent.dataset.awPhotoCode=`C-${String(i+1).padStart(2,'0')}`;
    // Never randomize the crop. Random focal points were cutting faces and bodies.
    // Use conservative editorial framing by placement type and keep the subject high enough
    // to survive responsive crops without looking like stock-photo tiles.
    let focusY=38;
    if(parent.classList.contains('page-hero-visual')||parent.closest('.page-hero-visual')) focusY=32;
    else if(parent.classList.contains('article-hero-image')||parent.closest('.article-hero-image')) focusY=34;
    else if(parent.classList.contains('cf-story-media')||parent.closest('.cf-story-media')) focusY=36;
    else if(parent.classList.contains('cf-care-visual')||parent.closest('.cf-care-visual')) focusY=35;
    img.style.objectPosition=`50% ${focusY}%`;
    img.dataset.awFocus=`50-${focusY}`;
    // Respect the source photograph's own composition instead of forcing every image
    // into a random crop. Ratios are clamped per placement so pages remain designed.
    const applySourceRatio=()=>{
      if(!img.naturalWidth||!img.naturalHeight)return;
      const raw=img.naturalWidth/img.naturalHeight;
      parent.classList.toggle('aw-source-portrait',raw<1.08);
      parent.classList.toggle('aw-source-wide',raw>1.78);
      let min=.82,max=1.72;
      if(parent.classList.contains('page-hero-visual')||parent.closest('.page-hero-visual')){min=.92;max=1.58;}
      else if(parent.classList.contains('article-hero-image')||parent.closest('.article-hero-image')){min=.82;max=1.82;}
      else if(parent.classList.contains('cf-story-media')||parent.closest('.cf-story-media')){min=.86;max=1.72;}
      const ratio=Math.max(min,Math.min(max,raw));
      parent.style.setProperty('--aw-source-ratio',ratio.toFixed(3));
    };
    if(img.complete)applySourceRatio();else img.addEventListener('load',applySourceRatio,{once:true});
    photoParents.push(parent);
  });
  if(reduced||!('IntersectionObserver' in window)) photoParents.forEach(x=>x.classList.add('is-aw-visible'));
  else{
    const pio=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-aw-visible');pio.unobserve(entry.target);}
    }),{threshold:.08,rootMargin:'0px 0px -5% 0px'});
    [...new Set(photoParents)].forEach(x=>pio.observe(x));
  }

  /* 4. Pointer movement is reserved for the main hero/location visual only. */
  if(!reduced&&!coarse){
    const visual=q('.page-hero-visual');
    visual?.addEventListener('pointermove',e=>{
      const r=visual.getBoundingClientRect();
      const x=((e.clientX-r.left)/Math.max(1,r.width)-.5)*7;
      const y=((e.clientY-r.top)/Math.max(1,r.height)-.5)*5;
      visual.style.setProperty('--aw-pointer-x',`${x.toFixed(2)}px`);
      visual.style.setProperty('--aw-pointer-y',`${y.toFixed(2)}px`);
    });
    visual?.addEventListener('pointerleave',()=>{visual.style.setProperty('--aw-pointer-x','0px');visual.style.setProperty('--aw-pointer-y','0px');});
    const loc=q('.cf-map-visual');
    loc?.addEventListener('pointermove',e=>{
      const r=loc.getBoundingClientRect();
      loc.style.setProperty('--aw-location-x',`${(((e.clientX-r.left)/r.width)-.5)*-9}px`);
      loc.style.setProperty('--aw-location-y',`${(((e.clientY-r.top)/r.height)-.5)*-6}px`);
    });
  }

  /* 5. Chapter numbering and a compact rail prevent long pages from feeling like a pile of sections. */
  const chapters=qa('main > section').filter(x=>!x.classList.contains('terminal-film-hero')&&!x.classList.contains('page-hero')&&!x.classList.contains('journal-hero'));
  chapters.forEach((section,i)=>{
    const num=String(i+1).padStart(2,'0');
    section.dataset.awSection=`${num} / ${String(chapters.length).padStart(2,'0')}`;
    if(!section.id)section.id=`chapter-${num}`;
  });
  if(chapters.length>=3&&innerWidth>1180){
    const rail=d.createElement('aside');rail.className='aw-section-rail';rail.setAttribute('aria-label','Page sections');
    chapters.forEach((section,i)=>{
      const b=d.createElement('button');b.type='button';b.setAttribute('aria-label',`Section ${i+1}`);
      b.addEventListener('click',()=>section.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'}));rail.appendChild(b);
    });
    body.appendChild(rail);
    const buttons=qa('button',rail);
    if('IntersectionObserver' in window){
      const sio=new IntersectionObserver(entries=>{
        const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
        if(!visible)return;const idx=chapters.indexOf(visible.target);buttons.forEach((b,i)=>b.classList.toggle('is-active',i===idx));
      },{rootMargin:'-35% 0px -47% 0px',threshold:[0,.1,.3,.6]});
      chapters.forEach(x=>sio.observe(x));buttons[0]?.classList.add('is-active');
    }
  }

  /* 6. Forms expose completion without pretending submission is a medical workflow. */
  qa('form').forEach(form=>{
    if(form.matches('[data-appointment-form],[data-v10-volunteer-form],[data-v9-secure-intake]'))return;
    const fields=qa('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea',form).filter(x=>!x.disabled);
    if(fields.length<2)return;
    const meter=d.createElement('div');meter.className='aw-form-meter';meter.setAttribute('aria-hidden','true');meter.innerHTML='<i></i>';
    const note=d.createElement('small');
    note.textContent=locale==='es'?'Progreso del formulario':locale==='hy'?'Ձևի առաջընթաց':'Form progress';
    const first=fields[0].closest('.field,.form-field')||fields[0];
    first.parentNode?.insertBefore(meter,first);meter.after(note);
    const update=()=>{
      const complete=fields.filter(el=>{
        if(el.type==='checkbox'||el.type==='radio')return el.checked;
        return String(el.value||'').trim().length>0;
      }).length;
      form.style.setProperty('--aw-form-complete',(complete/fields.length).toFixed(4));
    };
    form.addEventListener('input',update);form.addEventListener('change',update);update();
  });

  /* 7. Adjacent article navigation makes the journal feel like a publication, not loose pages. */
  const articleSets={
    en:['primary-care-community-infrastructure.html','pregnancy-first-weeks-prenatal-care.html','routine-primary-care-why-follow-up-matters.html','preventive-care-before-symptoms.html','blood-pressure-number-and-story.html','medication-list-patient-safety.html','language-access-clinical-safety.html','prediabetes-window-before-disease.html','reseda-health-access.html','community-health-research-reseda-2025.html'],
    es:['es-articulos.html'],hy:['hy-journal.html']
  };
  if(body.dataset.pageKind==='article'&&locale==='en'){
    const set=articleSets.en,idx=set.indexOf(file),article=q('.article-body');
    if(idx>=0&&article){
      const nav=d.createElement('nav');nav.className='aw-article-next';nav.setAttribute('aria-label','More health articles');
      const prev=set[(idx-1+set.length)%set.length],next=set[(idx+1)%set.length];
      nav.innerHTML=`<a href="${prev}"><small>Previous article</small><strong>${titleFor(prev)}</strong></a><a href="${next}"><small>Next article</small><strong>${titleFor(next)}</strong></a>`;
      article.appendChild(nav);
    }
  }
  function titleFor(href){
    const map={
      'primary-care-community-infrastructure.html':'Why primary care matters','pregnancy-first-weeks-prenatal-care.html':'Early pregnancy: first steps','routine-primary-care-why-follow-up-matters.html':'Why regular follow-up matters','preventive-care-before-symptoms.html':'Prevention before symptoms','blood-pressure-number-and-story.html':'Understanding blood pressure','medication-list-patient-safety.html':'Medication-list safety','language-access-clinical-safety.html':'Language access and safety','prediabetes-window-before-disease.html':'The prediabetes window','reseda-health-access.html':'Healthcare access in Reseda','community-health-research-reseda-2025.html':'Community health research'
    };return map[href]||'Health article';
  }

  /* 8. Footer ending changes with page intent so the last action is specific. */
  const footer=q('.cf-footer');
  if(footer){
    const kinds={
      care:{en:['Need to confirm a service?','Call before you visit','tel:+18186744414'],es:['¿Necesita confirmar un servicio?','Llame antes de su visita','tel:+18186744414'],hy:['Պե՞տք է ճշտել ծառայությունը։','Զանգահարեք այցից առաջ','tel:+18186744414']},
      patient:{en:['Ready for the next patient step?','Prepare for your visit','appointments.html'],es:['¿Listo para el siguiente paso?','Prepárese para su visita','es-citas.html'],hy:['Պատրա՞ստ եք հաջորդ քայլին։','Պատրաստվեք այցին','hy-appointments.html']},
      community:{en:['Want to support the clinic?','See ways to help','donate.html'],es:['¿Quiere apoyar a la clínica?','Vea cómo ayudar','es-donar.html'],hy:['Ցանկանո՞ւմ եք աջակցել կլինիկային։','Տեսեք՝ ինչպես օգնել','hy-donate.html']},
      article:{en:['Have a question about your own health?','Contact the clinic','contact.html'],es:['¿Tiene una pregunta sobre su salud?','Contacte a la clínica','es-contacto.html'],hy:['Ձեր առողջության մասին հարց ունե՞ք։','Կապվեք կլինիկայի հետ','hy-contact.html']},
      clinic:{en:['Planning a visit?','Hours and directions','location.html'],es:['¿Planea una visita?','Horario y ubicación','es-contacto.html'],hy:['Պլանավորո՞ւմ եք այց։','Ժամեր և հասցե','hy-contact.html']},
      legal:{en:['Need clinic help instead?','Contact Canby','contact.html'],es:['¿Necesita ayuda de la clínica?','Contacte a Canby','es-contacto.html'],hy:['Կլինիկայի օգնությո՞ւն է պետք։','Կապվեք Canby-ի հետ','hy-contact.html']},
      home:{en:['Need care information now?','Call, visit, or prepare','appointments.html'],es:['¿Necesita información ahora?','Llame, visite o prepárese','es-citas.html'],hy:['Տեղեկատվությո՞ւն է պետք հիմա։','Զանգահարեք կամ պատրաստվեք','hy-appointments.html']}
    };
    const data=(kinds[body.dataset.pageKind]||kinds.home)[locale]||(kinds[body.dataset.pageKind]||kinds.home).en;
    const route=d.createElement('div');route.className='aw-footer-route';route.innerHTML=`<div><small>Next step</small><strong>${data[0]}</strong></div><a href="${data[2]}">${data[1]} ↗</a>`;
    footer.insertBefore(route,footer.firstChild);
  }

  /* 9. External-photo origin gets an early connection on pages that use it. */
  if(q('img[data-photo-origin="pexels"]')&&!q('link[data-aw-image-preconnect]')){
    const link=d.createElement('link');link.rel='preconnect';link.href='https://images.pexels.com';link.crossOrigin='anonymous';link.dataset.awImagePreconnect='';d.head.appendChild(link);
  }
  /* 10. Article metadata is derived from actual content, not placeholder copy. */
  const articleBody=q('.article-body');
  if(articleBody){
    const words=(articleBody.innerText||'').trim().split(/\s+/).filter(Boolean).length;
    const minutes=Math.max(2,Math.round(words/220));
    const meta=d.createElement('div');meta.className='aw-reading-meta';
    meta.textContent=locale==='es'?`${minutes} min de lectura`:locale==='hy'?`${minutes} րոպե ընթերցում`:`${minutes} min read`;
    const heroCopy=q('.page-hero-grid>div:first-child,.journal-hero-grid>div:first-child');
    heroCopy?.appendChild(meta);
  }

  /* 11. Long routes get a compact return control instead of forcing a manual scroll. */
  if(d.documentElement.scrollHeight>innerHeight*3.2){
    const top=d.createElement('button');top.type='button';top.className='aw-back-top';
    top.setAttribute('aria-label',locale==='es'?'Volver arriba':locale==='hy'?'Վերադառնալ վերև':'Back to top');
    top.innerHTML='<span>↑</span>';
    top.addEventListener('click',()=>scrollTo({top:0,behavior:reduced?'auto':'smooth'}));
    body.appendChild(top);
    const toggleTop=()=>top.classList.toggle('is-visible',scrollY>innerHeight*1.25);
    addEventListener('scroll',toggleTop,{passive:true});toggleTop();
  }

  /* 12. External links announce themselves visually without altering patient-task links. */
  qa('main a[href^="http"]').forEach(a=>{
    try{const u=new URL(a.href);if(u.origin!==location.origin&&!a.querySelector('.aw-external-mark')){
      const mark=d.createElement('span');mark.className='aw-external-mark';mark.setAttribute('aria-hidden','true');mark.textContent='↗';a.appendChild(mark);
    }}catch(_){ }
  });

})();


/* ===== canby-character-v8.js ===== */
(() => {
  'use strict';
  const d = document;
  const q = (s, r=d) => r.querySelector(s);
  const qa = (s, r=d) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const lang = (d.documentElement.lang || d.body.dataset.language || 'en').toLowerCase();
  const locale = lang.startsWith('es') ? 'es' : lang.startsWith('hy') ? 'hy' : 'en';

  d.body.classList.add('v8-ready');
  d.body.dataset.build = 'premium-v8-20260815';
  d.body.dataset.siteVersion = 'premium-v8-20260815';

  const icons = {
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4v3M19 4v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"/><path d="M8 13h3v3H8z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.3 3.8 9.5 8a1 1 0 0 1-.2 1.2L7.8 10.7a15 15 0 0 0 5.5 5.5l1.5-1.5a1 1 0 0 1 1.2-.2l4.2 2.2a1 1 0 0 1 .5 1.1l-.6 2.7a1.2 1.2 0 0 1-1.2.9C10 21.4 2.6 14 2.6 5.1a1.2 1.2 0 0 1 .9-1.2l2.7-.6a1 1 0 0 1 1.1.5Z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 6v5c0 5.2-3.2 8.2-8 10-4.8-1.8-8-4.8-8-10V6l8-3Z"/><path d="m8.8 12 2.1 2.1 4.5-4.6"/></svg>',
    id: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5.5 16c.6-1.6 1.5-2.4 2.5-2.4s1.9.8 2.5 2.4M13 10h5M13 14h4"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.7 2.7L16.5 9"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.5-8.8-8.2C1.7 8.7 3.5 5 7 5c2 0 3.3 1 5 3 1.7-2 3-3 5-3 3.5 0 5.3 3.7 3.8 6.8C19 15.5 12 20 12 20Z"/></svg>',
    hand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13.5V8.8a1.5 1.5 0 0 1 3 0V12M7 11V6.8a1.5 1.5 0 0 1 3 0V11M10 11V5.8a1.5 1.5 0 0 1 3 0V11M13 11V7.2a1.5 1.5 0 0 1 3 0v5.2l1.2-1.2a1.7 1.7 0 0 1 2.4 2.4l-4.2 4.2A7 7 0 0 1 10.5 20H9a5 5 0 0 1-5-5v-1.5Z"/></svg>',
    care: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="8"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M9 5h10v10"/></svg>'
  };
  const iconEl = (name) => {
    const span = d.createElement('span');
    span.className = 'v8-icon';
    span.setAttribute('aria-hidden','true');
    span.innerHTML = icons[name] || icons.arrow;
    return span;
  };

  // 01. Add icon-led character to the three highest-intent homepage actions.
  qa('.cf-action').forEach((a, i) => {
    if (!a.querySelector('.v8-icon')) a.prepend(iconEl(['calendar','phone','shield'][i] || 'arrow'));
    a.setAttribute('data-v8-tilt','');
  });

  // 02. Give the before-visit timeline an icon vocabulary, not generic numbers alone.
  qa('.cf-step').forEach((step, i) => {
    if (!step.querySelector('.v8-icon')) step.append(iconEl(['phone','id','check'][i] || 'check'));
  });

  // 03. Community actions get meaningful movement icons.
  qa('.cf-community-link').forEach((a, i) => {
    if (!a.querySelector('.v8-icon')) a.prepend(iconEl(i === 0 ? 'hand' : 'heart'));
    a.setAttribute('data-v8-tilt','');
  });

  // 04. Add a restrained moving clinic ribbon directly after the hero.
  const hero = q('#terminalAmbulanceHero');
  if (hero && !q('.v8-clinic-ribbon')) {
    const terms = {
      en:['PRIMARY CARE','PREVENTION','FOLLOW-UP','PATIENT ACCESS','COMMUNITY'],
      es:['ATENCIÓN PRIMARIA','PREVENCIÓN','SEGUIMIENTO','ACCESO DEL PACIENTE','COMUNIDAD'],
      hy:['ԱՌԱՋՆԱՅԻՆ ԽՆԱՄՔ','ԿԱՆԽԱՐԳԵԼՈՒՄ','ՀԵՏԵՎՈՒՄ','ՊԱՑԻԵՆՏԻ ՀԱՍԱՆԵԼԻՈՒԹՅՈՒՆ','ՀԱՄԱՅՆՔ']
    }[locale];
    const group = terms.map((t,i)=>`<b>${t}</b><i></i>`).join('');
    const ribbon = d.createElement('div');
    ribbon.className='v8-clinic-ribbon';
    ribbon.setAttribute('aria-hidden','true');
    ribbon.innerHTML=`<div class="v8-clinic-ribbon__track"><div class="v8-clinic-ribbon__group">${group}</div><div class="v8-clinic-ribbon__group">${group}</div></div>`;
    hero.insertAdjacentElement('afterend', ribbon);
  }

  // 05. Oversized editorial background words give every homepage chapter a visual identity.
  const homeWords = {
    en:{start:'START',care:'CARE','before-visit':'READY','patient-area':'SECURE','health-info':'LEARN',community:'TOGETHER'},
    es:{start:'INICIO',care:'CUIDADO','before-visit':'LISTO','patient-area':'SEGURO','health-info':'APRENDER',community:'JUNTOS'},
    hy:{start:'ՍԿԻԶԲ',care:'ԽՆԱՄՔ','before-visit':'ՊԱՏՐԱՍՏ','patient-area':'ԱՆՎՏԱՆԳ','health-info':'ՍՈՎՈՐԵԼ',community:'ՄԻԱՍԻՆ'}
  }[locale];
  Object.entries(homeWords).forEach(([id, word]) => q(`#${CSS.escape(id)}`)?.setAttribute('data-v8-word',word));
  q('#care')?.classList.add('v8-dark'); q('#patient-area')?.classList.add('v8-dark');

  // 06. Page heroes get a consistent chapter label.
  const kindLabels = {
    en:{care:'CARE / 01',patient:'PATIENTS / 02',clinic:'CLINIC / 03',community:'COMMUNITY / 04',article:'READ / 05',legal:'INFORMATION / 06'},
    es:{care:'CUIDADO / 01',patient:'PACIENTES / 02',clinic:'CLÍNICA / 03',community:'COMUNIDAD / 04',article:'LEER / 05',legal:'INFORMACIÓN / 06'},
    hy:{care:'ԽՆԱՄՔ / 01',patient:'ՊԱՑԻԵՆՏ / 02',clinic:'ԿԼԻՆԻԿԱ / 03',community:'ՀԱՄԱՅՆՔ / 04',article:'ԿԱՐԴԱԼ / 05',legal:'ՏԵՂԵԿՈՒԹՅՈՒՆ / 06'}
  }[locale];
  const pageKind = d.body.dataset.pageKind || 'clinic';
  q('.page-hero')?.setAttribute('data-v8-label', kindLabels[pageKind] || 'CANBY');

  // 07. Alternate long-form section surfaces so pages have rhythm rather than one flat canvas.
  qa('main > .section').forEach((section,i) => section.classList.add(i % 2 ? 'v8-surface-b' : 'v8-surface-a'));

  // 08. Add intentional reveal choreography to large structural blocks.
  const revealTargets = qa('.cf-start-grid,.cf-care-head,.cf-care-stage,.cf-visit-sticky,.cf-portal-head,.cf-interface,.cf-journal-head,.cf-story-grid,.cf-location-copy,.section-title,.split,.cta-band,.page-hero-grid');
  revealTargets.forEach(el=>el.classList.add('v8-reveal'));
  qa('.cf-action-rail,.cf-steps,.cf-care-list,.cf-community-grid,.grid-2,.grid-3').forEach(el=>el.classList.add('v8-stagger'));

  if (reduced || !('IntersectionObserver' in window)) {
    qa('.v8-reveal,.v8-stagger,.cf-location').forEach(el=>el.classList.add('v8-in'));
  } else {
    const io = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if (!entry.isIntersecting) return;
        entry.target.classList.add('v8-in');
        io.unobserve(entry.target);
      });
    },{threshold:.08,rootMargin:'0px 0px -8% 0px'});
    qa('.v8-reveal,.v8-stagger,.cf-location').forEach(el=>io.observe(el));
  }

  // 09. Make the large action surfaces subtly responsive to the pointer.
  if (finePointer && !reduced) {
    qa('[data-v8-tilt]').forEach(card=>{
      let raf=0;
      card.addEventListener('pointermove',e=>{
        cancelAnimationFrame(raf);
        raf=requestAnimationFrame(()=>{
          const r=card.getBoundingClientRect();
          const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
          card.style.transform=`perspective(900px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.2).toFixed(2)}deg) translateY(-6px)`;
        });
      });
      card.addEventListener('pointerleave',()=>{cancelAnimationFrame(raf);card.style.removeProperty('transform');});
    });
  }

  // 10. Page buttons have a tiny magnetic response, kept below three pixels.
  if (finePointer && !reduced) {
    qa('.btn,.cf-button').forEach(btn=>{
      btn.addEventListener('pointermove',e=>{
        const r=btn.getBoundingClientRect();
        const x=((e.clientX-r.left)/r.width-.5)*4, y=((e.clientY-r.top)/r.height-.5)*4;
        btn.style.translate=`${x.toFixed(1)}px ${y.toFixed(1)}px`;
      });
      btn.addEventListener('pointerleave',()=>btn.style.removeProperty('translate'));
    });
  }

  // 11. Give repeated generic service icons a more designed numeric rhythm.
  qa('.service-icon').forEach((el,i)=>{
    if (!el.textContent.trim() || /^\d+$/.test(el.textContent.trim())) el.textContent=String(i+1).padStart(2,'0');
  });

  // 12. Footer gets a branded motion ending that stays purely decorative.
  const footer=q('.cf-footer');
  if(footer && !q('.v8-footer-pulse',footer)){
    const words={en:['CARE','ACCESS','COMMUNITY','FOLLOW-UP'],es:['CUIDADO','ACCESO','COMUNIDAD','SEGUIMIENTO'],hy:['ԽՆԱՄՔ','ՀԱՍԱՆԵԼԻՈՒԹՅՈՒՆ','ՀԱՄԱՅՆՔ','ՀԵՏԵՎՈՒՄ']}[locale];
    const content=words.map((w,i)=>`${i===1?'<b>':''}${w}${i===1?'</b>':''}<span>·</span>`).join('');
    const pulse=d.createElement('div'); pulse.className='v8-footer-pulse';pulse.setAttribute('aria-hidden','true');
    pulse.innerHTML=`<div class="v8-footer-pulse__track"><div class="v8-footer-pulse__group">${content}</div><div class="v8-footer-pulse__group">${content}</div></div>`;
    const safety=q('.cf-footer-safety',footer); safety ? safety.insertAdjacentElement('afterend',pulse) : footer.prepend(pulse);
  }

  // 13. Carry active chapter state into aria-current for stronger keyboard/screen-reader semantics.
  const sceneLinks=qa('.cf-scene-nav a');
  if(sceneLinks.length && 'MutationObserver' in window){
    const paint=()=>sceneLinks.forEach(a=>a.setAttribute('aria-current',a.classList.contains('is-active')?'true':'false'));
    const observer=new MutationObserver(paint); sceneLinks.forEach(a=>observer.observe(a,{attributes:true,attributeFilter:['class']})); paint();
  }

  // 14. Keep CSS timeline progress smooth even if the older step observer isn't active.
  const steps=qa('.cf-step'), stepWrap=q('.cf-steps');
  if(steps.length && stepWrap && 'IntersectionObserver' in window){
    const stepIO=new IntersectionObserver(entries=>{
      const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      const index=steps.indexOf(visible.target);
      const pct=steps.length>1 ? index/(steps.length-1)*100 : 100;
      stepWrap.style.setProperty('--visit-progress',pct.toFixed(1)); stepWrap.style.setProperty('--visit-progress-pct',`${pct.toFixed(1)}%`);
    },{rootMargin:'-25% 0px -45% 0px',threshold:[.2,.5,.8]});
    steps.forEach(x=>stepIO.observe(x));
  }

  // 15. Add a visual secure state only to disabled/unconnected patient forms; no false claim of active integration.
  qa('form input:disabled,form select:disabled,form textarea:disabled').forEach(field=>field.closest('.form-card,.secure-intake,form')?.classList.add('v8-integration-locked'));
})();


/* ===== CANBY PREMIUM FINAL / V9 QUALITY RUNTIME ===== */
(()=>{
  'use strict';
  const d=document;
  const q=(s,r=d)=>r.querySelector(s);
  const qa=(s,r=d)=>[...r.querySelectorAll(s)];
  d.body.classList.add('premium-final-ready');
  d.body.dataset.build='premium-final-20260815';
  d.body.dataset.siteVersion='premium-final-20260815';

  // Remove the earlier pointer-tilt visual behavior. Premium-final uses depth,
  // lighting and restrained vertical response instead of rotating UI cards.
  qa('[data-v8-tilt]').forEach(el=>{el.style.removeProperty('transform');});

  // Make below-fold photography cheaper to decode and safer when a third-party
  // editorial image is unavailable. The hero asset remains eager/high-priority.
  qa('img').forEach(img=>{
    if(!img.closest('#terminalAmbulanceHero')){
      if(!img.hasAttribute('loading')) img.loading='lazy';
      if(!img.hasAttribute('decoding')) img.decoding='async';
    }
    img.addEventListener('error',()=>img.classList.add('pf-image-error'),{once:true});
  });

  // Escape consistently closes every transient navigation layer.
  d.addEventListener('keydown',e=>{
    if(e.key!=='Escape') return;
    d.body.classList.remove('menu-open');
    q('.cf-menu-button')?.setAttribute('aria-expanded','false');
    qa('.cf-nav-item.is-open').forEach(item=>{
      item.classList.remove('is-open');
      item.querySelector('.cf-nav-trigger')?.setAttribute('aria-expanded','false');
    });
    q('.cf-language')?.classList.remove('is-open');
    q('.cf-language-button')?.setAttribute('aria-expanded','false');
  });

  // Give meaningful major sections stable chapter identifiers for visual QA,
  // analytics hooks and future animation choreography without changing copy.
  qa('main > section').forEach((section,i)=>{
    if(!section.dataset.premiumChapter) section.dataset.premiumChapter=String(i+1).padStart(2,'0');
  });

  // Pause marquee motion when the tab is not visible so no decorative animation
  // burns cycles in the background.
  d.addEventListener('visibilitychange',()=>{
    d.body.classList.toggle('pf-tab-hidden',d.hidden);
  });
})();
