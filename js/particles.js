/* =========================================================
   PORTFOLIO — particles.js
   Fond animé léger : réseau de particules connectées,
   rendu en Canvas 2D natif (aucune dépendance externe).
   ========================================================= */

(function(){
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, particles = [];
  const COLOR = '79,124,255';   // --accent
  const COLOR_2 = '0,212,255';  // --accent-2
  const PARTICLE_COUNT_BASE = 70;
  const MAX_DIST = 140;

  function resize(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function countForViewport(){
    return Math.min(PARTICLE_COUNT_BASE, Math.floor((width * height) / 18000));
  }

  function initParticles(){
    particles = [];
    const count = countForViewport();
    for (let i = 0; i < count; i++){
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
        colorMix: Math.random()
      });
    }
  }
  initParticles();
  window.addEventListener('resize', initParticles);

  function step(){
    ctx.clearRect(0, 0, width, height);

    for (const p of particles){
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      const color = p.colorMix > 0.5 ? COLOR_2 : COLOR;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},0.7)`;
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++){
      for (let j = i + 1; j < particles.length; j++){
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST){
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${COLOR},${0.15 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (!reduceMotion) requestAnimationFrame(step);
  }

  // If reduced motion is preferred, draw a single static frame only.
  step();
})();
