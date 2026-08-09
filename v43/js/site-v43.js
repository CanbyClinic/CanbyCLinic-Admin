(() => {
  'use strict';

  const body = document.body;
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.main-nav');

  const closeNav = () => {
    if (!toggle || !nav) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('nav-open');
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      body.classList.toggle('nav-open', open);
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closeNav();
    });
  }

  if (header) {
    const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 12);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const answer = document.getElementById(button.getAttribute('aria-controls'));
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      if (answer) answer.classList.toggle('open', !open);
    });
  });

  document.querySelectorAll('[data-mail-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const type = form.dataset.mailForm;
      const name = String(data.get('name') || '').trim();
      const phone = String(data.get('phone') || '').trim();
      const email = String(data.get('email') || '').trim();

      if (!name || (!phone && !email)) {
        window.alert('Please provide your name and either a phone number or email address.');
        return;
      }

      const subject = type === 'appointment'
        ? 'Callback request — Canby Community Clinic'
        : 'General website inquiry — Canby Community Clinic';

      const rows = [
        `Name: ${name}`,
        `Phone: ${phone || 'Not provided'}`,
        `Email: ${email || 'Not provided'}`,
        `Preferred language: ${data.get('language') || 'Not provided'}`,
        `Best time to contact: ${data.get('contact_time') || 'Not provided'}`
      ];

      if (type !== 'appointment') {
        rows.push(`General message (no medical details): ${String(data.get('message') || '').trim()}`);
      }

      rows.push('', 'Please do not reply with diagnoses, symptoms, test results, insurance member numbers, or medical records.');

      const secureCallback = type === 'appointment' && window.CANBY_CONFIG && String(window.CANBY_CONFIG.secureCallbackUrl || '').trim();
      if (secureCallback) {
        const message = form.querySelector('.form-message');
        try {
          const response = await fetch(secureCallback, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              kind: 'appointment_callback',
              name,
              phone,
              email,
              preferred_language: data.get('language') || '',
              best_contact_time: data.get('contact_time') || ''
            }),
            credentials: 'omit'
          });
          if (!response.ok) throw new Error('Callback request failed');
          if (message) {
            message.style.display = 'block';
            message.textContent = 'Your callback request was submitted. A clinic representative can contact you using the information provided.';
          }
          form.reset();
          return;
        } catch (error) {
          if (message) {
            message.style.display = 'block';
            message.textContent = 'The secure request was not completed. Please call (818) 674-4414.';
          }
          return;
        }
      }

      window.location.href = `mailto:info@puravidacc.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(rows.join('\n'))}`;

      const message = form.querySelector('.form-message');
      if (message) {
        message.style.display = 'block';
        message.textContent = 'Your email application should open. If it does not, call (818) 674-4414.';
      }
    });
  });

  const query = new URLSearchParams(window.location.search);
  const amount = query.get('amount');
  document.querySelectorAll('[data-selected-amount]').forEach((element) => {
    element.textContent = amount && /^\d+(\.\d{1,2})?$/.test(amount) ? `$${amount}` : 'the amount you choose';
  });

  document.querySelectorAll('.amount-card').forEach((card) => {
    const cardAmount = new URL(card.href, window.location.href).searchParams.get('amount');
    if (amount && cardAmount === amount) card.classList.add('selected');
  });

  document.querySelectorAll('[data-donation-checkout]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const configured = window.CANBY_CONFIG && String(window.CANBY_CONFIG.donationCheckoutUrl || '').trim();
      if (!configured) return;
      event.preventDefault();
      const checkout = new URL(configured, window.location.href);
      if (amount && /^\d+(\.\d{1,2})?$/.test(amount)) checkout.searchParams.set('amount', amount);
      window.location.href = checkout.toString();
    });

    const configured = window.CANBY_CONFIG && String(window.CANBY_CONFIG.donationCheckoutUrl || '').trim();
    if (configured) link.textContent = 'Continue to Secure Checkout';
  });

  const compassData = {
    prepare: {
      title: 'Prepare for an Appointment',
      copy: 'Bring an accurate medication list, relevant records, identification if requested, and the questions you want answered.',
      href: 'appointments.html#what-to-bring',
      label: 'Open the Appointment Guide'
    },
    find: {
      title: 'Find the Clinic and Confirm Hours',
      copy: 'Review the address, weekday schedule, directions, and emergency notice before traveling to the clinic.',
      href: 'location.html',
      label: 'Open Location Details'
    },
    privacy: {
      title: 'Understand Website Privacy and Patient Rights',
      copy: 'See what this public website does not collect, and review privacy, nondiscrimination, and accessibility information.',
      href: 'privacy.html',
      label: 'Review Privacy Information'
    },
    learn: {
      title: 'Read the Health Education Library',
      copy: 'Explore evidence-linked articles about prevention, blood pressure, prediabetes, medication safety, and healthcare access.',
      href: 'health-articles.html',
      label: 'Open the Article Library'
    }
  };

  const compassTitle = document.querySelector('[data-compass-title]');
  const compassCopy = document.querySelector('[data-compass-copy]');
  const compassLink = document.querySelector('[data-compass-link]');
  document.querySelectorAll('[data-care-topic]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = compassData[button.dataset.careTopic];
      if (!item || !compassTitle || !compassCopy || !compassLink) return;
      document.querySelectorAll('[data-care-topic]').forEach((tab) => tab.setAttribute('aria-selected', String(tab === button)));
      compassTitle.textContent = item.title;
      compassCopy.textContent = item.copy;
      compassLink.href = item.href;
      compassLink.textContent = item.label;
    });
  });

  const copyButton = document.querySelector('[data-copy-address]');
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('7601 Canby Ave #6B, Reseda, CA 91335');
        copyButton.textContent = 'Address Copied';
      } catch (error) {
        copyButton.textContent = '7601 Canby Ave #6B, Reseda, CA 91335';
      }
    });
  }

  const progress = document.querySelector('.reading-progress');
  if (progress) {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
      progress.style.width = `${percent}%`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }
})();


