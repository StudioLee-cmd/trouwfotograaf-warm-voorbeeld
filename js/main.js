/* ============================================================
   CLIENT WARM TEMPLATE — MAIN.JS
   Inspired by Gatherwell — warm, editorial community aesthetic.
   No dependencies (no GSAP, no Lenis). Vanilla JS only.
   Handles: scroll reveals, sticky testimonials, mobile menu,
   blog filters, pricing toggle, FAQ accordion, smooth scroll,
   form validation, counter animation, lazy loading.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initStickyTestimonials();
  initMobileMenu();
  initBlogFilters();
  initPricingToggle();
  initFaqAccordion();
  initSmoothScroll();
  initFormValidation();
  initCounterAnimation();
  initLazyLoading();
});


// --- 1. SCROLL REVEAL ANIMATIONS ---

const initScrollReveal = () => {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add('revealed');

        // Stagger children if parent has .reveal-stagger
        if (el.classList.contains('reveal-stagger')) {
          const children = el.children;
          Array.from(children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 120}ms`;
            child.classList.add('revealed');
          });
        }

        revealObserver.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
};


// --- 2. STICKY TESTIMONIAL CARDS ---

const initStickyTestimonials = () => {
  const cards = document.querySelectorAll('.testimonial-card');
  if (!cards.length) return;

  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    },
    { threshold: 0.5 }
  );

  cards.forEach((card) => cardObserver.observe(card));
};


// --- 3. MOBILE MENU TOGGLE ---

const initMobileMenu = () => {
  const menuBtn = document.querySelector('.mobile-menu-toggle') || document.querySelector('.menu-btn');
  const menuOverlay = document.querySelector('.mobile-menu-overlay') || document.querySelector('.menu-overlay');
  const closeBtn = menuOverlay?.querySelector('.mobile-menu-close') || menuOverlay?.querySelector('.menu-close');

  if (!menuBtn || !menuOverlay) return;

  const openMenu = () => {
    menuOverlay.classList.add('active');
    menuBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    menuOverlay.classList.remove('active');
    menuBtn.classList.remove('active');
    document.body.style.overflow = '';
  };

  menuBtn.addEventListener('click', () => {
    menuOverlay.classList.contains('active') ? closeMenu() : openMenu();
  });

  // Close on close button click
  closeBtn?.addEventListener('click', closeMenu);

  // Close on backdrop click (click on overlay itself, not its children)
  menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) closeMenu();
  });

  // Close on link click inside menu
  menuOverlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
      closeMenu();
    }
  });
};


// --- 4. BLOG FILTERS ---

const initBlogFilters = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const blogItems = document.querySelectorAll('.blog-item');

  if (!filterBtns.length || !blogItems.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category || 'all';

      // Update active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Fade out all items first
      blogItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(12px)';
      });

      // After fade-out, show/hide and fade matching items back in
      setTimeout(() => {
        blogItems.forEach((item) => {
          const matches =
            category === 'all' || item.dataset.category === category;

          item.style.display = matches ? '' : 'none';

          if (matches) {
            // Force reflow before animating back
            void item.offsetHeight;
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }
        });
      }, 300);
    });
  });
};


// --- 5. PRICING TOGGLE ---

const initPricingToggle = () => {
  const toggle = document.querySelector('.pricing-toggle');
  if (!toggle) return;

  const monthlyPrices = document.querySelectorAll('.monthly-price');
  const yearlyPrices = document.querySelectorAll('.yearly-price');

  const updatePricing = () => {
    const isYearly = toggle.checked;

    monthlyPrices.forEach((el) => {
      el.style.display = isYearly ? 'none' : '';
    });

    yearlyPrices.forEach((el) => {
      el.style.display = isYearly ? '' : 'none';
    });
  };

  // Set initial state
  updatePricing();

  toggle.addEventListener('change', updatePricing);
};


// --- 6. FAQ ACCORDION ---

const initFaqAccordion = () => {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    // Set initial collapsed height
    answer.style.maxHeight = '0';
    answer.style.overflow = 'hidden';
    answer.style.transition = 'max-height 0.4s ease, opacity 0.3s ease';
    answer.style.opacity = '0';

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items first
      faqItems.forEach((other) => {
        if (other === item) return;
        const otherAnswer = other.querySelector('.faq-answer');
        other.classList.remove('active');
        if (otherAnswer) {
          otherAnswer.style.maxHeight = '0';
          otherAnswer.style.opacity = '0';
        }
      });

      // Toggle clicked item
      if (isOpen) {
        item.classList.remove('active');
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.opacity = '1';
      }
    });
  });
};


// --- 7. SMOOTH SCROLL TO ANCHOR ---

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight =
        document.querySelector('header')?.offsetHeight || 0;
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

      window.scrollTo({ top: targetPosition, behavior: 'smooth' });

      // Update URL hash without jumping
      history.pushState(null, '', targetId);
    });
  });
};


// --- 8. FORM VALIDATION ---

const initFormValidation = () => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  // Remove any existing inline errors
  const clearErrors = () => {
    form.querySelectorAll('.field-error').forEach((el) => el.remove());
    form
      .querySelectorAll('.has-error')
      .forEach((el) => el.classList.remove('has-error'));
  };

  const showError = (field, message) => {
    field.classList.add('has-error');

    // Don't duplicate error messages
    const existing = field.parentElement?.querySelector('.field-error');
    if (existing) {
      existing.textContent = message;
      return;
    }

    const errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    errorEl.style.cssText =
      'display:block;color:var(--color-error, #c0392b);font-size:0.85rem;margin-top:4px;';
    field.parentElement?.appendChild(errorEl);
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) => {
    if (!phone) return true; // phone is optional
    return /^[\d\s\-+()]{7,}$/.test(phone);
  };

  form.addEventListener('submit', (e) => {
    clearErrors();
    let isValid = true;

    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach((field) => {
      const value = field.value.trim();

      if (!value) {
        showError(field, 'Dit veld is verplicht.');
        isValid = false;
        return;
      }

      if (field.type === 'email' && !validateEmail(value)) {
        showError(field, 'Voer een geldig e-mailadres in.');
        isValid = false;
        return;
      }

      if (field.type === 'tel' && !validatePhone(value)) {
        showError(field, 'Voer een geldig telefoonnummer in.');
        isValid = false;
      }
    });

    if (!isValid) {
      e.preventDefault();

      // Scroll to first error
      const firstError = form.querySelector('.has-error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Clear individual field error on input
  form.addEventListener('input', (e) => {
    const field = e.target;
    if (field.classList.contains('has-error')) {
      field.classList.remove('has-error');
      field.parentElement?.querySelector('.field-error')?.remove();
    }
  });
};


// --- 9. COUNTER ANIMATION ---

const initCounterAnimation = () => {
  const counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;

    const duration = 2000;
    const startTime = performance.now();
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for a smooth deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easedProgress * target);

      el.textContent = prefix + current.toLocaleString('nl-NL') + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
};


// --- 10. IMAGE LAZY LOADING ---

const initLazyLoading = () => {
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach((img) => {
    img.setAttribute('loading', 'lazy');
  });
};
