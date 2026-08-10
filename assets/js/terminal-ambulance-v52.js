(() => {
  'use strict';
  const section = document.getElementById('terminalAmbulanceHero');
  const canvas = document.getElementById('terminalAmbulanceCanvas');
  if (!section || !canvas) return;

  const TOTAL = 180;
  const FRAME_END = 145;
  const ctx = canvas.getContext('2d', { alpha:false, desynchronized:true });
  const loader = section.querySelector('.terminal-load-cover');
  const nav = section.querySelector('.terminal-cinematic-nav');
  const scrollLabel = section.querySelector('.terminal-scroll-label');
  const shade = section.querySelector('.terminal-cinematic-shade');
  const messages = Array.from(section.querySelectorAll('[data-terminal-message]'));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let mode = selectMode();
  let cache = new Map();
  let pending = new Set();
  let targetFrame = 0;
  let displayFrame = 0;
  let lastTarget = 0;
  let currentProgress = 0;
  let raf = 0;
  let dpr = 1;

  function selectMode() {
    return (innerWidth <= 760 || innerHeight > innerWidth * 1.22) ? 'mobile' : 'desktop';
  }
  function frameURL(i) {
    return `assets/ambulance/${mode}/frame_${String(i + 1).padStart(3,'0')}.webp?v=59`;
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
    const first = [0,1,2,3,4,5,10,20,35,50,70,90,105,120,138,150,163,179];
    Promise.all(first.slice(0,6).map((i,n)=>loadFrame(i,n<2))).then(() => {
      loader?.classList.add('is-ready');
      drawNearest(0);
    });
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 120));
    idle(() => first.slice(6).forEach(i=>loadFrame(i)), {timeout:1200});
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
    const cover=Math.max(cw/iw,ch/ih);
    const openingEase = Math.max(0, Math.min(1, currentProgress / .18));
    const settle = 1 - Math.pow(1 - openingEase, 3);
    const zoom=(mode==='mobile' ? 1.02 : 1.0) + (1 - settle) * .025;
    const s=cover*zoom, dw=iw*s, dh=ih*s;
    ctx.save();
    ctx.imageSmoothingEnabled=true;
    ctx.imageSmoothingQuality='high';
    ctx.filter='saturate(.96) contrast(1.08) brightness(1.03)';
    const yLift = mode==='mobile' ? 0 : (1 - settle) * -10 * dpr;
    const xDrift = mode==='mobile' ? 0 : (1 - settle) * 16 * dpr;
    ctx.drawImage(img,(cw-dw)/2 + xDrift,(ch-dh)/2+yLift,dw,dh);
    ctx.filter='none';
    const grade=ctx.createLinearGradient(0,0,cw,ch);
    grade.addColorStop(0,'rgba(0,245,212,.08)');
    grade.addColorStop(.48,'rgba(6,12,24,.02)');
    grade.addColorStop(1,'rgba(155,93,229,.10)');
    ctx.fillStyle=grade; ctx.fillRect(0,0,cw,ch);
    ctx.restore();
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
    currentProgress=p;
    section.style.setProperty('--terminal-progress', p.toFixed(4));
    const stillHold = .16;
    const driveProgress = p <= stillHold ? 0 : Math.min(1, (p - stillHold) / (1 - stillHold));
    const cinematicDrive = driveProgress * driveProgress * (3 - 2 * driveProgress);
    targetFrame=cinematicDrive*FRAME_END;
    const dir=targetFrame>=lastTarget?1:-1;
    lastTarget=targetFrame;
    const i=Math.round(targetFrame);
    loadFrame(i,true);
    for(let n=1;n<=10;n++) loadFrame(i+n*dir);
    for(let n=1;n<=4;n++) loadFrame(i-n*dir);
    const fade=Math.max(0,Math.min(1,(p-.80)/.13));
    if(nav){nav.style.opacity=String(1-fade); nav.style.visibility=fade>.98?'hidden':'visible'; nav.style.transform=`translateX(-50%) translateY(${-8*fade}px)`;}
    if(scrollLabel){ const cue=Math.max(0,1-p*3.2); scrollLabel.style.opacity=String(cue); scrollLabel.style.visibility=cue<.03?'hidden':'visible'; }
    if(shade) shade.style.opacity=String(.42*(1-fade));
    messages.forEach((el, idx) => {
      const start=[.18,.41,.64][idx] ?? .18;
      const end=[.36,.59,.82][idx] ?? .36;
      const fadeIn=Math.max(0,Math.min(1,(p-start)/.055));
      const fadeOut=Math.max(0,Math.min(1,(end-p)/.065));
      const reveal=fadeIn*fadeOut;
      const a=Math.pow(reveal,.82);
      el.style.opacity=String(a);
      el.style.setProperty('--message-reveal', reveal.toFixed(4));
      el.style.setProperty('--message-clip', `${((1 - reveal) * 100).toFixed(2)}%`);
      el.style.setProperty('--message-blur', `${((1 - reveal) * 7).toFixed(2)}px`);
      el.style.transform=`translate3d(0,${(1-a)*18}px,0) scale(${.992 + a*.008})`;
      el.style.visibility=a<.02?'hidden':'visible';
    });
    document.body.classList.toggle('terminal-past', p>.88 || section.getBoundingClientRect().bottom<=innerHeight+2);
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