// --- Canby V3: entry, language, portal launchers, and secure-intake integration ---
(() => {
  'use strict';
  const q = (s, root=document) => root.querySelector(s);
  const qa = (s, root=document) => [...root.querySelectorAll(s)];

  const entry = q('[data-entry-experience]');
  if (entry) {
    const seen = sessionStorage.getItem('canby-entry-seen') === '1';
    if (seen) entry.classList.add('entry-hidden');
    q('[data-enter-site]', entry)?.addEventListener('click', () => {
      sessionStorage.setItem('canby-entry-seen','1');
      entry.classList.add('entry-exit');
      setTimeout(() => entry.classList.add('entry-hidden'), 680);
    });
  }

  qa('.language-button').forEach((button) => {
    const menu = button.parentElement?.querySelector('.language-menu');
    if (!menu) return;
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
    });
    document.addEventListener('click', () => { button.setAttribute('aria-expanded','false'); menu.hidden = true; });
  });

  const portalMessage = q('[data-portal-message]');
  qa('[data-portal-tab]').forEach((tab) => tab.addEventListener('click', () => {
    const key = tab.dataset.portalTab;
    qa('[data-portal-tab]').forEach(t => t.classList.toggle('active', t===tab));
    qa('[data-portal-pane]').forEach(p => p.classList.toggle('active', p.dataset.portalPane===key));
    if (portalMessage) portalMessage.textContent='';
  }));

  qa('[data-portal-action]').forEach((button) => button.addEventListener('click', () => {
    const action = button.dataset.portalAction;
    const key = action === 'login' ? 'portalLoginUrl' : action === 'signup' ? 'portalSignupUrl' : 'portalResetUrl';
    const url = window.CANBY_CONFIG && String(window.CANBY_CONFIG[key] || '').trim();
    if (url) {
      window.location.assign(url);
      return;
    }
    if (portalMessage) {
      portalMessage.innerHTML = '<strong>Secure portal connection required.</strong> The public GitHub site cannot safely store passwords or patient records. Add the clinic-approved portal URL in <code>assets/js/config.js</code>, or call (818) 674-4414.';
      portalMessage.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  }));

  qa('[data-secure-intake]').forEach((form) => form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = q('[data-intake-status]',form);
    if (!form.reportValidity()) return;
    const endpoint = window.CANBY_CONFIG && String(window.CANBY_CONFIG.secureIntakeUrl || '').trim();
    if (!endpoint) {
      if (status) status.innerHTML = '<strong>Secure intake connection required.</strong> This form is ready, but submission is intentionally blocked until the clinic connects an approved secure endpoint in <code>assets/js/config.js</code>. Call (818) 674-4414 for help.';
      status?.scrollIntoView({behavior:'smooth',block:'center'});
      return;
    }
    const button = q('button[type="submit"]',form);
    button?.setAttribute('disabled','');
    if (status) status.textContent='Submitting securely…';
    try {
      const payload = {};
      for (const [key, value] of new FormData(form).entries()) {
        if (Object.prototype.hasOwnProperty.call(payload, key)) {
          payload[key] = Array.isArray(payload[key]) ? [...payload[key], value] : [payload[key], value];
        } else {
          payload[key] = value;
        }
      }
      const response = await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),credentials:'omit'});
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      form.reset();
      if (status) status.innerHTML='<strong>Information submitted.</strong> A clinic representative can review it through the approved system and follow up using the contact information provided.';
    } catch (error) {
      if (status) status.innerHTML='<strong>Submission was not completed.</strong> Please call (818) 674-4414. Do not send sensitive information by ordinary email.';
    } finally { button?.removeAttribute('disabled'); }
  }));

  qa('[data-mail-form="appointment"]').forEach((form) => form.addEventListener('submit', () => {
    setTimeout(() => {
      const modal=q('[data-appointment-modal]');
      if (modal) { modal.hidden=false; document.body.classList.add('modal-open'); }
    }, 200);
  }));
  qa('[data-close-modal]').forEach((button)=>button.addEventListener('click',()=>{
    const modal=q('[data-appointment-modal]'); if(modal){modal.hidden=true; document.body.classList.remove('modal-open');}
  }));

  qa('[data-donation-frequency]').forEach(button => button.addEventListener('click', () => {
    qa('[data-donation-frequency]').forEach(b=>b.classList.toggle('active',b===button));
    document.body.dataset.donationFrequency=button.dataset.donationFrequency;
  }));
})();

