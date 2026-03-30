/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── NAV SCROLL ── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 40 ? '0 2px 20px rgba(0,0,0,0.4)' : 'none';
});

/* ── HAMBURGER MENU ── */
const burger = document.getElementById('nav-burger');
const navLinks = document.getElementById('nav-links');
burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── NAV ANCHOR SCROLL (same page, no new tab) ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── TESTIMONIAL FILTER ── */
document.querySelectorAll('.t-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.t-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.tcard').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.type === filter) ? '' : 'none';
    });
  });
});

/* ── CONTACT FORM ── */
document.getElementById('contact-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-send');
  const success = document.getElementById('form-success');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  try {
    const data = new FormData(e.target);
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data
    });
    const json = await res.json();
    if (json.success) {
      success.classList.add('show');
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      e.target.reset();
      btn.textContent = 'Send Message →';
      btn.disabled = false;
    } else {
      btn.textContent = 'Something went wrong — try again';
      btn.disabled = false;
    }
  } catch {
    btn.textContent = 'Something went wrong — try again';
    btn.disabled = false;
  }
});

/* ── LANGUAGE TOGGLE ── */
let currentLang = 'en';

function applyLanguage(lang) {
  currentLang = lang;
  document.querySelector('.lang-en').classList.toggle('active', lang === 'en');
  document.querySelector('.lang-pl').classList.toggle('active', lang === 'pl');
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-en]').forEach(el => {
    if (el.tagName === 'OPTION') return;
    const text = el.getAttribute('data-' + lang);
    if (!text) return;
    if (text.includes('<')) { el.innerHTML = text; }
    else { el.textContent = text; }
  });

  document.querySelectorAll('select option[data-en]').forEach(opt => {
    const text = opt.getAttribute('data-' + lang);
    if (text) opt.textContent = text;
  });

  document.querySelectorAll('textarea[data-en-placeholder]').forEach(el => {
    el.placeholder = el.getAttribute('data-' + lang + '-placeholder') || el.placeholder;
  });

  localStorage.setItem('kryspt-lang', lang);
}

document.getElementById('lang-toggle')?.addEventListener('click', () => {
  applyLanguage(currentLang === 'en' ? 'pl' : 'en');
});

const savedLang = localStorage.getItem('kryspt-lang');
if (savedLang && savedLang !== 'en') applyLanguage(savedLang);

/* ── ACTIVE NAV LINK ON SCROLL ── */
const sections = document.querySelectorAll('section[id], div[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('nav-active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => activeObserver.observe(s));
