(() => {
  const page = location.pathname.split('/').pop() || 'index.html';
  const main = document.querySelector('main');
  const clinic = {
    phone: '(818) 674-4414',
    phoneHref: 'tel:18186744414',
    address: '7601 Canby Ave #6B, Reseda, CA 91335',
    map: 'https://www.google.com/maps/place/Pura+Vida+Community+Clinic/@34.208699,-118.534985,17z',
    email: 'info@puravidacc.org',
  };

  const routes = {
    'new-patient.html': {
      kicker: 'New patient path',
      title: 'Your first visit at Canby.',
      copy: 'What to bring, how to prepare, and how to reach the clinic before you arrive.',
      primary: ['Patient forms', 'patient-forms.html'],
      secondary: ['Call the clinic', clinic.phoneHref],
      cards: [
        ['01', 'Prepare your basics', 'Bring identification if available, insurance information, current medications, allergies, and recent records.'],
        ['02', 'Confirm before arriving', 'Call to confirm availability, language support, current accepted plans, and what forms are needed.'],
        ['03', 'Use the secure path', 'Do not send medical details through general website forms or ordinary email. Ask for the approved channel.'],
        ['04', 'Plan your visit', 'Use the visit planner to build a simple checklist that stays on your device only.'],
      ],
      image: 'images/v4-appointments-wide.webp',
    },
    'services.html': {
      kicker: 'Clinic services',
      title: 'Care at Canby Community Clinic.',
      copy: 'Learn about primary care, prevention, medication preparation, referrals, and patient education. Call to confirm current services and availability.',
      primary: ['Request contact', 'contact.html'],
      secondary: ['New patient guide', 'new-patient.html'],
      cards: [
        ['01', 'Primary care', 'Visit guidance, follow-up planning, preventive care conversations, and patient education.'],
        ['02', 'Blood pressure and diabetes support', 'Plain-language education and preparation tools for common chronic health questions.'],
        ['03', 'Medication support', 'A safer medication list workflow to bring to your visit and discuss with clinic staff.'],
        ['04', 'Testing and referral guidance', 'Help understanding next steps when outside labs, imaging, or specialists may be needed.'],
      ],
      image: 'images/v4-services-wide.webp',
    },
    'patient-resources.html': {
      kicker: 'Patient resources',
      title: 'Prepare for your appointment.',
      copy: 'Trusted visit preparation, learning tools, local support categories, and privacy-first guidance.',
      primary: ['Open visit planner', 'visit-planner.html'],
      secondary: ['Health library', 'health-library.html'],
      cards: [
        ['01', 'Visit planner', 'Build a simple checklist before calling or arriving.'],
        ['02', 'Health library', 'Learn about prevention, blood pressure, diabetes, medications, and safety.'],
        ['03', 'Language access', 'Find Spanish and Armenian entry points, and call for interpreter support.'],
        ['04', 'Community resources', 'Browse local support categories for families and neighbors.'],
      ],
      image: 'images/v4-resources-wide.webp',
    },
    'community-resources-directory.html': {
      kicker: 'Community resources',
      title: 'Community resources for patients and families.',
      copy: 'Find local support categories and guidance for reaching the right resource.',
      primary: ['Call for guidance', clinic.phoneHref],
      secondary: ['Volunteer', 'volunteer.html'],
      cards: [
        ['01', 'Food and essentials', 'Prepare questions about food access, household basics, and local family support.'],
        ['02', 'Transportation', 'Plan how to get to the clinic and ask about available local options.'],
        ['03', 'Family support', 'Explore education, language access, and community navigation resources.'],
        ['04', 'Safety and follow-up', 'Know when to call the clinic, when to use urgent care, and when to call 911.'],
      ],
      image: 'images/v4-community-research-brief.webp',
    },
    'volunteer.html': {
      kicker: 'Volunteer',
      title: 'Volunteer with Canby.',
      copy: 'Volunteer support can help outreach, education, events, patient navigation, translation, and day-to-day community connection.',
      primary: ['Ask about volunteering', 'contact.html'],
      secondary: ['Support with a donation', 'donate.html'],
      cards: [
        ['01', 'Community outreach', 'Help connect neighbors with clinic information and local resources.'],
        ['02', 'Language support', 'Ask about opportunities to support multilingual education and access.'],
        ['03', 'Events and education', 'Support health education moments that meet people where they are.'],
        ['04', 'Operations support', 'Help with practical non-clinical support after clinic approval and onboarding.'],
      ],
      image: 'images/v4-volunteer-wide.webp',
    },
    'appointments.html': {
      kicker: 'Appointments',
      title: 'Appointments at Canby.',
      copy: 'Call the clinic to confirm availability and receive current guidance. Website requests are non-urgent and not monitored continuously.',
      primary: ['Call now', clinic.phoneHref],
      secondary: ['Request contact', 'contact.html'],
      cards: [
        ['01', 'Call first', 'The phone line is the fastest way to confirm services and appointment availability.'],
        ['02', 'Prepare information', 'Have your name, callback number, preferred language, and basic reason for calling ready.'],
        ['03', 'Keep medical details private', 'Use only approved secure channels for sensitive health information.'],
        ['04', 'Know urgent signs', 'For emergencies, call 911 instead of using the website.'],
      ],
      image: 'images/v4-appointments-wide.webp',
    },
  };

  function initShell() {
    document.body.classList.add('pv-page-boost');
    document.querySelectorAll('.brand-logo').forEach((img) => {
      img.src = 'assets/images/canby-community-clinic-logo-transparent.png';
    });
    document.querySelectorAll('.brand small').forEach((item) => {
      if (item.textContent.toLowerCase().includes('resource hub')) item.textContent = 'Community care in Reseda';
    });
    document.querySelectorAll('.eyebrow').forEach((item) => {
      if (item.textContent.trim() === 'Canby Clinic V45') item.textContent = 'Canby Community Clinic';
    });
    const desktop = document.querySelector('.nav-links');
    if (desktop) {
      const links = [
        ['index.html', 'Home'],
        ['new-patient.html', 'Patients'],
        ['services.html', 'Services'],
        ['patient-forms.html', 'Forms'],
        ['donate.html', 'Donate'],
        ['contact.html', 'Contact'],
      ];
      desktop.innerHTML = links.map(([href, label]) => `<a href="${href}"${href === page ? ' class="active"' : ''}>${label}</a>`).join('');
    }
    const portal = document.querySelector('.portal-cta');
    if (portal) portal.textContent = 'Portal';
  }

  function renderHeroPage(config) {
    if (!main) return;
    document.title = `${config.title.replace(/\.$/, '')} | Canby Community Clinic`;
    main.innerHTML = `
      <section class="pv-kinetic-hero">
        <div>
          <span class="pv-hero-kicker">${config.kicker}</span>
          <h1>${headline(config.title)}</h1>
          <p class="pv-hero-copy">${config.copy}</p>
          <div class="pv-hero-actions">
            <a class="pv-pill primary" href="${config.primary[1]}">${config.primary[0]}</a>
            <a class="pv-pill accent" href="${config.secondary[1]}">${config.secondary[0]}</a>
            <a class="pv-pill" href="${clinic.map}" target="_blank" rel="noopener noreferrer">Directions</a>
          </div>
        </div>
        <aside class="pv-hero-dashboard" aria-label="Canby quick actions">
          <div class="pv-dashboard-grid">
            <a href="${clinic.phoneHref}"><strong>Call clinic</strong><small>${clinic.phone}<br>Mon-Fri, 9 AM-5 PM</small></a>
            <a href="patient-portal.html"><strong>Patient portal</strong><small>Login, sign up, or recover access</small></a>
            <a href="patient-forms.html"><strong>Forms</strong><small>English, Spanish, and Armenian paths</small></a>
            <a href="contact.html"><strong>Contact request</strong><small>Non-urgent callback request</small></a>
          </div>
          <div class="pv-dashboard-note"><strong>${clinic.address}</strong><small>For urgent medical needs, call 911. Do not send symptoms or private health information through ordinary website forms.</small></div>
        </aside>
      </section>
      <section class="pv-section">
        <div class="pv-section-head pv-fade-up">
          <div><span class="pv-mini-label">What you can do here</span><h2>Choose the information you need.</h2></div>
          <p>Review the options below, or call the clinic if you are unsure where to begin.</p>
        </div>
        <div class="pv-card-grid">
          ${config.cards.map((card) => actionCard(card)).join('')}
        </div>
      </section>
      <section class="pv-section tint">
        <div class="pv-section-head pv-fade-up">
          <div><span class="pv-mini-label">Clinic contact</span><h2>Address, phone, and hours.</h2></div>
          <p>Canby Community Clinic<br>${clinic.address}<br><a href="${clinic.phoneHref}">${clinic.phone}</a><br><a href="mailto:${clinic.email}">${clinic.email}</a></p>
        </div>
        <div class="pv-action-row pv-fade-up">
          <a class="pv-pill primary" href="${clinic.phoneHref}">Call clinic</a>
          <a class="pv-pill accent" href="${clinic.map}" target="_blank" rel="noopener noreferrer">Open Google Maps</a>
          <a class="pv-pill" href="notice-of-privacy-practices.html">Privacy practices</a>
          <a class="pv-pill" href="accessibility.html">Accessibility</a>
        </div>
      </section>`;
  }

  function headline(text) {
    const words = text.replace(/\.$/, '').split(' ');
    const pivot = Math.max(2, Math.ceil(words.length / 2));
    return `<span>${words.slice(0, pivot).join(' ')}</span><span><em>${words.slice(pivot).join(' ')}</em></span>`;
  }

  function actionCard([number, title, copy]) {
    return `<article class="pv-action-card pv-fade-up"><span class="pv-number">${number}</span><div><h3>${title}</h3><p>${copy}</p></div></article>`;
  }

  function renderDonate(kind) {
    if (!main) return;
    document.title = kind === 'options' ? 'Donation Options | Canby Community Clinic' : 'Donate | Canby Community Clinic';
    main.innerHTML = `
      <section class="pv-section dark">
        <div class="pv-donation-layout">
          <div class="pv-impact-panel pv-fade-up">
            <span class="pv-mini-label">Community support</span>
            <h1>Support community care in Reseda.</h1>
            <p>Gifts to Canby Community Clinic can support patient education, neighborhood outreach, language access, and the day-to-day work that helps patients reach care.</p>
            <div class="pv-soon"><strong>Online giving is not open yet.</strong><br>To ask about donations, in-kind support, or other ways to help, contact the clinic directly.</div>
            <div class="pv-action-row">
              <a class="pv-pill accent" href="contact.html">Talk to the clinic</a>
              <a class="pv-pill" href="volunteer.html">Volunteer</a>
            </div>
          </div>
          <div class="pv-donation-stack">
            ${[
              ['01', 'Patient preparation', 'Printed instructions, multilingual support materials, and clearer forms before visits.'],
              ['02', 'Community outreach', 'Neighborhood education, events, and resource navigation for families.'],
              ['03', 'Clinic operations', 'Practical support that keeps communication, supplies, and patient pathways moving.'],
              ['04', 'Access and trust', 'Practical tools that reduce confusion and connect patients with clinic staff.'],
            ].map((card) => `<article class="pv-donation-card pv-fade-up"><span class="pv-number">${card[0]}</span><div><h3>${card[1]}</h3><p>${card[2]}</p></div></article>`).join('')}
          </div>
        </div>
      </section>
      <section class="pv-section tint">
        <div class="pv-section-head pv-fade-up">
          <div><span class="pv-mini-label">Donation questions</span><h2>Tell us how you would like to help.</h2></div>
          <p>This non-urgent contact form does not collect card or bank information. Please do not include medical information.</p>
        </div>
        <form class="pv-form-mini pv-fade-up" id="pvDonationInterest">
          <input name="name" autocomplete="name" placeholder="Your name" required>
          <input name="email" type="email" autocomplete="email" placeholder="Email address" required>
          <select name="interest" required>
            <option value="">How would you like to help?</option>
            <option>One-time donation when payments open</option>
            <option>Monthly giving when payments open</option>
            <option>In-kind support</option>
            <option>Volunteer and donation conversation</option>
          </select>
          <textarea name="note" placeholder="Optional note. Please do not include medical information."></textarea>
          <button type="submit">Send donation interest</button>
          <p class="un-form-status" role="status"></p>
        </form>
      </section>`;
    bindDonationForm();
  }

  function bindDonationForm() {
    const form = document.querySelector('#pvDonationInterest');
    if (!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = form.querySelector('.un-form-status');
      status.textContent = 'Sending through the clinic contact path...';
      const data = Object.fromEntries(new FormData(form));
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: data.name,
            lastName: 'Donation interest',
            email: data.email,
            phone: '',
            preferredContact: 'email',
            requestType: 'donation',
            consent: true,
          }),
        });
        if (!response.ok) throw new Error('The secure request service is not connected in this preview.');
        form.reset();
        status.textContent = 'Thank you. The clinic will follow up by email.';
        status.className = 'un-form-status is-success';
      } catch (error) {
        status.textContent = `${error.message} Please call ${clinic.phone}.`;
        status.className = 'un-form-status is-error';
      }
    });
  }

  function revealMotion() {
    const items = document.querySelectorAll('.pv-fade-up');
    if (!items.length) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .13, rootMargin: '0px 0px -8% 0px' });
    items.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 5 * 70, 280)}ms`;
      observer.observe(item);
    });
  }

  initShell();
  if (routes[page]) renderHeroPage(routes[page]);
  if (page === 'donate.html') renderDonate('main');
  if (page === 'donation-options.html') renderDonate('options');
  revealMotion();
})();
