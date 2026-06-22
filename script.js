/* ============================================================
   SONDRICH LIMITED — shared script (runs on every page)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---- clear the page-in entrance animation once it finishes ----
     a CSS animation with fill-mode:forwards stays "active" indefinitely,
     which keeps creating a containing block for position:fixed children
     (header, mobile menu, floating buttons) instead of the viewport. */
  document.body.addEventListener('animationend', (e) => {
    if (e.animationName === 'pageIn') document.body.style.animation = 'none';
  });

  /* ---- header scroll state ---- */
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30));
  }

  /* ---- mobile menu ---- */
  const burger = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
  }

  /* ---- active nav link (based on current filename) ---- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---- hero 3D parallax / idle float (home page only) ---- */
  const stage = document.getElementById('windowStage');
  const heroSection = document.getElementById('heroSection');
  if (stage && heroSection) {
    window.addEventListener('load', () => {
      setTimeout(() => stage.classList.add('is-open'), 500);
    });
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (supportsHover) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        stage.style.transform = `rotateX(${y * -8}deg) rotateY(${x * 10}deg)`;
      });
      heroSection.addEventListener('mouseleave', () => { stage.style.transform = ''; });
    } else {
      stage.classList.add('idle-float');
    }
  }

  /* ---- scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---- glass-anim: brief demo pulse on first view, plus tap-to-toggle for touch/click ---- */
  const glassEls = document.querySelectorAll('.glass-anim');
  if (glassEls.length) {
    const catIO = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          setTimeout(() => {
            el.classList.add('demo-open');
            setTimeout(() => el.classList.remove('demo-open'), 1100);
          }, i * 90);
          catIO.unobserve(el);
        }
      });
    }, { threshold: 0.45 });
    glassEls.forEach(el => catIO.observe(el));

    glassEls.forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => el.classList.toggle('is-active'));
    });
  }

  /* ---- scroll to top button ---- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 500));
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- quote form -> WhatsApp ---- */
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('qName').value.trim();
      const phone = document.getElementById('qPhone').value.trim();
      const service = document.getElementById('qService').value;
      const msg = document.getElementById('qMsg').value.trim();
      const text = `Hello Sondrich Limited, my name is ${name} (${phone}). I'm interested in: ${service}. Details: ${msg || 'N/A'}`;
      window.open(`https://wa.me/255680967142?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

});
