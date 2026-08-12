(() => {
  'use strict';

  const page = location.pathname.split('/').pop() || 'index.html';
  if (page === 'index.html') return;

  const main = document.querySelector('main');
  const clinic = {
    phone: '(818) 674-4414',
    phoneHref: 'tel:18186744414',
    address: '7601 Canby Ave #6B, Reseda, CA 91335',
    maps: 'https://www.google.com/maps/place/Pura+Vida+Community+Clinic/@34.208699,-118.534985,17z'
  };

  document.body.classList.add('c72-interior');
  rewriteFooter();

  if (page === 'visit-planner.html') renderVisitPlanner();
  else if (page === 'blood-pressure-explainer.html') renderBloodPressure();
  else if (page === 'medication-list-builder.html') renderMedicationBuilder();
  else refineExistingPage();

  addContextStrip();
  initializeReveals();

  function toolHero({ kicker, title, copy, image, alt, caption }) {
    return `
      <section class="c72-tool-hero" aria-labelledby="c72-tool-title">
        <div class="c72-tool-hero-copy c72-reveal">
          <nav class="c72-breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><span>${kicker}</span></nav>
          <span class="c72-kicker">${kicker}</span>
          <h1 id="c72-tool-title">${title}</h1>
          <p>${copy}</p>
          <div class="c72-hero-contact">
            <a href="${clinic.phoneHref}"><small>Call the clinic</small><strong>${clinic.phone}</strong></a>
            <a href="${clinic.maps}" target="_blank" rel="noopener noreferrer"><small>Visit Canby</small><strong>7601 Canby Ave #6B<br>Reseda, CA 91335</strong></a>
          </div>
        </div>
        <figure class="c72-tool-media c72-reveal">
          <img src="${image}" alt="${alt}">
          <figcaption>${caption}</figcaption>
        </figure>
      </section>`;
  }

  function renderVisitPlanner() {
    if (!main) return;
    document.body.classList.add('c72-tool-page');
    document.title = 'Visit Planner | Canby Community Clinic';
    main.innerHTML = `${toolHero({
      kicker: 'Visit planner',
      title: 'Arrive prepared.',
      copy: 'Create a practical checklist for your visit. Nothing is sent, saved, or shared from this page.',
      image: 'assets/images/visit-planner-editorial-v72.png',
      alt: 'A clean tabletop with a blank form, medicine bottles, glasses, and a pen ready for visit preparation',
      caption: 'Bring what helps explain the full picture: medications, records, questions, and identification if available.'
    })}
      <section class="c72-workbench" aria-labelledby="c72-planner-heading">
        <header class="c72-section-head c72-reveal">
          <div><span class="c72-kicker">Your preparation list</span><h2 id="c72-planner-heading">A useful plan in under a minute.</h2></div>
          <p>Choose the reason for your visit and your language preference. The checklist updates immediately and stays only in this browser tab.</p>
        </header>
        <div class="c72-tool-grid">
          <form class="c72-panel c72-reveal" id="c72VisitForm">
            <header class="c72-panel-head"><h3>Visit details</h3><p>Use general categories only. Do not enter symptoms, diagnoses, or private information.</p></header>
            <div class="c72-control-stack">
              <div class="c72-field"><label for="c72Reason">Main reason</label><select id="c72Reason">
                <option value="general">General or follow-up visit</option>
                <option value="blood">Blood pressure questions</option>
                <option value="diabetes">Diabetes or blood sugar questions</option>
                <option value="medication">Medication review</option>
                <option value="forms">Forms or records</option>
                <option value="community">Community resource guidance</option>
              </select></div>
              <div class="c72-field"><label for="c72Language">Preferred language</label><select id="c72Language">
                <option value="English">English</option><option value="Spanish">Spanish</option><option value="Armenian">Armenian</option><option value="Other">Another language</option>
              </select></div>
              <label class="c72-check-option"><input id="c72FirstVisit" type="checkbox" checked><span>This is my first visit</span></label>
              <label class="c72-check-option"><input id="c72Records" type="checkbox"><span>I have records or a referral to bring</span></label>
              <div class="c72-button-row"><button class="c72-button primary" type="button" id="c72Print">Print checklist</button><button class="c72-button" type="reset">Reset</button></div>
            </div>
            <p class="c72-privacy-note"><strong>Privacy:</strong> this tool does not submit information to the clinic and does not store your selections after the page closes.</p>
          </form>
          <section class="c72-panel c72-result c72-reveal" aria-live="polite">
            <div class="c72-result-top">
              <div class="c72-progress-ring" id="c72Progress"><strong>0%</strong></div>
              <div><h3>Your visit checklist</h3><p id="c72ChecklistSummary">Check items as you gather them.</p></div>
            </div>
            <ul class="c72-checklist" id="c72Checklist"></ul>
          </section>
        </div>
      </section>
      ${utilityBand()}`;

    const form = document.querySelector('#c72VisitForm');
    const checklist = document.querySelector('#c72Checklist');
    const progress = document.querySelector('#c72Progress');
    const summary = document.querySelector('#c72ChecklistSummary');
    const reason = document.querySelector('#c72Reason');
    const language = document.querySelector('#c72Language');
    const first = document.querySelector('#c72FirstVisit');
    const records = document.querySelector('#c72Records');

    const baseItems = [
      'Photo identification, if available',
      'Insurance information, if you plan to use insurance',
      'Medication bottles or a current medication list',
      'Questions you want to discuss during the visit',
      'A phone number the clinic can use for follow-up'
    ];
    const reasonItems = {
      general: 'Any recent visit notes or results that may be useful',
      blood: 'Recent blood pressure readings, including dates and times',
      diabetes: 'Blood sugar log or glucose meter, if you use one',
      medication: 'All prescription, over-the-counter, and supplement containers',
      forms: 'The form, request, or record instructions you received',
      community: 'A short list of the practical support categories you need'
    };

    function renderChecklist() {
      const completed = new Set(Array.from(checklist.querySelectorAll('input:checked')).map((item) => item.value));
      const items = [...baseItems, reasonItems[reason.value]];
      if (first.checked) items.push('Completed new-patient forms, if the clinic asked for them');
      if (records.checked) items.push('Copies of relevant records or your referral paperwork');
      if (language.value !== 'English') items.push(`A note that ${language.value} is your preferred language`);
      checklist.innerHTML = items.map((item) => `<li><label><input type="checkbox" value="${escapeHtml(item)}"${completed.has(item) ? ' checked' : ''}><span>${escapeHtml(item)}</span></label></li>`).join('');
      updateProgress();
    }

    function updateProgress() {
      const all = Array.from(checklist.querySelectorAll('input'));
      const done = all.filter((item) => item.checked).length;
      const value = all.length ? Math.round(done / all.length * 100) : 0;
      progress.style.setProperty('--value', value);
      progress.querySelector('strong').textContent = `${value}%`;
      summary.textContent = done ? `${done} of ${all.length} items ready.` : 'Check items as you gather them.';
    }

    form.addEventListener('change', renderChecklist);
    form.addEventListener('reset', () => setTimeout(renderChecklist));
    checklist.addEventListener('change', updateProgress);
    document.querySelector('#c72Print').addEventListener('click', () => window.print());
    renderChecklist();
  }

  function renderBloodPressure() {
    if (!main) return;
    document.body.classList.add('c72-tool-page');
    document.title = 'Blood Pressure Guide | Canby Community Clinic';
    main.innerHTML = `${toolHero({
      kicker: 'Blood pressure guide',
      title: 'Know what to ask.',
      copy: 'Use an adult blood pressure reading to understand the educational range and prepare a better conversation with a health professional.',
      image: 'assets/images/clinician-consultation.webp',
      alt: 'A clinician speaking with a patient during a calm visit',
      caption: 'A single reading does not diagnose high blood pressure. Patterns, symptoms, medications, and clinical context matter.'
    })}
      <section class="c72-workbench" aria-labelledby="c72-bp-heading">
        <header class="c72-section-head c72-reveal"><div><span class="c72-kicker">Adult education tool</span><h2 id="c72-bp-heading">Put the reading in context.</h2></div><p>Categories follow the 2025 American Heart Association framework. This page is educational and cannot diagnose or replace care.</p></header>
        <div class="c72-tool-grid">
          <form class="c72-panel c72-reveal" id="c72BpForm">
            <header class="c72-panel-head"><h3>Enter one reading</h3><p>Sit quietly before measuring and follow the instructions for your monitor.</p></header>
            <div class="c72-control-stack">
              <div class="c72-bp-readings">
                <label class="c72-bp-reading c72-field"><span>Top / systolic</span><input id="c72Sys" type="number" min="60" max="260" inputmode="numeric" placeholder="120" required></label>
                <label class="c72-bp-reading c72-field"><span>Bottom / diastolic</span><input id="c72Dia" type="number" min="40" max="160" inputmode="numeric" placeholder="80" required></label>
              </div>
              <button class="c72-button primary" type="submit">Explain this range</button>
              <div class="c72-bp-scale" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
            </div>
            <p class="c72-privacy-note">This reading is used only on this page and is not saved or sent. For symptoms that feel life-threatening, call 911.</p>
          </form>
          <section class="c72-panel c72-result c72-reveal">
            <header class="c72-panel-head"><h3>Reading guide</h3><p>Enter both numbers to see the educational category and questions to bring to your visit.</p></header>
            <div class="c72-bp-output" id="c72BpOutput"><strong>Waiting for a reading</strong><p>Repeated readings taken correctly are usually more useful than one isolated number.</p></div>
          </section>
        </div>
      </section>
      ${utilityBand()}`;

    document.querySelector('#c72BpForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const systolic = Number(document.querySelector('#c72Sys').value);
      const diastolic = Number(document.querySelector('#c72Dia').value);
      let title = 'Normal range';
      let copy = 'Both numbers are in the normal category. Keep a record if your clinician asked you to monitor at home.';
      if (systolic > 180 || diastolic > 120) {
        title = 'Severe range';
        copy = 'Wait at least one minute and measure again. If the reading remains this high and you have chest pain, shortness of breath, weakness, numbness, vision changes, back pain, or difficulty speaking, call 911. Without those symptoms, contact a health professional promptly.';
      } else if (systolic >= 140 || diastolic >= 90) {
        title = 'Stage 2 high blood pressure range';
        copy = 'One reading does not confirm a diagnosis. Record the number, repeat as directed, and discuss the pattern with a health professional.';
      } else if (systolic >= 130 || diastolic >= 80) {
        title = 'Stage 1 high blood pressure range';
        copy = 'Bring several correctly taken readings and your medication list to a health professional for context and next-step guidance.';
      } else if (systolic >= 120 && diastolic < 80) {
        title = 'Elevated range';
        copy = 'The top number is elevated while the bottom number is below 80. Ask how often to monitor and what factors may affect your readings.';
      }
      document.querySelector('#c72BpOutput').innerHTML = `<strong>${title}</strong><p>${copy}</p><p><a href="https://www.heart.org/en/health-topics/high-blood-pressure/blood-pressure-explained" target="_blank" rel="noopener noreferrer">Review the American Heart Association categories</a></p>`;
    });
  }

  function renderMedicationBuilder() {
    if (!main) return;
    document.body.classList.add('c72-tool-page');
    document.title = 'Medication List Builder | Canby Community Clinic';
    main.innerHTML = `${toolHero({
      kicker: 'Medication list',
      title: 'Bring one clear list.',
      copy: 'Build a temporary list of prescription medicines, over-the-counter products, vitamins, and supplements to print for your visit.',
      image: 'assets/images/medication-support.webp',
      alt: 'Medication containers and a written list prepared for a clinic visit',
      caption: 'Include everything you take, even products that do not require a prescription. Bring the original containers when possible.'
    })}
      <section class="c72-workbench" aria-labelledby="c72-med-heading">
        <header class="c72-section-head c72-reveal"><div><span class="c72-kicker">Temporary builder</span><h2 id="c72-med-heading">Make the list easy to review.</h2></div><p>Your entries remain only in this open page. Print before closing or refreshing; the clinic does not receive this list automatically.</p></header>
        <div class="c72-tool-grid">
          <form class="c72-panel c72-reveal" id="c72MedForm">
            <header class="c72-panel-head"><h3>Add an item</h3><p>Copy the name and dose from the container when possible.</p></header>
            <div class="c72-control-stack">
              <div class="c72-field"><label for="c72MedName">Medication or supplement</label><input id="c72MedName" autocomplete="off" required placeholder="Name on the container"></div>
              <div class="c72-field"><label for="c72MedDose">Dose</label><input id="c72MedDose" autocomplete="off" placeholder="Example: 10 mg"></div>
              <div class="c72-field"><label for="c72MedWhen">How you take it</label><input id="c72MedWhen" autocomplete="off" placeholder="Example: once each morning"></div>
              <div class="c72-button-row"><button class="c72-button primary" type="submit">Add to list</button><button class="c72-button" id="c72MedPrint" type="button">Print</button><button class="c72-button" id="c72MedClear" type="button">Clear</button></div>
            </div>
            <p class="c72-privacy-note">This tool does not save or transmit the list. Do not use it for urgent medication questions; call the clinic or emergency services as appropriate.</p>
          </form>
          <section class="c72-panel c72-med-list c72-reveal" aria-live="polite">
            <header class="c72-panel-head"><h3>Your medication list</h3><p id="c72MedCount">No items yet</p></header>
            <div id="c72MedList"><p class="c72-med-empty">Add the first medication, vitamin, or supplement using the form.</p></div>
          </section>
        </div>
      </section>
      ${utilityBand()}`;

    const form = document.querySelector('#c72MedForm');
    const list = document.querySelector('#c72MedList');
    const count = document.querySelector('#c72MedCount');
    let medications = [];
    function render() {
      count.textContent = medications.length ? `${medications.length} item${medications.length === 1 ? '' : 's'} ready to print` : 'No items yet';
      list.innerHTML = medications.length ? medications.map((item, index) => `<article class="c72-med-item"><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml([item.dose, item.when].filter(Boolean).join(' / ') || 'Dose and schedule not entered')}</small></div><button class="c72-icon-button" type="button" data-remove="${index}" aria-label="Remove ${escapeHtml(item.name)}">&times;</button></article>`).join('') : '<p class="c72-med-empty">Add the first medication, vitamin, or supplement using the form.</p>';
    }
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      medications.push({ name: document.querySelector('#c72MedName').value.trim(), dose: document.querySelector('#c72MedDose').value.trim(), when: document.querySelector('#c72MedWhen').value.trim() });
      form.reset();
      render();
      document.querySelector('#c72MedName').focus();
    });
    list.addEventListener('click', (event) => {
      const button = event.target.closest('[data-remove]');
      if (!button) return;
      medications.splice(Number(button.dataset.remove), 1);
      render();
    });
    document.querySelector('#c72MedPrint').addEventListener('click', () => window.print());
    document.querySelector('#c72MedClear').addEventListener('click', () => { medications = []; render(); });
  }

  function refineExistingPage() {
    const phrases = ['Built for real patients', 'Clear information, fast actions, and deeper learning.', 'Need help choosing the right next step?'];
    document.querySelectorAll('main section').forEach((section) => {
      const text = section.textContent || '';
      if (phrases.some((phrase) => text.includes(phrase))) section.remove();
    });
    document.querySelectorAll('.eyebrow').forEach((element) => {
      if (element.textContent.trim() === 'Canby Clinic V45') element.textContent = 'Canby Community Clinic';
    });
    document.querySelectorAll('.card, .surface, .pv-action-card, .cc-policy-card').forEach((element) => element.classList.add('c72-reveal'));
  }

  function addContextStrip() {
    if (!main || document.querySelector('.c72-utility-band')) return;
    const strip = document.createElement('nav');
    strip.className = 'c72-context-strip c72-reveal';
    strip.setAttribute('aria-label', 'Clinic next steps');
    strip.innerHTML = `
      <a href="${clinic.phoneHref}"><small>Questions</small><strong>Call ${clinic.phone}</strong></a>
      <a href="visit-planner.html"><small>Before a visit</small><strong>Build a preparation checklist</strong></a>
      <a href="${clinic.maps}" target="_blank" rel="noopener noreferrer"><small>Clinic location</small><strong>${clinic.address}</strong></a>`;
    main.append(strip);
  }

  function utilityBand() {
    return `<nav class="c72-utility-band" aria-label="Clinic next steps"><div class="c72-utility-inner">
      <a href="${clinic.phoneHref}"><small>Call the clinic</small><strong>${clinic.phone}<br>Monday-Friday, 9 AM-5 PM</strong></a>
      <a href="${clinic.maps}" target="_blank" rel="noopener noreferrer"><small>Directions</small><strong>${clinic.address}</strong></a>
      <a href="new-patient.html"><small>New patients</small><strong>Forms, first-visit information, and what to bring</strong></a>
    </div></nav>`;
  }

  function rewriteFooter() {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    footer.classList.add('c72-footer');
    footer.innerHTML = `<div class="c72-footer-inner">
      <div class="c72-footer-brand-wrap">
        <a class="c72-footer-brand" href="index.html"><img src="assets/images/canby-community-clinic-logo-transparent.png" alt=""><span><strong>Canby Community Clinic</strong><small>Community care in Reseda</small></span></a>
        <p class="c72-footer-contact">${clinic.address}<br><a href="${clinic.phoneHref}">${clinic.phone}</a> / Monday-Friday, 9 AM-5 PM<br>For emergencies, call 911.</p>
      </div>
      <div class="c72-footer-group"><h3>Patients and care</h3><nav><a href="services.html">Services</a><a href="new-patient.html">New patients</a><a href="patient-forms.html">Forms</a><a href="visit-planner.html">Visit planner</a><a href="patient-portal.html">Portal</a><a href="contact.html">Contact</a></nav></div>
      <div class="c72-footer-group"><h3>Community and information</h3><nav><a href="health-library.html">Health library</a><a href="community-resources-directory.html">Resources</a><a href="volunteer.html">Volunteer</a><a href="donate.html">Donate</a><a href="about.html">About Canby</a><a href="accessibility.html">Accessibility</a></nav></div>
      <div class="c72-footer-legal"><span>&copy; 2026 Canby Community Clinic</span><span><a href="privacy.html">Website privacy</a> / <a href="notice-of-privacy-practices.html">Privacy practices</a> / <a href="nondiscrimination.html">Nondiscrimination</a></span></div>
    </div>`;
  }

  function initializeReveals() {
    const elements = document.querySelectorAll('.c72-reveal');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }), { threshold: .1, rootMargin: '0px 0px -5% 0px' });
    elements.forEach((element) => observer.observe(element));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  }
})();
