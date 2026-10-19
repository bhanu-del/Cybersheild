/**
 * CyberShield — Interactive Cyber HUD & Particle Telemetry Engine
 * Activated STRICTLY in Dark Mode ([data-theme="dark"]).
 * Dormant and hidden in Light Mode ([data-theme="light"]).
 * 
 * Features:
 * 1. Interactive Cyber Mesh & Threat Nodes that dynamically react to mouse cursor.
 * 2. Rotating Radar Sonar Sweep beam inspired by Military / SOC Threat Monitors.
 * 3. Dynamic Card Spotlight & Neon Glare that follows the mouse pointer.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  let canvas = null;
  let ctx = null;
  let animId = null;
  let isRunning = false;
  let width = 0;
  let height = 0;

  const mouse = {
    x: -9999,
    y: -9999,
    radius: 180,
    isActive: false
  };

  function getNodeCount() {
    return (window.innerWidth <= 768) ? 22 : 55;
  }

  const nodes = [];
  const colors = ['#00F0FF', '#00FF88', '#38BDF8', '#818CF8', '#00E5FF'];

  // Radar sweep angle
  let radarAngle = 0;

  function initNodes() {
    nodes.length = 0;
    const count = getNodeCount();
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        radius: Math.random() * 2.0 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.03 + Math.random() * 0.03
      });
    }
  }

  function resize() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function updateCardSpotlight(clientX, clientY) {
    const cards = document.querySelectorAll('.card, .quick-tool-card, .metric-card, .ai-verdict-card, .lesson-card, .hero-banner');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  }

  function handleMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.isActive = true;
    updateCardSpotlight(e.clientX, e.clientY);
  }

  function handleMouseLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
    mouse.isActive = false;
  }

  function handleTouchStart(e) {
    if (!e.touches || !e.touches[0]) return;
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
    mouse.isActive = true;
    updateCardSpotlight(mouse.x, mouse.y);
  }

  function handleTouchMove(e) {
    if (!e.touches || !e.touches[0]) return;
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
    mouse.isActive = true;
    updateCardSpotlight(mouse.x, mouse.y);
  }

  function handleTouchEnd() {
    mouse.isActive = false;
    mouse.x = -9999;
    mouse.y = -9999;
  }

  function renderFrame() {
    if (!isRunning || !ctx) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Rotating Holographic Radar in background
    const isMobile = width <= 768;
    const radarCenterX = isMobile ? width / 2 : width - 180;
    const radarCenterY = isMobile ? 120 : 180;
    const radarRadius = isMobile ? 75 : 140;

    ctx.save();
    ctx.strokeStyle = isMobile ? 'rgba(0, 240, 255, 0.05)' : 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1;

    // Radar concentric rings
    const ringStep = isMobile ? 25 : 35;
    for (let r = ringStep; r <= radarRadius; r += ringStep) {
      ctx.beginPath();
      ctx.arc(radarCenterX, radarCenterY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Radar crosshair lines
    ctx.beginPath();
    ctx.moveTo(radarCenterX - radarRadius, radarCenterY);
    ctx.lineTo(radarCenterX + radarRadius, radarCenterY);
    ctx.moveTo(radarCenterX, radarCenterY - radarRadius);
    ctx.lineTo(radarCenterX, radarCenterY + radarRadius);
    ctx.stroke();

      // Rotating Scanner Beam
      radarAngle += 0.018;
      const beamX = radarCenterX + Math.cos(radarAngle) * radarRadius;
      const beamY = radarCenterY + Math.sin(radarAngle) * radarRadius;

      const beamGrad = ctx.createRadialGradient(radarCenterX, radarCenterY, 5, radarCenterX, radarCenterY, radarRadius);
      beamGrad.addColorStop(0, 'rgba(0, 255, 136, 0.25)');
      beamGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.12)');
      beamGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

      ctx.beginPath();
      ctx.moveTo(radarCenterX, radarCenterY);
      ctx.arc(radarCenterX, radarCenterY, radarRadius, radarAngle - 0.35, radarAngle);
      ctx.closePath();
      ctx.fillStyle = beamGrad;
      ctx.fill();

      // Leading beam line
      ctx.beginPath();
      ctx.moveTo(radarCenterX, radarCenterY);
      ctx.lineTo(beamX, beamY);
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }

    // 2. Draw Nodes & Interconnecting Cyber Mesh
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      // Update position
      node.x += node.vx;
      node.y += node.vy;

      // Wrap around screen boundaries
      if (node.x < 0) node.x = width;
      if (node.x > width) node.x = 0;
      if (node.y < 0) node.y = height;
      if (node.y > height) node.y = 0;

      // Mouse attraction/repulsion reaction
      if (mouse.isActive) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 1) {
          const force = (mouse.radius - dist) / mouse.radius;
          node.x += (dx / dist) * force * 1.8;
          node.y += (dy / dist) * force * 1.8;

          // Connect laser line directly to mouse cursor
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${force * 0.45})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Connect lines between nearby nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeB = nodes[j];
        const dx = node.x - nodeB.x;
        const dy = node.y - nodeB.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.22;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Pulse node glow
      node.pulse += node.pulseSpeed;
      const currentRadius = node.radius + Math.sin(node.pulse) * 0.8;

      ctx.beginPath();
      ctx.arc(node.x, node.y, Math.max(1, currentRadius), 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = node.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 3. Draw subtle cursor aura if mouse is active
    if (mouse.isActive) {
      const cursorGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
      cursorGrad.addColorStop(0, 'rgba(0, 240, 255, 0.12)');
      cursorGrad.addColorStop(0.5, 'rgba(0, 102, 255, 0.05)');
      cursorGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 140, 0, Math.PI * 2);
      ctx.fillStyle = cursorGrad;
      ctx.fill();
    }

    animId = requestAnimationFrame(renderFrame);
  }

  function start() {
    if (isRunning) return;
    if (!canvas) {
      setupCanvas();
    }
    if (!canvas) return;

    canvas.style.display = 'block';
    isRunning = true;
    resize();
    initNodes();

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    animId = requestAnimationFrame(renderFrame);
  }

  function stop() {
    if (!isRunning) return;
    isRunning = false;
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    if (canvas) {
      canvas.style.display = 'none';
      if (ctx) ctx.clearRect(0, 0, width, height);
    }
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseleave', handleMouseLeave);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  }

  function setupCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.id = 'cyber-hud-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.style.display = 'none';
    document.body.prepend(canvas);

    ctx = canvas.getContext('2d');
  }

  function updateThemeState() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      start();
    } else {
      stop();
    }
  }

  const CyberHUD = {
    init: function() {
      setupCanvas();
      updateThemeState();

      // Listen for theme preference changes
      if (global.CyberShield.State && typeof global.CyberShield.State.subscribe === 'function') {
        global.CyberShield.State.subscribe((type) => {
          if (type === 'preference_changed') {
            updateThemeState();
          }
        });
      }

      // Also observe data-theme attribute on documentElement
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          if (m.type === 'attributes' && m.attributeName === 'data-theme') {
            updateThemeState();
          }
        });
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    },

    destroy: function() {
      stop();
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      canvas = null;
      ctx = null;
    }
  };

  global.CyberShield.CyberHUD = CyberHUD;

  // Auto-init on DOMContentLoaded if DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CyberHUD.init());
  } else {
    CyberHUD.init();
  }

})(typeof window !== 'undefined' ? window : global);
