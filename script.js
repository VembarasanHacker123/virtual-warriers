/* ============================================
   VIRTUAL WARRIER — MASTER JAVASCRIPT
   All interactions, animations, chatbot, 3D
   ============================================ */

(function () {
  'use strict';

  // ========== CURSOR ==========
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
  });

  function animateRing() {
    if (ring) {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // ========== NAVBAR SCROLL ==========
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  // ========== HAMBURGER ==========
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ========== PARTICLE CANVAS ==========
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let W, H;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.3;
        this.alpha = Math.random() * 0.6 + 0.1;
        this.color = Math.random() > 0.5 ? '0,240,255' : '139,92,246';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 130; i++) particles.push(new Particle());

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,240,255,${0.05 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ========== TERMINAL ANIMATION ==========
  const terminalBody = document.getElementById('terminalBody');
  if (terminalBody) {
    const lines = [
      { text: '$ initializing virtual warrier...', color: '#00f0ff', delay: 300 },
      { text: '> loading modules... [OK]', color: '#7ee8a2', delay: 700 },
      { text: '> connecting to servers... [OK]', color: '#7ee8a2', delay: 1100 },
      { text: '> auth: VERIFIED ✓', color: '#7ee8a2', delay: 1500 },
      { text: '', color: '', delay: 1800 },
      { text: '// stack initialized', color: '#8b5cf6', delay: 2100 },
      { text: 'const stack = {', color: '#e2e8f0', delay: 2400 },
      { text: '  frontend: "React + Next.js",', color: '#fbbf24', delay: 2700 },
      { text: '  backend:  "Node.js + Python",', color: '#fbbf24', delay: 3000 },
      { text: '  mobile:   "Flutter",', color: '#fbbf24', delay: 3300 },
      { text: '  cloud:    "Firebase + AWS"', color: '#fbbf24', delay: 3600 },
      { text: '};', color: '#e2e8f0', delay: 3900 },
      { text: '', color: '', delay: 4100 },
      { text: '> system ONLINE. Ready to build. ⚡', color: '#00f0ff', delay: 4400 },
      { text: '█', color: '#00f0ff', delay: 4700, blink: true },
    ];

    lines.forEach(line => {
      setTimeout(() => {
        const el = document.createElement('div');
        el.style.color = line.color || '#7ee8a2';
        if (line.blink) {
          el.style.animation = 'blink 1s step-end infinite';
          el.style.cssText += 'animation: blink 1s step-end infinite;';
        }
        if (line.text === '') {
          el.innerHTML = '&nbsp;';
        } else {
          typeText(el, line.text, 18);
        }
        terminalBody.appendChild(el);
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }, line.delay);
    });

    const style = document.createElement('style');
    style.textContent = '@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }';
    document.head.appendChild(style);
  }

  function typeText(el, text, speed) {
    let i = 0;
    el.textContent = '';
    const timer = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
  }

  // ========== COUNTER ANIMATION ==========
  function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.count);
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { el.textContent = target; clearInterval(timer); }
        else el.textContent = Math.floor(current);
      }, 20);
    });
  }

  // ========== SCROLL REVEAL ==========
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));

  // Trigger counters when hero is in view
  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateCounters(); heroObserver.disconnect(); }
  }, { threshold: 0.3 });
  const heroEl = document.querySelector('.hero');
  if (heroEl) heroObserver.observe(heroEl);

  // ========== AUTO REVEAL ON SCROLL ==========
  function addRevealClasses() {
    const sections = document.querySelectorAll(
      '.service-card, .portfolio-card, .why-card, .tech-item, .about-pillar, .pillar'
    );
    sections.forEach((el, i) => {
      el.classList.add('reveal');
      if (i % 3 === 1) el.classList.add('reveal-delay-1');
      if (i % 3 === 2) el.classList.add('reveal-delay-2');
      revealObserver.observe(el);
    });
  }
  addRevealClasses();

  // ========== CONTACT FORM ==========
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit .btn-text');
      btn.textContent = '⏳ Sending...';
      setTimeout(() => {
        btn.textContent = '🚀 Launch Project';
        formSuccess.style.display = 'block';
        form.reset();
        setTimeout(() => formSuccess.style.display = 'none', 5000);
      }, 1500);
    });
  }

  // ========== CHATBOT ==========
  const chatTrigger = document.getElementById('chatTrigger');
  const chatClose = document.getElementById('chatClose');
  const chatWindow = document.getElementById('chatbotWindow');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');

  const botResponses = {
    services: "We specialize in 3 core services:\n\n⚡ **Web Development** — Modern responsive sites, e-commerce platforms, business portals\n\n💻 **Software Development** — Enterprise software, automation, SaaS products\n\n📱 **Android App Development** — High-performance apps, startup MVPs, business solutions\n\nWant to know more about any specific service?",
    pricing: "Our pricing depends on project scope:\n\n🌐 **Simple Website** — Starting ₹15,000\n🛒 **E-commerce** — Starting ₹40,000\n💻 **Custom Software** — Starting ₹80,000\n📱 **Android App** — Starting ₹50,000\n\nEvery project gets a **free consultation & quote**. Want to get started?",
    timeline: "Our typical timelines:\n\n🌐 **Website** — 1–3 weeks\n🛒 **E-commerce** — 3–6 weeks\n💻 **Custom Software** — 4–12 weeks\n📱 **Android App** — 4–10 weeks\n\nWe use agile sprints so you see progress every week!",
    start: "Starting a project is easy! 🚀\n\n1️⃣ Fill the contact form on this page\n2️⃣ Or email us at **hello@virtualwarrier.com**\n3️⃣ Or WhatsApp us directly\n\nWe'll schedule a **free 30-min consultation** to understand your vision. Ready?",
    hello: "Hello! Welcome to Virtual Warrier! 👋\n\nWe build powerful digital products — websites, software & mobile apps. How can I help you today?",
    default: "Thanks for your message! 💬\n\nFor detailed queries, please reach out via:\n📧 hello@virtualwarrier.com\n💬 WhatsApp: +91 99999 99999\n\nOr fill the contact form and we'll respond within 24 hours! ⚡"
  };

  function getResponse(msg) {
    const lower = msg.toLowerCase();
    if (lower.includes('service') || lower.includes('what do you')) return botResponses.services;
    if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) return botResponses.pricing;
    if (lower.includes('time') || lower.includes('long') || lower.includes('duration')) return botResponses.timeline;
    if (lower.includes('start') || lower.includes('begin') || lower.includes('project')) return botResponses.start;
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return botResponses.hello;
    return botResponses.default;
  }

  function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    msgDiv.appendChild(bubble);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot typing-msg';
    typing.innerHTML = '<div class="msg-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typing;
  }

  function sendMessage(msg) {
    if (!msg.trim()) return;
    addMessage(msg, 'user');
    if (chatInput) chatInput.value = '';
    const typing = showTyping();
    setTimeout(() => {
      typing.remove();
      addMessage(getResponse(msg), 'bot');
    }, 900 + Math.random() * 600);
  }

  window.quickAsk = function (type) {
    const labels = {
      services: 'What services do you offer?',
      pricing: 'How much does a project cost?',
      timeline: 'How long does development take?',
      start: 'How do I start a project?'
    };
    const qs = chatMessages.querySelector('.chat-quick-btns');
    if (qs) qs.remove();
    sendMessage(labels[type]);
  };

  if (chatTrigger) {
    chatTrigger.addEventListener('click', () => {
      chatWindow.classList.toggle('open');
    });
  }
  if (chatClose) {
    chatClose.addEventListener('click', () => {
      chatWindow.classList.remove('open');
    });
  }
  if (chatSend) {
    chatSend.addEventListener('click', () => {
      sendMessage(chatInput.value);
    });
  }
  if (chatInput) {
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') sendMessage(chatInput.value);
    });
  }

  // ========== SMOOTH ACTIVE NAV ==========
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    navLinkEls.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--cyan)' : '';
    });
  });

  // ========== 3D TILT on Service Cards ==========
  document.querySelectorAll('.service-card, .portfolio-card, .why-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ========== GLITCH EFFECT on logo ==========
  const logoText = document.querySelector('.logo-text');
  if (logoText) {
    setInterval(() => {
      logoText.style.textShadow = `${Math.random() * 4 - 2}px 0 var(--cyan)`;
      setTimeout(() => logoText.style.textShadow = '', 80);
    }, 3000 + Math.random() * 2000);
  }

  console.log('%c⚡ VIRTUAL WARRIER SYSTEM ONLINE', 'color: #00f0ff; font-family: monospace; font-size: 14px; font-weight: bold;');
  console.log('%c🚀 hello@virtualwarrier.com', 'color: #8b5cf6; font-family: monospace;');

})();