// =========================================================
// CANBY V4 — motion, front-end portal prototype, dashboard
// =========================================================
(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  // Reveal sections only after layout is ready.
  const revealItems = $$('.reveal-section');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('revealed'));
  }

  // The original V3 entry handler still works; this adds a controlled minimum intro.
  const entry = $('[data-entry-experience]');
  if (entry && !entry.classList.contains('entry-hidden')) {
    document.body.style.overflow = 'hidden';
    const closeEntry = () => {
      sessionStorage.setItem('canby-entry-seen', '1');
      entry.classList.add('entry-exit');
      document.body.style.overflow = '';
      setTimeout(() => entry.classList.add('entry-hidden'), 720);
    };
    $$('[data-enter-site]', entry).forEach((button) => button.addEventListener('click', closeEntry));
    entry.addEventListener('transitionend', () => {
      if (entry.classList.contains('entry-exit')) entry.classList.add('entry-hidden');
    });
  }

  // Password reveal buttons.
  $$('[data-toggle-password]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = button.parentElement?.querySelector('input');
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.textContent = show ? 'Hide' : 'Show';
      button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  // Portal tabs with query-string support.
  const portalTabs = $$('[data-portal-tab]');
  const portalPanes = $$('[data-portal-pane]');
  const openPortalTab = (name) => {
    portalTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.portalTab === name));
    portalPanes.forEach((pane) => pane.classList.toggle('active', pane.dataset.portalPane === name));
  };
  portalTabs.forEach((tab) => tab.addEventListener('click', () => openPortalTab(tab.dataset.portalTab)));
  if (new URLSearchParams(location.search).get('mode') === 'signup') openPortalTab('signup');

  const encoder = new TextEncoder();
  const digest = async (value) => {
    if (!window.crypto?.subtle) return btoa(unescape(encodeURIComponent(value)));
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(value));
    return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
  };
  const accountKey = 'canby-v4-demo-account';
  const loginKey = 'canby-v4-demo-login';
  const intakeKey = 'canby-v4-demo-intake';
  const isSpanish = document.documentElement.lang === 'es';
  const isArmenian = document.documentElement.lang === 'hy';
  const dashboardUrl = isSpanish ? 'es-panel-paciente.html' : (isArmenian ? 'hy-patient-dashboard.html' : 'patient-dashboard.html');
  const intakeUrl = isSpanish ? 'es-nuevo-paciente.html?onboarding=1' : (isArmenian ? 'hy-new-patient.html?onboarding=1' : 'new-patient.html?onboarding=1');
  const portalUrl = isSpanish ? 'es-portal-paciente.html' : (isArmenian ? 'hy-patient-portal.html' : 'patient-portal.html');

  // Returning patients stay signed in by default when they chose the remembered-device option.
  if ($('[data-demo-login]') && new URLSearchParams(location.search).get('mode') !== 'signup') {
    const alreadySignedIn = localStorage.getItem(loginKey) === '1' || sessionStorage.getItem(loginKey) === '1';
    if (alreadySignedIn && localStorage.getItem(accountKey)) {
      location.replace(dashboardUrl);
      return;
    }
  }

  // Prefill the first-page intake with basic account information on this device.
  const demoIntakeForm = $('[data-demo-intake]');
  if (demoIntakeForm) {
    const rawAccount = localStorage.getItem(accountKey);
    if (rawAccount) {
      try {
        const account = JSON.parse(rawAccount) || {};
        const map = { first_name: account.firstName, last_name: account.lastName, email: account.email, mobile_phone: account.phone };
        Object.entries(map).forEach(([name, value]) => {
          const input = demoIntakeForm.elements.namedItem(name);
          if (input && !input.value && value) input.value = value;
        });
      } catch (_) {}
    }
    const today = demoIntakeForm.elements.namedItem('today_date');
    if (today && !today.value) today.value = new Date().toISOString().slice(0, 10);
  }

  const setPortalMessage = (message, error = false) => {
    const el = $('[data-portal-message]');
    if (!el) return;
    el.textContent = message;
    el.style.background = error ? '#fff0ee' : '#edf9f1';
    el.style.borderColor = error ? '#e6b6ae' : '#bce3c7';
    el.style.color = error ? '#7a2d22' : '#185f2c';
    el.style.padding = '14px';
    el.style.borderRadius = '12px';
  };

  $('[data-demo-signup]')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (String(data.password || '').length < 8) {
      setPortalMessage(isSpanish ? 'La contraseña debe tener al menos 8 caracteres.' : 'Password must be at least 8 characters.', true);
      return;
    }
    if (data.password !== data.confirmPassword) {
      setPortalMessage(isSpanish ? 'Las contraseñas no coinciden.' : 'Passwords do not match.', true);
      return;
    }
    const account = {
      firstName: String(data.firstName || '').trim(),
      lastName: String(data.lastName || '').trim(),
      email: String(data.email || '').trim().toLowerCase(),
      phone: String(data.phone || '').trim(),
      passwordHash: await digest(String(data.password)),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(accountKey, JSON.stringify(account));
    if (data.remember) localStorage.setItem(loginKey, '1'); else sessionStorage.setItem(loginKey, '1');
    location.href = intakeUrl;
  });

  $('[data-demo-login]')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const raw = localStorage.getItem(accountKey);
    if (!raw) {
      setPortalMessage(isSpanish ? 'No existe una cuenta de demostración en este navegador. Cree una cuenta primero.' : 'No demo account exists in this browser. Create an account first.', true);
      openPortalTab('signup');
      return;
    }
    let account;
    try { account = JSON.parse(raw); } catch { account = null; }
    const passwordHash = await digest(String(data.password || ''));
    if (!account || account.email !== String(data.email || '').trim().toLowerCase() || account.passwordHash !== passwordHash) {
      setPortalMessage(isSpanish ? 'El correo o la contraseña de demostración no coinciden.' : 'The demo email or password does not match.', true);
      return;
    }
    if (data.remember) localStorage.setItem(loginKey, '1'); else sessionStorage.setItem(loginKey, '1');
    location.href = dashboardUrl;
  });

  const resetModal = $('[data-reset-modal]');
  $('[data-forgot-password]')?.addEventListener('click', () => {
    if (resetModal) resetModal.hidden = false;
  });
  $('[data-close-reset]')?.addEventListener('click', () => { if (resetModal) resetModal.hidden = true; });
  resetModal?.addEventListener('click', (event) => { if (event.target === resetModal) resetModal.hidden = true; });
  $('[data-send-reset]')?.addEventListener('click', () => {
    const email = String($('[data-reset-email]')?.value || '').trim();
    const message = $('[data-reset-message]');
    if (!message) return;
    if (!email.includes('@')) {
      message.textContent = isSpanish ? 'Ingrese un correo válido.' : 'Enter a valid email address.';
      return;
    }
    message.textContent = isSpanish
      ? 'Vista previa completada. El portal final enviará un enlace verificado mediante el sistema seguro.'
      : 'Preview complete. The production portal will send a verified link through the secure identity system.';
  });

  // Demo intake: store only in browser and move to dashboard.
  $('[data-demo-intake]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const entries = {};
    new FormData(form).forEach((value, key) => {
      if (entries[key] === undefined) entries[key] = value;
      else if (Array.isArray(entries[key])) entries[key].push(value);
      else entries[key] = [entries[key], value];
    });
    localStorage.setItem(intakeKey, JSON.stringify({ savedAt: new Date().toISOString(), values: entries }));
    localStorage.setItem(loginKey, '1');
    location.href = dashboardUrl + '?intake=saved';
  });

  // Dashboard navigation and account state.
  const dashboard = $('[data-patient-dashboard]');
  if (dashboard) {
    const loggedIn = localStorage.getItem(loginKey) === '1' || sessionStorage.getItem(loginKey) === '1';
    const raw = localStorage.getItem(accountKey);
    if (!loggedIn || !raw) {
      location.replace(portalUrl);
      return;
    }
    let account = {};
    try { account = JSON.parse(raw) || {}; } catch { account = {}; }
    const fullName = [account.firstName, account.lastName].filter(Boolean).join(' ') || (isSpanish ? 'Paciente' : 'Patient');
    $$('[data-patient-name]').forEach((el) => { el.textContent = fullName; });
    const intake = localStorage.getItem(intakeKey);
    $$('[data-intake-status]').forEach((el) => { el.textContent = intake ? (isSpanish ? 'Guardado' : 'Saved') : (isSpanish ? 'No Iniciado' : 'Not Started'); });
    $$('[data-document-status]').forEach((el) => { el.textContent = intake ? (isSpanish ? 'Guardado en este navegador.' : 'Saved in this browser.') : (isSpanish ? 'No completado en este navegador.' : 'Not completed in this browser.'); });

    const openDashboardTab = (name) => {
      $$('[data-dashboard-tab]').forEach((button) => button.classList.toggle('active', button.dataset.dashboardTab === name));
      $$('[data-dashboard-pane]').forEach((pane) => pane.classList.toggle('active', pane.dataset.dashboardPane === name));
      history.replaceState(null, '', `#${name}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    $$('[data-dashboard-tab]').forEach((button) => button.addEventListener('click', () => openDashboardTab(button.dataset.dashboardTab)));
    $$('[data-dashboard-go]').forEach((button) => button.addEventListener('click', () => openDashboardTab(button.dataset.dashboardGo)));
    const initial = location.hash.replace('#', '');
    if ($(`[data-dashboard-pane="${CSS.escape(initial)}"]`)) openDashboardTab(initial);

    const profile = $('[data-demo-profile]');
    if (profile) {
      ['firstName','lastName','email','phone'].forEach((key) => {
        const input = profile.elements.namedItem(key);
        if (input) input.value = account[key] || '';
      });
      profile.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(profile).entries());
        account = { ...account, ...data };
        localStorage.setItem(accountKey, JSON.stringify(account));
        $$('[data-patient-name]').forEach((el) => { el.textContent = [account.firstName,account.lastName].filter(Boolean).join(' ') || 'Patient'; });
        const message = $('[data-profile-message]');
        if (message) message.textContent = isSpanish ? 'Perfil de demostración guardado en este navegador.' : 'Demo profile saved in this browser.';
      });
    }
  }

  $('[data-demo-signout]')?.addEventListener('click', () => {
    localStorage.removeItem(loginKey);
    sessionStorage.removeItem(loginKey);
    location.href = portalUrl;
  });
})();


// V4.2 reference interaction layer
(() => {
  'use strict';
  document.documentElement.classList.add('v43-assets-ready');
  const params = new URLSearchParams(location.search);
  const entry = document.querySelector('[data-entry-experience]');
  if (entry && params.get('entry') === '1') {
    sessionStorage.removeItem('canby-entry-seen');
    entry.classList.remove('entry-hidden','entry-exit');
  }
  const signupShortcut = document.querySelector('[data-open-signup]');
  if (signupShortcut) signupShortcut.addEventListener('click', () => {
    document.querySelector('[data-portal-tab="signup"]')?.click();
  });
  if (params.get('mode') === 'signup') {
    window.addEventListener('DOMContentLoaded', () => document.querySelector('[data-portal-tab="signup"]')?.click(), {once:true});
  }
})();

// Ensure every entrance control can dismiss the overlay.
(() => {
  'use strict';
  const entry = document.querySelector('[data-entry-experience]');
  if (!entry) return;
  const dismiss = () => {
    sessionStorage.setItem('canby-entry-seen', '1');
    entry.classList.add('entry-exit');
    window.setTimeout(() => entry.classList.add('entry-hidden'), 620);
  };
  entry.querySelectorAll('[data-enter-site]').forEach((control) => {
    control.addEventListener('click', dismiss);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !entry.classList.contains('entry-hidden')) dismiss();
  });
})();

// =========================================================
// CANBY V4.3 — mobile app navigation, clickable journal cards,
// volunteer questionnaire delivery, and compact interaction polish
// =========================================================
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const lang = document.documentElement.lang || 'en';
  const isPortalLike = /(?:patient-portal|patient-dashboard|new-patient|portal-paciente|panel-paciente|nuevo-paciente)/.test(location.pathname);
  const copy = {
    en: {home:'Home', appt:'Appointments', portal:'Portal', resources:'Resources', more:'More', call:'Call Clinic', directions:'Directions', hours:'Mon–Fri 9–5', homeUrl:'index.html', apptUrl:'appointments.html', portalUrl:'patient-portal.html', resourcesUrl:'patient-resources.html'},
    es: {home:'Inicio', appt:'Citas', portal:'Portal', resources:'Recursos', more:'Más', call:'Llamar', directions:'Direcciones', hours:'Lun–Vie 9–5', homeUrl:'es.html', apptUrl:'es-citas.html', portalUrl:'es-portal-paciente.html', resourcesUrl:'es-recursos.html'},
    hy: {home:'Գլխավոր', appt:'Ժամադրություն', portal:'Մուտք', resources:'Ռեսուրսներ', more:'Ավելին', call:'Զանգ', directions:'Քարտեզ', hours:'Երկ–Ուրբ 9–5', homeUrl:'hy.html', apptUrl:'hy-appointments.html', portalUrl:'hy-patient-portal.html', resourcesUrl:'hy-resources.html'}
  }[lang] || null;

  const icon = (name) => ({
    home:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 11.2 12 3l9 8.2V21h-6v-6H9v6H3z"/></svg>',
    calendar:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v15H3V6a2 2 0 0 1 2-2h2zm12 8H5v9h14z"/></svg>',
    portal:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10ZM4 22v-2c0-4 3.6-7 8-7s8 3 8 7v2z"/></svg>',
    book:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3h7a3 3 0 0 1 3 3v15a4 4 0 0 0-4-4H4zm16 0h-4a3 3 0 0 0-1 .17V18a5.9 5.9 0 0 1 5-1z"/></svg>',
    menu:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>'
  }[name]);

  if (copy && !isPortalLike && !$('.mobile-app-nav')) {
    const nav = document.createElement('nav');
    nav.className = 'mobile-app-nav';
    nav.setAttribute('aria-label', lang === 'es' ? 'Navegación móvil' : lang === 'hy' ? 'Բջջային նավարկում' : 'Mobile navigation');
    const current = location.pathname.split('/').pop() || 'index.html';
    const item = (href, label, svg, cls='') => `<a href="${href}" class="${cls} ${current===href?'active':''}">${svg}<span>${label}</span></a>`;
    nav.innerHTML = item(copy.homeUrl,copy.home,icon('home')) + item(copy.apptUrl,copy.appt,icon('calendar')) + item(copy.portalUrl,copy.portal,icon('portal'),'portal-item') + item(copy.resourcesUrl,copy.resources,icon('book')) + `<button type="button" data-mobile-more>${icon('menu')}<span>${copy.more}</span></button>`;
    document.body.append(nav);
    $('[data-mobile-more]',nav)?.addEventListener('click', () => {
      const menu = $('#main-navigation');
      const toggle = $('.mobile-toggle');
      if (!menu) return;
      const open = !menu.classList.contains('open');
      menu.classList.toggle('open',open);
      toggle?.setAttribute('aria-expanded',String(open));
    });
  }

  if (copy && !isPortalLike && !$('.mobile-clinic-strip')) {
    const header = $('.site-header');
    if (header) {
      const strip = document.createElement('div');
      strip.className='mobile-clinic-strip';
      strip.innerHTML=`<a href="tel:+18186744414"><b>☎</b>${copy.call}</a><a href="https://www.google.com/maps/search/?api=1&query=7601+Canby+Ave+%236B+Reseda+CA+91335"><b>⌖</b>${copy.directions}</a><span><b>◷</b>${copy.hours}</span>`;
      header.after(strip);
    }
  }

  // The entire article tile acts as a link while preserving the visible text link.
  $$('[data-card-href]').forEach((card) => {
    const go = () => { if (card.dataset.cardHref) location.href = card.dataset.cardHref; };
    card.addEventListener('click', (event) => {
      if (event.target.closest('a,button,input,select,textarea')) return;
      go();
    });
    card.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('a,button,input,select,textarea')) {
        event.preventDefault(); go();
      }
    });
  });

  // Volunteer path selection.
  $$('[data-volunteer-path]').forEach((button) => {
    button.addEventListener('click', () => {
      const type=button.dataset.volunteerPath;
      $$('[data-volunteer-path]').forEach(x=>x.classList.toggle('active',x===button));
      $$('[data-volunteer-form]').forEach(form=>{
        const show=form.dataset.volunteerForm===type;
        form.hidden=!show; form.classList.toggle('active',show);
        if(show) form.scrollIntoView({behavior:'smooth',block:'start'});
      });
    });
  });

  const clinicEmail = String(window.CANBY_CONFIG?.clinicEmail || 'info@puravidacc.org').trim();
  $$('[data-volunteer-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const type = String(data.get('Application Type') || 'Volunteer');
      const name = `${data.get('First Name') || ''} ${data.get('Last Name') || ''}`.trim();
      const subject = `Canby Clinic Volunteer Application — ${type} — ${name}`;
      const lines = [`CANBY COMMUNITY CLINIC VOLUNTEER APPLICATION`,``,`Application Type: ${type}`,`Submitted from: ${location.href}`,``];
      for (const [key,value] of data.entries()) lines.push(`${key}: ${value}`);
      lines.push('', 'Applicant: Please review this message and press Send. Do not include patient medical information.');
      const mailto = `mailto:${encodeURIComponent(clinicEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
      const status = $('[data-volunteer-status]',form);
      if (status) {
        status.textContent = lang==='es' ? 'Se abrió su aplicación de correo. Revise el mensaje y presione Enviar.' : lang==='hy' ? 'Էլ․ փոստի ծրագիրը բացվել է։ Ստուգեք նամակը և սեղմեք Send։' : 'Your email application is opening. Review the message and press Send.';
        status.style.padding='14px'; status.style.background='#edf9f1'; status.style.border='1px solid #bce3c7'; status.style.borderRadius='12px';
      }
      sessionStorage.setItem('canby-volunteer-draft',JSON.stringify(Object.fromEntries(data.entries())));
      window.location.href = mailto;
    });
  });

  // Donation selection is visually persistent for the current visit.
  $$('.donation-amount-grid button').forEach((button) => button.addEventListener('click', () => {
    $$('.donation-amount-grid button').forEach(x=>x.classList.remove('recommended'));
    button.classList.add('recommended');
    sessionStorage.setItem('canby-donation-amount',button.textContent.trim());
  }));
  $$('.donation-frequency button').forEach((button) => button.addEventListener('click', () => {
    $$('.donation-frequency button').forEach(x=>x.classList.toggle('active',x===button));
  }));
})();


