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

  /* ---- Active nav link on scroll, with sliding indicator ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar a');
  const navIndicator = document.getElementById('nav-indicator');
  const navUl = document.querySelector('.navbar ul');

  const moveIndicatorTo = (link) => {
    if (!navIndicator || !navUl || !link) return;
    const ulRect = navUl.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    // Only show the sliding underline in desktop layout (horizontal nav).
    // In the mobile stacked menu the link sits on its own line, so a
    // horizontal underline doesn't make sense there.
    if (window.innerWidth <= 860) {
      navIndicator.style.opacity = '0';
      return;
    }
    navIndicator.style.opacity = '1';
    navIndicator.style.left = (linkRect.left - ulRect.left) + 'px';
    navIndicator.style.width = linkRect.width + 'px';
  };

  const setActive = () => {
    let current = '';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) current = sec.id;
    });
    let activeLink = null;
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + current;
      link.classList.toggle('active', isActive);
      if (isActive) activeLink = link;
    });
    if (activeLink) moveIndicatorTo(activeLink);
  };
  window.addEventListener('scroll', setActive);
  window.addEventListener('resize', setActive);
  setActive();
  // re-sync once webfonts/layout settle (link widths can shift slightly)
  setTimeout(setActive, 400);

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

  /* ---- Magnetic tilt on profile photo (reacts to cursor on/near it) ---- */
  const photoWrap = document.querySelector('.about-photo-wrap');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (photoWrap && !prefersReducedMotion) {
    const maxTilt = 10;       // degrees
    const influenceRadius = 220; // px around the element that still nudges it
    const handleMove = (e) => {
      const rect = photoWrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const maxDist = Math.max(rect.width, rect.height) / 2 + influenceRadius;
      if (dist > maxDist) {
        photoWrap.style.setProperty('--tilt-x', '0deg');
        photoWrap.style.setProperty('--tilt-y', '0deg');
        return;
      }
      const strength = 1 - Math.min(dist / maxDist, 1); // 1 = right over it, 0 = at the edge of influence
      const tiltX = (dx / (rect.width / 2)) * maxTilt * strength;
      const tiltY = -(dy / (rect.height / 2)) * maxTilt * strength;
      photoWrap.style.setProperty('--tilt-x', tiltX.toFixed(2) + 'deg');
      photoWrap.style.setProperty('--tilt-y', tiltY.toFixed(2) + 'deg');
      // glow follows cursor only while actually over the card
      if (dist < Math.max(rect.width, rect.height) / 2) {
        const gx = ((e.clientX - rect.left) / rect.width) * 100;
        const gy = ((e.clientY - rect.top) / rect.height) * 100;
        photoWrap.style.setProperty('--glow-x', gx + '%');
        photoWrap.style.setProperty('--glow-y', gy + '%');
      }
    };
    const resetTilt = () => {
      photoWrap.style.setProperty('--tilt-x', '0deg');
      photoWrap.style.setProperty('--tilt-y', '0deg');
    };
    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', resetTilt);
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
