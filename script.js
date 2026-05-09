// ===== MOBILE MENU =====
const burger = document.getElementById('burger');
const header = document.getElementById('header');
burger.addEventListener('click', () => header.classList.toggle('open'));
// Close on any nav link or button inside nav
document.querySelectorAll('.nav__link, .nav .btn').forEach(l => l.addEventListener('click', () => header.classList.remove('open')));
// Close when clicking outside header
document.addEventListener('click', (e) => {
  if (!header.contains(e.target)) header.classList.remove('open');
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq__item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq__icon').textContent = '+';
    });
    if (!wasActive) {
      item.classList.add('active');
      item.querySelector('.faq__icon').textContent = '×';
    }
  });
});

// ===== HEADER SCROLL =====
window.addEventListener('scroll', () => {
  header.style.boxShadow = scrollY > 10 ? '0 1px 4px rgba(0,0,0,.05)' : 'none';
});

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = '✓ Надіслано!';
  btn.style.background = '#00d4aa';
  btn.style.pointerEvents = 'none';
  setTimeout(() => { btn.textContent = 'Відправити →'; btn.style.background = ''; btn.style.pointerEvents = ''; form.reset(); }, 3000);
});

// ===== ANIMATED COUNTER =====
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1800;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * ease);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stats__number').forEach(animateCounter);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
const statsSection = document.querySelector('.stats');
if (statsSection) counterObserver.observe(statsSection);

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
}, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('section').forEach(el => { el.classList.add('reveal'); revealObs.observe(el); });

// ===== STAGGERED GRID REVEAL =====
const staggerObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      Array.from(entry.target.children).forEach((child, i) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(24px)';
        child.style.transition = `opacity .6s cubic-bezier(.16,1,.3,1) ${i * 80}ms, transform .6s cubic-bezier(.16,1,.3,1) ${i * 80}ms`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        }));
      });
      staggerObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.audience__grid,.steps__grid,.testimonials__grid,.services__grid,.features__grid,.stats__grid,.bento-grid').forEach(g => staggerObs.observe(g));
