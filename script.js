/* ================================================
   LAMBORGHINI-INSPIRED PORTFOLIO — JAVASCRIPT
   Raihan Putra Nurhamsyah
   ================================================ */

(function () {
  'use strict';

  // ————————————————————————————————————————
  // GOLD PARTICLE CANVAS ANIMATION
  // ————————————————————————————————————————
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let mouseX = 0;
  let mouseY = 0;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
      this.fadeSpeed = Math.random() * 0.005 + 0.001;
      // Gold color with slight variation
      const goldVariant = Math.random();
      if (goldVariant < 0.6) {
        this.color = '255, 192, 0';   // Lamborghini Gold
      } else if (goldVariant < 0.85) {
        this.color = '255, 206, 62';  // Gold Light
      } else {
        this.color = '255, 255, 255'; // White sparkle
      }
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.fadeDirection * this.fadeSpeed;

      if (this.opacity <= 0.05 || this.opacity >= 0.6) {
        this.fadeDirection *= -1;
      }

      // Mouse interaction — subtle attraction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        this.x += dx * 0.002;
        this.y += dy * 0.002;
      }

      // Wrap around
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 200);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 192, 0, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
  }

  // Initialize canvas
  resizeCanvas();
  initParticles();
  animateParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // ————————————————————————————————————————
  // SCROLL-TRIGGERED REVEAL ANIMATIONS
  // ————————————————————————————————————————
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ————————————————————————————————————————
  // NAVIGATION — SCROLL EFFECT
  // ————————————————————————————————————————
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hero progress bar
    const hero = document.getElementById('hero');
    const heroHeight = hero.offsetHeight;
    const scrollPercent = Math.min((window.scrollY / heroHeight) * 100, 100);
    const progressBar = document.getElementById('hero-progress');
    if (progressBar) {
      progressBar.style.width = scrollPercent + '%';
    }
  });

  // ————————————————————————————————————————
  // MOBILE MENU TOGGLE
  // ————————————————————————————————————————
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu on link click
  document.querySelectorAll('[data-menu-link]').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ————————————————————————————————————————
  // SMOOTH SCROLL
  // ————————————————————————————————————————
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80; // Account for fixed nav
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  // ————————————————————————————————————————
  // BACK TO TOP
  // ————————————————————————————————————————
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ————————————————————————————————————————
  // SKILL CARD HOVER STAGGER
  // ————————————————————————————————————————
  document.querySelectorAll('.skill-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.05}s`;
  });

  // ————————————————————————————————————————
  // TYPING EFFECT ON HERO (subtle)
  // ————————————————————————————————————————
  const heroGreeting = document.querySelector('.hero__greeting');
  if (heroGreeting) {
    const text = heroGreeting.textContent;
    heroGreeting.textContent = '';
    let charIndex = 0;

    function typeText() {
      if (charIndex < text.length) {
        heroGreeting.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeText, 60);
      }
    }

    // Start typing after a short delay
    setTimeout(typeText, 800);
  }

})();
