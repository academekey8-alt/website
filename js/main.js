/* AcademeKey — main.js  (runs on every page) */

/* ── Glass nav on scroll ── */
(function () {
  const hdr = document.getElementById('mainHeader') || document.querySelector('header');
  if (!hdr) return;
  const toggle = () => hdr.classList.toggle('nav-solid', window.scrollY > 80);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
})();

/* ── Knowledge Path nav line (scroll progress, <5% opacity) ── */
(function () {
  const kpath = document.getElementById('navKPath');
  if (!kpath) return;
  const update = () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;
    kpath.style.width = pct + '%';
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

/* ── Mobile nav ── */
(function () {
  const btn      = document.getElementById('hamburger');
  const menu     = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  const open  = () => {
    btn.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => {
    btn.getAttribute('aria-expanded') === 'true' ? close() : open();
  });

  /* Close on any link click */
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  /* Close on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) close();
  });

  /* Close on outside click (tap on veil area — menu is full-screen so this is a touch on the header) */
})();

/* ── Active nav link ── */
(function () {
  const path = window.location.pathname.replace(/\/$/, '');
  document.querySelectorAll('.nav-links > a, .mob-link').forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/\/$/, '');
    if (!href) return;
    /* exact match or ends-with for index */
    const isHome   = (href === 'index.html' || href === '/') && (path === '' || path.endsWith('index.html') || path === '/');
    const isMatch  = !isHome && href && path.endsWith(href);
    if (isHome || isMatch) a.classList.add('active');
  });
})();

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = id ? document.getElementById(id) : null;
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ── Tabs (program detail page) ── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const pane = document.getElementById(target);
    if (pane) pane.classList.add('active');
  });
});

/* ── Why AcademeKey — staggered card reveal ── */
(function () {
  const cards = document.querySelectorAll('[data-why-anim]');
  if (!cards.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('why-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  cards.forEach(c => io.observe(c));
})();

/* ── Who We Are — scroll reveal ── */
(function () {
  const sec = document.getElementById('whoWeAre');
  if (!sec) return;
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { sec.classList.add('wwa-visible'); io.disconnect(); }
  }, { threshold: 0.12 });
  io.observe(sec);
})();

/* ── Program search (programs page) ── */
const searchInput = document.getElementById('progSearch');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll('.prog-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? '' : 'none';
    });
  });
}
