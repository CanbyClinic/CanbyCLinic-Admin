(() => {
  const page = location.pathname.split('/').pop() || 'index.html';
  const main = document.querySelector('main');
  const clinic = {
    phone: '(818) 674-4414',
    phoneHref: 'tel:18186744414',
    address: '7601 Canby Ave #6B, Reseda, CA 91335',
    email: 'info@puravidacc.org',
    map: 'https://www.google.com/maps/place/Pura+Vida+Community+Clinic/@34.208699,-118.534985,17z',
    mapEmbed: 'https://www.google.com/maps?q=7601+Canby+Ave+%236B,+Reseda,+CA+91335&output=embed',
  };

  const pageData = {
    'new-patient.html': {
      kicker: 'New patients',
      title: 'Start care with a clear plan.',
      copy: 'A calm first step for forms, visit preparation, language support, and the fastest way to reach the clinic.',
      primary: ['Open patient forms', 'patient-forms.html'],
      secondary: ['Call clinic', clinic.phoneHref],
      image: 'images/v4-appointments-wide.webp',
      items: [
        ['01', 'Before you call', 'Have your name, callback number, preferred language, and basic visit question ready.'],
        ['02', 'Before you arrive', 'Bring identification if available, insurance information, medication bottles or list, and recent records.'],
        ['03', 'Privacy first', 'Do not send symptoms, diagnoses, insurance cards, or identification through ordinary email or general website forms.'],
        ['04', 'Need help?', `Call ${clinic.phone} for the current secure submission route and clinic availability.`],
      ],
    },
    'services.html': {
      kicker: 'Care',
      title: 'Primary care, made easier to navigate.',
      copy: 'Clear service pathways for prevention, chronic-condition education, medication preparation, testing guidance, and community support.',
      primary: ['Request contact', 'contact.html'],
      secondary: ['Plan a visit', 'visit-planner.html'],
      image: 'images/v4-services-wide.webp',
      items: [
        ['01', 'Primary care', 'Visit preparation, follow-up questions, and prevention conversations.'],
        ['02', 'Prevention', 'Screenings, risk conversations, and plain-language education.'],
        ['03', 'Medication support', 'Build a medication list to discuss with your care team.'],
        ['04', 'Referrals', 'Prepare for next steps involving labs, imaging, specialists, or community resources.'],
      ],
    },
    'volunteer.html': {
      kicker: 'Volunteer',
      title: 'Help neighbors reach care sooner.',
      copy: 'Support outreach, language access, events, education, and practical clinic work after onboarding and approval.',
      primary: ['Ask about volunteering', 'contact.html'],
      secondary: ['Donate', 'donate.html'],
      image: 'images/v4-volunteer-wide.webp',
      items: [
        ['01', 'Outreach', 'Help connect neighbors with reliable clinic information and local resources.'],
        ['02', 'Language', 'Support multilingual access and patient-friendly communication.'],
        ['03', 'Education', 'Help with community health education and practical patient materials.'],
        ['04', 'Operations', 'Support non-clinical work that makes the clinic easier to access.'],
      ],
    },
    'community-resources-directory.html': {
      kicker: 'Community resources',
      title: 'Find support without getting lost.',
      copy: 'A simpler doorway to local resource categories and clinic-adjacent support for patients and families.',
      primary: ['Call for guidance', clinic.phoneHref],
      secondary: ['Patient resources', 'patient-resources.html'],
      image: 'images/v4-resources-wide.webp',
      items: [
        ['01', 'Food and essentials', 'Prepare questions about basic needs and local support options.'],
        ['02', 'Transportation', 'Plan the visit and ask about nearby ways to get to care.'],
        ['03', 'Family support', 'Look for language access, education, and help navigating next steps.'],
        ['04', 'Urgent concerns', 'Use 911 for emergencies. Call the clinic for non-emergency guidance.'],
      ],
    },
    'patient-resources.html': {
      kicker: 'Resources',
      title: 'Answers before the appointment.',
      copy: 'Patient education, preparation tools, privacy guidance, and clinic contact information in one place.',
      primary: ['Visit planner', 'visit-planner.html'],
      secondary: ['Health library', 'health-library.html'],
      image: 'images/v4-journal-wide.webp',
      items: [
        ['01', 'Visit planner', 'Build a simple checklist before you call or arrive.'],
        ['02', 'Health library', 'Learn about blood pressure, diabetes, prevention, and medication safety.'],
        ['03', 'Forms', 'Find patient form paths in English, Spanish, and Armenian.'],
        ['04', 'Contact', 'Use phone, directions, and non-urgent callback requests.'],
      ],
    },
    'appointments.html': {
      kicker: 'Appointments',
      title: 'Reach the right next step.',
      copy: 'Call first for current appointment availability and clinic instructions. Website requests are not for urgent needs.',
      primary: ['Call now', clinic.phoneHref],
      secondary: ['Request contact', 'contact.html'],
      image: 'images/v4-appointments-wide.webp',
      items: [
        ['01', 'Fastest path', `Call ${clinic.phone} during posted hours.`],
        ['02', 'What to have ready', 'Name, callback number, preferred language, and basic reason for calling.'],
        ['03', 'Forms', 'Ask which forms are needed and how the clinic wants them submitted.'],
        ['04', 'Emergency', 'Call 911 for urgent or life-threatening symptoms.'],
      ],
    },
  };

  function shell() {
    document.body.classList.add('pv70');
    document.querySelectorAll('.brand-logo').forEach((img) => {
      img.src = 'assets/images/canby-community-clinic-logo-transparent.png';
    });
    document.querySelectorAll('.brand small').forEach((item) => {
      item.textContent = 'Community care in Reseda';
    });
    const desktop = document.querySelector('.nav-links');
    if (desktop) {
      const links = [
        ['index.html', 'Home'],
        ['services.html', 'Care'],
        ['new-patient.html', 'Patients'],
        ['patient-forms.html', 'Forms'],
        ['donate.html', 'Donate'],
        ['contact.html', 'Contact'],
      ];
      desktop.innerHTML = links.map(([href, label]) => `<a href="${href}"${active(href)}>${label}</a>`).join('');
    }
    const mobile = document.querySelector('.mobile-panel');
    if (mobile) {
      mobile.innerHTML = [
        ['index.html', 'Home'],
        ['services.html', 'Care'],
        ['new-patient.html', 'Patients'],
        ['patient-forms.html', 'Forms'],
        ['donate.html', 'Donate'],
        ['patient-portal.html', 'Portal'],
        ['contact.html', 'Visit and contact'],
      ].map(([href, label]) => `<a href="${href}"${active(href)}><span>${label}</span><span aria-hidden="true">&rarr;</span></a>`).join('');
    }
    document.querySelectorAll('.eyebrow').forEach((el) => {
      if (/V45/i.test(el.textContent)) el.textContent = 'Canby Community Clinic';
    });
  }

  function active(href) {
    return href === page ? ' class="active"' : '';
  }

  function renderHome() {
    if (!main) return;
    document.title = 'Canby Community Clinic | Start Care Faster';
    main.innerHTML = `
      <div class="pv70-home">
        <section class="pv70-hero" id="start">
          <div class="pv70-shell pv70-hero-grid">
            <div class="pv70-reveal">
              <p class="pv70-kicker">Canby Community Clinic</p>
              <h1>Start care <span>faster.</span></h1>
              <p class="pv70-lead">Patient forms, portal access, directions, hours, and a real clinic phone number, placed where patients can actually use them.</p>
              <div class="pv70-actions">
                <a class="pv70-button primary" href="new-patient.html">New patient intake</a>
                <a class="pv70-button green" href="tel:18186744414">Call ${clinic.phone}</a>
                <a class="pv70-button" href="patient-portal.html">Portal</a>
              </div>
            </div>
            <aside class="pv70-command-card pv70-reveal" aria-label="Patient action hub">
              <div class="pv70-command-image" role="img" aria-label="Community clinic care team"></div>
              <nav class="pv70-command-list" aria-label="Start here">
                ${command('01', 'New Patient Intake', 'Prepare for your first visit', 'new-patient.html')}
                ${command('02', 'Patient Forms', 'English, Spanish, and Armenian paths', 'patient-forms.html')}
                ${command('03', 'Visit and Contact', clinic.address, 'contact.html')}
                ${command('04', 'Donate or Volunteer', 'Help your community show up stronger', 'donate.html')}
              </nav>
            </aside>
          </div>
        </section>

        <section class="pv70-section soft">
          <div class="pv70-shell">
            <div class="pv70-section-head pv70-reveal">
              <div><p class="pv70-kicker">Patient flow</p><h2>Simple steps. No portal maze.</h2></div>
              <p>Most visitors need one of four things: call, forms, directions, or a secure account path. The homepage now makes those actions obvious before the deeper content starts.</p>
            </div>
            <div class="pv70-grid">
              ${card('01', 'Call the clinic', 'The fastest way to confirm services, availability, forms, and language support.', clinic.phoneHref)}
              ${card('02', 'Prepare forms', 'Choose the right form path and avoid sending private information through unsafe channels.', 'patient-forms.html')}
              ${card('03', 'Find us', `${clinic.address}. Open maps or request non-urgent follow-up.`, 'contact.html')}
              ${card('04', 'Use portal', 'Sign in, sign up, or learn what needs to be connected for secure access.', 'patient-portal.html')}
            </div>
          </div>
        </section>

        <section class="pv70-section">
          <div class="pv70-shell pv70-split">
            <figure class="pv70-visual pv70-reveal"><img src="assets/images/canby-patient-journey-hero.webp" alt="Clinician welcoming a family at a community clinic" loading="lazy"></figure>
            <div class="pv70-reveal">
              <p class="pv70-kicker">Care that moves with our community</p>
              <h2>Health can feel scary sometimes.</h2>
              <p class="pv70-lead">The site should reduce stress, not add to it. Every section points to a practical next step and keeps medical privacy front and center.</p>
              <div class="pv70-list">
                <a href="services.html"><span>Care</span><strong>Services and support</strong><small>Primary care, prevention, medication support, and referrals.</small></a>
                <a href="health-library.html"><span>Learn</span><strong>Health library</strong><small>Plain-language patient education.</small></a>
                <a href="community-resources-directory.html"><span>Support</span><strong>Community resources</strong><small>Local categories for patients and families.</small></a>
              </div>
            </div>
          </div>
        </section>

        <section class="pv70-section dark">
          <div class="pv70-shell">
            <div class="pv70-section-head pv70-reveal">
              <div><p class="pv70-kicker">Give back</p><h2>Help your community.</h2></div>
              <p>Donations and volunteer time support outreach, education, patient preparation, and practical tools that make care easier to access.</p>
            </div>
            <div class="pv70-grid three">
              ${card('01', 'Donate', 'Stripe and banking will be connected later after clinic approval. The page is ready for that step.', 'donate.html')}
              ${card('02', 'Volunteer', 'Support outreach, events, language access, and patient-friendly education.', 'volunteer.html')}
              ${card('03', 'Community mission', 'Show patients why Canby exists and where support makes a difference.', 'about.html')}
            </div>
          </div>
        </section>

        <section class="pv70-section" id="forms">
          <div class="pv70-shell pv70-split">
            <div class="pv70-reveal">
              <p class="pv70-kicker">Forms and language access</p>
              <h2>Care in the language patients use.</h2>
              <p class="pv70-lead">English, Spanish, and Armenian entry points stay easy to find. The clinic can guide patients to the approved secure submission method.</p>
              <div class="pv70-actions">
                <a class="pv70-button primary" href="patient-forms.html">Open all forms</a>
                <a class="pv70-button" href="nondiscrimination.html">Language access</a>
              </div>
            </div>
            <div class="pv70-list pv70-reveal">
              <a href="new-patient.html"><span>EN</span><strong>English</strong><small>New patient guide, visit planner, and resources.</small></a>
              <a href="es-nuevo-paciente.html"><span>ES</span><strong>Español</strong><small>Guía para pacientes nuevos y recursos.</small></a>
              <a href="hy-new-patient.html"><span>HY</span><strong>Հայերեն</strong><small>Նոր պացիենտների ուղեցույց և ռեսուրսներ։</small></a>
            </div>
          </div>
        </section>

        <section class="pv70-footer-cta">
          <div class="pv70-shell pv70-section-head">
            <div><p class="pv70-kicker">Visit Canby</p><h2>Real care, right now.</h2></div>
            <p>${clinic.address}<br><a href="${clinic.phoneHref}">${clinic.phone}</a><br>Monday-Friday, 9 AM-5 PM</p>
          </div>
        </section>
      </div>`;
  }

  function command(num, title, copy, href) {
    return `<a href="${href}"><b>${num}</b><span><strong>${title}</strong><small>${copy}</small></span><span aria-hidden="true">&rarr;</span></a>`;
  }

  function card(num, title, copy, href) {
    return `<a class="pv70-card pv70-reveal" href="${href}"><span class="num">${num}</span><div><h3>${title}</h3><p>${copy}</p></div></a>`;
  }

  function renderStandard(data) {
    if (!main) return;
    document.title = `${data.title.replace(/\.$/, '')} | Canby Community Clinic`;
    main.innerHTML = `
      <div class="pv70-page">
        <section class="pv70-page-hero">
          <div class="pv70-shell">
            <p class="pv70-kicker">${data.kicker}</p>
            <h1>${splitTitle(data.title)}</h1>
            <p class="pv70-lead">${data.copy}</p>
            <div class="pv70-actions">
              <a class="pv70-button primary" href="${data.primary[1]}">${data.primary[0]}</a>
              <a class="pv70-button green" href="${data.secondary[1]}">${data.secondary[0]}</a>
              <a class="pv70-button" href="${clinic.map}" target="_blank" rel="noopener noreferrer">Directions</a>
            </div>
          </div>
        </section>
        <section class="pv70-page-main">
          <div class="pv70-shell pv70-split">
            <figure class="pv70-visual pv70-reveal"><img src="${data.image}" alt="" loading="lazy"></figure>
            <div class="pv70-list pv70-reveal">
              ${data.items.map(([num, title, copy]) => `<div><span>${num}</span><strong>${title}</strong><small>${copy}</small></div>`).join('')}
            </div>
          </div>
        </section>
        ${contactCta()}
      </div>`;
  }

  function splitTitle(title) {
    const clean = title.replace(/\.$/, '');
    const words = clean.split(' ');
    const pivot = Math.max(2, Math.ceil(words.length / 2));
    return `${words.slice(0, pivot).join(' ')} <span>${words.slice(pivot).join(' ')}</span>`;
  }

  function contactCta() {
    return `<section class="pv70-footer-cta"><div class="pv70-shell pv70-section-head"><div><p class="pv70-kicker">Clinic details</p><h2>Reach us faster.</h2></div><p>${clinic.address}<br><a href="${clinic.phoneHref}">${clinic.phone}</a><br>Monday-Friday, 9 AM-5 PM</p></div></section>`;
  }

  function renderDonate() {
    if (!main) return;
    document.title = 'Donate | Canby Community Clinic';
    main.innerHTML = `
      <section class="pv70-section dark">
        <div class="pv70-shell pv70-donate-layout">
          <div class="pv70-donate-main pv70-reveal">
            <p class="pv70-kicker">Donations</p>
            <h1>Help your community.</h1>
            <p>Your support helps Canby Community Clinic strengthen education, outreach, patient preparation, community navigation, and the practical tools that make care easier to access.</p>
            <div class="pv70-donate-note"><strong>Donation processing is not live yet.</strong><br>Stripe and bank connection will be added later after the clinic approves the nonprofit account, payment settings, receipts, privacy review, and banking setup.</div>
            <div class="pv70-actions">
              <a class="pv70-button green" href="contact.html">Ask about donating</a>
              <a class="pv70-button" href="volunteer.html">Volunteer</a>
            </div>
          </div>
          <div class="pv70-donate-form pv70-reveal">
            <p class="pv70-kicker">Donation interest</p>
            <form id="pvDonationInterest">
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
          </div>
        </div>
      </section>
      <section class="pv70-section soft">
        <div class="pv70-shell">
          <div class="pv70-section-head pv70-reveal">
            <div><p class="pv70-kicker">Impact</p><h2>Where support goes.</h2></div>
            <p>Donations help improve the patient experience and strengthen the nonprofit community mission.</p>
          </div>
          <div class="pv70-grid">
            ${card('01', 'Patient preparation', 'Printed instructions, multilingual support materials, and clearer forms before visits.', 'patient-forms.html')}
            ${card('02', 'Community outreach', 'Neighborhood education, events, and resource navigation for families.', 'community-resources-directory.html')}
            ${card('03', 'Clinic operations', 'Practical support that keeps communication, supplies, and patient pathways moving.', 'about.html')}
            ${card('04', 'Access and trust', 'Tools that reduce confusion and help patients reach real people faster.', 'contact.html')}
          </div>
        </div>
      </section>`;
    bindDonationForm();
  }

  function bindDonationForm() {
    const form = document.querySelector('#pvDonationInterest');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = form.querySelector('.un-form-status');
      status.textContent = `This preview cannot send donation interest yet. Please call ${clinic.phone}.`;
      status.className = 'un-form-status is-error';
    });
  }

  function renderContact() {
    if (!main) return;
    document.title = 'Visit and Contact | Canby Community Clinic';
    main.innerHTML = `
      <section class="pv70-page-hero">
        <div class="pv70-shell">
          <p class="pv70-kicker">Visit and contact</p>
          <h1>Reach the clinic <span>faster.</span></h1>
          <p class="pv70-lead">Call for the quickest help, open directions, or request a non-urgent callback without sharing medical details.</p>
        </div>
      </section>
      <section class="pv70-page-main">
        <div class="pv70-shell pv70-split">
          <figure class="pv70-visual pv70-reveal"><iframe title="Google map showing Canby Community Clinic in Reseda" src="${clinic.mapEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></figure>
          <div class="pv70-reveal">
            <div class="pv70-list">
              <a href="${clinic.phoneHref}"><span>Phone</span><strong>${clinic.phone}</strong><small>Fastest path for appointments and questions.</small></a>
              <a href="${clinic.map}" target="_blank" rel="noopener noreferrer"><span>Address</span><strong>${clinic.address}</strong><small>Open Google Maps for directions.</small></a>
              <div><span>Hours</span><strong>Monday-Friday</strong><small>9 AM-5 PM. Closed Saturday-Sunday.</small></div>
              <a href="mailto:${clinic.email}"><span>Email</span><strong>${clinic.email}</strong><small>Do not send medical details by ordinary email.</small></a>
            </div>
          </div>
        </div>
        <div class="pv70-shell" style="margin-top:52px">
          <div class="pv70-section-head pv70-reveal">
            <div><p class="pv70-kicker">Non-urgent callback</p><h2>Ask us to contact you.</h2></div>
            <p>Use this only for basic contact requests. Do not include symptoms, diagnoses, medication names, insurance numbers, ID numbers, or other medical details.</p>
          </div>
          <form class="pv70-contact-form pv70-reveal" id="pv70ContactForm">
            <input name="firstName" autocomplete="given-name" placeholder="First name" required maxlength="80">
            <input name="lastName" autocomplete="family-name" placeholder="Last name" required maxlength="80">
            <input name="email" type="email" autocomplete="email" placeholder="Email address" maxlength="160">
            <input name="phone" type="tel" autocomplete="tel" placeholder="Phone number" maxlength="30">
            <select name="preferredContact" required>
              <option value="">Preferred reply</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
            </select>
            <select name="requestType" required>
              <option value="">What can we help with?</option>
              <option value="appointment">Appointment request</option>
              <option value="forms">Forms or records guidance</option>
              <option value="language">Language or accessibility support</option>
              <option value="volunteer">Volunteering</option>
              <option value="donation">Donations</option>
              <option value="general">General clinic question</option>
            </select>
            <label style="display:grid;grid-template-columns:20px 1fr;gap:10px;align-items:start;font-weight:800"><input name="consent" type="checkbox" required style="min-height:auto;margin-top:4px"> I agree that the clinic may contact me using the phone number or email I provided. I understand this form is not for urgent or medical information.</label>
            <button type="submit">Send contact request</button>
            <p class="un-form-status" role="status" aria-live="polite"></p>
          </form>
        </div>
      </section>`;
    bindContactForm();
  }

  function bindContactForm() {
    const form = document.querySelector('#pv70ContactForm');
    if (!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = form.querySelector('.un-form-status');
      const data = Object.fromEntries(new FormData(form));
      if (data.preferredContact === 'email' && !data.email) {
        status.textContent = 'Enter an email address for an email reply.';
        status.className = 'un-form-status is-error';
        return;
      }
      if (data.preferredContact === 'phone' && !data.phone) {
        status.textContent = 'Enter a phone number for a phone reply.';
        status.className = 'un-form-status is-error';
        return;
      }
      status.textContent = 'This preview cannot send the request until clinic backend credentials are connected. Please call ' + clinic.phone + '.';
      status.className = 'un-form-status is-error';
    });
  }

  function reveal() {
    const items = document.querySelectorAll('.pv70-reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((item) => item.classList.add('in'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    items.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4 * 60, 180)}ms`;
      observer.observe(item);
    });
  }

  shell();
  if (page === 'index.html') renderHome();
  if (pageData[page]) renderStandard(pageData[page]);
  if (page === 'donate.html' || page === 'donation-options.html') renderDonate();
  if (page === 'contact.html') renderContact();
  reveal();
})();
