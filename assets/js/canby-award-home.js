(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  if (path !== 'index.html') return;

  const home = document.querySelector('.cc-home');
  if (!home) return;

  document.title = 'Canby Community Clinic | Care That Moves With Our Community';
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = 'Patient forms, secure portal access, clinic hours, directions, and community care resources for Canby Community Clinic in Reseda.';

  home.outerHTML = `
    <div class="aw-home">
      <section class="aw-command" id="start" aria-labelledby="aw-command-title">
        <div class="aw-command-rule" aria-hidden="true"><i></i><i></i></div>
        <div class="aw-command-copy aw-reveal">
          <p class="aw-label"><span>Canby Community Clinic</span><span>7601 Canby Ave #6B / Reseda</span></p>
          <h1 id="aw-command-title"><span>Start your</span><span>visit faster.</span></h1>
          <p class="aw-command-intro">The fastest path to appointments, forms, secure portal access, directions, and a real person at the clinic.</p>
          <div class="aw-open"><span aria-hidden="true"></span><strong>Clinic line open</strong><small>Monday-Friday / 9 AM-5 PM</small></div>
        </div>
        <nav class="aw-actions aw-reveal" aria-label="Patient quick actions">
          <a href="new-patient.html"><span class="aw-action-index">01</span><span><strong>New Patient Intake</strong><small>Prepare for your first visit</small></span><b aria-hidden="true">&rarr;</b></a>
          <a href="patient-portal.html"><span class="aw-action-index">02</span><span><strong>Patient Portal</strong><small>Log in, sign up, or recover access</small></span><b aria-hidden="true">&rarr;</b></a>
          <a href="patient-forms.html"><span class="aw-action-index">03</span><span><strong>Patient Forms</strong><small>English / Spanish / Armenian</small></span><b aria-hidden="true">&rarr;</b></a>
          <a href="contact.html"><span class="aw-action-index">04</span><span><strong>Request Contact</strong><small>Ask the clinic to call or email you</small></span><b aria-hidden="true">&rarr;</b></a>
        </nav>
        <div class="aw-command-contact"><a href="tel:18186744414">Call (818) 674-4414</a><span>7601 Canby Ave #6B, Reseda, CA 91335</span></div>
        <p class="aw-emergency">For a medical emergency, call <a href="tel:911">911</a>. This website is not monitored for urgent medical needs.</p>
      </section>

      <nav class="aw-rail" aria-label="Explore Canby">
        <a href="#start">Start</a><a href="#new-patients">New patients</a><a href="#insurance">Insurance</a><a href="#forms">Forms</a><a href="#visit">Visit</a><a href="#community">Community</a>
      </nav>

      <section class="aw-motion-scene" aria-label="Community care at Canby">
        <div class="aw-motion-frame"><img src="assets/images/canby-patient-journey-hero.webp" alt="A clinician welcoming a multigenerational family at a community clinic"></div>
        <div class="aw-motion-caption"><span>One clinic. One clear next step.</span><span>Care in Reseda / Monday-Friday</span></div>
      </section>

      <section class="aw-statement" aria-labelledby="aw-statement-title">
        <div class="aw-statement-number">01 / A calmer beginning</div>
        <h2 id="aw-statement-title" class="aw-reveal"><span>Health can feel</span><span>scary sometimes.</span></h2>
        <p class="aw-reveal">You should not have to decode your next step. Canby makes preparation clear, language support visible, and help easy to reach.</p>
        <a class="aw-circle-link" href="tel:18186744414" aria-label="Call Canby Community Clinic"><span>Talk to a<br>real person</span><b>&nearr;</b></a>
      </section>

      <section class="aw-journey" id="new-patients" aria-labelledby="aw-journey-title">
        <header class="aw-section-head aw-reveal">
          <p>02 / New patients</p>
          <h2 id="aw-journey-title">Three steps.<br>No guesswork.</h2>
          <a href="new-patient.html">Open the complete guide <span>&rarr;</span></a>
        </header>
        <div class="aw-journey-layout">
          <figure class="aw-journey-photo aw-reveal"><img src="assets/images/canby-patient-journey-hero.webp" alt="A clinician welcoming a family at a community clinic" loading="lazy"><figcaption>Clear information before care begins.</figcaption></figure>
          <ol class="aw-steps">
            <li class="aw-reveal"><span>01</span><div><h3>Review</h3><p>Note your questions, medications, allergies, and recent care. Our guide shows what matters.</p><a href="new-patient.html">New patient guide &rarr;</a></div></li>
            <li class="aw-reveal"><span>02</span><div><h3>Confirm</h3><p>Call to confirm services, appointment availability, language needs, and insurance participation.</p><a href="tel:18186744414">Call (818) 674-4414 &nearr;</a></div></li>
            <li class="aw-reveal"><span>03</span><div><h3>Prepare</h3><p>Bring identification if available, insurance information, medications, and any recent records.</p><a href="patient-forms.html">Patient forms &rarr;</a></div></li>
          </ol>
        </div>
      </section>

      <section class="aw-insurance" id="insurance" aria-labelledby="aw-insurance-title">
        <div class="aw-insurance-kicker">03 / Insurance and payment</div>
        <h2 id="aw-insurance-title" class="aw-reveal"><span>KNOW</span><span>BEFORE</span><span>YOU GO.</span></h2>
        <p class="aw-insurance-note aw-reveal">Coverage changes. Call Canby and the number on your insurance card before your visit to confirm participation and expected costs.</p>
        <div class="aw-plan-list aw-reveal">
          <article><span>01</span><h3>Medi-Cal</h3><p>Confirm the plan and medical group.</p></article>
          <article><span>02</span><h3>Medicare</h3><p>Confirm eligibility and referrals.</p></article>
          <article><span>03</span><h3>Health plans</h3><p>Verify current clinic participation.</p></article>
          <article><span>04</span><h3>Self-pay</h3><p>Ask about current pricing options.</p></article>
        </div>
        <div class="aw-secure aw-reveal"><strong>Keep health information private.</strong><p>Do not upload insurance cards or medical documents to a general website form. Call the clinic for the approved secure channel.</p><a href="patient-portal.html">Secure portal information &rarr;</a></div>
      </section>

      <section class="aw-forms" id="forms" aria-labelledby="aw-forms-title">
        <div class="aw-forms-title">
          <p>04 / Patient resources</p>
          <h2 id="aw-forms-title">CARE,<br>IN YOUR<br>LANGUAGE.</h2>
          <p>Plain-language preparation with free language assistance available through the clinic.</p>
        </div>
        <div class="aw-forms-interface aw-reveal">
          <div class="aw-tabs" role="tablist" aria-label="Patient resource language">
            <button type="button" role="tab" aria-selected="true" data-aw-tab="en">English</button>
            <button type="button" role="tab" aria-selected="false" data-aw-tab="es">Espa&ntilde;ol</button>
            <button type="button" role="tab" aria-selected="false" data-aw-tab="hy">&#1344;&#1377;&#1397;&#1381;&#1408;&#1381;&#1398;</button>
          </div>
          <div class="aw-panel is-active" data-aw-panel="en">
            <p>English resources</p>
            <a href="new-patient.html"><span><strong>New patient guide</strong><small>First-visit steps and preparation</small></span><b>&rarr;</b></a>
            <a href="visit-planner.html"><span><strong>Visit planner</strong><small>Build a temporary, non-identifying checklist</small></span><b>&rarr;</b></a>
            <a href="patient-resources.html"><span><strong>Patient resources</strong><small>Clinic, health, and community information</small></span><b>&rarr;</b></a>
          </div>
          <div class="aw-panel" data-aw-panel="es">
            <p>Recursos en espa&ntilde;ol</p>
            <a href="es-nuevo-paciente.html"><span><strong>Gu&iacute;a para pacientes nuevos</strong><small>Pasos para prepararse para su primera visita</small></span><b>&rarr;</b></a>
            <a href="es-citas.html"><span><strong>Citas</strong><small>Informaci&oacute;n para planificar su visita</small></span><b>&rarr;</b></a>
            <a href="es-recursos.html"><span><strong>Recursos</strong><small>Informaci&oacute;n para pacientes y familias</small></span><b>&rarr;</b></a>
          </div>
          <div class="aw-panel" data-aw-panel="hy">
            <p>&#1344;&#1377;&#1397;&#1381;&#1408;&#1381;&#1398; &#1398;&#1397;&#1400;&#1410;&#1385;&#1381;&#1408;</p>
            <a href="hy-new-patient.html"><span><strong>&#1350;&#1400;&#1408; &#1402;&#1377;&#1409;&#1387;&#1381;&#1398;&#1407;&#1398;&#1381;&#1408;&#1387; &#1400;&#1410;&#1394;&#1381;&#1409;&#1400;&#1410;&#1397;&#1409;</strong><small>&#1329;&#1404;&#1377;&#1403;&#1387;&#1398; &#1377;&#1397;&#1409;&#1387;&#1398; &#1402;&#1377;&#1407;&#1408;&#1377;&#1405;&#1407;&#1406;&#1381;&#1388;&#1400;&#1410; &#1412;&#1377;&#1397;&#1388;&#1381;&#1408;</small></span><b>&rarr;</b></a>
            <a href="hy-appointments.html"><span><strong>&#1329;&#1397;&#1409;&#1381;&#1388;&#1400;&#1410;&#1385;&#1397;&#1400;&#1410;&#1398;&#1398;&#1381;&#1408;</strong><small>&#1329;&#1397;&#1409;&#1384; &#1402;&#1388;&#1377;&#1398;&#1377;&#1406;&#1400;&#1408;&#1381;&#1388;&#1400;&#1410; &#1407;&#1381;&#1394;&#1381;&#1391;&#1400;&#1410;&#1385;&#1397;&#1400;&#1410;&#1398;</small></span><b>&rarr;</b></a>
            <a href="hy-resources.html"><span><strong>&#1356;&#1381;&#1405;&#1400;&#1410;&#1408;&#1405;&#1398;&#1381;&#1408;</strong><small>&#1354;&#1377;&#1409;&#1387;&#1381;&#1398;&#1407;&#1398;&#1381;&#1408;&#1387; &#1415; &#1384;&#1398;&#1407;&#1377;&#1398;&#1387;&#1412;&#1398;&#1381;&#1408;&#1387; &#1392;&#1377;&#1396;&#1377;&#1408;</small></span><b>&rarr;</b></a>
          </div>
          <p class="aw-language-help">Need every form in one place? <a href="patient-forms.html">Open Patient Forms.</a> For an interpreter or accessible format, <a href="tel:18186744414">call the clinic.</a></p>
        </div>
      </section>

      <section class="aw-visit" id="visit" aria-labelledby="aw-visit-title">
        <div class="aw-visit-map"><iframe title="Google Map showing Canby Community Clinic" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=7601+Canby+Ave+%236B,+Reseda,+CA+91335&output=embed"></iframe></div>
        <div class="aw-visit-copy aw-reveal">
          <p>05 / Visit Canby</p>
          <h2 id="aw-visit-title">Real care,<br>right now.</h2>
          <address>7601 Canby Ave #6B<br>Reseda, CA 91335</address>
          <div class="aw-visit-facts"><span><small>Google-listed hours</small><strong>Mon-Fri / 9 AM-5 PM<br>Closed weekends</strong></span><span><small>Phone</small><strong>(818) 674-4414</strong></span></div>
          <div class="aw-visit-links"><a href="tel:18186744414">Call clinic &nearr;</a><a href="https://www.google.com/maps/place/Pura+Vida+Community+Clinic/@34.208699,-118.534985,17z" rel="noopener">Google directions &nearr;</a><a href="contact.html">Request contact &rarr;</a></div>
        </div>
      </section>

      <section class="aw-community" id="community" aria-labelledby="aw-community-title">
        <figure><img src="assets/images/canby-community-outreach.webp" alt="Canby clinicians and volunteers supporting neighbors at a community health outreach" loading="lazy"></figure>
        <div class="aw-community-copy aw-reveal">
          <p>06 / Community care</p>
          <h2 id="aw-community-title">Care that moves<br>with our community.</h2>
          <div><span>Patients</span><span>Families</span><span>Neighbors</span></div>
          <nav aria-label="Community links"><a href="about.html">Our mission &rarr;</a><a href="volunteer.html">Volunteer &rarr;</a><a href="donate.html">Donate &rarr;</a></nav>
        </div>
      </section>

      <section class="aw-privacy" aria-labelledby="aw-privacy-title">
        <p>Privacy / Accessibility / Trust</p>
        <h2 id="aw-privacy-title">Your health information deserves careful handling.</h2>
        <div><p>Do not send medical details through ordinary email or general website forms. Use a clinic-approved secure channel or call for guidance.</p><nav><a href="notice-of-privacy-practices.html">Privacy practices</a><a href="privacy.html">Website privacy</a><a href="nondiscrimination.html">Nondiscrimination</a><a href="accessibility.html">Accessibility</a></nav></div>
      </section>
    </div>`;

  document.body.classList.add('aw-home-active');

  const tabs = [...document.querySelectorAll('[data-aw-tab]')];
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    const key = tab.dataset.awTab;
    tabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    document.querySelectorAll('[data-aw-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.awPanel === key));
  }));

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal = document.querySelectorAll('.aw-reveal');
  if (!reduced && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveal.forEach((item) => revealObserver.observe(item));
  } else {
    reveal.forEach((item) => item.classList.add('is-visible'));
  }

  const railLinks = [...document.querySelectorAll('.aw-rail a')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      railLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
    }), { rootMargin: '-35% 0px -58% 0px' });
    railLinks.map((link) => document.querySelector(link.hash)).filter(Boolean).forEach((section) => sectionObserver.observe(section));
  }

  if (!reduced) {
    let scheduled = false;
    const updateMotion = () => {
      scheduled = false;
      document.querySelectorAll('.aw-motion-scene, .aw-community').forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / Math.max(1, innerHeight + rect.height)));
        scene.style.setProperty('--aw-scene-progress', progress.toFixed(4));
      });
    };
    addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(updateMotion);
    }, { passive: true });
    updateMotion();
  }
})();
