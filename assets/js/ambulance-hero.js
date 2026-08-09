(() => {
  const TOTAL_FRAMES = 110;
  const framePath = i => `assets/frames/canby_ambulance_frame_${String(i + 1).padStart(3, '0')}.webp`;
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const loading = document.getElementById('loading');
  const copy = document.getElementById('sceneCopy');
  const eyebrow = document.getElementById('eyebrow');
  const headline = document.getElementById('headline');
  const subline = document.getElementById('subline');
  const hint = document.getElementById('scrollHint');

  const scenes = [
    { at: 0.00, eyebrow: 'CANBY CLINIC MOBILE CARE UNIT', headline: 'Community care is on the move.', subline: 'A realistic ambulance-led opening direction for the Canby Clinic homepage.' },
    { at: 0.28, eyebrow: 'HIGH-URGENCY VISUAL LANGUAGE', headline: 'Fast. Local. Focused on people.', subline: 'The animation behaves like a premium vehicle sequence, not a children’s illustration.' },
    { at: 0.58, eyebrow: 'RESEDA • CANBY AVE', headline: 'A clinic presence people remember.', subline: 'Scroll-controlled motion, vivid clinical color, and a Canby-branded ambulance.' },
    { at: 0.82, eyebrow: 'NEXT: FULL WEBSITE BUILD', headline: 'Approve the intro. Then we build around it.', subline: 'This is only the opening animation prototype.' }
  ];

  let images = [];
  let loaded = 0;
  let current = 0;
  let raf = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function preload() {
    images = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = framePath(i);
      img.onload = () => {
        loaded += 1;
        if (loaded === 1) draw(0);
        if (loaded === TOTAL_FRAMES) {
          loading.classList.add('hide');
          update();
        }
      };
      return img;
    });
  }

  function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(current);
  }

  function draw(index) {
    const img = images[index];
    if (!img || !img.complete) return;
    current = index;
    const w = innerWidth;
    const h = innerHeight;
    const ir = img.width / img.height;
    const cr = w / h;
    let dw = w, dh = h, dx = 0, dy = 0;
    if (ir > cr) {
      dh = h;
      dw = img.width * (dh / img.height);
      dx = (w - dw) / 2;
    } else {
      dw = w;
      dh = img.height * (dw / img.width);
      dy = (h - dh) / 2;
    }
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function ease(t) { return t * t * (3 - 2 * t); }

  function progress() {
    const hero = document.getElementById('hero');
    const rect = hero.getBoundingClientRect();
    const total = hero.offsetHeight - innerHeight;
    return clamp(-rect.top / Math.max(1, total), 0, 1);
  }

  function sceneFor(p) {
    let s = scenes[0];
    for (const item of scenes) if (p >= item.at) s = item;
    return s;
  }

  function updateCopy(p) {
    const s = sceneFor(p);
    if (headline.textContent !== s.headline) {
      eyebrow.textContent = s.eyebrow;
      headline.textContent = s.headline;
      subline.textContent = s.subline;
    }
    const local = (p * (scenes.length - .1)) % 1;
    const fade = clamp(Math.sin(local * Math.PI) * 1.25, 0, 1);
    copy.style.opacity = .46 + fade * .54;
    copy.style.transform = `translate3d(0, ${(1 - fade) * 18}px, 0)`;
    hint.style.opacity = p > .9 ? 0 : 1;
  }

  function update() {
    const p = reduced ? 1 : progress();
    const frame = Math.min(TOTAL_FRAMES - 1, Math.floor(p * (TOTAL_FRAMES - 1)));
    draw(frame);
    updateCopy(p);
  }

  function requestUpdate() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
  }

  preload();
  addEventListener('resize', sizeCanvas, { passive: true });
  addEventListener('scroll', requestUpdate, { passive: true });
  sizeCanvas();
  update();
})();
