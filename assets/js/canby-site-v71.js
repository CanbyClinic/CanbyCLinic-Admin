(() => {
  'use strict';

  const page = location.pathname.split('/').pop() || 'index.html';
  const main = document.querySelector('main');
  const clinic = {
    phone: '(818) 674-4414',
    phoneHref: 'tel:18186744414',
    address: '7601 Canby Ave #6B, Reseda, CA 91335',
    maps: 'https://www.google.com/maps/place/Pura+Vida+Community+Clinic/@34.208699,-118.534985,17z'
  };

  document.body.classList.add('pv71');
  document.documentElement.setAttribute('data-theme', 'clinical');

  document.querySelectorAll('.brand-logo').forEach((image) => {
    image.src = 'assets/images/canby-community-clinic-logo-transparent.png';
  });

  const navigation = [
    ['index.html', 'Home'],
    ['services.html', 'Care'],
    ['new-patient.html', 'New patients'],
    ['patient-forms.html', 'Forms'],
    ['about.html', 'Our clinic'],
    ['contact.html', 'Visit']
  ];

  const desktopNav = document.querySelector('.nav-links');
  if (desktopNav) {
    desktopNav.innerHTML = navigation.map(([href, label]) =>
      `<a href="${href}"${href === page ? ' class="active"' : ''}>${label}</a>`
    ).join('');
  }

  const mobileNav = document.querySelector('.mobile-panel');
  if (mobileNav) {
    mobileNav.innerHTML = [...navigation, ['patient-portal.html', 'Patient portal'], ['donate.html', 'Donate']]
      .map(([href, label]) => `<a href="${href}"><span>${label}</span><span aria-hidden="true">&rarr;</span></a>`)
      .join('');
  }

  document.querySelectorAll('.brand small').forEach((element) => {
    element.textContent = 'Community care in Reseda';
  });

  if (page === 'index.html') renderHome();
  enhanceMotion();
  initializeLanguageTabs();

  function renderHome() {
    const intro = document.querySelector('#terminalAmbulanceHero');
    if (!main || !intro) return;

    let sibling = intro.nextElementSibling;
    while (sibling) {
      const next = sibling.nextElementSibling;
      sibling.remove();
      sibling = next;
    }

    intro.insertAdjacentHTML('afterend', `
      <div class="c71-home" id="start">
        <section class="c71-arrival" aria-labelledby="c71-arrival-title">
          <div class="c71-shell c71-arrival-grid">
            <div class="c71-arrival-copy c71-reveal">
              <p class="c71-index">Patient navigation / Canby Community Clinic</p>
              <h1 id="c71-arrival-title">What do you need today?</h1>
              <p class="c71-intro">Appointments, forms, directions, and help from the clinic, all in one place.</p>
              <a class="c71-phone" href="${clinic.phoneHref}"><span>Call the clinic</span><strong>${clinic.phone}</strong></a>
            </div>
            <nav class="c71-action-list c71-reveal" aria-label="Patient actions">
              ${action('01', 'Schedule or change an appointment', 'Call during clinic hours', clinic.phoneHref, 'Call')}
              ${action('02', 'I am a new patient', 'Forms, documents, and first-visit information', 'new-patient.html', 'Begin')}
              ${action('03', 'Patient portal', 'Sign in or create a secure account', 'patient-portal.html', 'Open')}
              ${action('04', 'Forms and language help', 'English / Espa&ntilde;ol / &#1344;&#1377;&#1397;&#1381;&#1408;&#1381;&#1398;', 'patient-forms.html', 'View')}
            </nav>
          </div>
          <div class="c71-urgent"><span>For life-threatening symptoms, call 911.</span><span>This website is not monitored for urgent medical needs.</span></div>
        </section>

        <section class="c71-care" id="care" aria-labelledby="c71-care-title">
          <div class="c71-care-visual" aria-hidden="true">
            <img src="assets/images/hero-family-clinician.webp" alt="" loading="lazy">
          </div>
          <div class="c71-shell c71-care-layout">
            <header class="c71-care-heading c71-reveal">
              <p class="c71-index">Care / Close to home</p>
              <h2 id="c71-care-title">A neighborhood clinic should feel familiar.</h2>
              <p>Canby serves patients and families in Reseda with practical guidance before, during, and after a visit. Call to confirm current services and availability.</p>
              <a class="c71-text-link" href="services.html">Explore care at Canby <span>&rarr;</span></a>
            </header>
            <div class="c71-care-index" role="list">
              ${careItem('01', 'Primary and preventive care', 'Routine care, screening conversations, and follow-up planning.')}
              ${careItem('02', 'Blood pressure and diabetes support', 'Education and preparation for conversations with your care team.')}
              ${careItem('03', 'Medications and next steps', 'Bring an accurate medication list and questions for your visit.')}
              ${careItem('04', 'Referrals and community resources', 'Help preparing for labs, specialists, and local support.')}
            </div>
          </div>
        </section>

        <section class="c71-first-visit" id="new-patients" aria-labelledby="c71-first-title">
          <div class="c71-shell">
            <header class="c71-section-heading c71-reveal">
              <p class="c71-index">Before your first visit</p>
              <h2 id="c71-first-title">Bring what helps us understand the full picture.</h2>
            </header>
            <div class="c71-visit-flow">
              <figure class="c71-visit-photo c71-reveal">
                <img src="assets/images/canby-patient-journey-hero.webp" alt="A clinician speaking with a family at a community clinic" loading="lazy">
                <figcaption>Questions are welcome. Write them down and bring them with you.</figcaption>
              </figure>
              <ol class="c71-visit-steps">
                ${visitStep('01', 'Call first', `Confirm appointment availability, current services, language assistance, and insurance participation at ${clinic.phone}.`)}
                ${visitStep('02', 'Gather your information', 'Bring identification if available, insurance information, medication bottles or a current list, and recent records or referrals.')}
                ${visitStep('03', 'Tell us what you need', 'Let the clinic know your preferred language, accessibility needs, and the questions you want to discuss.')}
              </ol>
            </div>
          </div>
        </section>

        <section class="c71-location" id="visit" aria-labelledby="c71-location-title">
          <div class="c71-location-map">
            <iframe title="Map showing Canby Community Clinic in Reseda" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=7601+Canby+Ave+%236B,+Reseda,+CA+91335&output=embed"></iframe>
          </div>
          <div class="c71-location-copy c71-reveal">
            <p class="c71-index">Visit the clinic</p>
            <h2 id="c71-location-title">Canby Avenue.<br>Reseda.</h2>
            <address>7601 Canby Ave #6B<br>Reseda, CA 91335</address>
            <dl>
              <div><dt>Hours</dt><dd>Monday-Friday<br>9 AM-5 PM</dd></div>
              <div><dt>Phone</dt><dd><a href="${clinic.phoneHref}">${clinic.phone}</a></dd></div>
            </dl>
            <nav aria-label="Location actions">
              <a href="${clinic.phoneHref}">Call clinic <span>&nearr;</span></a>
              <a href="${clinic.maps}" rel="noopener">Directions <span>&nearr;</span></a>
              <a href="contact.html">Contact details <span>&rarr;</span></a>
            </nav>
          </div>
        </section>

        <section class="c71-language" id="forms" aria-labelledby="c71-language-title">
          <div class="c71-shell c71-language-grid">
            <div class="c71-language-copy c71-reveal">
              <p class="c71-index">Forms and language access</p>
              <h2 id="c71-language-title">Understand your care. Be understood.</h2>
              <p>Ask for language assistance or an accessible format when you call. Do not send medical records, identification, or insurance cards through ordinary email.</p>
            </div>
            <div class="c71-language-panel c71-reveal">
              <div class="c71-tabs" role="tablist" aria-label="Choose a language">
                <button type="button" role="tab" aria-selected="true" data-c71-tab="en">English</button>
                <button type="button" role="tab" aria-selected="false" data-c71-tab="es">Espa&ntilde;ol</button>
                <button type="button" role="tab" aria-selected="false" data-c71-tab="hy">&#1344;&#1377;&#1397;&#1381;&#1408;&#1381;&#1398;</button>
              </div>
              ${languagePanel('en', true, [
                ['New patient information', 'new-patient.html'],
                ['Visit planner', 'visit-planner.html'],
                ['Patient forms', 'patient-forms.html']
              ])}
              ${languagePanel('es', false, [
                ['Informaci&oacute;n para pacientes nuevos', 'es-nuevo-paciente.html'],
                ['Citas', 'es-citas.html'],
                ['Recursos para pacientes', 'es-recursos.html']
              ])}
              ${languagePanel('hy', false, [
                ['&#1350;&#1400;&#1408; &#1402;&#1377;&#1409;&#1387;&#1381;&#1398;&#1407;&#1398;&#1381;&#1408;', 'hy-new-patient.html'],
                ['&#1329;&#1397;&#1409;&#1381;&#1388;&#1400;&#1410;&#1385;&#1397;&#1400;&#1410;&#1398;&#1398;&#1381;&#1408;', 'hy-appointments.html'],
                ['&#1356;&#1381;&#1405;&#1400;&#1410;&#1408;&#1405;&#1398;&#1381;&#1408;', 'hy-resources.html']
              ])}
            </div>
          </div>
        </section>

        <section class="c71-community" aria-labelledby="c71-community-title">
          <figure><img src="assets/images/canby-community-outreach.webp" alt="Clinic staff and volunteers meeting neighbors at a community event" loading="lazy"></figure>
          <div class="c71-community-copy c71-reveal">
            <p class="c71-index">A community clinic, supported by its community</p>
            <h2 id="c71-community-title">Help keep care close to home.</h2>
            <p>Volunteer time and donations support outreach, patient education, language access, and the practical work that helps neighbors reach care.</p>
            <div><a href="volunteer.html">Volunteer <span>&rarr;</span></a><a href="donate.html">Support the clinic <span>&rarr;</span></a><a href="about.html">About Canby <span>&rarr;</span></a></div>
          </div>
        </section>

        <section class="c71-closing">
          <div class="c71-shell">
            <p class="c71-index">Canby Community Clinic / Reseda</p>
            <h2>Questions before your visit?</h2>
            <a href="${clinic.phoneHref}">${clinic.phone} <span>&nearr;</span></a>
            <p>${clinic.address}</p>
          </div>
        </section>
      </div>
    `);

    document.title = 'Canby Community Clinic | Community Care in Reseda';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = 'Appointments, patient forms, clinic hours, directions, and community health resources from Canby Community Clinic in Reseda.';
  }

  function action(number, title, detail, href, verb) {
    return `<a href="${href}"><span class="c71-action-number">${number}</span><span><strong>${title}</strong><small>${detail}</small></span><b>${verb} <i aria-hidden="true">&nearr;</i></b></a>`;
  }

  function careItem(number, title, copy) {
    return `<article role="listitem" class="c71-reveal"><span>${number}</span><div><h3>${title}</h3><p>${copy}</p></div></article>`;
  }

  function visitStep(number, title, copy) {
    return `<li class="c71-reveal"><span>${number}</span><div><h3>${title}</h3><p>${copy}</p></div></li>`;
  }

  function languagePanel(key, active, links) {
    return `<div class="c71-panel${active ? ' is-active' : ''}" data-c71-panel="${key}">${links.map(([label, href]) => `<a href="${href}"><span>${label}</span><b aria-hidden="true">&rarr;</b></a>`).join('')}</div>`;
  }

  function initializeLanguageTabs() {
    document.querySelectorAll('[data-c71-tab]').forEach((button) => button.addEventListener('click', () => {
      const key = button.dataset.c71Tab;
      document.querySelectorAll('[data-c71-tab]').forEach((tab) => tab.setAttribute('aria-selected', String(tab === button)));
      document.querySelectorAll('[data-c71-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.c71Panel === key));
    }));
  }

  function enhanceMotion() {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = document.querySelectorAll('.c71-reveal');
    if (reduced || !('IntersectionObserver' in window)) {
      reveals.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }), { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    reveals.forEach((element) => observer.observe(element));

    let scheduled = false;
    const update = () => {
      scheduled = false;
      document.querySelectorAll('.c71-care, .c71-community').forEach((section) => {
        const bounds = section.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight + bounds.height)));
        section.style.setProperty('--c71-progress', progress.toFixed(4));
      });
    };
    addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }
})();
