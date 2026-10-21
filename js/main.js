/**
 * KULITHA HANSAJA - PERSONAL PORTFOLIO JAVASCRIPT
 * Vanilla JS: Theme Toggle, Web Dev Carousel, Email & LinkedIn Sliders, Mini-Sliders, Lightbox, Scroll-Spy
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initWebDevCarousel();
  initShowcaseSliders();
  initMiniSliders();
  initScrollAnimations();
  initLightbox();
  initScrollSpy();
  initGeoTabs();
});

/* --------------------------------------------------------------------------
   1. Dark / Light Theme Toggle with LocalStorage Persistence
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('kh_theme');
  const initialTheme = savedTheme ? savedTheme : 'dark';
  document.documentElement.setAttribute('data-theme', initialTheme);
  updateToggleAria(initialTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Add temporary class for smooth 180ms color/background transition
    document.documentElement.classList.add('theme-transition');
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('kh_theme', nextTheme);
    updateToggleAria(nextTheme);

    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 220);
  });

  function updateToggleAria(theme) {
    toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  if (!hamburgerBtn || !navMenu) return;

  hamburgerBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      navMenu.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   2. Web Dev Auto-Sliding Carousel (with Slide Counter & Dots)
   -------------------------------------------------------------------------- */
function initWebDevCarousel() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  const counterEl = document.getElementById('carouselCounter');
  const slides = document.querySelectorAll('.carousel-slide');

  if (!track || !slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;
  const autoplayInterval = 4500;

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const updateUI = () => {
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
    if (counterEl) {
      counterEl.textContent = `0${currentIndex + 1} / 0${totalSlides}`;
    }
  };

  const goToSlide = (index) => {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateUI();
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
  }

  const startAutoplay = () => {
    autoplayTimer = setInterval(nextSlide, autoplayInterval);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
  };

  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  const carouselWrapper = document.querySelector('.carousel-wrapper');
  if (carouselWrapper) {
    carouselWrapper.addEventListener('mouseenter', stopAutoplay);
    carouselWrapper.addEventListener('mouseleave', startAutoplay);
  }

  updateUI();
  startAutoplay();

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      nextSlide();
      resetAutoplay();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
      resetAutoplay();
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   4. Email Campaigns & LinkedIn Covers Sliders (Shared Robust Architecture)
   -------------------------------------------------------------------------- */
function initShowcaseSliders() {
  setupTrackSlider('emailTrack', 'emailPrev', 'emailNext', 'emailDots', 4200);
  setupTrackSlider('linkedinTrack', 'linkedinPrev', 'linkedinNext', 'linkedinDots', 4200);
}

function setupTrackSlider(trackId, prevBtnId, nextBtnId, dotsId, interval = 4200) {
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);
  const dotsContainer = document.getElementById(dotsId);

  if (!track) return;
  const slides = track.querySelectorAll('.newsletter-slide');
  if (!slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let timer = null;

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const updateDots = () => {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  const goToSlide = (index) => {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetTimer();
    });
  }

  const startTimer = () => {
    timer = setInterval(nextSlide, interval);
  };

  const stopTimer = () => {
    if (timer) clearInterval(timer);
  };

  const resetTimer = () => {
    stopTimer();
    startTimer();
  };

  const parentCard = track.closest('.newsletter-showcase-card');
  if (parentCard) {
    parentCard.addEventListener('mouseenter', stopTimer);
    parentCard.addEventListener('mouseleave', startTimer);
  }

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      nextSlide();
      resetTimer();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
      resetTimer();
    }
  }, { passive: true });

  updateDots();
  startTimer();
}

/* --------------------------------------------------------------------------
   4. Independent Mini-Sliders (Power BI Dashboards)
   -------------------------------------------------------------------------- */
function initMiniSliders() {
  const miniSliders = document.querySelectorAll('[data-mini-slider]');

  miniSliders.forEach(slider => {
    const track = slider.querySelector('.mini-slider-track');
    const slides = slider.querySelectorAll('.mini-slide');
    const prevBtn = slider.querySelector('.mini-prev');
    const nextBtn = slider.querySelector('.mini-next');
    const dotsContainer = slider.querySelector('.mini-slider-dots');

    if (!track || !slides.length) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let timer = null;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = `mini-dot ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          goToMiniSlide(idx);
          resetMiniTimer();
        });
        dotsContainer.appendChild(dot);
      });
    }

    const updateMiniDots = () => {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.mini-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    const goToMiniSlide = (index) => {
      currentIndex = (index + totalSlides) % totalSlides;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateMiniDots();
    };

    const nextMiniSlide = () => goToMiniSlide(currentIndex + 1);
    const prevMiniSlide = () => goToMiniSlide(currentIndex - 1);

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevMiniSlide();
        resetMiniTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextMiniSlide();
        resetMiniTimer();
      });
    }

    const startMiniTimer = () => {
      timer = setInterval(nextMiniSlide, 3800);
    };

    const stopMiniTimer = () => {
      if (timer) clearInterval(timer);
    };

    const resetMiniTimer = () => {
      stopMiniTimer();
      startMiniTimer();
    };

    slider.addEventListener('mouseenter', stopMiniTimer);
    slider.addEventListener('mouseleave', startMiniTimer);

    startMiniTimer();
  });
}

/* --------------------------------------------------------------------------
   5. Scroll Animations (Fade-Up ~400ms)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   6. Lightbox Modal
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');

  if (!modal || !img || !closeBtn) return;

  const openLightbox = (src, title) => {
    img.src = src;
    caption.textContent = title || '';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-zoom]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a') || e.target.classList.contains('mini-dot')) return;
      const clickedImg = e.target.closest('img');
      const targetImg = el.querySelector('img') || el;
      const src = clickedImg ? clickedImg.src : (el.getAttribute('data-zoom') || targetImg.src);
      const title = clickedImg ? (clickedImg.alt || el.getAttribute('data-caption')) : (el.getAttribute('data-caption') || targetImg.alt || '');
      openLightbox(src, title);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   8. Scroll-Spy (Highlight Active Nav Link)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   9. GEO Platform Tab Switcher (Nestlé Case Study)
   -------------------------------------------------------------------------- */
function initGeoTabs() {
  const tabBtns = document.querySelectorAll('.geo-tab-btn');
  const tabPanels = document.querySelectorAll('.geo-tab-panel');
  if (!tabBtns.length || !tabPanels.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPlatform = btn.getAttribute('data-platform');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      if (targetPlatform === 'all') {
        tabPanels.forEach(p => p.classList.add('active'));
      } else {
        const activePanel = document.getElementById(`panel-${targetPlatform}`);
        if (activePanel) {
          activePanel.classList.add('active');
        }
      }
    });
  });
}
