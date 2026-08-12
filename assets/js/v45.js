
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
    if(!canvas || !section || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    let w=0,h=0,dpr=1, raf=0, t=0;
    const particles = Array.from({length:170}, (_,i)=>({
      x:Math.random(), y:Math.random(), z:Math.random(), s:.35+Math.random()*1.6, p:Math.random()*Math.PI*2,
      hue:['#00B4D8','#2DC653','#F72585','#FFBE0B','#8338EC'][i%5]
    }));
    function resize(){
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth = innerWidth; h = canvas.clientHeight = innerHeight;
      canvas.width = Math.floor(w*dpr); canvas.height = Math.floor(h*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    function ease(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2}
    function progress(){
      const r = section.getBoundingClientRect();
      const total = section.offsetHeight - innerHeight;
      return Math.max(0, Math.min(1, -r.top / Math.max(1,total)));
    }
    function linePath(p){
      const pts=[]; const cy=h*(.52 - .12*Math.sin(p*Math.PI));
      for(let i=0;i<80;i++){
        const x=i/79*w; let y=cy + Math.sin(i*.37 + p*8)*18*(1-p);
        const k=i/79;
        const pulse = Math.exp(-Math.pow((k-.25-p*.22)*18,2))*90 + Math.exp(-Math.pow((k-.52-p*.16)*20,2))*70;
        y += ((i%13===0? -pulse:pulse*.42) * (1-Math.max(0,p-.55)*1.6));
        if(p>.48){
          const targetY = h*(.28 + .48*((Math.sin(k*9)+1)/2));
          y = y*(1-(p-.48)/.52) + targetY*((p-.48)/.52);
        }
        pts.push([x,y]);
      }
      return pts;
    }
    function drawBuilding(p){
      const b = Math.max(0, (p-.63)/.26); if(!b) return;
      const bx=w*.58, by=h*.58, bw=Math.min(420,w*.44), bh=220;
      ctx.save(); ctx.globalAlpha=b; ctx.translate(bx, by + (1-b)*90); ctx.scale(.8+b*.2,.8+b*.2);
      ctx.fillStyle='rgba(255,255,255,.92)'; round(-bw/2,-bh/2,bw,bh,26); ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,.55)'; ctx.lineWidth=2; ctx.stroke();
      ctx.fillStyle='rgba(0,180,216,.22)';
      for(let row=0; row<3; row++) for(let col=0; col<5; col++){ round(-bw/2+34+col*70,-bh/2+32+row*48,38,24,8); ctx.fill(); }
      ctx.fillStyle='#F72585'; round(-26,-10,52,90,14); ctx.fill();
      ctx.fillStyle='white'; ctx.font='900 42px Inter, Arial'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('+',0,-52);
      ctx.fillStyle='rgba(6,18,31,.82)'; ctx.font='900 24px Inter, Arial'; ctx.fillText('Canby Clinic',0,bh/2-32);
      ctx.restore();
    }
    function round(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
    function draw(){
      raf = requestAnimationFrame(draw); t += .016;
      const p = progress(); const ep = ease(p);
      ctx.clearRect(0,0,w,h);
      const grad = ctx.createLinearGradient(0,0,w,h);
      grad.addColorStop(0, p<.7?'#06121f':'rgba(255,253,247,1)'); grad.addColorStop(.45, p<.7?'#08365d':'rgba(247,251,255,1)'); grad.addColorStop(1, p<.7?'#110829':'rgba(255,253,247,1)');
      ctx.fillStyle=grad; ctx.fillRect(0,0,w,h);
      ctx.save(); ctx.globalCompositeOperation='lighter';
      particles.forEach((a,i)=>{
        const swirl = ep*Math.PI*3 + a.p;
        const rx = (a.x-.5)*w*(1.3-.5*ep) + Math.cos(swirl+i*.02)*ep*130;
        const ry = (a.y-.5)*h*(1.2-.3*ep) + Math.sin(swirl)*ep*70;
        const x = w/2 + rx; const y = h/2 + ry;
        const size = a.s*(1+a.z*2)*(p<.72?1.4: .75);
        ctx.fillStyle=a.hue; ctx.globalAlpha=(p<.72?.5:.18)*(1-a.z*.3);
        ctx.beginPath(); ctx.arc(x,y,size,0,Math.PI*2); ctx.fill();
      });
      ctx.restore();
      // orbiting health cross tunnel
      ctx.save(); ctx.translate(w/2,h/2); ctx.rotate(t*.06 + p*.8); ctx.globalAlpha=Math.max(.06,.42-p*.32); ctx.strokeStyle='rgba(255,255,255,.28)'; ctx.lineWidth=1.5;
      for(let i=0;i<7;i++){ ctx.beginPath(); ctx.ellipse(0,0,120+i*65,44+i*20, i*.45,0,Math.PI*2); ctx.stroke(); }
      ctx.restore();
      const pts=linePath(ep);
      ctx.save(); ctx.lineWidth = Math.max(2, w/520); ctx.lineJoin='round'; ctx.lineCap='round';
      const g=ctx.createLinearGradient(0,0,w,0); g.addColorStop(0,'#00B4D8'); g.addColorStop(.35,'#2DC653'); g.addColorStop(.66,'#FFBE0B'); g.addColorStop(1,'#F72585');
      ctx.strokeStyle=g; ctx.shadowColor='#00B4D8'; ctx.shadowBlur=24;
      ctx.beginPath(); pts.forEach(([x,y],i)=> i?ctx.lineTo(x,y):ctx.moveTo(x,y)); ctx.stroke(); ctx.restore();
      // map pins / community nodes
      if(p>.42){
        const a=Math.min(1,(p-.42)/.32); ctx.save(); ctx.globalAlpha=a; ctx.strokeStyle='rgba(255,255,255,.22)'; ctx.lineWidth=1;
        for(let i=0;i<9;i++){
          const x=w*(.16+((i*19)%67)/100), y=h*(.22+((i*31)%58)/100); ctx.beginPath(); ctx.arc(x,y,18+Math.sin(t+i)*4,0,Math.PI*2); ctx.stroke();
          ctx.fillStyle=['#00B4D8','#2DC653','#F72585','#FFBE0B'][i%4]; ctx.beginPath(); ctx.arc(x,y,4+Math.sin(t*2+i)*1.5,0,Math.PI*2); ctx.fill();
        }
        ctx.restore();
      }
      drawBuilding(ep);
      if(p>.82){
        ctx.save(); ctx.globalAlpha=(p-.82)/.18; ctx.fillStyle='rgba(255,253,247,.92)'; ctx.fillRect(0,0,w,h); ctx.restore();
      }
    }
    addEventListener('resize', resize, {passive:true}); resize(); draw();
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
    let meds = [];
    const render=()=>{list.innerHTML = meds.length? meds.map((m,i)=>`<div class="card"><strong>${m.name}</strong><p>${m.dose||''} ${m.when?`— ${m.when}`:''}</p><button class="btn ghost" data-del="${i}">Remove</button></div>`).join(''):'<p class="soft-text">Nothing has been added. This temporary list is not saved.</p>';};
    form.addEventListener('submit', e=>{e.preventDefault(); meds.push({name:$('#medName').value,dose:$('#medDose').value,when:$('#medWhen').value}); form.reset(); render();});
    list.addEventListener('click', e=>{const b=e.target.closest('[data-del]'); if(b){meds.splice(+b.dataset.del,1); render();}}); render();
  }

  function initPortal(){
    const portalForm = $('#portalAuth'); if(portalForm){
      portalForm.addEventListener('submit', e=>{e.preventDefault(); portalForm.reset(); portalForm.insertAdjacentHTML('beforeend','<div class="notice danger"><strong>Portal login is not connected.</strong><p>No information was saved. Call the clinic for the approved secure portal.</p></div>');});
    }
    const userSpot = $('[data-user-name]'); if(userSpot){
      userSpot.textContent = 'Canby Patient';
    }
    $$('[data-logout]').forEach(b=>b.addEventListener('click',()=>{location.href='patient-portal.html';}));
  }

  const upgradeStyle = document.createElement('link');
  upgradeStyle.rel = 'stylesheet';
  upgradeStyle.href = 'assets/css/canby-command-center.css?v=61';
  document.head.appendChild(upgradeStyle);
  const upgradeScript = document.createElement('script');
  upgradeScript.src = 'assets/js/canby-command-center.js?v=61';
  upgradeScript.async = false;
  upgradeScript.addEventListener('load', () => {
    const isHome = Boolean(document.querySelector('.cc-home'));
    if (isHome) {
      const awardStyle = document.createElement('link');
      awardStyle.rel = 'stylesheet';
      awardStyle.href = 'assets/css/canby-award-home.css?v=68';
      document.head.appendChild(awardStyle);
    }
    const unifiedStyle = document.createElement('link');
    unifiedStyle.rel = 'stylesheet';
    unifiedStyle.href = 'assets/css/canby-unified-system.css?v=69';
    document.head.appendChild(unifiedStyle);
    const polishStyle = document.createElement('link');
    polishStyle.rel = 'stylesheet';
    polishStyle.href = 'assets/css/canby-polish-v69.css?v=69';
    document.head.appendChild(polishStyle);
    const designStyle = document.createElement('link');
    designStyle.rel = 'stylesheet';
    designStyle.href = 'assets/css/canby-site-v71.css?v=71';
    document.head.appendChild(designStyle);
    const interiorsStyle = document.createElement('link');
    interiorsStyle.rel = 'stylesheet';
    interiorsStyle.href = 'assets/css/canby-interiors-v72.css?v=72';
    document.head.appendChild(interiorsStyle);
    const unifiedScript = document.createElement('script');
    unifiedScript.src = 'assets/js/canby-unified-system.js?v=69';
    unifiedScript.async = false;
    unifiedScript.addEventListener('load', () => {
      const loadDesign = () => {
        const designScript = document.createElement('script');
        designScript.src = 'assets/js/canby-site-v71.js?v=71';
        designScript.async = false;
        designScript.addEventListener('load', () => {
          const interiorsScript = document.createElement('script');
          interiorsScript.src = 'assets/js/canby-interiors-v72.js?v=72';
          interiorsScript.async = false;
          document.body.appendChild(interiorsScript);
        });
        document.body.appendChild(designScript);
      };
      const polishScript = document.createElement('script');
      polishScript.src = 'assets/js/canby-polish-v69.js?v=71';
      polishScript.async = false;
      polishScript.addEventListener('load', loadDesign);
      document.body.appendChild(polishScript);
    });
    document.body.appendChild(unifiedScript);
  });
  document.body.appendChild(upgradeScript);

  document.addEventListener('DOMContentLoaded', () => {
    initHeader(); initProgress(); initReveal(); initHeroCanvas(); initFaq(); initFilters(); initVisitPlanner(); initBp(); initMedicationBuilder(); initPortal();
  });
})();
