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
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('STAYX: Form submission started');
    
    const btn = contactForm.querySelector('button[type="submit"]');
    const lang = document.documentElement.lang || 'uk';
    const originalText = btn.textContent;

    // Reset previous errors
    contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    try {
      // Safe helper to get value
      const getVal = (id) => {
        const el = document.getElementById(id);
        if (!el) return '—';
        return el.value;
      };

      const email = getVal('userEmail');
      const phone = getVal('phone');
      
      // 1. Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        document.getElementById('userEmail').classList.add('error');
        throw new Error('Invalid Email');
      }

      // 2. Validate Phone (using global iti instance)
      if (window.iti && !window.iti.isValidNumber()) {
        document.getElementById('phone').classList.add('error');
        throw new Error('Invalid Phone');
      }

      const formData = {
        name: getVal('userName'),
        email: email,
        phone: phone,
        budget: getVal('budget'),
        rooms: getVal('rooms'),
        district: getVal('district'),
        date: getVal('moveInDate'),
        comments: getVal('comments'),
        lang: lang
      };

      console.log('STAYX: Data collected', formData);

      btn.textContent = '...';
      btn.style.opacity = '0.7';
      btn.style.pointerEvents = 'none';

      console.log('STAYX: Sending to API...');
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('STAYX: Server response', result);

      if (response.ok) {
        btn.textContent = '✓';
        btn.style.background = '#00d4aa';
        contactForm.reset();
        setTimeout(() => {
          window.location.href = lang === 'uk' ? 'thank-you.html' : `/${lang}/thank-you.html`;
        }, 1500);
      } else {
        throw new Error(result.error || 'Server error');
      }
    } catch (error) {
      console.error('STAYX: Final form error', error);
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

// ===== FORM ENHANCEMENTS (Digits only & Date Picker) =====
function initFormEnhancements() {
  // 1. Phone: Digits only
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }

  // 2. Date: Open picker on click
  const dateInput = document.getElementById('moveInDate');
  if (dateInput) {
    dateInput.addEventListener('click', function() {
      if (this.showPicker) {
        this.showPicker();
      }
    });
  }

  // 3. Real-time validation for email & phone
  const emailInp = document.getElementById('userEmail');
  if (emailInp) {
    emailInp.addEventListener('blur', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInp.value && !emailRegex.test(emailInp.value)) {
        emailInp.classList.add('error');
      }
    });
    emailInp.addEventListener('input', () => emailInp.classList.remove('error'));
  }

  const phoneInp = document.getElementById('phone');
  if (phoneInp) {
    phoneInp.addEventListener('blur', () => {
      if (phoneInp.value && window.iti && !window.iti.isValidNumber()) {
        phoneInp.classList.add('error');
      }
    });
    phoneInp.addEventListener('input', () => phoneInp.classList.remove('error'));
  }
}

// Initialize on load
initFormEnhancements();

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

