const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupMobileNavigation() {
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.getElementById('nav-links');

  if (!mobileMenu || !navLinks) {
    return;
  }

  const closeMenu = () => {
    navLinks.classList.remove('nav-open');
    mobileMenu.setAttribute('aria-expanded', 'false');
  };

  mobileMenu.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('nav-open');
    navLinks.classList.toggle('nav-open');
    mobileMenu.setAttribute('aria-expanded', String(!isOpen));
  });

  mobileMenu.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      mobileMenu.click();
    }
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') {
        closeMenu();
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }

      closeMenu();
    });
  });
}

function setupSectionHighlighting() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('main section[id], header section[id]');

  if (!navLinks.length || !sections.length) {
    return;
  }

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const sectionId = `#${entry.target.getAttribute('id')}`;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === sectionId;
          link.classList.toggle('active', isActive);
        });
      });
    },
    { threshold: 0.4, rootMargin: '-10% 0px -45% 0px' }
  );

  sections.forEach((section) => activeObserver.observe(section));
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll('.reveal');

  if (!revealItems.length) {
    return;
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }
}

function setupServiceCards() {
  const serviceCards = document.querySelectorAll('.service-flip-card');

  if (!serviceCards.length) {
    return;
  }

  serviceCards.forEach((card) => {
    const toggleCard = (event) => {
      if (event.target.closest('.service-card-action')) {
        return;
      }

      const isFlipped = card.classList.contains('is-flipped');
      card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(!isFlipped));
    };

    card.addEventListener('click', toggleCard);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleCard(event);
      }
    });
  });
}

function setupStoriesCarousel() {
  const storiesTrack = document.getElementById('storiesTrack');
  const prevButton = document.querySelector('.stories-prev');
  const nextButton = document.querySelector('.stories-next');

  if (!storiesTrack || !prevButton || !nextButton) {
    return;
  }

  const slides = Array.from(storiesTrack.children);
  if (!slides.length) {
    return;
  }

  let currentIndex = 0;
  let startX = 0;

  function getVisibleSlides() {
    if (window.innerWidth < 700) {
      return 1;
    }

    return 2;
  }

  function getGap() {
    const styles = window.getComputedStyle(storiesTrack);
    return Number.parseFloat(styles.gap) || 0;
  }

  function updateCarousel() {
    const visibleSlides = getVisibleSlides();
    const maxIndex = Math.max(slides.length - visibleSlides, 0);
    currentIndex = Math.min(currentIndex, maxIndex);

    const firstSlide = slides[0];
    const slideWidth = firstSlide.getBoundingClientRect().width + getGap();
    const offset = currentIndex * slideWidth;

    storiesTrack.style.transform = `translateX(-${offset}px)`;
    storiesTrack.style.transition = prefersReducedMotion ? 'none' : 'transform 0.45s ease';
  }

  prevButton.addEventListener('click', () => {
    currentIndex = Math.max(currentIndex - 1, 0);
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    const maxIndex = Math.max(slides.length - getVisibleSlides(), 0);
    currentIndex = Math.min(currentIndex + 1, maxIndex);
    updateCarousel();
  });

  storiesTrack.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
  }, { passive: true });

  storiesTrack.addEventListener('touchend', (event) => {
    const endX = event.changedTouches[0].clientX;
    const distance = endX - startX;

    if (Math.abs(distance) < 40) {
      return;
    }

    if (distance < 0) {
      nextButton.click();
    } else {
      prevButton.click();
    }
  }, { passive: true });

  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}

function setupTeamSlider() {
  const teamTrack = document.getElementById('teamTrack');
  const prevButton = document.querySelector('.team-prev');
  const nextButton = document.querySelector('.team-next');

  if (!teamTrack || !prevButton || !nextButton) {
    return;
  }

  const getGap = () => {
    const styles = window.getComputedStyle(teamTrack);
    return Number.parseFloat(styles.gap) || 0;
  };

  const getSlideWidth = () => {
    const firstCard = teamTrack.querySelector('.member-team');
    if (!firstCard) {
      return 0;
    }

    return firstCard.getBoundingClientRect().width + getGap();
  };

  prevButton.addEventListener('click', () => {
    teamTrack.scrollBy({
      left: -getSlideWidth(),
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });

  nextButton.addEventListener('click', () => {
    teamTrack.scrollBy({
      left: getSlideWidth(),
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });

  teamTrack.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prevButton.click();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextButton.click();
    }
  });
}

function setupTeamDetails() {
  const teamButtons = document.querySelectorAll('.team-toggle');

  teamButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const extraInfo = button.nextElementSibling;
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      if (extraInfo && extraInfo.classList.contains('team-extra')) {
        extraInfo.hidden = isExpanded;
      }

      button.setAttribute('aria-expanded', String(!isExpanded));
    });
  });
}

function animateNumber(element) {
  const target = Number(element.dataset.target || 0);
  const suffix = element.dataset.suffix || '';

  if (prefersReducedMotion) {
    element.textContent = `${target}${suffix}`;
    return;
  }

  const duration = 1400;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = Math.round(target * progress);
    element.textContent = `${currentValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function setupAnimatedStats() {
  const statItems = document.querySelectorAll('.impact-number');

  if (!statItems.length) {
    return;
  }

  if ('IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateNumber(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statItems.forEach((item) => statObserver.observe(item));
  } else {
    statItems.forEach((item) => animateNumber(item));
  }
}

function setupFormValidation() {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('form-status');

  if (!contactForm || !formStatus) {
    return;
  }

  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    message: document.getElementById('message')
  };

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const showError = (field, message) => {
    field.classList.add('invalid');
    formStatus.classList.add('error');
    formStatus.textContent = message;
  };

  Object.values(fields).forEach((field) => {
    if (!field) {
      return;
    }

    field.addEventListener('input', () => {
      field.classList.remove('invalid');
      formStatus.classList.remove('error');
      formStatus.textContent = '';
    });
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let isValid = true;

    if (!fields.name || !fields.email || !fields.message) {
      return;
    }

    if (fields.name.value.trim().length < 2) {
      showError(fields.name, 'Please enter your name.');
      isValid = false;
    }

    if (!validateEmail(fields.email.value.trim())) {
      showError(fields.email, 'Please enter a valid email address.');
      isValid = false;
    }

    if (fields.message.value.trim().length < 10) {
      showError(fields.message, 'Please add a short message so we can help you properly.');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    formStatus.classList.remove('error');
    formStatus.textContent = 'Thanks for your message. We will review it and be in touch soon.';
    contactForm.reset();
  });
}

function setupFooterYear() {
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

setupMobileNavigation();
setupSectionHighlighting();
setupRevealAnimations();
setupServiceCards();
setupStoriesCarousel();
setupTeamSlider();
setupTeamDetails();
setupAnimatedStats();
setupFormValidation();
setupFooterYear();

