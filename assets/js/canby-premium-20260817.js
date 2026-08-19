(() => {
  'use strict';

  // Every localized homepage owns the self-contained procedural hero. Do not fetch the retired film sequence.
  if (document.body.dataset.pageKind === 'home') return;

  const hero = document.querySelector('[data-terminal-film]');
  if (!hero) return;

  const canvas = hero.querySelector('[data-terminal-canvas]');
  const fallback = hero.querySelector('[data-terminal-fallback]');
  const progressBar = hero.querySelector('[data-terminal-progress]');
  const ctx = canvas?.getContext('2d', { alpha: false, desynchronized: true });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const manifestUrl = hero.dataset.manifest;
  const cache = new Map();
  const pending = new Map();
  let manifest = null;
  let requested = 0;
  let drawn = -1;
  let lastProgress = 0;
  let direction = 1;
  let scheduled = false;
  let sourceKey = innerWidth <= 760 ? 'mobile' : 'desktop';

  const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));

  function heroProgress() {
    const rect = hero.getBoundingClientRect();
    const distance = Math.max(1, hero.offsetHeight - innerHeight);
    return clamp(-rect.top / distance);
  }

  function setPast(rect = hero.getBoundingClientRect()) {
    const past = rect.bottom <= Math.max(84, innerHeight * .12);
    document.body.classList.toggle('terminal-past', past);
  }

  function setProgress(p) {
    hero.style.setProperty('--terminal-progress', p.toFixed(5));
    if (progressBar) progressBar.style.transform = `scaleX(${p.toFixed(5)})`;
    if (p > lastProgress + .001) direction = 1;
    else if (p < lastProgress - .001) direction = -1;
    lastProgress = p;
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const r = canvas.getBoundingClientRect();
    const maxDpr = coarse ? 1.6 : 2;
    const dpr = Math.min(maxDpr, Math.max(1, devicePixelRatio || 1));
    const w = Math.max(1, Math.round(r.width * dpr));
    const h = Math.max(1, Math.round(r.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      if (drawn >= 0 && cache.get(drawn)?.complete) draw(cache.get(drawn));
    }
  }

  function draw(img) {
    if (!img || !ctx || !canvas || !img.naturalWidth || !img.naturalHeight) return;
    const cw = canvas.width, ch = canvas.height;
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let sw, sh, sx, sy;
    if (ir > cr) {
      sh = img.naturalHeight;
      sw = sh * cr;
      sx = (img.naturalWidth - sw) * .5;
      sy = 0;
    } else {
      sw = img.naturalWidth;
      sh = sw / cr;
      sx = 0;
      sy = (img.naturalHeight - sh) * .5;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    canvas.classList.add('is-live');
    fallback?.classList.add('is-hidden');
  }

  function frameUrl(index) {
    const spec = manifest?.[sourceKey];
    if (!spec?.pattern) return '';
    const manifestBase = new URL(manifestUrl, location.href);
    return new URL(spec.pattern.replace('{frame}', String(index).padStart(4, '0')), manifestBase).href;
  }

  function loadFrame(index, priority = false) {
    if (!manifest || manifest.status !== 'ready' || !manifest.frameCount) return Promise.resolve(null);
    index = Math.max(0, Math.min(manifest.frameCount - 1, index));
    if (cache.has(index)) return Promise.resolve(cache.get(index));
    if (pending.has(index)) return pending.get(index);
    const img = new Image();
    img.decoding = 'async';
    if (priority) img.fetchPriority = 'high';
    const promise = new Promise(resolve => {
      img.onload = () => { cache.set(index, img); pending.delete(index); resolve(img); };
      img.onerror = () => { pending.delete(index); resolve(null); };
    });
    pending.set(index, promise);
    img.src = frameUrl(index);
    return promise;
  }

  function nearestDecoded(target) {
    if (cache.has(target)) return [target, cache.get(target)];
    for (let d = 1; d < 18; d++) {
      const a = target - d, b = target + d;
      if (a >= 0 && cache.has(a)) return [a, cache.get(a)];
      if (b < (manifest?.frameCount || 0) && cache.has(b)) return [b, cache.get(b)];
    }
    return null;
  }

  function prefetchAround(target) {
    if (!manifest?.frameCount) return;
    const ahead = coarse ? 5 : 10;
    const behind = coarse ? 2 : 4;
    const jobs = [];
    for (let i = 1; i <= ahead; i++) jobs.push(target + i * direction);
    for (let i = 1; i <= behind; i++) jobs.push(target - i * direction);
    jobs.forEach(i => { if (i >= 0 && i < manifest.frameCount) loadFrame(i); });
  }

  async function paintSequence(p) {
    if (!manifest || manifest.status !== 'ready' || !manifest.frameCount || reduced) return;
    requested = Math.round(p * (manifest.frameCount - 1));
    const exact = cache.get(requested);
    if (exact) {
      if (drawn !== requested) { draw(exact); drawn = requested; }
      prefetchAround(requested);
      return;
    }
    const nearest = nearestDecoded(requested);
    if (nearest && drawn !== nearest[0]) { draw(nearest[1]); drawn = nearest[0]; }
    const img = await loadFrame(requested, true);
    if (img && requested === Math.round(heroProgress() * (manifest.frameCount - 1))) {
      draw(img); drawn = requested;
    }
    prefetchAround(requested);
  }

  function paint() {
    scheduled = false;
    const rect = hero.getBoundingClientRect();
    const p = hero.classList.contains('is-fallback-only') ? 0 : heroProgress();
    setProgress(p);
    setPast(rect);
    paintSequence(p);
  }

  function queue() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(paint);
  }

  async function init() {
    try {
      const r = await fetch(manifestUrl, { cache: 'no-store' });
      manifest = r.ok ? await r.json() : null;
    } catch {
      manifest = null;
    }

    const ready = !!(manifest && manifest.status === 'ready' && Number(manifest.frameCount) > 1 && !reduced);
    hero.classList.toggle('is-sequence-ready', ready);
    hero.classList.toggle('is-fallback-only', !ready);
    hero.dataset.heroStatus = ready ? 'sequence-ready' : 'production-frame-gate';

    if (ready) {
      sourceKey = innerWidth <= 760 ? 'mobile' : 'desktop';
      resizeCanvas();
      const initial = Math.round(heroProgress() * (manifest.frameCount - 1));
      const initialFrame = await loadFrame(initial, true);
      const first = initialFrame || await loadFrame(0, true);
      if (first) { draw(first); drawn = initialFrame ? initial : 0; }
      for (let i = 1; i <= Math.min(8, manifest.frameCount - 1); i++) loadFrame(i);
    }
    queue();
  }

  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', () => {
    const nextKey = innerWidth <= 760 ? 'mobile' : 'desktop';
    if (nextKey !== sourceKey) {
      sourceKey = nextKey;
      cache.clear(); pending.clear(); drawn = -1;
      fallback?.classList.remove('is-hidden');
    }
    resizeCanvas(); queue();
  }, { passive: true });
  addEventListener('pageshow', queue);
  init();
})();
