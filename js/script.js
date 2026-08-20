/* =========================================================
   PORTFOLIO — script.js
   Logique principale : thème, langue, navigation, curseur,
   loader, barre de progression, typing effect, compteurs,
   tilt 3D, formulaire de contact.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- LOADER ---------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader && loader.classList.add('hidden'), 400);
  });

  /* ---------- SCROLL PROGRESS BAR ---------- */
  const progressBar = document.getElementById('progress-bar');
  function updateProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar){
      progressBar.style.width = pct + '%';
      progressBar.setAttribute('aria-valuenow', Math.round(pct));
    }
  }
  window.addEventListener('scroll', updateProgress, { passive:true });

  /* ---------- NAVBAR scrolled state + active link ---------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('main section, .hero');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive:true });

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin:'-45% 0px -50% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ---------- MOBILE MENU ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinksContainer = document.getElementById('navLinks');
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    navLinksContainer.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- THEME TOGGLE (dark/light + persistence) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });

  /* ---------- LANGUAGE TOGGLE (FR/EN + persistence) ---------- */
  const langToggle = document.getElementById('langToggle');
  const langLabel = document.getElementById('langLabel');
  const heroGreeting = document.getElementById('heroGreeting');
  let currentLang = localStorage.getItem('portfolio-lang') || 'fr';

  function applyLanguage(lang){
    document.querySelectorAll('[data-fr]').forEach(el => {
      const text = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-fr');
      if (text !== null && text !== '') el.textContent = text;
    });
    if (heroGreeting){
      const isEvening = new Date().getHours() >= 12;
      heroGreeting.textContent = lang === 'en'
        ? (isEvening ? "Good evening, I'm" : "Good morning, I'm")
        : (isEvening ? 'Bonsoir, je suis' : 'Bonjour, je suis');
    }
    document.documentElement.setAttribute('lang', lang);
    langLabel.textContent = lang === 'en' ? 'EN' : 'FR';
    currentLang = lang;
    localStorage.setItem('portfolio-lang', lang);
    if (typeof restartTyping === 'function') restartTyping();
  }

  langToggle.addEventListener('click', () => {
    applyLanguage(currentLang === 'fr' ? 'en' : 'fr');
  });
  applyLanguage(currentLang);

  /* ---------- CUSTOM CURSOR ---------- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  if (window.matchMedia('(pointer: fine)').matches){
    let ringX = 0, ringY = 0, dotX = 0, dotY = 0;
    window.addEventListener('mousemove', (e) => {
      dotX = e.clientX; dotY = e.clientY;
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top = dotY + 'px';
    });
    function animateRing(){
      ringX += (dotX - ringX) * 0.18;
      ringY += (dotY - ringY) * 0.18;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();
    document.querySelectorAll('a, button, .tilt-card, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
  }

  /* ---------- BACK TO TOP ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive:true });
  backToTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ---------- TYPING EFFECT ---------- */
  const typedEl = document.getElementById('typed-text');
  const rolesFR = ['Étudiant en Informatique et télécommunications', 'Développeur web', 'Passionné de Cybersécurité'];
  const rolesEN = ['IT and Telecommunications student', 'Web developer', 'Cybersecurity enthusiast'];
  let typeIndex = 0, charIndex = 0, deleting = false, typingTimeout;

  function typeLoop(){
    const roles = currentLang === 'en' ? rolesEN : rolesFR;
    const word = roles[typeIndex % roles.length];

    if (!deleting){
      charIndex++;
      typedEl.textContent = word.slice(0, charIndex);
      if (charIndex === word.length){
        deleting = true;
        typingTimeout = setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = word.slice(0, charIndex);
      if (charIndex === 0){
        deleting = false;
        typeIndex++;
      }
    }
    typingTimeout = setTimeout(typeLoop, deleting ? 45 : 90);
  }
  window.restartTyping = function(){
    clearTimeout(typingTimeout);
    charIndex = 0; deleting = false; typeIndex = 0;
    typeLoop();
  };
  if (typedEl) typeLoop();

  /* ---------- ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 60));
        const tick = () => {
          current += step;
          if (current >= target){ el.textContent = target; el.classList.add('counted'); return; }
          el.textContent = current;
          requestAnimationFrame(tick);
        };
        tick();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold:0.4 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- SKILL BARS animate on view ---------- */
  const bars = document.querySelectorAll('.bar');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold:0.3 });
  bars.forEach(b => barObserver.observe(b));

  /* ---------- 3D TILT CARDS ---------- */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  /* ---------- AOS INIT ---------- */
  if (window.AOS){
    AOS.init({ duration:700, once:true, offset:60, easing:'ease-out-cubic' });
  }

  /* ---------- GSAP subtle parallax on hero floating icons ---------- */
  if (window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.float-icon').forEach((icon, i) => {
      gsap.to(icon, {
        y: (i % 2 === 0 ? -40 : 40),
        scrollTrigger: { trigger: '.hero', start:'top top', end:'bottom top', scrub:true }
      });
    });
  }

  /* ---------- CONTACT FORM (EmailJS) ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  const EMAILJS_PUBLIC_KEY = 'vKnHHIjV0BzC0Cudl';
  const EMAILJS_SERVICE_ID = 'service_42o0nag';
  const EMAILJS_TEMPLATE_ID = 'template_g9ed9k7';

  if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'){
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isConfigured = EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && window.emailjs;

    if (!isConfigured){
      formStatus.textContent = currentLang === 'en'
        ? 'Contact form not yet configured (see README — EmailJS setup).'
        : 'Formulaire non encore configuré (voir README — configuration EmailJS).';
      return;
    }

    submitBtn.disabled = true;
    formStatus.textContent = currentLang === 'en' ? 'Sending…' : 'Envoi en cours…';

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
      .then(() => {
        formStatus.textContent = currentLang === 'en' ? 'Message sent successfully!' : 'Message envoyé avec succès !';
        form.reset();
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        const errorMessage = error && error.text ? ` (${error.text})` : '';
        formStatus.textContent = currentLang === 'en'
          ? `An error occurred. Please try again.${errorMessage}`
          : `Une erreur est survenue. Réessayez.${errorMessage}`;
      })
      .finally(() => { submitBtn.disabled = false; });
  });

});
