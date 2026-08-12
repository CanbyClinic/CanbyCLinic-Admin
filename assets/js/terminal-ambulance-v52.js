(() => {
  'use strict';

  const section = document.getElementById('terminalAmbulanceHero');
  const canvas = document.getElementById('terminalAmbulanceCanvas');
  if (!section || !canvas) return;

  const COUNTS = { desktop: 410, mobile: 410 };
  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const loader = section.querySelector('.terminal-load-cover');
  const scrollLabel = section.querySelector('.terminal-scroll-label');
  const shade = section.querySelector('.terminal-cinematic-shade');
  const handoff = section.querySelector('.terminal-handoff-panel');
  const cinematicNav = section.querySelector('.terminal-cinematic-nav');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  section.classList.add('uses-baked-vehicle');
  const titleSequence = createTitleSequence();
  let mode = selectMode();
  let cache = new Map();
  let pending = new Set();
  let generation = 0;
  let currentFrame = 0;
  let dpr = 1;

  function selectMode() {
    return innerWidth <= 760 || innerHeight > innerWidth * 1.22 ? 'mobile' : 'desktop';
  }

  function totalFrames() {
    return COUNTS[mode];
  }

  function frameURL(index, activeMode = mode) {
    const folder = activeMode === 'desktop' ? 'desktop-v74-4k' : 'mobile-v74-hq';
    return `assets/ambulance/${folder}/frame_${String(index + 1).padStart(3, '0')}.webp`;
  }

  function loadFrame(index, priority = false, token = generation) {
    const total = totalFrames();
    index = Math.max(0, Math.min(total - 1, index | 0));
    if (cache.has(index) || pending.has(index)) return Promise.resolve(cache.get(index));
    pending.add(index);
    const activeMode = mode;
    return new Promise(resolve => {
      const image = new Image();
      if ('fetchPriority' in image && priority) image.fetchPriority = 'high';
      image.decoding = 'async';
      image.onload = () => {
        if (token === generation && activeMode === mode) cache.set(index, image);
        pending.delete(index);
        resolve(token === generation ? image : null);
      };
      image.onerror = () => {
        pending.delete(index);
        resolve(null);
      };
      image.src = frameURL(index, activeMode);
    });
  }

  function prime() {
    generation += 1;
    const token = generation;
    cache = new Map();
    pending = new Set();
    loadFrame(0, true, token).then(image => {
      if (!image || token !== generation) return;
      loader?.classList.add('is-ready');
      drawImageCover(image);
    });

    const total = totalFrames();
    const anchors = [
      ...Array.from({ length: Math.min(28, total - 1) }, (_, i) => i + 1),
      ...[0.18, 0.34, 0.50, 0.66, 0.82, 0.96].map(p => Math.min(total - 1, Math.round((total - 1) * p)))
    ];
    const seen = new Set([0]);
    const queue = [];
    for (const index of anchors) {
      if (!seen.has(index)) { seen.add(index); queue.push(index); }
    }
    for (let index = 1; index < total; index += 1) {
      if (!seen.has(index)) queue.push(index);
    }
    const loadBatch = () => {
      if (token !== generation || queue.length === 0) return;
      queue.splice(0, 10).forEach(index => loadFrame(index, false, token));
      setTimeout(loadBatch, 42);
    };
    setTimeout(loadBatch, 24);
  }

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    drawNearest(currentFrame);
  }

  function drawImageCover(image) {
    if (!image?.naturalWidth) return;
    const cover = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const framing = mode === 'desktop' ? 0.865 : 0.925;
    const scale = cover * framing;
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    ctx.fillStyle = '#050708';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
  }

  function drawNearest(index) {
    const total = totalFrames();
    index = Math.max(0, Math.min(total - 1, index | 0));
    let image = cache.get(index);
    if (!image) {
      for (let distance = 1; distance < 12 && !image; distance += 1) {
        image = cache.get(index - distance) || cache.get(index + distance);
      }
      loadFrame(index, true).then(found => {
        if (found && currentFrame === index) drawImageCover(found);
      });
    }
    if (image) drawImageCover(image);
  }

  function scrollProgress() {
    if (reduced.matches) return 0;
    const bounds = section.getBoundingClientRect();
    const distance = Math.max(1, section.offsetHeight - innerHeight);
    if (bounds.bottom <= innerHeight + 2) return 1;
    return clamp(-bounds.top / distance);
  }

  function update() {
    const progress = scrollProgress();
    currentFrame = Math.floor(progress * (totalFrames() - 1));
    canvas.dataset.targetFrame = String(currentFrame);
    canvas.dataset.displayFrame = String(currentFrame);
    drawNearest(currentFrame);
    loadFrame(currentFrame, true);
    updateTitles(progress);
    if (scrollLabel) scrollLabel.style.opacity = String(Math.max(0, 1 - progress * 3.2));
    if (shade) shade.style.opacity = String(0.34 - progress * 0.12);
    if (handoff) handoff.style.opacity = String(easedRange(progress, 0.958, 0.997));
    if (cinematicNav) cinematicNav.style.opacity = '0';
    document.body.classList.toggle(
      'terminal-past',
      progress > 0.995 || section.getBoundingClientRect().bottom <= innerHeight + 2
    );
  }

  function createTitleSequence() {
    const wrapper = document.createElement('div');
    wrapper.className = 'terminal-title-sequence';
    wrapper.setAttribute('aria-hidden', 'true');
    const labels = [
      { headline: 'Care that moves with our community.' },
      { headline: 'Clear care. Close to home.' },
      {
        headline: 'Canby Community Clinic',
        detail: '7601 Canby Ave #6B, Reseda, CA 91335  |  (818) 674-4414'
      }
    ];
    labels.forEach(label => {
      const heading = document.createElement('h2');
      Array.from(label.headline).forEach(character => {
        if (character === ' ') {
          heading.append(' ');
          return;
        }
        const span = document.createElement('span');
        span.className = 'terminal-char';
        span.textContent = character;
        heading.append(span);
      });
      if (label.detail) {
        const detail = document.createElement('small');
        detail.className = 'terminal-title-detail';
        detail.textContent = label.detail;
        heading.append(detail);
      }
      wrapper.append(heading);
    });
    section.querySelector('.terminal-ambulance-sticky')?.append(wrapper);
    return wrapper;
  }

  function easedRange(value, start, end) {
    const t = clamp((value - start) / (end - start));
    return t * t * (3 - 2 * t);
  }

  function updateTitles(progress) {
    const headings = Array.from(titleSequence.querySelectorAll('h2'));
    const shifted = progress - 0.03;
    const active = Math.floor(shifted * 3);
    const local = shifted * 3 - active;
    headings.forEach((heading, headingIndex) => {
      const characters = Array.from(heading.querySelectorAll('.terminal-char'));
      if (headingIndex !== active) {
        characters.forEach(character => {
          character.style.opacity = '0';
          character.style.color = '#8fe421';
        });
        heading.querySelector('.terminal-title-detail')?.style.setProperty('opacity', '0');
        return;
      }
      const reveal = Math.min(local / 0.5, 1);
      const hide = clamp(((local - 0.6) / 0.4) * 2);
      const count = Math.max(1, characters.length);
      characters.forEach((character, index) => {
        const start = index / count;
        const end = (index + 1) / count;
        const revealed = clamp((reveal - start) / (end - start));
        const hidden = clamp((hide - start) / (end - start));
        const revealEase = 1 - (1 - revealed) ** 2;
        const hideEase = hidden ** 2;
        character.style.opacity = String(revealEase * (1 - hideEase));
        character.style.color = revealed < 1 ? '#8fe421' : '#ffffff';
      });
      const detail = heading.querySelector('.terminal-title-detail');
      if (detail) detail.style.opacity = String(clamp((local - 0.22) / 0.18) * (1 - hide));
    });
  }

  function clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  function handleResize() {
    const nextMode = selectMode();
    if (nextMode !== mode) {
      mode = nextMode;
      loader?.classList.remove('is-ready');
      prime();
    }
    resize();
    update();
  }

  let rafPending = false;
  function scheduleUpdate() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      update();
    });
  }

  addEventListener('scroll', scheduleUpdate, { passive: true });
  addEventListener('resize', handleResize, { passive: true });
  reduced.addEventListener?.('change', scheduleUpdate);
  resize();
  prime();
  update();
})();
