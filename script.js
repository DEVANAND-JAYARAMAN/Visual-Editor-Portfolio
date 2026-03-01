/* -------------------------------------------
   Thiru Portfolio Website - Global Scripts
   ------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  setupScrollReveal();
  setupSkillBars();
  setupPortfolioFiltersAndModal();
  setupTestimonialsCarousel();
  setupContactFormValidation();
  setupDynamicYear();
});

function setupMobileNav() {
  const toggleButton = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('#siteNav');

  if (!toggleButton || !nav) return;

  toggleButton.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });
}

function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function setupSkillBars() {
  const skillBars = document.querySelectorAll('.skill-fill[data-level]');
  if (!skillBars.length) return;

  const animateBars = () => {
    skillBars.forEach((bar) => {
      const level = bar.getAttribute('data-level');
      bar.style.width = `${level}%`;
    });
  };

  if (!('IntersectionObserver' in window)) {
    animateBars();
    return;
  }

  const skillsSection = document.querySelector('.skills');
  if (!skillsSection) {
    animateBars();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateBars();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(skillsSection);
}

function setupPortfolioFiltersAndModal() {
  const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
  const portfolioItems = document.querySelectorAll('.portfolio-item[data-category]');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedFilter = button.getAttribute('data-filter');

      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      portfolioItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        const shouldShow = selectedFilter === 'all' || selectedFilter === itemCategory;
        item.classList.toggle('hidden', !shouldShow);
      });
    });
  });

  const modal = document.querySelector('#portfolioModal');
  if (!modal || !portfolioItems.length) return;

  const modalTitle = modal.querySelector('[data-modal-title]');
  const modalCategory = modal.querySelector('[data-modal-category]');
  const modalPreview = modal.querySelector('[data-modal-preview]');
  const closeButton = modal.querySelector('[data-modal-close]');

  portfolioItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (!modalTitle || !modalCategory || !modalPreview) return;

      const title = item.getAttribute('data-title') || 'Project Preview';
      const category = item.getAttribute('data-category') || 'Portfolio';
      const gradient = item.getAttribute('data-gradient') || 'linear-gradient(140deg, #2a4270, #1a1f35)';

      modalTitle.textContent = title;
      modalCategory.textContent = category;
      modalPreview.style.background = gradient;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  closeButton?.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

function setupTestimonialsCarousel() {
  const track = document.querySelector('[data-carousel-track]');
  const slides = track?.querySelectorAll('.testimonial') || [];
  const prevButton = document.querySelector('[data-carousel-prev]');
  const nextButton = document.querySelector('[data-carousel-next]');

  if (!track || !slides.length) return;

  let currentIndex = 0;

  const updateSlide = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  };

  const moveNext = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide();
  };

  const movePrev = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide();
  };

  nextButton?.addEventListener('click', moveNext);
  prevButton?.addEventListener('click', movePrev);

  setInterval(moveNext, 4500);
}

function setupContactFormValidation() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  const fields = {
    name: form.querySelector('#name'),
    email: form.querySelector('#email'),
    subject: form.querySelector('#subject'),
    message: form.querySelector('#message')
  };

  const errors = {
    name: form.querySelector('[data-error="name"]'),
    email: form.querySelector('[data-error="email"]'),
    subject: form.querySelector('[data-error="subject"]'),
    message: form.querySelector('[data-error="message"]')
  };

  const messageBox = form.querySelector('#formMessage');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let isValid = true;

    Object.values(errors).forEach((errorNode) => {
      if (errorNode) errorNode.textContent = '';
    });
    if (messageBox) messageBox.textContent = '';

    const nameValue = fields.name?.value.trim() || '';
    const emailValue = fields.email?.value.trim() || '';
    const subjectValue = fields.subject?.value.trim() || '';
    const messageValue = fields.message?.value.trim() || '';

    if (nameValue.length < 2) {
      if (errors.name) errors.name.textContent = 'Please enter your name.';
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
      if (errors.email) errors.email.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    if (subjectValue.length < 3) {
      if (errors.subject) errors.subject.textContent = 'Please add a subject.';
      isValid = false;
    }

    if (messageValue.length < 10) {
      if (errors.message) errors.message.textContent = 'Message should be at least 10 characters.';
      isValid = false;
    }

    if (!isValid) return;

    if (messageBox) {
      messageBox.textContent = 'Thanks! Your message has been validated and is ready to send.';
    }

    form.reset();
  });
}

function setupDynamicYear() {
  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}
