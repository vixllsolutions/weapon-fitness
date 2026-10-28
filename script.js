(() => {
  'use strict';
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.main-nav a');

  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('nav-open', !isOpen);
    });
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
    revealItems.forEach((item, index) => {
      if (item.closest('.hero')) item.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Training category filters
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      serviceCards.forEach(card => {
        const visible = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !visible);
      });
    });
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  });

  // Use service cards to pre-select an enquiry goal
  const goalSelect = document.getElementById('memberGoal');
  document.querySelectorAll('[data-goal]').forEach(link => {
    link.addEventListener('click', () => {
      if (!goalSelect) return;
      const requested = link.dataset.goal.toLowerCase();
      const options = Array.from(goalSelect.options);
      let matched = options.find(option => option.text.toLowerCase() === requested);
      if (!matched && requested.includes('cardio')) matched = options.find(option => option.text.toLowerCase().includes('cardio'));
      if (!matched && requested.includes('training')) matched = options.find(option => option.text.toLowerCase().includes('personal'));
      if (!matched && requested.includes('resistance')) matched = options.find(option => option.text.toLowerCase().includes('strength'));
      if (matched) goalSelect.value = matched.value;
    });
  });

  // The enquiry form creates a WhatsApp message; no backend or data storage is used.
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(enquiryForm);
      const name = String(formData.get('name') || '').trim();
      const goal = String(formData.get('goal') || '').trim();
      const phone = String(formData.get('phone') || '').trim();
      if (!name || !goal) {
        enquiryForm.reportValidity();
        return;
      }
      const message = `Hi Weapon Fitness 2, my name is ${name}. I'd like to know more about ${goal}.${phone ? ` My phone number is ${phone}.` : ''} Please share the membership or training details.`;
      const url = `https://wa.me/919008701016?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // Gallery lightbox with keyboard close support
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox ? lightbox.querySelector('img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  let previousFocus = null;
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (previousFocus) previousFocus.focus();
  };
  document.querySelectorAll('[data-lightbox]').forEach(button => {
    button.addEventListener('click', () => {
      if (!lightbox || !lightboxImage) return;
      previousFocus = button;
      lightboxImage.src = button.dataset.lightbox;
      lightboxImage.alt = button.querySelector('img')?.alt || 'Gym photo enlarged';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lightboxClose?.focus();
    });
  });
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeLightbox(); });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
