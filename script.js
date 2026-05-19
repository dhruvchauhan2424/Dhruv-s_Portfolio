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
       Ultra-Premium Custom Cursor
       ========================================================================== */
    const cursorMain = document.getElementById('cursor-main');
    const cursorParticlesContainer = document.getElementById('cursor-particles');

    if (cursorMain && window.innerWidth > 768) {
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

        function createParticle(x, y, vx, vy) {
            const particle = document.createElement('div');
            particle.classList.add('magic-particle');
            
            // Random size between 2px and 6px
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Randomize starting position slightly
            const startX = x + (Math.random() - 0.5) * 10;
            const startY = y + (Math.random() - 0.5) * 10;
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            
            cursorParticlesContainer.appendChild(particle);

            // Animate using Web Animations API for high performance
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 20 + 10; // Base speed + random
            
            // Factor in cursor movement velocity
            const destX = startX + Math.cos(angle) * velocity - vx * 2;
            const destY = startY + Math.sin(angle) * velocity - vy * 2;

            const animation = particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 0.8, filter: 'blur(0px)' },
                { transform: `translate(${destX - startX}px, ${destY - startY}px) scale(0)`, opacity: 0, filter: 'blur(4px)' }
            ], {
                duration: Math.random() * 500 + 500, // 500ms to 1000ms
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
            });

            animation.onfinish = () => {
                particle.remove();
            };
        }

        function animateCursor() {
            // Smooth lerp for main cursor
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            
            // Calculate velocity
            const vx = cursorX - lastCursorX;
            const vy = cursorY - lastCursorY;
            const speed = Math.sqrt(vx * vx + vy * vy);
            
            // Tilt/Rotation effect based on movement
            const rotation = Math.min(Math.max(vx * 0.5, -15), 15); // Clamp rotation
            const stretch = 1 + Math.min(speed * 0.01, 0.5); // Slight stretch on move
            
            cursorMain.style.transform = `translate(${cursorX}px, ${cursorY}px) rotate(${rotation}deg) scaleX(${stretch})`;
            
            // Emit particles when moving
            if (speed > 2) {
                particleTimer++;
                if (particleTimer > 2) { // Control emission rate
                    createParticle(cursorX, cursorY, vx, vy);
                    particleTimer = 0;
                }
            }

            lastCursorX = cursorX;
            lastCursorY = cursorY;
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Magnetic and Hover effects
        const buttons = document.querySelectorAll('a, button, .nav-link, .achievement-card, .service-card');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => cursorMain.classList.add('hover-btn'));
            btn.addEventListener('mouseleave', () => cursorMain.classList.remove('hover-btn'));
        });

        const projects = document.querySelectorAll('.project-card');
        projects.forEach(card => {
            card.addEventListener('mouseenter', () => cursorMain.classList.add('hover-project'));
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
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

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
                // Mix of cyan and purple dots
                this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.3)' : 'rgba(138, 43, 226, 0.3)';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.size > 0.2) this.size -= 0.01;

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

        function initParticles() {
            particlesArray = [];
            const numberOfParticles = (canvas.width * canvas.height) / 10000;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

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
