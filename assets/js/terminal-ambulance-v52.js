(() => {
  'use strict';
  const section = document.getElementById('terminalAmbulanceHero');
  const canvas = document.getElementById('terminalAmbulanceCanvas');
  if (!section || !canvas) return;

  const TOTAL = 130;
  const ctx = canvas.getContext('2d', { alpha:false, desynchronized:true });
  const loader = section.querySelector('.terminal-load-cover');
  const nav = section.querySelector('.terminal-cinematic-nav');
  const scrollLabel = section.querySelector('.terminal-scroll-label');
  const shade = section.querySelector('.terminal-cinematic-shade');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let mode = selectMode();
  let cache = new Map();
  let pending = new Set();
  let targetFrame = 0;
  let displayFrame = 0;
  let lastTarget = 0;
  let raf = 0;
  let dpr = 1;

  function selectMode() {
    return (innerWidth <= 760 || innerHeight > innerWidth * 1.22) ? 'mobile' : 'desktop';
  }
  function frameURL(i) {
    return `assets/ambulance/${mode}/frame_${String(i + 1).padStart(3,'0')}.webp`;
  }
  function loadFrame(i, priority=false) {
    i = Math.max(0, Math.min(TOTAL - 1, i|0));
    if (cache.has(i) || pending.has(i)) return Promise.resolve(cache.get(i));
    pending.add(i);
    return new Promise(resolve => {
      const img = new Image();
      if ('fetchPriority' in img && priority) img.fetchPriority = 'high';
      img.decoding = 'async';
      img.onload = () => {
        pending.delete(i); cache.set(i,img); trimCache(i); resolve(img);
      };
      img.onerror = () => { pending.delete(i); resolve(null); };
      img.src = frameURL(i);
    });
  }
  function trimCache(center) {
    const max = mode === 'mobile' ? 54 : 72;
    if (cache.size <= max) return;
    [...cache.keys()].sort((a,b)=>Math.abs(b-center)-Math.abs(a-center)).slice(0,cache.size-max).forEach(k=>cache.delete(k));
  }
  function prime() {
    const first = [0,1,2,3,4,5,10,20,32,45,58,72,86,100,112,120,125,129];
    Promise.all(first.slice(0,6).map((i,n)=>loadFrame(i,n<2))).then(() => {
      loader?.classList.add('is-ready');
      drawNearest(0);
    });
    requestIdleCallback?.(() => first.slice(6).forEach(i=>loadFrame(i)), {timeout:1200});
  }
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.max(1, canvas.clientWidth), h = Math.max(1, canvas.clientHeight);
    canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
    drawNearest(Math.round(displayFrame));
  }
  function drawImageCover(img) {
    if (!img || !img.naturalWidth) return;
    const cw=canvas.width, ch=canvas.height, iw=img.naturalWidth, ih=img.naturalHeight;
    const s=Math.max(cw/iw,ch/ih), dw=iw*s, dh=ih*s;
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,cw,ch);
    ctx.drawImage(img,(cw-dw)/2,(ch-dh)/2,dw,dh);
  }
  function drawNearest(i) {
    i=Math.max(0,Math.min(TOTAL-1,i|0));
    let img=cache.get(i);
    if (!img) {
      for (let d=1;d<9 && !img;d++) img=cache.get(i-d)||cache.get(i+d);
      loadFrame(i,true).then(found=>{ if(found && Math.abs(Math.round(displayFrame)-i)<=2) drawImageCover(found); });
    }
    if(img) drawImageCover(img);
  }
  function progress() {
    if (reduced.matches) return 0;
    const r=section.getBoundingClientRect();
    const total=Math.max(1,section.offsetHeight-innerHeight);
    return Math.max(0,Math.min(1,-r.top/total));
  }
  function updateTarget() {
    const p=progress();
    targetFrame=p*(TOTAL-1);
    const dir=targetFrame>=lastTarget?1:-1;
    lastTarget=targetFrame;
    const i=Math.round(targetFrame);
    loadFrame(i,true);
    for(let n=1;n<=10;n++) loadFrame(i+n*dir);
    for(let n=1;n<=4;n++) loadFrame(i-n*dir);
    const fade=Math.max(0,Math.min(1,(p-.82)/.17));
    if(nav){nav.style.opacity=String(1-fade); nav.style.transform=`translateX(-50%) translateY(${-8*fade}px)`;}
    if(scrollLabel) scrollLabel.style.opacity=String(Math.max(0,1-p*3.2));
    if(shade) shade.style.opacity=String(.42*(1-fade));
    document.body.classList.toggle('terminal-past', p>.985 || section.getBoundingClientRect().bottom<=innerHeight+2);
  }
  function tick() {
    raf=requestAnimationFrame(tick);
    // Responsive but slightly damped: gives trackpads film-like motion without autoplay.
    const delta=targetFrame-displayFrame;
    displayFrame += delta * (Math.abs(delta)>10 ? .42 : .30);
    if(Math.abs(delta)<.015) displayFrame=targetFrame;
    drawNearest(Math.round(displayFrame));
  }
  function handleResize() {
    const next=selectMode();
    if(next!==mode){ mode=next; cache.clear(); pending.clear(); prime(); }
    resize(); updateTarget();
  }
  addEventListener('scroll',updateTarget,{passive:true});
  addEventListener('resize',handleResize,{passive:true});
  reduced.addEventListener?.('change',()=>{updateTarget();});
  resize(); updateTarget(); prime(); tick();
})();
