/* AcademeKey — motion.js
   Premium motion language: calm · editorial · architectural · purposeful
   ─────────────────────────────────────────────────────────────────────── */
(() => {
'use strict';

/* Guard: add class so CSS can scope all motion behind JS availability */
document.documentElement.classList.add('motion-ready');

const NO_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── 1. Page veil — load fade-in + page transitions ────────────────── */
const veil = document.getElementById('pageVeil');
if (veil) {
  /* Fade out on load */
  requestAnimationFrame(() => setTimeout(() => veil.classList.add('veil-out'), 40));

  if (!NO_MOTION) {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (!href || href[0] === '#' || /^(mailto:|tel:|https?:)/.test(href)) return;
      a.addEventListener('click', e => {
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;
        e.preventDefault();
        veil.classList.remove('veil-out');
        setTimeout(() => { window.location.href = href; }, 460);
      });
    });
  }
}

/* ─── 2. Reading progress bar ────────────────────────────────────────── */
const bar = document.getElementById('readProgress');
if (bar && !NO_MOTION) {
  const tick = () => {
    const total = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${total > 0 ? Math.min(1, scrollY / total) : 0})`;
  };
  window.addEventListener('scroll', tick, { passive: true });
  tick();
}

/* ─── 3. Hero page-load sequence ─────────────────────────────────────── */
const revealEls = document.querySelectorAll('[data-reveal]');
if (revealEls.length) {
  if (NO_MOTION) {
    revealEls.forEach(el => el.classList.add('revealed'));
  } else {
    revealEls.forEach(el => {
      const delay = parseInt(el.dataset.reveal) || 0;
      setTimeout(() => el.classList.add('revealed'), delay + 60);
    });
  }
}

/* ─── 4. Scroll reveal ───────────────────────────────────────────────── */
const srEls = document.querySelectorAll('[data-sr]');
if (srEls.length) {
  if (NO_MOTION) {
    srEls.forEach(el => el.classList.add('sr-visible'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        setTimeout(
          () => target.classList.add('sr-visible'),
          parseInt(target.dataset.srDelay) || 0
        );
        io.unobserve(target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    srEls.forEach(el => io.observe(el));
  }
}

/* ─── 5. Glass card ambient float ────────────────────────────────────── */
if (!NO_MOTION) {
  const gc = document.querySelector('.hero-glass-card');
  if (gc) gc.style.animation = 'heroFloat 8s ease-in-out infinite alternate';
}

/* ─── 6. Image light sweep ───────────────────────────────────────────── */
if (!NO_MOTION) {
  const sweepEls = document.querySelectorAll('[data-sweep]');
  if (sweepEls.length) {
    const sweepIO = new IntersectionObserver(entries => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        target.classList.add('sweep-run');
        sweepIO.unobserve(target);
      });
    }, { threshold: 0.15 });
    sweepEls.forEach(el => sweepIO.observe(el));
  }
}

/* ─── 7. Magnetic CTA ────────────────────────────────────────────────── */
if (!NO_MOTION && innerWidth >= 1024) {
  const cta = document.querySelector('.btn-hero-primary');
  if (cta) {
    let raf;
    cta.addEventListener('mousemove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = cta.getBoundingClientRect();
        const dx = Math.max(-4, Math.min(4, (e.clientX - r.left - r.width  / 2) * 0.13));
        const dy = Math.max(-4, Math.min(4, (e.clientY - r.top  - r.height / 2) * 0.13));
        cta.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
      });
    });
    cta.addEventListener('mouseleave', () => { cta.style.transform = ''; });
  }
}

/* ─── 8. Cursor geometry parallax (hero) ─────────────────────────────── */
if (!NO_MOTION && innerWidth >= 1024) {
  const geo = document.querySelector('.hero-geo');
  if (geo) {
    let raf;
    window.addEventListener('mousemove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = ((e.clientX / innerWidth)  - 0.5) * 22;
        const y = ((e.clientY / innerHeight) - 0.5) * 12;
        geo.style.transform = `translate(${x}px, ${y}px)`;
      });
    }, { passive: true });
  }
}

/* ─── 9. Mission line-by-line reveal ─────────────────────────────────── */
if (!NO_MOTION) {
  const mission = document.querySelector('.mission');
  if (mission) {
    const lines = mission.querySelectorAll('[data-mission-line]');
    const underline = mission.querySelector('.mission-underline');
    const para = mission.querySelector('[data-mission-para]');
    if (lines.length) {
      const mIO = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        lines.forEach((line, i) =>
          setTimeout(() => line.classList.add('mission-line-visible'), i * 130)
        );
        const after = lines.length * 130;
        if (underline) setTimeout(() => underline.classList.add('mission-ul-visible'), after);
        if (para) setTimeout(() => para.classList.add('sr-visible'), after + 100);
        mIO.disconnect();
      }, { threshold: 0.3 });
      mIO.observe(mission);
    }
  }
}

/* ─── 10. Program card masonry reveal ───────────────────────────────── */
(function () {
  const cards = document.querySelectorAll('[data-pcard]');
  if (!cards.length) return;
  if (NO_MOTION) { cards.forEach(c => c.classList.add('pcard-visible')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      const delay = parseInt(target.dataset.pcard) || 0;
      setTimeout(() => target.classList.add('pcard-visible'), delay);
      io.unobserve(target);
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
  cards.forEach(c => {
    c.style.setProperty('--pd', (parseInt(c.dataset.pcard) || 0) + 'ms');
    io.observe(c);
  });
})();

/* ─── 12. Knowledge Path transition ─────────────────────────────────── */
(function () {
  if (NO_MOTION) return;
  const kpath = document.getElementById('kpathDivider');
  if (!kpath) return;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { kpath.classList.add('kpath-drawn'); io.disconnect(); }
  }, { threshold: 0.3 });
  io.observe(kpath);
})();

/* ─── 13. Knowledge Path — Why section crossbar rule ────────────────────
   The growing gold line echoes the A crossbar; draws once on enter.       */
(function () {
  if (NO_MOTION) return;
  const rule = document.querySelector('.why-kp-rule');
  if (!rule) return;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { rule.classList.add('kp-rule-drawn'); io.disconnect(); }
  }, { threshold: 0.5 });
  io.observe(rule);
})();

/* ─── 14. Knowledge Path — Mission logo alignment peak ───────────────────
   When the Mission section reaches 25% visibility, the accumulated logo
   geometry aligns into a recognisable logo outline at 2.8% opacity.
   Peaks for ~1.6s then dissolves. Fires exactly once per page session.    */
(function () {
  if (NO_MOTION) return;
  const mission = document.getElementById('ourMission');
  if (!mission) return;
  let fired = false;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !fired) {
      fired = true;
      io.disconnect();
      mission.classList.add('kp-peak');
      setTimeout(() => mission.classList.remove('kp-peak'), 1800);
    }
  }, { threshold: 0.25 });
  io.observe(mission);
})();

/* ─── 16. Footer Knowledge Path transition divider ──────────────────────
   The two gold arms extend from centre, then the A-mark gem crystallises. */
(function () {
  if (NO_MOTION) return;
  const t = document.getElementById('fkpTransition');
  if (!t) return;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { t.classList.add('fkp-drawn'); io.disconnect(); }
  }, { threshold: 0.5 });
  io.observe(t);
})();

/* ─── 18. Divider line expand left → right ───────────────────────────── */
if (!NO_MOTION) {
  document.querySelectorAll('[data-divider]').forEach(d => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { d.classList.add('divider-visible'); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(d);
  });
}

/* ─── 19. Footer — KP divider + section fade-up ──────────────────────── */
(function () {
  /* Auto-update copyright year on every page */
  const yr = document.getElementById('ftYear');
  if (yr) yr.textContent = new Date().getFullYear();

  const div = document.getElementById('ftKpDivider');
  const sec = document.querySelector('.ft-section');
  if (!div || !sec) return;

  if (NO_MOTION) {
    div.classList.add('ft-div-vis');
    sec.classList.add('ft-vis');
    return;
  }
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      div.classList.add('ft-div-vis');
      setTimeout(() => sec.classList.add('ft-vis'), 320);
      io.disconnect();
    }
  }, { threshold: 0.5 });
  io.observe(div);
})();

})();
