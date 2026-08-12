(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.documentElement.setAttribute('data-theme', 'clinical');
  document.body.classList.add('cc-upgraded');

  const homeMarkup = `
    <div class="cc-home">
      <section class="cc-command" id="start">
        <div class="cc-shell cc-command-grid">
          <div class="cc-command-copy cc-reveal">
            <p class="cc-kicker">Canby patient command center</p>
            <h1 class="cc-display">Start your visit faster.</h1>
            <p class="cc-lead">Simple steps, clear information, and a warm team ready to help you prepare for care.</p>
            <p class="cc-live-line">Clinic line open Monday-Friday, 9 AM-5 PM</p>
          </div>
          <div class="cc-actions cc-reveal" aria-label="Patient quick actions">
            <div class="cc-actions-head"><span>Choose a next step</span><span>Canby / Reseda</span></div>
            <a class="cc-action" href="new-patient.html"><span class="cc-action-number">01</span><span><strong>New Patient Intake</strong><small>See the steps and prepare before your first visit.</small></span><span class="cc-action-arrow" aria-hidden="true">→</span></a>
            <a class="cc-action" href="patient-portal.html"><span class="cc-action-number">02</span><span><strong>Portal Login</strong><small>Use the clinic's approved portal when it is connected.</small></span><span class="cc-action-arrow" aria-hidden="true">→</span></a>
            <a class="cc-action" href="#forms"><span class="cc-action-number">03</span><span><strong>Patient Forms</strong><small>Find visit resources in English, Spanish, or Armenian.</small></span><span class="cc-action-arrow" aria-hidden="true">↓</span></a>
            <a class="cc-action" href="tel:18186744414"><span class="cc-action-number">04</span><span><strong>Call Clinic</strong><small>(818) 674-4414 for appointments and questions.</small></span><span class="cc-action-arrow" aria-hidden="true">↗</span></a>
            <div class="cc-emergency"><strong>This website is not monitored for urgent medical needs.</strong><span>Emergency? <a href="tel:911">Call 911</a></span></div>
          </div>
        </div>
      </section>
      <nav class="cc-section-nav" aria-label="Homepage sections"><div class="cc-shell"><a href="#start">Start</a><a href="#new-patients">New patients</a><a href="#insurance">Insurance</a><a href="#forms">Forms</a><a href="#visit">Visit</a><a href="#community">Community</a></div></nav>
      <section class="cc-band cc-band--mist" id="new-patients">
        <div class="cc-shell">
          <header class="cc-band-head cc-reveal"><div><p class="cc-kicker">New patients</p><h2 class="cc-section-title">Three clear steps before care.</h2></div><p class="cc-lead">We keep the first visit practical. Review what you need, call the clinic, and bring the information that helps your care team understand you.</p></header>
          <div class="cc-steps">
            <article class="cc-step cc-reveal"><span class="cc-step-number">01</span><div><h3>Review</h3><p>Read the new-patient guide and note your questions, medications, allergies, and recent care.</p><a href="new-patient.html">Open the guide →</a></div></article>
            <article class="cc-step cc-reveal"><span class="cc-step-number">02</span><div><h3>Confirm</h3><p>Call to confirm current services, appointment availability, language needs, and insurance participation.</p><a href="tel:18186744414">Call (818) 674-4414 →</a></div></article>
            <article class="cc-step cc-reveal"><span class="cc-step-number">03</span><div><h3>Prepare</h3><p>Bring your documents and arrive with enough time to complete any clinic-approved intake forms.</p><a href="#forms">View patient resources →</a></div></article>
          </div>
          <div class="cc-bring cc-reveal"><h3>What to bring</h3><div class="cc-checks"><span>Photo identification, if available</span><span>Insurance card, if applicable</span><span>Medication bottles or an up-to-date list</span><span>Recent records, lab results, or referrals</span><span>Questions you want to discuss</span><span>Your preferred language and accessibility needs</span></div></div>
        </div>
      </section>
      <section class="cc-band cc-band--ink" id="insurance">
        <div class="cc-shell">
          <header class="cc-band-head cc-reveal"><div><p class="cc-kicker" style="color:var(--cc-cyan)">Insurance and payment</p><h2 class="cc-section-title">Know before you go.</h2></div><p class="cc-lead">Plan participation and benefits can change. Call Canby and your health plan before the visit to confirm current coverage and expected costs.</p></header>
          <div class="cc-insurance-grid cc-reveal">
            <article class="cc-insurance-tile"><small>01 / PUBLIC</small><h3>Medi-Cal</h3><p>Ask the clinic to confirm current plan and medical-group participation.</p></article>
            <article class="cc-insurance-tile"><small>02 / FEDERAL</small><h3>Medicare</h3><p>Confirm eligibility, participation, referral needs, and covered services.</p></article>
            <article class="cc-insurance-tile"><small>03 / COMMERCIAL</small><h3>Health plans</h3><p>Call the member-services number on your card and confirm with the clinic.</p></article>
            <article class="cc-insurance-tile"><small>04 / DIRECT</small><h3>Self-pay</h3><p>Ask about current pricing and available payment options before care.</p></article>
          </div>
          <div class="cc-secure-route cc-reveal"><div><h3>Send documents only through an approved secure channel.</h3><p>Do not upload an insurance card or medical document to a general website form. Call the clinic or use its approved patient portal after the clinic confirms the correct route.</p></div><a href="patient-portal.html">Portal information →</a></div>
        </div>
      </section>
      <section class="cc-band" id="forms">
        <div class="cc-shell">
          <header class="cc-band-head cc-reveal"><div><p class="cc-kicker" style="color:var(--cc-red)">Patient forms</p><h2 class="cc-section-title">Choose your language.</h2></div><p class="cc-lead">Start with plain-language visit resources. The clinic can provide qualified language assistance and clinic-approved forms.</p></header>
          <div class="cc-forms-layout cc-reveal">
            <div class="cc-tabs" role="tablist" aria-label="Patient resource language"><button class="cc-tab" role="tab" aria-selected="true" data-form-tab="en">English</button><button class="cc-tab" role="tab" aria-selected="false" data-form-tab="es">Español</button><button class="cc-tab" role="tab" aria-selected="false" data-form-tab="hy">Հայերեն</button></div>
            <div>
              <div class="cc-form-panel is-active" data-form-panel="en"><h3>English resources</h3><a class="cc-form-link" href="new-patient.html"><span><strong>New patient guide</strong><small>First-visit steps and preparation.</small></span><span>→</span></a><a class="cc-form-link" href="visit-planner.html"><span><strong>Visit planner</strong><small>Create a non-identifying checklist for your visit.</small></span><span>→</span></a><a class="cc-form-link" href="patient-resources.html"><span><strong>Patient resources</strong><small>Clinic, health, and community information.</small></span><span>→</span></a></div>
              <div class="cc-form-panel" data-form-panel="es"><h3>Recursos en español</h3><a class="cc-form-link" href="es-nuevo-paciente.html"><span><strong>Guía para pacientes nuevos</strong><small>Pasos para prepararse para su primera visita.</small></span><span>→</span></a><a class="cc-form-link" href="es-citas.html"><span><strong>Citas</strong><small>Información para planificar su visita.</small></span><span>→</span></a><a class="cc-form-link" href="es-recursos.html"><span><strong>Recursos</strong><small>Información para pacientes y familias.</small></span><span>→</span></a></div>
              <div class="cc-form-panel" data-form-panel="hy"><h3>Հայերեն նյութեր</h3><a class="cc-form-link" href="hy-new-patient.html"><span><strong>Նոր պացիենտների ուղեցույց</strong><small>Առաջին այցին պատրաստվելու քայլեր։</small></span><span>→</span></a><a class="cc-form-link" href="hy-appointments.html"><span><strong>Այցելություններ</strong><small>Այցը պլանավորելու տեղեկություն։</small></span><span>→</span></a><a class="cc-form-link" href="hy-resources.html"><span><strong>Ռեսուրսներ</strong><small>Տեղեկություն պացիենտների և ընտանիքների համար։</small></span><span>→</span></a></div>
            </div>
          </div>
        </div>
      </section>
      <section class="cc-band cc-band--green" id="visit">
        <div class="cc-shell cc-visit-grid">
          <figure class="cc-visit-image cc-reveal"><img src="assets/images/clinic-exterior-concept.webp" alt="Canby Community Clinic exterior concept" loading="lazy"><figcaption>Canby Community Clinic · Reseda, California</figcaption></figure>
          <div class="cc-visit-details cc-reveal"><p class="cc-kicker">Visit information</p><h2 class="cc-section-title">Real care, right now.</h2><p class="cc-address">7601 Canby Ave #6B<br>Reseda, CA 91335</p><div class="cc-hours"><div><small>Clinic hours</small><strong>Monday-Friday<br>9 AM-5 PM</strong></div><div><small>Phone</small><strong>(818) 674-4414</strong></div></div><div class="cc-visit-actions"><a href="tel:18186744414">Call clinic</a><a href="https://maps.google.com/?q=7601+Canby+Ave+%236B+Reseda+CA+91335" rel="noopener">Get directions</a><a href="contact.html">Contact details</a></div></div>
        </div>
      </section>
      <section class="cc-band" id="community">
        <div class="cc-shell cc-community-grid">
          <div class="cc-community-copy cc-reveal"><p class="cc-kicker" style="color:var(--cc-cyan)">Community care</p><h2 class="cc-section-title">Care that moves with our community.</h2><p class="cc-lead">Health can feel scary sometimes. Canby is designed to make the next step easier to understand and more human.</p><div class="cc-impact"><div><strong>Patients</strong><span>Clear steps and practical visit support.</span></div><div><strong>Families</strong><span>Plain-language health and community resources.</span></div><div><strong>Neighbors</strong><span>Ways to volunteer, give, and strengthen local care.</span></div></div><div class="cc-community-actions"><a href="about.html">Our mission</a><a href="volunteer.html">Volunteer</a><a href="donate.html">Donate</a></div></div>
          <figure class="cc-community-image cc-reveal"><img src="assets/images/community-volunteers.webp" alt="Community volunteers supporting local care" loading="lazy"></figure>
        </div>
      </section>
      <section class="cc-privacy-strip"><div class="cc-shell cc-privacy-grid"><h2>Your health information deserves careful handling.</h2><div><p>Do not send medical details through ordinary email or general website forms. Use a clinic-approved secure channel or call for guidance.</p><div class="cc-privacy-links"><a href="notice-of-privacy-practices.html">Notice of Privacy Practices</a><a href="privacy.html">Website privacy</a><a href="nondiscrimination.html">Nondiscrimination</a><a href="accessibility.html">Accessibility</a></div></div></div></section>
    </div>`;

  const policies = {
    'privacy.html': {
      title: 'Website Privacy', kicker: 'Privacy and safety', accent: 'cyan',
      intro: 'How this public website handles information and how patients can choose a safer communication channel.',
      sections: [
        ['What this website collects', '<p>This public website is designed to provide information and navigation without asking you to submit medical details. It may receive ordinary technical requests needed to deliver pages, such as an IP address and browser information, through the hosting provider.</p><p>Canby should not add advertising pixels, session replay, or third-party analytics to pages where patients sign in, register, schedule, or share health information unless the clinic completes a documented privacy, security, and legal review and has any required agreements in place.</p>'],
        ['Do not send medical information here', '<div class="cc-policy-note"><strong>Do not use ordinary email or a general website form for symptoms, diagnoses, medications, insurance cards, identification, or other health information.</strong></div><p>Call the clinic at <a href="tel:18186744414">(818) 674-4414</a> or use the clinic-approved patient portal after Canby confirms that it is connected and ready.</p>'],
        ['Cookies and local storage', '<p>This redesigned site does not store names, email addresses, passwords, medication lists, insurance information, or medical details in browser storage. A small preference may be stored for non-medical display settings only.</p>'],
        ['Your choices', '<p>You can browse the public information without creating an account. You may disable optional browser storage in your browser settings. For questions about medical records or privacy rights, review the Notice of Privacy Practices or contact the clinic.</p>'],
        ['Contact', '<p>Canby Community Clinic<br>7601 Canby Ave #6B, Reseda, CA 91335<br><a href="tel:18186744414">(818) 674-4414</a></p>']
      ]
    },
    'notice-of-privacy-practices.html': {
      title: 'Notice of Privacy Practices', kicker: 'Your information. Your rights. Our responsibilities.', accent: 'red',
      intro: 'This notice describes how medical information about you may be used and disclosed and how you can get access to it. Please review it carefully.',
      sections: [
        ['Your rights', '<p>You may ask to inspect or receive a copy of your paper or electronic medical record, ask us to correct it, request confidential communications, ask us to limit certain uses or disclosures, receive an accounting of certain disclosures, obtain a paper copy of this notice, choose someone to act for you, and file a complaint if you believe your privacy rights were violated.</p><p>Some requests may be subject to legal limits. We will explain those limits when they apply.</p>'],
        ['Your choices', '<p>For certain health information, you can tell us your choices about what we share. This can include sharing with family or friends involved in your care, disaster relief, fundraising communications, and other uses where the law gives you a choice. We will obtain written authorization for uses and disclosures that require it, and you may revoke that authorization in writing as allowed by law.</p>'],
        ['How we may use and share information', '<p>We may use and disclose health information for treatment, payment, and health care operations. We may also disclose information when required or permitted by law, including for public health and safety, health oversight, workers’ compensation, law enforcement, legal proceedings, organ donation, medical examiners, and other specifically authorized purposes.</p><p>If we maintain or receive substance use disorder records protected by 42 CFR Part 2, those records receive additional protections. We will not use or disclose those records in civil, criminal, administrative, or legislative proceedings against you except as permitted by applicable law, with written consent, or under a valid court order when required.</p>'],
        ['Our responsibilities', '<p>We are required by law to maintain the privacy and security of protected health information, provide this notice, follow the notice currently in effect, and notify affected individuals after a breach when required. We will not use or share information outside the ways described here unless you authorize it in writing, and you may change your mind in writing.</p>'],
        ['Complaints and questions', '<p>You may contact the Canby Community Clinic Privacy Officer at 7601 Canby Ave #6B, Reseda, CA 91335 or <a href="tel:18186744414">(818) 674-4414</a>. You may also file a complaint with the U.S. Department of Health and Human Services Office for Civil Rights. We will not retaliate against you for filing a complaint.</p>'],
        ['Changes to this notice', '<p>We may change this notice and apply the revised terms to health information we already have and information we receive in the future. The current notice will be available at the clinic and on this website.</p>']
      ], effective: 'Effective date: August 10, 2026'
    },
    'nondiscrimination.html': {
      title: 'Nondiscrimination and Language Access', kicker: 'Care with dignity', accent: 'green',
      intro: 'Canby Community Clinic provides equal access to care and communication assistance for patients and families.',
      sections: [
        ['Nondiscrimination', '<p>Canby Community Clinic complies with applicable federal civil rights laws and does not discriminate, exclude people, or treat them less favorably on the basis of race, color, national origin, sex, age, or disability.</p>'],
        ['Communication assistance', '<p>Canby provides reasonable modifications and appropriate auxiliary aids and services when needed for effective communication, including qualified sign-language interpreters and information in accessible formats.</p><p>Free language assistance may include qualified interpreters and translated information. Patients do not have to provide their own interpreter. Call <a href="tel:18186744414">(818) 674-4414</a> and state your preferred language or communication need.</p>'],
        ['File a grievance', '<p>If you believe Canby did not provide these services or discriminated in another way, contact the clinic at 7601 Canby Ave #6B, Reseda, CA 91335 or <a href="tel:18186744414">(818) 674-4414</a>.</p><p>You may also file a civil-rights complaint with the U.S. Department of Health and Human Services Office for Civil Rights through its complaint portal, by mail, or by phone.</p>'],
        ['Language resources', '<p><a href="es.html">Español</a> · <a href="hy.html">Հայերեն</a> · <a href="contact.html">Request another language or accessible format</a></p>']
      ]
    },
    'accessibility.html': {
      title: 'Accessibility', kicker: 'Access for every patient', accent: 'cyan',
      intro: 'Canby is working toward an experience that is perceivable, operable, understandable, and robust across devices and assistive technologies.',
      sections: [
        ['Our standard', '<p>This website is designed toward WCAG 2.2 Level AA, including keyboard access, visible focus, sufficient color contrast, meaningful headings, text alternatives, responsive reflow, and support for reduced motion.</p>'],
        ['Available assistance', '<p>If a page, document, or feature is difficult to use, call <a href="tel:18186744414">(818) 674-4414</a>. Canby can provide reasonable modifications, auxiliary aids, and information in alternative formats when needed.</p>'],
        ['Animation and motion', '<p>The site honors the operating-system reduced-motion preference. The cinematic introduction can be bypassed by keyboard or by navigating directly to patient actions. Essential patient information does not depend on animation.</p>'],
        ['Feedback', '<p>Please report the page, device, browser, and the type of assistance needed. We will work to provide the information through an accessible alternative and improve the website.</p>']
      ]
    }
  };

  function renderHome() {
    const hero = document.querySelector('#terminalAmbulanceHero');
    if (!hero) return;
    let node = hero.nextElementSibling;
    while (node) { const next = node.nextElementSibling; node.remove(); node = next; }
    hero.insertAdjacentHTML('afterend', homeMarkup);
    document.title = 'Canby Community Clinic | Start Your Visit Faster';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = 'Patient information, new-patient steps, forms, visit details, language resources, and community care from Canby Community Clinic in Reseda.';
  }

  function renderPolicy(config) {
    const main = document.querySelector('main');
    if (!main) return;
    const ids = config.sections.map((_, i) => `policy-${i + 1}`);
    main.innerHTML = `<article class="cc-policy"><header class="cc-policy-hero" style="border-color:var(--cc-${config.accent})"><p class="cc-kicker" style="color:var(--cc-${config.accent})">${config.kicker}</p><h1 class="cc-display">${config.title}</h1><p class="cc-lead" style="margin-top:28px">${config.intro}</p><div class="cc-policy-meta"><span>${config.effective || 'Last reviewed: August 10, 2026'}</span><span>Canby Community Clinic · (818) 674-4414</span></div></header><div class="cc-policy-body"><nav class="cc-policy-nav" aria-label="Page contents">${config.sections.map((s,i)=>`<a href="#${ids[i]}">${s[0]}</a>`).join('')}</nav><div class="cc-policy-content">${config.sections.map((s,i)=>`<section id="${ids[i]}"><h2>${s[0]}</h2>${s[1]}</section>`).join('')}</div></div></article>`;
    document.title = `${config.title} | Canby Community Clinic`;
  }

  function renderPortal() {
    const main = document.querySelector('main');
    if (!main) return;
    main.innerHTML = `<section class="cc-policy"><div class="cc-safe-portal"><div><p class="cc-kicker" style="color:var(--cc-cyan)">Patient portal</p><h1 class="cc-display">Your privacy comes first.</h1><p class="cc-lead" style="margin-top:28px">The public website does not accept portal credentials or health information. Canby will activate this link only after an approved patient-portal service is securely connected.</p></div><aside class="cc-safe-panel"><h2>Need help today?</h2><p>Call the clinic for appointment help, forms, records guidance, or the correct secure way to share information.</p><div class="cc-visit-actions"><a href="tel:18186744414">Call (818) 674-4414</a><a href="new-patient.html">New patient guide</a></div><p><strong>Do not send passwords, medical details, identification, or insurance cards through ordinary email.</strong></p></aside></div></section>`;
    document.title = 'Patient Portal Information | Canby Community Clinic';
  }

  if (path === 'index.html') renderHome();
  if (policies[path]) renderPolicy(policies[path]);
  if (path === 'patient-portal.html') renderPortal();

  const mainNav = document.querySelector('.nav-links');
  if (mainNav) mainNav.innerHTML = '<a href="services.html">Care</a><a href="new-patient.html">New patients</a><a href="index.html#forms">Forms</a><a href="contact.html">Visit</a><a href="community-resources-directory.html">Community</a><a href="about.html">About</a>';
  const mobileMenu = document.querySelector('.mobile-panel');
  if (mobileMenu) mobileMenu.innerHTML = '<a href="index.html"><span>Home</span><span>→</span></a><a href="services.html"><span>Care</span><span>→</span></a><a href="new-patient.html"><span>New patients</span><span>→</span></a><a href="index.html#forms"><span>Forms and languages</span><span>→</span></a><a href="contact.html"><span>Visit information</span><span>→</span></a><a href="community-resources-directory.html"><span>Community</span><span>→</span></a><a href="patient-portal.html"><span>Portal information</span><span>→</span></a>';
  const brandSubtitle = document.querySelector('.site-header .brand small');
  if (brandSubtitle) brandSubtitle.textContent = 'Community care in Reseda';
  const quickForms = document.querySelector('.mobile-quick a:nth-child(3)');
  if (quickForms) quickForms.href = 'index.html#forms';

  document.querySelectorAll('.eyebrow').forEach(label => {
    if (label.textContent.trim() === 'Canby Clinic V45') label.textContent = 'Canby Community Clinic';
  });

  const footerClinic = document.querySelector('.footer [href="privacy.html"]');
  if (footerClinic && !document.querySelector('.footer [href="notice-of-privacy-practices.html"]')) {
    footerClinic.insertAdjacentHTML('afterend', '<a href="notice-of-privacy-practices.html">Privacy practices</a><a href="nondiscrimination.html">Nondiscrimination</a><a href="accessibility.html">Accessibility</a>');
  }

  document.querySelectorAll('[data-form-tab]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.formTab;
    document.querySelectorAll('[data-form-tab]').forEach(tab => tab.setAttribute('aria-selected', String(tab === button)));
    document.querySelectorAll('[data-form-panel]').forEach(panel => panel.classList.toggle('is-active', panel.dataset.formPanel === key));
  }));

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .13, rootMargin: '0px 0px -40px' });
    document.querySelectorAll('.cc-reveal').forEach(element => observer.observe(element));
  } else {
    document.querySelectorAll('.cc-reveal').forEach(element => element.classList.add('is-visible'));
  }

  const sectionLinks = [...document.querySelectorAll('.cc-section-nav a')];
  if (sectionLinks.length && 'IntersectionObserver' in window) {
    const sections = sectionLinks.map(link => document.querySelector(link.hash)).filter(Boolean);
    const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(link => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
    }), { rootMargin: '-35% 0px -55%' });
    sections.forEach(section => navObserver.observe(section));
  }
})();
