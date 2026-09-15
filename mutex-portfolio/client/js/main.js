/* =========================================================
   MUTEX — Portfolio interactions
   GSAP + ScrollTrigger for orchestrated reveals.
   All motion respects prefers-reduced-motion.
   ========================================================= */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------- NAV: floating pill on scroll ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- MOBILE MENU ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  function closeMenu() {
    nav.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function openMenu() {
    nav.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  if (toggle) {
    toggle.addEventListener('click', () => {
      nav.classList.contains('is-open') ? closeMenu() : openMenu();
    });
  }
  mobileLinks.forEach((a) => a.addEventListener('click', closeMenu));

  /* ---------- HERO ENTRANCE (single orchestrated sequence) ---------- */
  function playHero() {
    const lines = document.querySelectorAll('.hero h1 .line');
    const label = document.querySelector('.hero-label');
    const role = document.querySelector('.hero-role');
    const lead = document.querySelector('.hero p.lead');
    const actions = document.querySelector('.hero-actions');
    const visual = document.querySelector('.hero-visual');

    if (reduceMotion || !window.gsap) {
      [label, role, lead, actions, visual].forEach((el) => el && (el.style.opacity = 1));
      lines.forEach((l) => (l.style.transform = 'none'));
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.set([label, role, lead, actions], { opacity: 0, y: 16 })
      .set(visual, { opacity: 0, y: 24 })
      .to(label, { opacity: 1, y: 0, duration: 0.6 }, 0.1)
      .to(lines, { y: '0%', duration: 0.9, stagger: 0.12 }, 0.15)
      .to(role, { opacity: 1, y: 0, duration: 0.6 }, 0.55)
      .to(lead, { opacity: 1, y: 0, duration: 0.6 }, 0.68)
      .to(actions, { opacity: 1, y: 0, duration: 0.6 }, 0.8)
      .to(visual, { opacity: 1, y: 0, duration: 0.9 }, 0.35);
  }
  window.addEventListener('DOMContentLoaded', playHero);

  /* ---------- GENERIC SCROLL REVEAL ---------- */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- ABOUT TIMELINE STAGGER ---------- */
  function initTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;
    if (reduceMotion || !window.gsap) {
      items.forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }
    gsap.to(items, {
      opacity: 1,
      x: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.16,
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 75%',
        once: true,
      },
    });
  }

  /* ---------- PROJECT MEDIA WIPE REVEAL ---------- */
  function initProjectReveal() {
    const rows = document.querySelectorAll('.project-media');
    if (!rows.length || reduceMotion || !window.gsap) return;
    rows.forEach((row) => {
      gsap.fromTo(
        row,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: row, start: 'top 85%', once: true },
        }
      );
    });
  }

  /* ---------- PHILOSOPHY LINE-BY-LINE REVEAL ---------- */
  function initPhilosophy() {
    const words = document.querySelectorAll('.philosophy .word');
    if (!words.length) return;
    if (reduceMotion || !window.gsap) {
      words.forEach((w) => (w.style.opacity = 1));
      return;
    }
    gsap.to(words, {
      opacity: 1,
      duration: 0.4,
      stagger: 0.06,
      ease: 'none',
      scrollTrigger: {
        trigger: '.philosophy blockquote',
        start: 'top 80%',
        end: 'bottom 60%',
        scrub: 0.6,
      },
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initTimeline();
    initProjectReveal();
    initPhilosophy();
  });

  /* ---------- CONTACT FORM ---------- */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());

      if (!data.name || !data.email || !data.message) {
        status.textContent = 'Please fill in every field before sending.';
        status.className = 'form-status is-error';
        return;
      }

      status.textContent = 'Sending…';
      status.className = 'form-status';

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Server unavailable');
        status.textContent = 'Message sent — thank you. I\'ll reply soon.';
        status.className = 'form-status is-ok';
        form.reset();
      } catch (err) {
        // Graceful fallback if the Node/Express backend isn't running
        // (e.g. the site is opened as a static file).
        const mailto = `mailto:hello@mutex.dev?subject=${encodeURIComponent(
          'Portfolio inquiry from ' + data.name
        )}&body=${encodeURIComponent(data.message + '\n\n— ' + data.name + ' (' + data.email + ')')}`;
        status.innerHTML = `Couldn't reach the server — <a href="${mailto}" style="text-decoration:underline;">send via email instead</a>.`;
        status.className = 'form-status is-error';
      }
    });
  }

  /* ---------- FOOTER YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
