// ============================================================
// ADIB ABDELLAH — PORTFOLIO INTERACTIONS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Page loader ---- */
  const loader = document.querySelector('.loader-container');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hide'), 350);
  });
  // fallback in case 'load' already fired
  setTimeout(() => loader && loader.classList.add('hide'), 1800);

  /* ---- Mobile nav toggle ---- */
  const menuBtn = document.getElementById('menu');
  const navbar = document.querySelector('.navbar');
  if (menuBtn && navbar) {
    menuBtn.addEventListener('click', () => {
      navbar.classList.toggle('active');
      menuBtn.classList.toggle('is-open');
    });
    document.querySelectorAll('.navbar a').forEach(a => {
      a.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuBtn.classList.remove('is-open');
      });
    });
  }

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar a');
  const setActive = () => {
    let current = '';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', setActive);
  setActive();

  /* ---- Scroll-to-top button ---- */
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) scrollTopBtn?.classList.add('show');
    else scrollTopBtn?.classList.remove('show');
  });

  /* ---- Reveal on scroll (with safety fallback) ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
    // Safety net: guarantee everything is visible even if an element is
    // somehow never intersected (e.g. zero-height parent, JS error elsewhere).
    setTimeout(() => revealEls.forEach(el => el.classList.add('in')), 2500);
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---- Typed role line in hero (no external dep, hand-rolled) ---- */
  const roles = [
    'Systèmes & Réseaux',
    'Cybersécurité & SOC',
    'Architecture IA-driven',
    'Infrastructure Windows / Linux'
  ];
  const typedEl = document.getElementById('typed-role');
  if (typedEl) {
    let roleIndex = 0, charIndex = 0, deleting = false;
    const tick = () => {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 55);
    };
    tick();
  }

  /* ---- Contact form via Formspree (AJAX, keeps user on page) ---- */
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Envoi...';
      btn.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          statusEl.textContent = '✓ Message envoyé — réponse sous 24-48h.';
          statusEl.className = 'form-status ok';
          form.reset();
        } else {
          throw new Error('Send failed');
        }
      } catch (err) {
        statusEl.textContent = '✗ Erreur d\'envoi. Contactez-moi directement par email.';
        statusEl.className = 'form-status err';
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }

  /* ---- Live local-time readout (Morocco) in hero status bar ---- */
  const clockEl = document.getElementById('live-clock');
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      const opts = { timeZone: 'Africa/Casablanca', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      clockEl.textContent = now.toLocaleTimeString('fr-FR', opts) + ' GMT+1';
    };
    updateClock();
    setInterval(updateClock, 1000);
  }
});
