(() => {
  const section = document.querySelector('.ambulance-hero-scroll');
  const canvas = document.getElementById('ambulanceCanvas');
  if(!section || !canvas) return;
  const ctx = canvas.getContext('2d', { alpha:false, desynchronized:true });
  const TOTAL = 120;
  const isMobile = matchMedia('(max-width: 700px)').matches;
  const base = isMobile ? 'assets/ambulance/frames-mobile/' : 'assets/ambulance/frames/';
  const cache = new Map();
  let targetFrame = 0, lastDrawn = -1, raf = 0, direction = 1, lastProgress = 0;
  const body = document.body;
  body.classList.add('home-cinematic');

  function frameUrl(i){ return `${base}frame_${String(i+1).padStart(3,'0')}.webp`; }
  function load(i, priority=false){
    i=Math.max(0,Math.min(TOTAL-1,i));
    if(cache.has(i)) return cache.get(i);
    const img = new Image(); img.decoding='async'; if(priority) img.fetchPriority='high';
    img.src=frameUrl(i); img.onload=()=>{ if(i===targetFrame || lastDrawn<0) requestDraw(); };
    cache.set(i,img); return img;
  }
  function preloadCritical(){
    [0,1,2,3,4,12,24,36,48,60,72,84,96,108,119].forEach((i,n)=>load(i,n<5));
    const idle = window.requestIdleCallback || ((cb)=>setTimeout(cb,120));
    idle(()=>{ for(let i=0;i<TOTAL;i+=3) load(i); });
  }
  function cover(img){
    const dpr=Math.min(devicePixelRatio||1,2); const w=innerWidth, h=innerHeight;
    const rw=Math.round(w*dpr), rh=Math.round(h*dpr);
    if(canvas.width!==rw || canvas.height!==rh){canvas.width=rw;canvas.height=rh;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);}
    const ir=img.naturalWidth/img.naturalHeight, cr=w/h; let dw,dh,dx,dy;
    if(ir>cr){dh=h;dw=dh*ir;dx=(w-dw)/2;dy=0}else{dw=w;dh=dw/ir;dx=0;dy=(h-dh)/2}
    ctx.fillStyle = targetFrame > TOTAL*.86 ? '#fff' : '#03060a'; ctx.fillRect(0,0,w,h); ctx.drawImage(img,dx,dy,dw,dh);
  }
  function nearestLoaded(i){
    const exact=cache.get(i); if(exact?.complete && exact.naturalWidth) return [i,exact];
    for(let d=1;d<18;d++){
      for(const n of [i-d,i+d]){ const im=cache.get(n); if(im?.complete && im.naturalWidth) return [n,im]; }
    }
    const first=cache.get(0); return first?.complete?[0,first]:null;
  }
  function draw(){ raf=0; const found=nearestLoaded(targetFrame); if(!found) return; const [i,img]=found; cover(img); lastDrawn=i; }
  function requestDraw(){ if(!raf) raf=requestAnimationFrame(draw); }
  function progress(){
    const r=section.getBoundingClientRect(); const total=section.offsetHeight-innerHeight;
    return Math.max(0,Math.min(1,-r.top/Math.max(1,total)));
  }
  function update(){
    const p=progress(); direction=p>=lastProgress?1:-1; lastProgress=p;
    targetFrame=Math.round(p*(TOTAL-1));
    load(targetFrame,true);
    for(let d=1;d<=10;d++){load(targetFrame+d*direction); if(d<=4) load(targetFrame-d*direction);}
    requestDraw();
    section.style.setProperty('--hero-progress',p.toFixed(4));
    body.classList.toggle('hero-ended', p>.965);
    const label=document.querySelector('.ambulance-hero-label');
    const line=document.querySelector('.ambulance-hero-line');
    if(label){ const a=Math.max(0,Math.min(1,(p-.07)/.09))*Math.max(0,Math.min(1,(.36-p)/.10)); label.style.opacity=a; label.style.transform=`translateY(${(1-a)*18}px)`; }
    if(line){ const a=Math.max(0,Math.min(1,(p-.39)/.10))*Math.max(0,Math.min(1,(.78-p)/.12)); line.style.opacity=a; line.style.transform=`translateY(${(1-a)*24}px)`; }
  }
  addEventListener('scroll',update,{passive:true}); addEventListener('resize',()=>{requestDraw();update();},{passive:true});
  preloadCritical(); update();
})();