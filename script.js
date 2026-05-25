document.addEventListener('DOMContentLoaded', () => {

    /* ===== Theme Toggle Logic ===== */
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            
            if (newTheme === 'light') {
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'block';
            } else {
                moonIcon.style.display = 'block';
                sunIcon.style.display = 'none';
            }
        });
    }
    
    /* ===== Custom Cursor ===== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorGlow = document.querySelector('.cursor-glow');
    
    // Check if device is touch capable to disable custom cursor logic if needed
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && cursorDot && cursorGlow) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Glow follows with a slight delay for smooth trailing effect
            cursorGlow.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effects for links and buttons
        const interactables = document.querySelectorAll('a, button, .project-item');
        
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorGlow.style.width = '60px';
                cursorGlow.style.height = '60px';
                cursorGlow.style.backgroundColor = 'rgba(0,0,0,0.05)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursorGlow.style.width = '40px';
                cursorGlow.style.height = '40px';
                cursorGlow.style.backgroundColor = 'transparent';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });

        // Add hover effects for invert text areas
        const invertTargets = document.querySelectorAll('.section-title, .about-content p, .project-meta h3, .project-meta p, .skill-name, .skill-desc, .massive-cta, .github-stats p, .top-left, .top-right, .bottom-left, .bottom-right');
        
        invertTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorGlow.classList.add('invert-mode');
                cursorDot.classList.add('invert-mode');
            });
            
            el.addEventListener('mouseleave', () => {
                cursorGlow.classList.remove('invert-mode');
                cursorDot.classList.remove('invert-mode');
            });
        });
    }

    /* ===== Intersection Observer for Reveal Animations ===== */
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before element comes into view
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add in-view class to trigger CSS transitions
                entry.target.classList.add('in-view');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-text, .reveal-fade, .skill-item');
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
    
    // Splash Screen Logic
    const splashScreen = document.getElementById('splash-screen');
    const splashName = document.getElementById('splash-name');
    
    if (splashName) {
        const text = splashName.innerText;
        splashName.innerHTML = '';
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char; // Keep space
            span.style.animationDelay = `${i * 0.08}s`;
            splashName.appendChild(span);
        });
    }
    
    // Time to wait: ~15 chars * 80ms + 800ms animation = 2000ms. Wait slightly longer so it's fully read.
    setTimeout(() => {
        if (splashScreen) {
            splashScreen.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }
        
        // Trigger hero elements after splash starts moving up
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero-section .reveal-text, .hero-section .reveal-fade');
            heroElements.forEach(el => el.classList.add('in-view'));
            
            // Signature writing animation
            const signature = document.querySelector('.signature-text');
            if(signature) {
                signature.classList.add('is-writing');
            }
        }, 600); // Trigger mid-way through splash exit
    }, 2800); // 2.8 seconds loading time

    /* ===== Smooth Parallax on Scroll ===== */
    const parallaxImages = document.querySelectorAll('.parallax-img');
    
    window.addEventListener('scroll', () => {
        if (isTouchDevice) return; // Keep it simple on mobile
        
        const scrollY = window.scrollY;
        
        parallaxImages.forEach(img => {
            const container = img.closest('.parallax-container');
            if (container) {
                const rect = container.getBoundingClientRect();
                // Check if element is in viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    // Calculate a slight translateY based on scroll position relative to the element
                    const distance = rect.top;
                    const speed = 0.1;
                    const yPos = distance * speed;
                    img.style.transform = `translateY(${yPos}px)`;
                }
            }
        });
    }, { passive: true });

    /* ===== Magnetic Buttons (Optional subtle effect for Contact CTA) ===== */
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const h = rect.width / 2;
            const v = rect.height / 2;
            
            // Calculate distance from center
            const x = e.clientX - rect.left - h;
            const y = e.clientY - rect.top - v;
            
            // Move button slightly towards mouse
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
            btn.style.transition = 'transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
        });
        
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'none';
        });
    });

    /* ===== Smooth Scroll Anchor Links ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                // Offset for fixed glass-navbar (80px height)
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ===== Initialize LiquidEther Backgrounds ===== */
    const liquidEtherEl = document.getElementById('hero-liquid-ether');
    let heroEther = null;
    let bodyEther = null;

    if (liquidEtherEl && typeof initLiquidEther === 'function') {
        heroEther = initLiquidEther(liquidEtherEl, {
            colors: ['#ff3333', '#EBE4D5', '#5227FF'],
            mouseForce: 20,
            cursorSize: 100,
            isViscous: false,
            viscous: 30,
            iterationsViscous: 32,
            iterationsPoisson: 32,
            resolution: 0.5,
            isBounce: false,
            autoDemo: true,
            autoSpeed: 0.5,
            autoIntensity: 2.2,
            takeoverDuration: 0.25,
            autoResumeDelay: 3000,
            autoRampDuration: 0.6
        });
    }

    const belowHeroEtherEl = document.getElementById('below-hero-liquid-ether');
    if (belowHeroEtherEl && typeof initLiquidEther === 'function') {
        bodyEther = initLiquidEther(belowHeroEtherEl, {
            colors: ['#5227FF', '#FF9FFC', '#B497CF'], // Exact React Bits colors
            mouseForce: 20,
            cursorSize: 100,
            isViscous: false,
            viscous: 30,
            iterationsViscous: 32,
            iterationsPoisson: 32,
            resolution: 0.4, // Slightly lower for background performance
            isBounce: false,
            autoDemo: true,
            autoSpeed: 0.4,
            autoIntensity: 2.0,
            takeoverDuration: 0.25,
            autoResumeDelay: 3000,
            autoRampDuration: 0.6
        });
        
        // Initially pause body ether to save resources since we start at the top
        if (bodyEther && typeof bodyEther.pause === 'function') {
            bodyEther.pause();
        }
    }

    // Scroll Handler for LiquidEther Canvas switching (Resource Management)
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const threshold = window.innerHeight * 0.75; // Trigger when hero is mostly scrolled past

        if (scrollY > threshold) {
            // Scrolled down: Fade in below-hero ether, and run it
            if (belowHeroEtherEl && !belowHeroEtherEl.classList.contains('visible')) {
                belowHeroEtherEl.classList.add('visible');
                if (bodyEther && typeof bodyEther.start === 'function') {
                    bodyEther.start();
                }
            }
        } else {
            // At the top: Fade out below-hero ether, and pause it to save CPU/GPU
            if (belowHeroEtherEl && belowHeroEtherEl.classList.contains('visible')) {
                belowHeroEtherEl.classList.remove('visible');
                if (bodyEther && typeof bodyEther.pause === 'function') {
                    bodyEther.pause();
                }
            }
        }
    }, { passive: true });

});