// --- V44 informative hub tools ---
(() => {
  'use strict';
  const topics = {
    new: ['New patient path', 'Start with the New Patient guide, review what to bring, then complete the forms preview before calling the clinic.', 'new-patient.html'],
    forms: ['Forms and visit preparation', 'Use the visit planner and medication list builder so the clinic team has clearer information when you arrive.', 'visit-planner.html'],
    learn: ['Health education library', 'Explore simple guides on blood pressure, diabetes basics, preventive care, and safe medication lists.', 'health-library.html'],
    community: ['Community resource directory', 'Find local categories for food, transportation, family support, housing help, senior services, and urgent help.', 'community-resources-directory.html'],
    volunteer: ['Volunteer or partner', 'Review medical, non-medical, student, language access, outreach, and community partner opportunities.', 'volunteer.html'],
    portal: ['Patient portal preview', 'Create a demo account, view the dashboard, save visit-prep items, and see how secure portal features will be organized.', 'patient-portal.html']
  };
  const title = document.querySelector('[data-help-title]');
  const copy = document.querySelector('[data-help-copy]');
  const link = document.querySelector('[data-help-link]');
  document.querySelectorAll('[data-help-topic]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = topics[button.dataset.helpTopic];
      if (!item || !title || !copy || !link) return;
      document.querySelectorAll('[data-help-topic]').forEach((b) => b.setAttribute('aria-selected', String(b === button)));
      title.textContent = item[0]; copy.textContent = item[1]; link.href = item[2];
    });
  });
  const bpBtn = document.querySelector('[data-bp-check]');
  if (bpBtn) bpBtn.addEventListener('click', () => {
    const sys = Number(document.querySelector('[data-bp-sys]')?.value || 0);
    const dia = Number(document.querySelector('[data-bp-dia]')?.value || 0);
    const out = document.querySelector('[data-bp-output]');
    if (!out) return;
    if (!sys || !dia) { out.textContent = 'Enter both numbers to see the education note.'; return; }
    let level = 'This looks within a lower range, but only a qualified clinician can interpret your numbers in context.';
    if (sys >= 180 || dia >= 120) level = 'Very high reading. If you have chest pain, trouble breathing, weakness, severe headache, or vision changes, call 911. Otherwise contact a medical professional promptly.';
    else if (sys >= 140 || dia >= 90) level = 'This falls in a high range. Record the reading and ask a clinician what follow-up is appropriate.';
    else if (sys >= 130 || dia >= 80) level = 'This may be elevated/high depending on your history. Track readings and review with a clinician.';
    else if (sys >= 120) level = 'This may be elevated. Healthy habits and follow-up readings can matter.';
    out.textContent = level;
  });
  const medBtn = document.querySelector('[data-med-build]');
  if (medBtn) medBtn.addEventListener('click', () => {
    const fields = ['data-med-name','data-med-dose','data-med-why'];
    const values = fields.map(s => document.querySelector('['+s+']')?.value.trim()).filter(Boolean);
    const out = document.querySelector('[data-med-output]');
    if (out) out.textContent = values.length ? 'Add to your visit list: ' + values.join(' · ') : 'Enter the medication name, dose, and reason to create a clear visit note.';
  });
})();
