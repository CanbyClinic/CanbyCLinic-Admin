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
    form.addEventListener('submit', (event) => {
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
