(() => {
  'use strict';

  const section = document.getElementById('terminalAmbulanceHero');
  const canvas = document.getElementById('terminalAmbulanceCanvas');
  if (!section || !canvas) return;

  const COUNTS = { desktop: 410, mobile: 409 };
  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  const loader = section.querySelector('.terminal-load-cover');
  const scrollLabel = section.querySelector('.terminal-scroll-label');
  const shade = section.querySelector('.terminal-cinematic-shade');
  const handoff = section.querySelector('.terminal-handoff-panel');
  const cinematicNav = section.querySelector('.terminal-cinematic-nav');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const vehicleOverlay = createVehicleOverlay();
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
    return `assets/ambulance/${activeMode}-v55/frame_${String(index + 1).padStart(3, '0')}.webp`;
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

    const queue = Array.from({ length: totalFrames() - 1 }, (_, index) => index + 1);
    const loadBatch = () => {
      if (token !== generation || queue.length === 0) return;
      queue.splice(0, 8).forEach(index => loadFrame(index, false, token));
      setTimeout(loadBatch, 50);
    };
    setTimeout(loadBatch, 50);
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
    const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    ctx.fillStyle = '#03070b';
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
    updateVehicle(progress);
    updateTitles(progress);
    if (scrollLabel) scrollLabel.style.opacity = String(Math.max(0, 1 - progress * 3.2));
    if (shade) shade.style.opacity = String(0.42 - progress * 0.18);
    if (handoff) handoff.style.opacity = String(easedRange(progress, 0.90, 0.985));
    if (cinematicNav) cinematicNav.style.opacity = String(1 - easedRange(progress, 0.86, 0.94));
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
      { headline: 'Health can feel scary sometimes.' },
      {
        headline: 'Real care, right now!',
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

  function createVehicleOverlay() {
    const sticky = section.querySelector('.terminal-ambulance-sticky');

    const buildingSign = document.createElement('div');
    buildingSign.className = 'terminal-clinic-building-sign';
    buildingSign.setAttribute('aria-hidden', 'true');
    buildingSign.innerHTML = `
      <img src="assets/images/canby-community-clinic-logo.png" alt="">
      <span><strong>CANBY COMMUNITY CLINIC</strong><small>7601 Canby Ave #6B &middot; Reseda, CA 91335</small></span>
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'terminal-vehicle-overlay';
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.dataset.rotation = '0';

    const normal = document.createElement('img');
    normal.className = 'terminal-vehicle-normal';
    normal.src = 'assets/ambulance/sprites-v55/ambulance-side.png';
    normal.alt = '';

    const logo = document.createElement('img');
    logo.className = 'terminal-vehicle-logo';
    logo.src = 'assets/images/canby-community-clinic-logo.png';
    logo.alt = '';

    const rearWheel = normal.cloneNode();
    rearWheel.className = 'terminal-vehicle-wheel terminal-vehicle-wheel-rear';
    const frontWheel = normal.cloneNode();
    frontWheel.className = 'terminal-vehicle-wheel terminal-vehicle-wheel-front';

    const wire = document.createElement('img');
    wire.className = 'terminal-vehicle-wire';
    wire.src = 'assets/ambulance/sprites-v55/ambulance-wire.png';
    wire.alt = '';

    const headlight = document.createElement('span');
    headlight.className = 'terminal-vehicle-headlight';

    wrapper.append(normal, rearWheel, frontWheel, logo, wire, headlight);

    const angleStage = document.createElement('div');
    angleStage.className = 'terminal-vehicle-angle-stage';
    angleStage.dataset.rotation = '0';
    const angleNormal = document.createElement('img');
    angleNormal.className = 'terminal-vehicle-angle-normal';
    angleNormal.src = 'assets/ambulance/sprites-v56/ambulance-three-quarter.png';
    angleNormal.alt = '';
    const angleLogo = logo.cloneNode();
    angleLogo.className = 'terminal-vehicle-angle-logo';
    const angleWire = document.createElement('img');
    angleWire.className = 'terminal-vehicle-angle-wire';
    angleWire.src = 'assets/ambulance/sprites-v56/ambulance-three-quarter-wire.png';
    angleWire.alt = '';
    angleStage.append(angleNormal, angleLogo, angleWire);

    const overhead = document.createElement('img');
    overhead.className = 'terminal-vehicle-overhead-wire';
    overhead.src = 'assets/ambulance/sprites-v56/ambulance-overhead-wire.png';
    overhead.alt = '';
    overhead.dataset.rotation = 'camera-angle';

    const frontStage = document.createElement('div');
    frontStage.className = 'terminal-vehicle-front-stage';
    frontStage.dataset.rotation = 'camera-only';
    const frontNormal = document.createElement('img');
    frontNormal.className = 'terminal-vehicle-front-normal';
    frontNormal.src = 'assets/ambulance/sprites-v57/ambulance-front.png';
    frontNormal.alt = '';
    const frontXray = document.createElement('img');
    frontXray.className = 'terminal-vehicle-front-xray';
    frontXray.src = 'assets/ambulance/sprites-v57/ambulance-front-xray.png';
    frontXray.alt = '';
    const frontGlow = document.createElement('span');
    frontGlow.className = 'terminal-vehicle-front-glow';
    frontStage.append(frontNormal, frontXray, frontGlow);

    sticky?.append(buildingSign, wrapper, angleStage, overhead, frontStage);
    return {
      wrapper, normal, rearWheel, frontWheel, logo, wire, headlight,
      angleStage, angleNormal, angleLogo, angleWire, overhead,
      frontStage, frontNormal, frontXray, frontGlow, buildingSign
    };
  }

  function updateVehicle(progress) {
    const physical = 1 - easedRange(progress, 0.29, 0.39);
    const sideWire = 0.42 * easedRange(progress, 0.27, 0.34) * (1 - easedRange(progress, 0.38, 0.45));
    const anglePhysical = easedRange(progress, 0.30, 0.38) * (1 - easedRange(progress, 0.44, 0.52));
    const angleWire = easedRange(progress, 0.43, 0.50) * (1 - easedRange(progress, 0.53, 0.59));
    const frontPhysical = easedRange(progress, 0.44, 0.53) * (1 - easedRange(progress, 0.56, 0.64));
    const frontXray = easedRange(progress, 0.54, 0.64) * (1 - easedRange(progress, 0.91, 0.97));
    const travel = easedRange(progress, 0, 0.29);
    const x = -6 + travel * 12;
    const scale = 0.94 + travel * 0.12;
    const cameraArc = easedRange(progress, 0.29, 0.58);
    const frontPush = easedRange(progress, 0.72, 0.94);

    vehicleOverlay.wrapper.style.setProperty('--vehicle-x', `${x.toFixed(3)}vw`);
    vehicleOverlay.wrapper.style.setProperty('--vehicle-scale', scale.toFixed(4));
    vehicleOverlay.wrapper.style.setProperty('--wheel-spin', `${(Math.min(progress, 0.29) * 2880).toFixed(2)}deg`);
    vehicleOverlay.normal.style.opacity = String(physical);
    vehicleOverlay.rearWheel.style.opacity = String(physical);
    vehicleOverlay.frontWheel.style.opacity = String(physical);
    vehicleOverlay.logo.style.opacity = String(physical);
    vehicleOverlay.wire.style.opacity = String(sideWire);
    vehicleOverlay.headlight.style.opacity = String(physical * (1 - easedRange(progress, 0.39, 0.48)));
    vehicleOverlay.wrapper.style.opacity = String(Math.max(physical, sideWire));
    vehicleOverlay.wrapper.dataset.rotation = '0';

    vehicleOverlay.angleStage.style.setProperty('--angle-x', `${(9 - cameraArc * 7).toFixed(3)}vw`);
    vehicleOverlay.angleStage.style.setProperty('--angle-y', `${(5 - cameraArc * 5).toFixed(3)}vh`);
    vehicleOverlay.angleStage.style.setProperty('--angle-scale', (0.96 + cameraArc * 0.18).toFixed(4));
    vehicleOverlay.angleNormal.style.opacity = String(anglePhysical);
    vehicleOverlay.angleLogo.style.opacity = String(anglePhysical);
    vehicleOverlay.angleWire.style.opacity = String(angleWire);
    vehicleOverlay.angleStage.style.opacity = String(Math.max(anglePhysical, angleWire));
    vehicleOverlay.angleStage.dataset.rotation = '0';

    vehicleOverlay.overhead.style.opacity = '0';

    vehicleOverlay.frontStage.style.setProperty('--front-x', `${(13 - cameraArc * 13).toFixed(3)}vw`);
    vehicleOverlay.frontStage.style.setProperty('--front-y', `${(3 - cameraArc * 3 + frontPush * 2).toFixed(3)}vh`);
    vehicleOverlay.frontStage.style.setProperty('--front-scale', (0.72 + cameraArc * 0.32 + frontPush * 6.7).toFixed(4));
    vehicleOverlay.frontNormal.style.opacity = String(frontPhysical);
    vehicleOverlay.frontXray.style.opacity = String(frontXray);
    vehicleOverlay.frontGlow.style.opacity = String(frontPhysical * (1 - easedRange(progress, 0.58, 0.66)));
    vehicleOverlay.frontStage.style.opacity = String(Math.max(frontPhysical, frontXray));

    const signVisible = easedRange(progress, 0.08, 0.16) * (1 - easedRange(progress, 0.64, 0.76));
    vehicleOverlay.buildingSign.style.opacity = String(signVisible);
    vehicleOverlay.buildingSign.style.setProperty('--sign-x', `${(-cameraArc * 9).toFixed(3)}vw`);
    vehicleOverlay.buildingSign.style.setProperty('--sign-scale', (1 + cameraArc * 0.12).toFixed(4));
    vehicleOverlay.buildingSign.classList.toggle('is-xray', progress >= 0.52);
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

  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', handleResize, { passive: true });
  reduced.addEventListener?.('change', update);
  resize();
  prime();
  update();
})();
