
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
    const section = $('.hero-scroll');
    if(!canvas || !section) return;
    const ctx = canvas.getContext('2d', { alpha:false });
    const TOTAL = 130;
    const frames = new Array(TOTAL);
    let loaded = 0, current = 0, target = 0, raf = 0, w = 0, h = 0, dpr = 1;
    const framePath = i => `assets/ambulance-frames/canby_ambulance_${String(i+1).padStart(3,'0')}.webp`;

    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
      canvas.style.width = w+'px'; canvas.style.height = h+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      draw(Math.round(current));
    }
    function draw(index){
      const img = frames[Math.max(0,Math.min(TOTAL-1,index))];
      if(!img || !img.complete) return;
      const ir = img.naturalWidth/img.naturalHeight, cr = w/h;
      let dw,dh,dx,dy;
      if(ir>cr){ dh=h; dw=dh*ir; dx=(w-dw)/2; dy=0; }
      else { dw=w; dh=dw/ir; dx=0; dy=(h-dh)/2; }
      ctx.clearRect(0,0,w,h); ctx.drawImage(img,dx,dy,dw,dh);
    }
    function progress(){
      const r = section.getBoundingClientRect();
      const total = section.offsetHeight - innerHeight;
      return Math.max(0,Math.min(1,-r.top/Math.max(1,total)));
    }
    function tick(){
      target = progress()*(TOTAL-1);
      current += (target-current)*0.18;
      if(Math.abs(target-current)<0.03) current=target;
      draw(Math.round(current));
      const p = progress();
      document.body.classList.toggle('hero-active', p < .965);
      const copy = $('.ambulance-copy');
      if(copy){
        const enter=Math.max(0,Math.min(1,(p-.08)/.16));
        const leave=Math.max(0,Math.min(1,(p-.58)/.18));
        copy.style.opacity = String(enter*(1-leave));
        copy.style.transform = `translate3d(0,${(1-enter)*28-leave*24}px,0)`;
      }
      raf=requestAnimationFrame(tick);
    }
    function preload(){
      const order=[0,1,2,3,4,5,10,20,30,40,50,60,70,80,90,100,110,120,129];
      const rest=Array.from({length:TOTAL},(_,i)=>i).filter(i=>!order.includes(i));
      [...order,...rest].forEach((i,n)=>{
        const im=new Image(); im.decoding='async'; im.src=framePath(i); frames[i]=im;
        im.onload=()=>{ loaded++; if(i===0) draw(0); const el=$('.ambulance-loader'); if(el) el.style.opacity=String(Math.max(0,1-loaded/18)); };
      });
    }
    addEventListener('resize',resize,{passive:true});
    resize(); preload(); tick();
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
