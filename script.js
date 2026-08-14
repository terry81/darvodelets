/* ═══════════════════════════════════════════
   darvodelets.com — script.js
   ═══════════════════════════════════════════ */

'use strict';

// ─── Language System ───────────────────────
const LANG_KEY = 'darvo_lang';

function getLang() {
  // URL param takes priority
  const params = new URLSearchParams(window.location.search);
  if (params.get('lang') === 'en') return 'en';
  return localStorage.getItem(LANG_KEY) || 'bg';
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  applyLang(lang);
  // Update URL param without reload
  const url = new URL(window.location);
  if (lang === 'en') {
    url.searchParams.set('lang', 'en');
  } else {
    url.searchParams.delete('lang');
  }
  history.replaceState(null, '', url);
  document.documentElement.lang = lang === 'en' ? 'en' : 'bg';
}

function applyLang(lang) {
  const isEn = lang === 'en';
  const attr = isEn ? 'data-en' : 'data-bg';

  // All translatable elements
  document.querySelectorAll('[data-bg]').forEach(el => {
    const text = el.getAttribute(attr);
    if (text === null) return;
    if (el.tagName === 'OPTION') {
      el.textContent = text;
    } else {
      el.innerHTML = text;
    }
  });

  // Lang toggle button
  const btn = document.getElementById('langLabel');
  if (btn) btn.textContent = isEn ? 'БГ' : 'EN';

  // Page title
  document.title = isEn
    ? 'Carpenter Sofia | Custom Furniture & Kitchens – darvodelets.com'
    : 'Дърводелец София | Мебели по поръчка, ремонт, дограма – darvodelets.com';

  // Meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.content = isEn
      ? 'Professional carpenter in Sofia and Pernik. Custom furniture, kitchens, repairs. Call: +359 88 4777765.'
      : 'Професионален дърводелец в София и Перник. Мебели по поръчка, кухни, ремонт и дограма. Обадете се: +359 88 4777765.';
  }
}


// ─── Header scroll state ──────────────────
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


// ─── Mobile Nav ────────────────────────────
function initMobileNav() {
  const burger  = document.getElementById('navBurger');
  const nav     = document.querySelector('.main-nav');
  if (!burger || !nav) return;

  function toggleNav(open) {
    burger.classList.toggle('open', open);
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open');
    toggleNav(!isOpen);
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleNav(false));
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) toggleNav(false);
  });
}


// ─── Language Toggle ──────────────────────
function initLangToggle() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = getLang();
    setLang(current === 'bg' ? 'en' : 'bg');
  });
}


// ─── Scroll Reveal ─────────────────────────
function initScrollReveal() {
  // Add reveal class to sections & cards
  const targets = document.querySelectorAll(
    '.service-card, .work-card, .testimonial-card, ' +
    '.stat-item, .about-text > *, .contact-info > *, ' +
    '.section-header, .about-wood-block'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger cards in grids
    const parent = el.parentElement;
    const siblings = [...parent.querySelectorAll('.reveal')];
    const idx = siblings.indexOf(el) % 5;
    if (idx > 0) el.classList.add(`reveal-delay-${idx}`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}


// ─── Counter Animation ─────────────────────
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isInt = Number.isInteger(target);

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }

  requestAnimationFrame(tick);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}


// ─── Contact Form ──────────────────────────
function initContactForm() {}

// ─── Smooth Anchor Scroll ─────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


// ─── Active Nav Highlighting ──────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          link.style.setProperty('--after-w', '0');
        });
        const active = document.querySelector(`.main-nav a[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'var(--amber)';
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: '-72px 0px 0px 0px',
  });

  sections.forEach(s => observer.observe(s));
}


// ─── Initialise ────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Apply language (reads URL param or localStorage)
  applyLang(getLang());

  initHeader();
  initMobileNav();
  initLangToggle();
  initScrollReveal();
  initCounters();
  initContactForm();
  initSmoothScroll();
  initActiveNav();

  // Announce to screen readers that language has loaded
  document.documentElement.setAttribute('data-lang-loaded', 'true');
});
