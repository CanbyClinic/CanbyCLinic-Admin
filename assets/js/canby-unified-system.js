(() => {
  const page = location.pathname.split('/').pop() || 'index.html';
  const main = document.querySelector('main');
  const footer = document.querySelector('.footer');
  const mapUrl = 'https://www.google.com/maps/place/Pura+Vida+Community+Clinic/@34.208699,-118.534985,17z';
  const mapEmbed = 'https://www.google.com/maps?q=7601+Canby+Ave+%236B,+Reseda,+CA+91335&output=embed';

  const clinic = {
    phone: '(818) 674-4414',
    phoneHref: 'tel:18186744414',
    address: '7601 Canby Ave #6B, Reseda, CA 91335',
    hours: 'Monday-Friday, 9 AM-5 PM',
  };

  function updateNavigation() {
    const links = [
      ['services.html', 'Care'],
      ['new-patient.html', 'New patients'],
      ['patient-forms.html', 'Patient forms'],
      ['contact.html', 'Visit & contact'],
    ];
    const desktop = document.querySelector('.nav-links');
    if (desktop) {
      desktop.innerHTML = links.map(([href, label]) => `<a href="${href}"${href === page ? ' class="active"' : ''}>${label}</a>`).join('');
    }
    const mobile = document.querySelector('.mobile-panel');
    if (mobile) {
      mobile.innerHTML = [
        ['index.html', 'Home'],
        ...links,
        ['health-library.html', 'Health library'],
        ['community-resources-directory.html', 'Community resources'],
        ['patient-portal.html', 'Patient portal'],
      ].map(([href, label]) => `<a href="${href}"${href === page ? ' class="active"' : ''}><span>${label}</span><span aria-hidden="true">&rarr;</span></a>`).join('');
    }
    document.querySelectorAll('.palette-dock').forEach((item) => item.remove());
    document.querySelectorAll('.mobile-quick a').forEach((link) => {
      if (link.textContent.trim() === 'Forms') link.href = 'patient-forms.html';
    });
    document.querySelectorAll('.footer [href="new-patient.html"]').forEach((link) => {
      if (link.nextElementSibling?.getAttribute('href') !== 'patient-forms.html') {
        link.insertAdjacentHTML('afterend', '<a href="patient-forms.html">Patient forms</a>');
      }
    });
  }

  function addContactStrip() {
    if (document.querySelector('.un-contact-strip')) return;
    const header = document.querySelector('.site-header');
    if (!header) return;
    header.insertAdjacentHTML('afterend', `
      <aside class="un-contact-strip" aria-label="Clinic contact information">
        <a href="${clinic.phoneHref}">Call ${clinic.phone}</a>
        <a href="${mapUrl}" target="_blank" rel="noopener noreferrer">${clinic.address}</a>
        <span>${clinic.hours} / Closed weekends</span>
      </aside>`);
  }

  function locationRibbon() {
    if (!footer || document.querySelector('.un-location-ribbon')) return;
    footer.insertAdjacentHTML('beforebegin', `
      <section class="un-location-ribbon" aria-label="Clinic location and hours">
        <p>Canby Community Clinic</p>
        <div><small>Visit</small><strong>${clinic.address}</strong></div>
        <div><small>Call and hours</small><strong><a href="${clinic.phoneHref}">${clinic.phone}</a><br>${clinic.hours}</strong></div>
        <a href="${mapUrl}" target="_blank" rel="noopener noreferrer">Open Google Maps &rarr;</a>
      </section>`);
  }

  function renderContact() {
    if (page !== 'contact.html' || !main) return;
    document.title = 'Contact and Directions | Canby Community Clinic';
    main.innerHTML = `
      <div class="un-contact-page">
        <section class="un-page-hero">
          <span class="eyebrow">Visit and contact</span>
          <h1>Reach the clinic faster.</h1>
          <p class="lead">Call for the quickest help, request a non-urgent callback, or open verified directions to the Reseda clinic.</p>
        </section>
        <section class="un-contact-layout">
          <div class="un-contact-summary">
            <span class="eyebrow">Canby Community Clinic</span>
            <h2>A real person is one step away.</h2>
            <div class="un-contact-facts">
              <div><small>Phone</small><strong><a href="${clinic.phoneHref}">${clinic.phone}</a></strong></div>
              <div><small>Address</small><strong><a href="${mapUrl}" target="_blank" rel="noopener noreferrer">${clinic.address}</a></strong></div>
              <div><small>Hours</small><strong>Monday-Friday<br>9 AM-5 PM<br>Closed Saturday-Sunday</strong></div>
              <div><small>Email</small><strong><a href="mailto:info@puravidacc.org">info@puravidacc.org</a></strong></div>
            </div>
          </div>
          <div class="un-form-shell">
            <span class="eyebrow">Non-urgent request</span>
            <h2>Ask us to contact you.</h2>
            <p>Share only basic contact information. Do not include symptoms, diagnoses, medications, insurance numbers, or other medical details.</p>
            <form id="unContactForm" class="un-form-grid">
              <div class="un-field"><label for="contactFirst">First name</label><input id="contactFirst" name="firstName" autocomplete="given-name" required maxlength="80"></div>
              <div class="un-field"><label for="contactLast">Last name</label><input id="contactLast" name="lastName" autocomplete="family-name" required maxlength="80"></div>
              <div class="un-field"><label for="contactEmail">Email</label><input id="contactEmail" name="email" type="email" autocomplete="email" maxlength="160"></div>
              <div class="un-field"><label for="contactPhone">Phone</label><input id="contactPhone" name="phone" type="tel" autocomplete="tel" maxlength="30"></div>
              <div class="un-field"><label for="contactMethod">Preferred reply</label><select id="contactMethod" name="preferredContact" required><option value="">Choose one</option><option value="phone">Phone</option><option value="email">Email</option></select></div>
              <div class="un-field"><label for="contactType">What can we help with?</label><select id="contactType" name="requestType" required><option value="">Choose one</option><option value="appointment">Appointment request</option><option value="forms">Forms or records guidance</option><option value="language">Language or accessibility support</option><option value="volunteer">Volunteering</option><option value="donation">Donations</option><option value="general">General clinic question</option></select></div>
              <div class="un-check"><input id="contactConsent" name="consent" type="checkbox" required><label for="contactConsent">I agree that the clinic may contact me using the phone number or email I provided. I understand this form is not for urgent or medical information.</label></div>
              <button class="un-form-submit un-field--full" type="submit">Send contact request</button>
              <p class="un-form-status" role="status" aria-live="polite"></p>
            </form>
            <p class="un-privacy-note"><strong>Emergency or urgent concern?</strong> Call 911 for an emergency. For time-sensitive clinic help, call ${clinic.phone}. Website requests are not monitored continuously.</p>
          </div>
        </section>
        <div class="un-map"><iframe title="Google map showing Canby Community Clinic in Reseda" src="${mapEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
      </div>`;
    bindContactForm();
  }

  function bindContactForm() {
    const form = document.querySelector('#unContactForm');
    if (!form) return;
    const status = form.querySelector('.un-form-status');
    const submit = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      status.className = 'un-form-status';
      if (data.preferredContact === 'email' && !data.email) {
        status.textContent = 'Enter an email address for an email reply.';
        status.classList.add('is-error');
        return;
      }
      if (data.preferredContact === 'phone' && !data.phone) {
        status.textContent = 'Enter a phone number for a phone reply.';
        status.classList.add('is-error');
        return;
      }
      submit.disabled = true;
      status.textContent = 'Sending your request...';
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || 'The request could not be sent.');
        form.reset();
        status.textContent = 'Your request was received. The clinic will use your preferred contact method to follow up.';
        status.classList.add('is-success');
      } catch (error) {
        status.textContent = `${error.message || 'The request could not be sent.'} Please call ${clinic.phone}.`;
        status.classList.add('is-error');
      } finally {
        submit.disabled = false;
      }
    });
  }

  function renderPatientForms() {
    if (page !== 'patient-forms.html' || !main) return;
    document.title = 'Patient Forms | Canby Community Clinic';
    main.innerHTML = `
      <div class="un-forms-page">
        <section class="un-page-hero">
          <span class="eyebrow">Patient forms</span>
          <h1>Prepare before your visit.</h1>
          <p class="lead">Choose your language, review the available forms, and call the clinic if you are unsure which document you need.</p>
        </section>
        <section class="un-resource-layout">
          <div class="un-resource-intro"><h2>Forms should make care easier.</h2><p>Only submit health information through a clinic-approved secure channel. Public downloads are provided for preparation; availability and submission instructions should be confirmed by phone.</p></div>
          <div class="un-resource-groups">
            ${formGroup('01', 'English', 'New patient preparation, consent guidance, and records request information.', 'new-patient.html')}
            ${formGroup('02', 'Espanol', 'Preparacion para pacientes nuevos, orientacion sobre consentimiento e informacion sobre expedientes.', 'es-nuevo-paciente.html')}
            ${formGroup('03', 'Hayeren', 'Nor patientneri patrastum, hamadzaynutyan u bzhshkakan grarumneri uxecuyc.', 'hy-new-patient.html')}
          </div>
          <div class="un-forms-callout"><strong>Need a form sent another way?</strong><span>Call <a href="${clinic.phoneHref}">${clinic.phone}</a> or request a non-urgent callback.</span><a href="contact.html">Request contact &rarr;</a></div>
        </section>
      </div>`;
  }

  function formGroup(index, title, copy, href) {
    return `<article class="un-resource-group"><span>${index} / Language</span><h3>${title}</h3><p>${copy}</p><a href="${href}">Open patient guide &rarr;</a><a href="visit-planner.html">Build a visit checklist &rarr;</a><a href="contact.html">Ask the clinic &rarr;</a></article>`;
  }

  function portalMarkup() {
    return `
      <div class="un-portal-page">
        <section class="un-page-hero">
          <span class="eyebrow">Secure patient access</span>
          <h1>Your portal. Your next step.</h1>
          <p class="lead">Create an account, verify your email, or return to a protected session. Never share your password with anyone.</p>
        </section>
        <section class="un-portal-wrap">
          <aside class="un-portal-aside">
            <span class="eyebrow">Patient privacy</span>
            <h2>Designed to keep access private.</h2>
            <p>The portal uses server-managed sessions and does not store login tokens in browser storage. Clinical records must only be enabled after the clinic completes its compliance review and connects approved systems.</p>
            <ul class="un-security-list"><li>Email verification</li><li>Server-only session cookies</li><li>Password recovery and session refresh</li><li>Protected database access rules</li><li>No advertising trackers in the portal</li></ul>
            <p><strong>Need help?</strong><br><a href="${clinic.phoneHref}">${clinic.phone}</a><br>${clinic.address}</p>
          </aside>
          <div class="un-auth" id="unAuthRoot" aria-live="polite">
            <div class="un-auth-tabs" role="tablist" aria-label="Portal account options">
              <button type="button" role="tab" aria-selected="true" data-auth-tab="login">Log in</button>
              <button type="button" role="tab" aria-selected="false" data-auth-tab="signup">Sign up</button>
              <button type="button" role="tab" aria-selected="false" data-auth-tab="recover">Reset password</button>
            </div>
            ${authPanel('login', 'Welcome back.', 'Use the email and password connected to your patient account.', `
              ${field('loginEmail', 'Email', 'email', 'email')}${field('loginPassword', 'Password', 'password', 'current-password')}
              <button class="un-form-submit" type="submit">Log in securely</button>`)}
            ${authPanel('signup', 'Create your account.', 'You will receive an email to verify this address before protected access is enabled.', `
              <div class="un-form-grid">${field('signupFirst', 'First name', 'text', 'given-name')}${field('signupLast', 'Last name', 'text', 'family-name')}</div>
              ${field('signupEmail', 'Email', 'email', 'email')}${field('signupPassword', 'Password', 'password', 'new-password')}${field('signupConfirm', 'Confirm password', 'password', 'new-password')}
              <p class="un-password-rule">Use at least 12 characters with uppercase, lowercase, a number, and a symbol.</p>
              <div class="un-check"><input id="signupConsent" type="checkbox" required><label for="signupConsent">I agree to the portal terms and understand that access is personal and must not be shared.</label></div>
              <button class="un-form-submit" type="submit">Create secure account</button>`)}
            ${authPanel('recover', 'Reset your password.', 'Enter your account email. For privacy, the response will be the same whether or not an account exists.', `
              ${field('recoverEmail', 'Email', 'email', 'email')}<button class="un-form-submit" type="submit">Send reset instructions</button>`)}
          </div>
        </section>
      </div>`;
  }

  function field(id, label, type, autocomplete) {
    return `<div class="un-field"><label for="${id}">${label}</label><input id="${id}" type="${type}" autocomplete="${autocomplete}" required></div>`;
  }

  function authPanel(name, title, copy, fields) {
    return `<section class="un-auth-panel${name === 'login' ? ' is-active' : ''}" data-auth-panel="${name}"><h2>${title}</h2><p>${copy}</p><form class="un-auth-form" data-auth-form="${name}">${fields}<p class="un-form-status" role="status"></p></form></section>`;
  }

  function strongPassword(value) {
    return value.length >= 12 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
  }

  async function api(path, body) {
    const options = { method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin', headers: {} };
    if (body !== undefined) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
    const response = await fetch(path, options);
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || 'The secure service is unavailable.');
    return result;
  }

  function setStatus(form, message, kind = '') {
    const status = form.querySelector('.un-form-status');
    if (!status) return;
    status.className = `un-form-status${kind ? ` is-${kind}` : ''}`;
    status.textContent = message;
  }

  function showDashboard(user) {
    const root = document.querySelector('#unAuthRoot');
    if (!root) return;
    const name = user.user_metadata?.first_name || 'Patient';
    root.innerHTML = `<div class="un-portal-dashboard"><span class="eyebrow">Secure session active</span><h2>Welcome, ${escapeHtml(name)}.</h2><p>Signed in as <strong>${escapeHtml(user.email || '')}</strong>. Choose a next step below.</p><div class="un-dashboard-actions"><a href="patient-forms.html"><span>Patient forms</span><small>Prepare documents and language access</small></a><a href="visit-planner.html"><span>Visit planner</span><small>Build a private, unsaved checklist</small></a><a href="patient-resources.html"><span>Patient resources</span><small>Trusted clinic and community guidance</small></a><a href="contact.html"><span>Contact clinic</span><small>Request non-urgent follow-up</small></a></div><button class="un-signout" type="button" data-signout>Log out</button><p class="un-form-status" role="status"></p></div>`;
    root.querySelector('[data-signout]').addEventListener('click', async () => {
      const button = root.querySelector('[data-signout]');
      button.disabled = true;
      try { await api('/api/auth/logout', {}); location.reload(); }
      catch (error) { button.disabled = false; root.querySelector('.un-form-status').textContent = error.message; }
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  async function acceptEmailSession() {
    const hash = new URLSearchParams(location.hash.slice(1));
    const accessToken = hash.get('access_token');
    const refreshToken = hash.get('refresh_token');
    const type = hash.get('type');
    if (!accessToken || !refreshToken) return false;
    history.replaceState(null, '', `${location.pathname}${location.search}`);
    await api('/api/auth/accept-session', { accessToken, refreshToken, type });
    return type === 'recovery';
  }

  function showPasswordUpdate() {
    const root = document.querySelector('#unAuthRoot');
    if (!root) return;
    root.innerHTML = `<section class="un-auth-panel is-active"><h2>Choose a new password.</h2><p>Your recovery link was accepted. Set a strong password to finish.</p><form class="un-auth-form" id="unUpdatePassword">${field('updatePassword', 'New password', 'password', 'new-password')}${field('updateConfirm', 'Confirm password', 'password', 'new-password')}<p class="un-password-rule">Use at least 12 characters with uppercase, lowercase, a number, and a symbol.</p><button class="un-form-submit" type="submit">Update password</button><p class="un-form-status" role="status"></p></form></section>`;
    const form = root.querySelector('#unUpdatePassword');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const password = form.querySelector('#updatePassword').value;
      if (password !== form.querySelector('#updateConfirm').value) return setStatus(form, 'Passwords do not match.', 'error');
      if (!strongPassword(password)) return setStatus(form, 'Use at least 12 characters with uppercase, lowercase, a number, and a symbol.', 'error');
      const button = form.querySelector('button');
      button.disabled = true;
      try {
        await api('/api/auth/update-password', { password });
        setStatus(form, 'Your password was updated. Reloading your secure portal...', 'success');
        setTimeout(() => location.reload(), 900);
      } catch (error) { setStatus(form, error.message, 'error'); button.disabled = false; }
    });
  }

  async function initPortal() {
    if (page !== 'patient-portal.html' || !main) return;
    document.title = 'Secure Patient Portal | Canby Community Clinic';
    main.innerHTML = portalMarkup();
    const root = document.querySelector('#unAuthRoot');
    root.querySelectorAll('[data-auth-tab]').forEach((button) => button.addEventListener('click', () => {
      root.querySelectorAll('[data-auth-tab]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
      root.querySelectorAll('[data-auth-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.authPanel === button.dataset.authTab));
    }));

    try {
      const recovery = await acceptEmailSession();
      if (recovery) return showPasswordUpdate();
    } catch (error) {
      const login = root.querySelector('[data-auth-form="login"]');
      setStatus(login, error.message, 'error');
    }

    root.querySelector('[data-auth-form="login"]').addEventListener('submit', async (event) => {
      event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button'); button.disabled = true;
      try {
        const result = await api('/api/auth/login', { email: form.querySelector('#loginEmail').value, password: form.querySelector('#loginPassword').value });
        showDashboard(result.user);
      } catch (error) { setStatus(form, error.message, 'error'); button.disabled = false; }
    });
    root.querySelector('[data-auth-form="signup"]').addEventListener('submit', async (event) => {
      event.preventDefault(); const form = event.currentTarget; const password = form.querySelector('#signupPassword').value; const button = form.querySelector('button');
      if (password !== form.querySelector('#signupConfirm').value) return setStatus(form, 'Passwords do not match.', 'error');
      if (!strongPassword(password)) return setStatus(form, 'Use at least 12 characters with uppercase, lowercase, a number, and a symbol.', 'error');
      button.disabled = true;
      try {
        await api('/api/auth/signup', { firstName: form.querySelector('#signupFirst').value, lastName: form.querySelector('#signupLast').value, email: form.querySelector('#signupEmail').value, password });
        form.reset(); setStatus(form, 'Check your email to verify your account, then return here to log in.', 'success');
      } catch (error) { setStatus(form, error.message, 'error'); button.disabled = false; }
    });
    root.querySelector('[data-auth-form="recover"]').addEventListener('submit', async (event) => {
      event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button'); button.disabled = true;
      try {
        await api('/api/auth/recover', { email: form.querySelector('#recoverEmail').value });
        form.reset(); setStatus(form, 'If an account exists for that email, reset instructions are on the way.', 'success');
      } catch (error) { setStatus(form, error.message, 'error'); } finally { button.disabled = false; }
    });

    try {
      const status = await api('/api/auth/status');
      if (!status.configured) {
        setStatus(root.querySelector('[data-auth-form="login"]'), `Secure account services are awaiting the clinic connection. Please call ${clinic.phone} for access help.`, 'error');
      }
    } catch (_) {
      setStatus(root.querySelector('[data-auth-form="login"]'), `Secure account services are not connected in this local preview. Please call ${clinic.phone} for access help.`, 'error');
    }

    try {
      const session = await api('/api/auth/session');
      if (session.user) showDashboard(session.user);
    } catch (error) {
      const login = root.querySelector('[data-auth-form="login"]');
      if (error.message.includes('not connected')) setStatus(login, `${error.message} You can still call ${clinic.phone}.`, 'error');
    }
  }

  updateNavigation();
  addContactStrip();
  renderContact();
  renderPatientForms();
  initPortal();
  locationRibbon();
})();
