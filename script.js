const burger = document.getElementById('burger');
const header = document.getElementById('header');

if (burger && header) {
  burger.addEventListener('click', () => header.classList.toggle('open'));
  // Close on any nav link or button inside nav
  document.querySelectorAll('.nav__link, .nav .btn').forEach(l => l.addEventListener('click', () => header.classList.remove('open')));
  // Close when clicking outside header
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) header.classList.remove('open');
  });
}

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
  if (window.scrollY > 20) {
    header.classList.add('header--scrolled');
  } else {
    // Only remove if the header isn't forced to stay scrolled (e.g., on white pages)
    if (header.getAttribute('data-keep-scrolled') !== 'true') {
      header.classList.remove('header--scrolled');
    }
  }
});

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const lang = document.documentElement.lang || 'uk';
    
    // Collect data
    const formData = {
      name: document.getElementById('userName').value,
      email: document.getElementById('userEmail').value,
      phone: document.getElementById('phone').value,
      budget: document.getElementById('budget').value,
      rooms: document.getElementById('rooms').value,
      district: document.getElementById('district').value,
      date: document.getElementById('moveInDate').value,
      comments: document.getElementById('comments').value,
      lang: lang
    };

    const originalText = btn.textContent;
    btn.textContent = '...';
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';

    try {
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        btn.textContent = '✓';
        btn.style.background = '#00d4aa';
        form.reset();
        setTimeout(() => {
          window.location.href = lang === 'uk' ? 'thank-you.html' : `/${lang}/thank-you.html`;
        }, 1500);
      } else {
        const errorData = await response.json();
        console.error('Submission error:', errorData);
        throw new Error('Failed to send');
      }
    } catch (error) {
      console.error('Form error:', error);
      btn.textContent = 'Error';
      btn.style.background = '#ff4d4d';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'all';
      }, 3000);
    }
  });
}

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

const statsSection = document.querySelector('.stats');
if (statsSection) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.stats__number').forEach(animateCounter);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  counterObserver.observe(statsSection);
}

