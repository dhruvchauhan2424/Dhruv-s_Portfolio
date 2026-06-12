document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Loader
       ========================================================================== */
    const loaderWrapper = document.querySelector('.loader-wrapper');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loaderWrapper.style.opacity = '0';
            setTimeout(() => {
                loaderWrapper.style.display = 'none';
                initTyping(); // Start typing animation after loader is gone
            }, 500);
        }, 1000); // Simulate loading time
    });

    /* ==========================================================================
       Ultra-Premium Custom Cursor + 14 Customization Options
       ========================================================================== */
    const cursorMain = document.getElementById('cursor-main');
    const cursorParticlesContainer = document.getElementById('cursor-particles');
    const magicCursor = document.getElementById('magic-cursor');

    const CURSOR_STYLES = [
        { id: 'logo', label: 'Logo' },
        { id: 'dot', label: 'Dot' },
        { id: 'ring', label: 'Ring' },
        { id: 'crosshair', label: 'Crosshair' },
        { id: 'arrow', label: 'Arrow' },
        { id: 'diamond', label: 'Diamond' },
        { id: 'square', label: 'Square' },
        { id: 'star', label: 'Star' },
        { id: 'heart', label: 'Heart' },
        { id: 'pointer', label: 'Pointer' },
        { id: 'neon', label: 'Neon' },
        { id: 'comet', label: 'Comet' }
    ];

    const LOGO_SVG_PREVIEW = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25,25 L55,25 A25,25 0 0,1 80,50 A25,25 0 0,1 55,75 L25,75 Z" stroke="var(--cyan)" stroke-width="8" stroke-linejoin="round" fill="none"/>
        <path d="M45,25 L45,75" stroke="var(--cyan)" stroke-width="4"/>
        <path d="M68,38 A15,15 0 0,0 52,50 A15,15 0 0,0 68,62" stroke="var(--purple)" stroke-width="6" stroke-linecap="round" fill="none"/>
    </svg>`;

    const DEFAULT_CURSOR_SETTINGS = {
        style: 'logo',
        size: 40,
        primary: '#00f2fe',
        secondary: '#8a2be2',
        glow: 70,
        speed: 15,
        particles: true,
        particleRate: 3,
        rotation: true,
        stretch: true,
        hoverSize: 60,
        showGlow: true,
        projectLabel: true,
        hoverText: 'View Project',
        blend: 'difference'
    };

    function loadCursorSettings() {
        try {
            const saved = localStorage.getItem('cursorSettings');
            return saved ? { ...DEFAULT_CURSOR_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_CURSOR_SETTINGS };
        } catch {
            return { ...DEFAULT_CURSOR_SETTINGS };
        }
    }

    let cursorSettings = loadCursorSettings();
    if (!CURSOR_STYLES.some(s => s.id === cursorSettings.style)) {
        cursorSettings.style = 'logo';
    }
    if (!cursorSettings.hoverText) {
        cursorSettings.hoverText = 'View Project';
    }
    let crazyModeActive = localStorage.getItem('crazyMode') === 'true';
    if (crazyModeActive) document.body.classList.add('crazy-mode');

    function saveCursorSettings() {
        localStorage.setItem('cursorSettings', JSON.stringify(cursorSettings));
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
            : '0, 242, 254';
    }

    function applyCursorSettings() {
        if (!cursorMain || !magicCursor) return;

        const s = cursorSettings;
        const half = s.size / 2;

        magicCursor.style.setProperty('--cursor-primary', s.primary);
        magicCursor.style.setProperty('--cursor-secondary', s.secondary);
        magicCursor.style.setProperty('--cursor-glow-opacity', s.glow / 100);
        magicCursor.style.setProperty('--cursor-hover-size', `${s.hoverSize}px`);

        cursorMain.style.width = `${s.size}px`;
        cursorMain.style.height = `${s.size}px`;
        cursorMain.style.marginTop = `-${half}px`;
        cursorMain.style.marginLeft = `-${half}px`;

        const glowEl = cursorMain.querySelector('.cursor-glow');
        if (glowEl) {
            const rgb = hexToRgb(s.primary);
            const secRgb = hexToRgb(s.secondary);
            glowEl.style.background = `radial-gradient(circle, rgba(${rgb}, ${s.glow / 100 * 0.6}) 0%, rgba(${secRgb}, ${s.glow / 100 * 0.15}) 40%, transparent 70%)`;
            glowEl.style.opacity = s.showGlow ? 1 : 0;
        }

        const iconSvg = cursorMain.querySelector('.cursor-icon svg');
        if (iconSvg) {
            iconSvg.style.filter = `drop-shadow(0 0 8px ${s.primary}) drop-shadow(0 0 15px ${s.primary})`;
        }

        CURSOR_STYLES.forEach(({ id }) => cursorMain.classList.remove(`style-${id}`));
        cursorMain.classList.remove('glow-off', 'label-off');
        cursorMain.classList.add(`style-${s.style}`);
        if (!s.showGlow) cursorMain.classList.add('glow-off');
        if (!s.projectLabel) cursorMain.classList.add('label-off');

        const cursorTextEl = cursorMain.querySelector('.cursor-text');
        if (cursorTextEl) {
            cursorTextEl.textContent = s.hoverText || 'View Project';
        }

        document.documentElement.style.setProperty('--cursor-hover-btn-size', `${s.hoverSize}px`);
        highlightActiveCursorCard(s.style);
    }

    function highlightActiveCursorCard(styleId) {
        document.querySelectorAll('.cursor-style-card').forEach(card => {
            card.classList.toggle('active', card.dataset.style === styleId);
        });
    }

    function buildCursorStyleGrid() {
        const grid = document.getElementById('cursor-style-grid');
        if (!grid) return;

        grid.innerHTML = '';
        CURSOR_STYLES.forEach(({ id, label }) => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'cursor-style-card';
            card.dataset.style = id;
            card.setAttribute('aria-label', `Select ${label} cursor`);

            const preview = document.createElement('div');
            preview.className = `cursor-preview style-${id}`;
            if (id === 'logo') preview.innerHTML = LOGO_SVG_PREVIEW;

            const name = document.createElement('span');
            name.className = 'cursor-style-name';
            name.textContent = label;

            card.appendChild(preview);
            card.appendChild(name);
            card.addEventListener('click', () => {
                cursorSettings.style = id;
                saveCursorSettings();
                applyCursorSettings();
            });
            grid.appendChild(card);
        });
    }

    function syncPanelFromSettings() {
        const map = {
            'cursor-size': s => s.size,
            'cursor-primary': s => s.primary,
            'cursor-secondary': s => s.secondary,
            'cursor-glow': s => s.glow,
            'cursor-speed': s => s.speed,
            'cursor-particles': s => s.particles,
            'cursor-particle-rate': s => s.particleRate,
            'cursor-rotation': s => s.rotation,
            'cursor-stretch': s => s.stretch,
            'cursor-hover-size': s => s.hoverSize,
            'cursor-show-glow': s => s.showGlow,
            'cursor-project-label': s => s.projectLabel,
            'cursor-hover-text': s => s.hoverText,
            'cursor-blend': s => s.blend
        };

        Object.entries(map).forEach(([id, getter]) => {
            const el = document.getElementById(id);
            if (!el) return;
            const val = getter(cursorSettings);
            if (el.type === 'checkbox') el.checked = val;
            else el.value = val;

            const label = document.querySelector(`.cursor-val[data-for="${id}"]`);
            if (label && el.type === 'range') label.textContent = val;
        });
    }

    function initCursorPanel() {
        const panel = document.getElementById('cursor-settings-panel');
        const overlay = document.getElementById('cursor-panel-overlay');
        const toggle = document.getElementById('cursor-settings-toggle');
        const closeBtn = document.getElementById('cursor-settings-close');
        const resetBtn = document.getElementById('cursor-reset');

        const openPanel = () => {
            panel?.classList.add('open');
            overlay?.classList.add('visible');
            panel?.setAttribute('aria-hidden', 'false');
        };

        const closePanel = () => {
            panel?.classList.remove('open');
            overlay?.classList.remove('visible');
            panel?.setAttribute('aria-hidden', 'true');
        };

        toggle?.addEventListener('click', openPanel);
        closeBtn?.addEventListener('click', closePanel);
        overlay?.addEventListener('click', closePanel);

        const controls = {
            'cursor-size': v => { cursorSettings.size = +v; },
            'cursor-primary': v => { cursorSettings.primary = v; },
            'cursor-secondary': v => { cursorSettings.secondary = v; },
            'cursor-glow': v => { cursorSettings.glow = +v; },
            'cursor-speed': v => { cursorSettings.speed = +v; },
            'cursor-particles': v => { cursorSettings.particles = v; },
            'cursor-particle-rate': v => { cursorSettings.particleRate = +v; },
            'cursor-rotation': v => { cursorSettings.rotation = v; },
            'cursor-stretch': v => { cursorSettings.stretch = v; },
            'cursor-hover-size': v => { cursorSettings.hoverSize = +v; },
            'cursor-show-glow': v => { cursorSettings.showGlow = v; },
            'cursor-project-label': v => { cursorSettings.projectLabel = v; },
            'cursor-hover-text': v => { cursorSettings.hoverText = v.trim() || 'View Project'; },
            'cursor-blend': v => { cursorSettings.blend = v; }
        };

        Object.keys(controls).forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;

            const handler = () => {
                const val = el.type === 'checkbox' ? el.checked : el.value;
                controls[id](val);
                saveCursorSettings();
                applyCursorSettings();

                const label = document.querySelector(`.cursor-val[data-for="${id}"]`);
                if (label && el.type === 'range') label.textContent = val;
            };

            el.addEventListener('input', handler);
            el.addEventListener('change', handler);
        });

        resetBtn?.addEventListener('click', () => {
            cursorSettings = { ...DEFAULT_CURSOR_SETTINGS };
            saveCursorSettings();
            applyCursorSettings();
            syncPanelFromSettings();
        });

        syncPanelFromSettings();
    }

    buildCursorStyleGrid();
    initCursorPanel();

    if (cursorMain && window.innerWidth > 768) {
        applyCursorSettings();

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let lastCursorX = cursorX;
        let lastCursorY = cursorY;
        let particleTimer = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const orbitRings = document.getElementById('cursor-orbit-rings');
        const crazyColors = ['#00f2fe', '#8a2be2', '#ff0844', '#ffe600', '#00ff88'];

        function createParticle(x, y, vx, vy, burst = false) {
            if (!cursorSettings.particles && !burst) return;

            const count = burst ? 16 : 1;
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.classList.add('magic-particle');

                const size = burst ? Math.random() * 8 + 4 : Math.random() * 4 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                const color = crazyModeActive
                    ? crazyColors[Math.floor(Math.random() * crazyColors.length)]
                    : cursorSettings.primary;
                particle.style.background = color;
                particle.style.boxShadow = `0 0 ${burst ? 20 : 10}px ${color}`;

                const startX = x + (Math.random() - 0.5) * (burst ? 30 : 10);
                const startY = y + (Math.random() - 0.5) * (burst ? 30 : 10);
                particle.style.left = `${startX}px`;
                particle.style.top = `${startY}px`;

                cursorParticlesContainer.appendChild(particle);

                const angle = Math.random() * Math.PI * 2;
                const velocity = burst ? Math.random() * 80 + 40 : Math.random() * 20 + 10;
                const destX = startX + Math.cos(angle) * velocity - vx * (burst ? 4 : 2);
                const destY = startY + Math.sin(angle) * velocity - vy * (burst ? 4 : 2);

                particle.animate([
                    { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: burst ? 1 : 0.8, filter: 'blur(0px)' },
                    { transform: `translate(${destX - startX}px, ${destY - startY}px) scale(0) rotate(${burst ? 360 : 180}deg)`, opacity: 0, filter: 'blur(6px)' }
                ], {
                    duration: burst ? Math.random() * 400 + 300 : Math.random() * 500 + 500,
                    easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
                }).onfinish = () => particle.remove();
            }
        }

        function createShockwave(x, y) {
            const container = document.getElementById('crazy-shockwaves');
            if (!container) return;
            for (let i = 0; i < 3; i++) {
                const wave = document.createElement('div');
                wave.classList.add('crazy-shockwave');
                wave.style.left = `${x}px`;
                wave.style.top = `${y}px`;
                wave.style.width = `${60 + i * 30}px`;
                wave.style.height = wave.style.width;
                wave.style.animationDelay = `${i * 0.1}s`;
                wave.style.borderColor = crazyColors[i % crazyColors.length];
                container.appendChild(wave);
                wave.addEventListener('animationend', () => wave.remove());
            }
        }

        function animateCursor() {
            const lerp = crazyModeActive
                ? Math.min(cursorSettings.speed / 100 * 1.5, 0.95)
                : cursorSettings.speed / 100;
            cursorX += (mouseX - cursorX) * lerp;
            cursorY += (mouseY - cursorY) * lerp;

            const vx = cursorX - lastCursorX;
            const vy = cursorY - lastCursorY;
            const speed = Math.sqrt(vx * vx + vy * vy);
            const time = Date.now();

            let rotation = cursorSettings.rotation
                ? Math.min(Math.max(vx * 0.5, -15), 15)
                : 0;
            let stretch = cursorSettings.stretch
                ? 1 + Math.min(speed * 0.01, 0.5)
                : 1;

            if (crazyModeActive) {
                rotation += Math.sin(time / 80) * 12;
                stretch += Math.sin(time / 120) * 0.3;
                const wobbleX = Math.sin(time / 60) * 3;
                const wobbleY = Math.cos(time / 90) * 3;
                cursorMain.style.transform = `translate(${cursorX + wobbleX}px, ${cursorY + wobbleY}px) rotate(${rotation}deg) scaleX(${stretch}) scaleY(${2 - stretch})`;
            } else {
                cursorMain.style.transform = `translate(${cursorX}px, ${cursorY}px) rotate(${rotation}deg) scaleX(${stretch})`;
            }

            if (orbitRings && crazyModeActive) {
                orbitRings.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            }

            if ((cursorSettings.particles || crazyModeActive) && speed > (crazyModeActive ? 0.5 : 2)) {
                particleTimer++;
                const threshold = crazyModeActive ? 1 : 11 - cursorSettings.particleRate;
                if (particleTimer > threshold) {
                    createParticle(cursorX, cursorY, vx, vy);
                    if (crazyModeActive && speed > 8) createParticle(cursorX, cursorY, vx, vy);
                    particleTimer = 0;
                }
            }

            lastCursorX = cursorX;
            lastCursorY = cursorY;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.addEventListener('click', (e) => {
            if (!crazyModeActive || window.innerWidth <= 768) return;
            createShockwave(e.clientX, e.clientY);
            createParticle(e.clientX, e.clientY, 0, 0, true);
            document.body.classList.add('crazy-click-flash');
            setTimeout(() => document.body.classList.remove('crazy-click-flash'), 150);
        });

        const buttons = document.querySelectorAll('a, button, .nav-link, .achievement-card, .service-card');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                cursorMain.classList.add('hover-btn');
                cursorMain.style.mixBlendMode = cursorSettings.blend;
            });
            btn.addEventListener('mouseleave', () => {
                cursorMain.classList.remove('hover-btn');
                cursorMain.style.mixBlendMode = 'normal';
            });
        });

        const projects = document.querySelectorAll('.project-card');
        projects.forEach(card => {
            card.addEventListener('mouseenter', () => {
                cursorMain.classList.add('hover-project');
                cursorMain.style.mixBlendMode = 'normal';
            });
            card.addEventListener('mouseleave', () => cursorMain.classList.remove('hover-project'));
        });
    }

    /* ==========================================================================
       Theme Toggle Slider
       ========================================================================== */
    const themeSlider = document.getElementById('theme-slider');
    
    // Check saved theme
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        if(themeSlider) themeSlider.checked = true;
    }

    if(themeSlider) {
        themeSlider.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    /* ==========================================================================
       Navigation & Hamburger Menu
       ========================================================================== */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    const scrollTopBtn = document.getElementById('scroll-top');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll to top button
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Active Section Highlight
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       Typing Effect
       ========================================================================== */
    const textArray = ["Full Stack Developer", "Python Developer", "UI/UX Enthusiast", "Problem Solver"];
    let textIndex = 0;
    let charIndex = 0;
    const typingElement = document.querySelector('.typing-text');
    let isDeleting = false;

    function initTyping() {
        const currentText = textArray[textIndex];

        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 100;

        if (isDeleting) {
            typeSpeed /= 2; // Delete faster
        }

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end of text
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typeSpeed = 500; // Pause before typing next text
        }

        setTimeout(initTyping, typeSpeed);
    }

    /* ==========================================================================
       Scroll Reveal & Counters & Progress Bars (Intersection Observer)
       ========================================================================== */
    const reveals = document.querySelectorAll('.reveal');
    const counters = document.querySelectorAll('.counter');
    const floatCounters = document.querySelectorAll('.counter-float');
    const progressBars = document.querySelectorAll('.progress');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            entry.target.classList.add('active');
            
            // Check if it's the stats section for counters
            if (entry.target.classList.contains('about-container')) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const increment = target / 100;
                    
                    const updateCount = () => {
                        const count = +counter.innerText;
                        if (count < target) {
                            counter.innerText = Math.ceil(count + increment);
                            setTimeout(updateCount, 20);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
            }

            // Check if it's the skills section for progress bars
            if (entry.target.classList.contains('skills-container')) {
                progressBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
            }

            // Check if it's the achievements section for float counters
            if (entry.target.classList.contains('achievements-grid')) {
                floatCounters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const increment = target / 100;
                    
                    const updateCount = () => {
                        const count = parseFloat(counter.innerText);
                        if (count < target) {
                            counter.innerText = (count + increment).toFixed(2);
                            setTimeout(updateCount, 20);
                        } else {
                            counter.innerText = target.toFixed(2);
                        }
                    };
                    updateCount();
                });
            }

            observer.unobserve(entry.target); // Only animate once
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    /* ==========================================================================
       Contact Form Submission
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';
            btn.style.pointerEvents = 'none';

            // Simulate form submission
            setTimeout(() => {
                btn.innerHTML = '<span>Sent Successfully!</span> <i class="fa-solid fa-check"></i>';
                btn.style.background = '#00c853';
                btn.style.color = '#fff';
                
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.pointerEvents = 'all';
                }, 3000);
            }, 1500);
        });
    }

    /* ==========================================================================
       Background Particle Canvas
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    let initParticles = () => {};

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        let canvasMouseX = window.innerWidth / 2;
        let canvasMouseY = window.innerHeight / 2;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('mousemove', (e) => {
            canvasMouseX = e.clientX;
            canvasMouseY = e.clientY;
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.3)' : 'rgba(138, 43, 226, 0.3)';
            }
            update() {
                if (crazyModeActive) {
                    const dx = canvasMouseX - this.x;
                    const dy = canvasMouseY - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200) {
                        this.speedX += dx * 0.0003;
                        this.speedY += dy * 0.0003;
                    }
                    this.speedX *= 1.02;
                    this.speedY *= 1.02;
                    this.size = Math.min(this.size + 0.02, 4);
                }

                this.x += this.speedX;
                this.y += this.speedY;

                if (!crazyModeActive && this.size > 0.2) this.size -= 0.01;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function drawParticleConnections() {
            if (!crazyModeActive) return;
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particlesArray.length; i++) {
                for (let j = i + 1; j < particlesArray.length; j++) {
                    const a = particlesArray[i];
                    const b = particlesArray[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.strokeStyle = `rgba(0, 242, 254, ${0.4 * (1 - dist / 100)})`;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
        }

        initParticles = function () {
            particlesArray = [];
            const density = crazyModeActive ? 6000 : 10000;
            const numberOfParticles = (canvas.width * canvas.height) / density;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        };

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            drawParticleConnections();
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    /* ==========================================================================
       CRAZY MODE — Toggle + 3D Tilt + Aurora Follow
       ========================================================================== */
    const crazyToggle = document.getElementById('crazy-mode-toggle');
    const auroraBg = document.getElementById('aurora-bg');

    function setCrazyMode(on) {
        crazyModeActive = on;
        document.body.classList.toggle('crazy-mode', on);
        localStorage.setItem('crazyMode', on);
        if (canvas) initParticles();
    }

    if (crazyToggle) {
        crazyToggle.addEventListener('click', () => setCrazyMode(!crazyModeActive));
    }

    window.addEventListener('mousemove', (e) => {
        if (!crazyModeActive || !auroraBg) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 60;
        const y = (e.clientY / window.innerHeight - 0.5) * 60;
        auroraBg.style.transform = `translate(${x}px, ${y}px)`;
    });

    document.querySelectorAll('.glass-card, .project-card, .service-card, .achievement-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (!crazyModeActive) return;
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(900px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) translateY(-8px) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    document.querySelectorAll('.btn, .btn-small').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (!crazyModeActive) return;
            btn.style.animation = 'btnCrazyHover 0.2s ease infinite alternate';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.animation = '';
        });
    });

    /* ==========================================================================
       Counter Animation
       ========================================================================== */
    const counterElements = document.querySelectorAll('.counter, .counter-float');
    
    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.getAttribute('data-target'));
                const isFloat = el.classList.contains('counter-float');
                const duration = 1500; // ms
                let startTimestamp = null;
                
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    const currentVal = progress * target;
                    
                    if (isFloat) {
                        el.textContent = currentVal.toFixed(2);
                    } else {
                        el.textContent = Math.floor(currentVal);
                    }
                    
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        // Ensure final value is exact
                        el.textContent = isFloat ? target.toFixed(2) : target;
                    }
                };
                
                window.requestAnimationFrame(step);
                observer.unobserve(el); // Only animate once
            }
        });
    };
    
    const counterObserver = new IntersectionObserver(animateCounters, {
        threshold: 0.1
    });
    
    counterElements.forEach(el => counterObserver.observe(el));
});
