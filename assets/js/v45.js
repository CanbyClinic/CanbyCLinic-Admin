
(() => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('canbyTheme') || 'clinical';
  root.setAttribute('data-theme', savedTheme);

  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => Array.from(p.querySelectorAll(s));

  function initHeader(){
    const path = location.pathname.split('/').pop() || 'index.html';
    $$('.nav-links a,.mobile-panel a,.side-panel a').forEach(a => {
      const href = a.getAttribute('href');
      if(href === path || (path === '' && href === 'index.html')) a.classList.add('active');
    });
    const toggle = $('.menu-toggle');
    const panel = $('.mobile-panel');
    if(toggle && panel){
      toggle.addEventListener('click', () => {
        const open = panel.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    $$('.palette-dot').forEach(btn => btn.addEventListener('click', () => {
      const t = btn.dataset.themePick;
      root.setAttribute('data-theme', t);
      localStorage.setItem('canbyTheme', t);
    }));
  }

  function initReveal(){
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
    $$('.reveal,.card,.start-card,.stat,.resource-card').forEach((el,i) => {
      el.classList.add('reveal'); el.style.transitionDelay = `${Math.min(i%6*55, 260)}ms`; io.observe(el);
    });
  }

  function initProgress(){
    const bar = $('.site-progress');
    if(!bar) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = `${Math.max(0, Math.min(1, scrollY / Math.max(1,max))) * 100}%`;
    };
    addEventListener('scroll', update, {passive:true}); update();
  }

  function initCursorSparks(){
    let last = 0;
    document.addEventListener('pointermove', e => {
      const now = performance.now();
      if(now - last < 70 || innerWidth < 900) return; last = now;
      const s = document.createElement('span');
      s.className = 'spark';
      s.style.left = `${e.clientX}px`; s.style.top = `${e.clientY}px`;
      const angle = Math.random()*Math.PI*2, dist = 18 + Math.random()*28;
      s.style.setProperty('--x', `${Math.cos(angle)*dist}px`);
      s.style.setProperty('--y', `${Math.sin(angle)*dist}px`);
      s.style.background = ['var(--teal)','var(--magenta)','var(--amber)','var(--green)'][Math.floor(Math.random()*4)];
      document.body.appendChild(s); setTimeout(()=>s.remove(), 620);
    }, {passive:true});
  }

  function initTilt(){
    $$('.card,.start-card,.hero-stage-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        if(innerWidth < 900) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width - .5; const y = (e.clientY-r.top)/r.height - .5;
        card.style.transform = `translateY(-6px) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg)`;
      });
      card.addEventListener('pointerleave', () => card.style.transform = '');
    });
  }

  function initHeroCanvas(){
    const canvas = $('#heroCanvas');
    const section = $('.ambulance-hero');
    if(!canvas || !section) return;

    const ctx = canvas.getContext('2d', { alpha:false });
    const FRAME_COUNT = 96;
    const framePath = i => `assets/ambulance/webp/frame_${String(i+1).padStart(4,'0')}.webp`;
    const frames = new Array(FRAME_COUNT);
    const loading = new Set();
    let cssW=innerWidth, cssH=innerHeight, dpr=1;
    let targetFrame=0, currentFrame=0, lastDrawn=-1, raf=0, direction=1;
    let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startCopy=$('.ambulance-copy-start'), midCopy=$('.ambulance-copy-mid'), endPanel=$('.ambulance-end'), hint=$('.ambulance-scroll-hint');

    function clamp(v,a=0,b=1){ return Math.max(a,Math.min(b,v)); }
    function smooth(a,b,x){ const t=clamp((x-a)/(b-a)); return t*t*(3-2*t); }
    function sectionProgress(){
      if(reduced) return 0;
      const r=section.getBoundingClientRect();
      return clamp(-r.top/Math.max(1,section.offsetHeight-innerHeight));
    }
    function resize(){
      cssW=innerWidth; cssH=innerHeight; dpr=Math.min(devicePixelRatio||1,2);
      canvas.width=Math.floor(cssW*dpr); canvas.height=Math.floor(cssH*dpr);
      canvas.style.width=cssW+'px'; canvas.style.height=cssH+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0); lastDrawn=-1;
    }
    function load(i, priority=false){
      i=Math.max(0,Math.min(FRAME_COUNT-1,i|0));
      if(frames[i] || loading.has(i)) return;
      loading.add(i);
      const img=new Image(); img.decoding='async'; img.fetchPriority=priority?'high':'auto';
      img.onload=()=>{ frames[i]=img; loading.delete(i); if(lastDrawn<0 || Math.abs(i-currentFrame)<2) drawFrame(Math.round(currentFrame)); };
      img.onerror=()=>loading.delete(i); img.src=framePath(i);
    }
    function primeAround(index){
      const i=Math.round(index); load(i,true);
      for(let k=1;k<=8;k++){ load(i+k*direction,k<4); load(i-k*direction,false); }
      for(let k=12;k<FRAME_COUNT;k+=18) load(k,false);
    }
    function nearestLoaded(i){
      if(frames[i]) return i;
      for(let d=1;d<10;d++){ if(frames[i-d]) return i-d; if(frames[i+d]) return i+d; }
      return -1;
    }
    function drawCover(img){
      const iw=img.naturalWidth||img.width, ih=img.naturalHeight||img.height;
      const scale=Math.max(cssW/iw,cssH/ih); const dw=iw*scale, dh=ih*scale;
      // mobile framing deliberately biases right/vehicle instead of naive center crop
      let x=(cssW-dw)/2, y=(cssH-dh)/2;
      if(cssW<700) x=(cssW-dw)*.48;
      ctx.fillStyle='#05070a'; ctx.fillRect(0,0,cssW,cssH);
      ctx.drawImage(img,x,y,dw,dh);
    }
    function drawFrame(index){
      index=Math.max(0,Math.min(FRAME_COUNT-1,index|0)); const n=nearestLoaded(index); if(n<0)return;
      if(n===lastDrawn)return; lastDrawn=n; drawCover(frames[n]);
    }
    function updateCopy(p){
      const a=1-smooth(.08,.23,p); const at=12*smooth(.03,.23,p);
      if(startCopy){ startCopy.style.opacity=a; startCopy.style.transform=`translateY(calc(-50% - ${at}px))`; }
      const m=smooth(.31,.43,p)*(1-smooth(.62,.74,p));
      if(midCopy){ midCopy.style.opacity=m; midCopy.style.transform=`translateY(calc(-50% - ${10*(1-m)}px))`; }
      if(hint) hint.style.opacity=String(1-smooth(.12,.28,p));
      const e=smooth(.88,.995,p); if(endPanel){ endPanel.style.opacity=e; endPanel.style.visibility=e>.01?'visible':'hidden'; }
      section.dataset.progress=e>.97?'end':'cinematic';
      document.body.classList.toggle('ambulance-hero-active',p<.985 && section.getBoundingClientRect().bottom>0);
    }
    function tick(){
      const p=sectionProgress(); const nextTarget=p*(FRAME_COUNT-1); direction=nextTarget>=targetFrame?1:-1; targetFrame=nextTarget;
      // scroll owns the target; interpolation only removes wheel/trackpad stepping
      currentFrame += (targetFrame-currentFrame)*.22;
      if(Math.abs(targetFrame-currentFrame)<.02) currentFrame=targetFrame;
      primeAround(currentFrame); drawFrame(Math.round(currentFrame)); updateCopy(p);
      raf=requestAnimationFrame(tick);
    }
    // critical first paint + sparse timeline sampling, then direction-aware neighborhood loading
    [0,1,2,3,4,5,6,7,8,12,18,24,36,48,60,72,84,95].forEach((i,n)=>load(i,n<9));
    addEventListener('resize',resize,{passive:true}); resize(); tick();
    document.addEventListener('visibilitychange',()=>{ if(!document.hidden) primeAround(currentFrame); });
  }

  function initFaq(){
    $$('.faq-q').forEach(q => q.addEventListener('click', () => q.closest('.faq-item').classList.toggle('open')));
  }

  function initFilters(){
    const wrap = $('[data-filter-wrap]'); if(!wrap) return;
    const buttons = $$('.filter-btn', wrap); const items = $$('[data-filter-item]');
    buttons.forEach(btn => btn.addEventListener('click', () => {
      buttons.forEach(b=>b.classList.remove('active')); btn.classList.add('active'); const f=btn.dataset.filter;
      items.forEach(it => it.style.display = (f==='all'||it.dataset.filterItem.includes(f)) ? '' : 'none');
    }));
  }

  function initVisitPlanner(){
    const form = $('#visitPlanner'); if(!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const reason = $('#visitReason').value;
      const lang = $('#visitLanguage').value;
      const first = $('#firstVisit').checked;
      const items = ['Photo ID if available','Current medications or bottles','List of symptoms and questions','Emergency contact information','Any recent lab or visit paperwork'];
      if(first) items.push('Complete new patient forms before arriving');
      if(reason.includes('blood')) items.push('Recent blood pressure readings if you have them');
      if(reason.includes('diabetes')) items.push('Blood sugar log or glucose meter if you use one');
      if(lang !== 'English') items.push(`${lang} language preference note`);
      $('#plannerOutput').innerHTML = `<div class="notice success"><strong>Your visit checklist</strong><ul>${items.map(x=>`<li>${x}</li>`).join('')}</ul><p>Please call (818) 674-4414 to confirm current services and availability.</p></div>`;
    });
  }

  function initBp(){
    const form = $('#bpForm'); if(!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault(); const sys=+$('#systolic').value; const dia=+$('#diastolic').value; let label='Normal range education', cls='success', pos=18;
      if(sys>=180 || dia>=120){ label='Possible hypertensive crisis range — seek urgent medical guidance'; cls='danger'; pos=92; }
      else if(sys>=140 || dia>=90){ label='High blood pressure range education'; cls='danger'; pos=78; }
      else if(sys>=130 || dia>=80){ label='Elevated / stage 1 education range'; cls='notice'; pos=62; }
      else if(sys>=120){ label='Elevated range education'; cls='notice'; pos=43; }
      $('#bpPin').style.left = `${pos}%`;
      $('#bpOutput').innerHTML = `<div class="notice ${cls==='danger'?'danger':cls==='success'?'success':''}"><strong>${label}</strong><p>This tool is educational only and does not diagnose. If symptoms feel urgent, call 911.</p></div>`;
    });
  }

  function initMedicationBuilder(){
    const form = $('#medForm'); const list = $('#medList'); if(!form||!list) return;
    let meds = JSON.parse(localStorage.getItem('canbyMeds')||'[]');
    const render=()=>{list.innerHTML = meds.length? meds.map((m,i)=>`<div class="card"><strong>${m.name}</strong><p>${m.dose||''} ${m.when?`— ${m.when}`:''}</p><button class="btn ghost" data-del="${i}">Remove</button></div>`).join(''):'<p class="soft-text">No medications added yet.</p>'; localStorage.setItem('canbyMeds',JSON.stringify(meds));};
    form.addEventListener('submit', e=>{e.preventDefault(); meds.push({name:$('#medName').value,dose:$('#medDose').value,when:$('#medWhen').value}); form.reset(); render();});
    list.addEventListener('click', e=>{const b=e.target.closest('[data-del]'); if(b){meds.splice(+b.dataset.del,1); render();}}); render();
  }

  function initPortal(){
    const portalForm = $('#portalAuth'); if(portalForm){
      portalForm.addEventListener('submit', e=>{e.preventDefault(); const name=$('#portalName')?.value||'Canby Patient'; const email=$('#portalEmail').value; localStorage.setItem('canbyUser', JSON.stringify({name,email,created:new Date().toISOString()})); location.href='patient-dashboard.html';});
    }
    const userSpot = $('[data-user-name]'); if(userSpot){
      const u = JSON.parse(localStorage.getItem('canbyUser')||'{}'); userSpot.textContent = u.name || 'Canby Patient';
    }
    $$('[data-logout]').forEach(b=>b.addEventListener('click',()=>{localStorage.removeItem('canbyUser'); location.href='patient-portal.html';}));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeader(); initProgress(); initReveal(); initCursorSparks(); initTilt(); initHeroCanvas(); initFaq(); initFilters(); initVisitPlanner(); initBp(); initMedicationBuilder(); initPortal();
  });
})();
