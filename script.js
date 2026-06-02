document.addEventListener('DOMContentLoaded', () => {

    /* ===== Dynamic Date & Ticking Scramble Clock ===== */
    const dateDisplay = document.querySelector('.nav-date-display');
    const timeDisplay = document.querySelector('.nav-time-display');
    
    if (timeDisplay) {
        function updateClock() {
            const now = new Date();
            
            // Format date: "01 Jun, 2026"
            const day = String(now.getDate()).padStart(2, '0');
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[now.getMonth()];
            const year = now.getFullYear();
            const dateString = `${day} ${month}, ${year}`;
            
            if (dateDisplay && dateDisplay.textContent !== dateString) {
                dateDisplay.textContent = dateString;
            }
            
            // Format time: "HH:MM:SS"
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const timeString = `${hours}:${minutes}:${seconds}`;
            
            // Set time content
            timeDisplay.textContent = timeString;
            
            // Trigger scramble/shuffle animation on the ticking clock!
            if (typeof initShuffleText === 'function') {
                initShuffleText(timeDisplay, {
                    shuffleDirection: 'down',
                    duration: 0.25,
                    animationMode: 'random',
                    shuffleTimes: 1,
                    ease: 'power2.out',
                    stagger: 0.01,
                    triggerOnHover: false
                });
            }
        }
        
        // Initialize immediately
        updateClock();
        // Update every second
        setInterval(updateClock, 1000);
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
    
    /* ===== Intersection Observer for Navbar Active State ===== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (sections.length > 0 && navLinks.length > 0) {
        const navObserverOptions = {
            root: null,
            rootMargin: '-40% 0px -60% 0px',
            threshold: 0
        };
        
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, navObserverOptions);
        
        sections.forEach(section => {
            navObserver.observe(section);
        });
    }

    // Splash Screen Logic
    const splashScreen = document.getElementById('splash-screen');
    const splashName = document.getElementById('splash-name');
    
    if (splashName && typeof initShuffleText === 'function') {
        initShuffleText(splashName, {
            shuffleDirection: 'right',
            duration: 0.35,
            animationMode: 'evenodd',
            shuffleTimes: 1,
            ease: 'power3.out',
            stagger: 0.03,
            triggerOnHover: true
        });
    }
    
    // Hold splash screen for 1.1 seconds, then fade it out cleanly to the homepage
    setTimeout(() => {
        if (splashScreen) {
            splashScreen.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }
        
        // Trigger hero elements after splash starts hiding
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero-section .reveal-text, .reveal-fade');
            heroElements.forEach(el => el.classList.add('in-view'));
            
            // Signature writing animation
            const signature = document.querySelector('.signature-text');
            if(signature) {
                signature.classList.add('is-writing');
            }
        }, 300);
    }, 1100);

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

    // Initialize mobile menu text shuffles
    const menuLabelEls = document.querySelectorAll('.staggered-menu-panel .shuffle-parent');
    menuLabelEls.forEach(el => {
        if (typeof initShuffleText === 'function') {
            initShuffleText(el, {
                shuffleDirection: 'right',
                duration: 0.35,
                animationMode: 'evenodd',
                shuffleTimes: 1,
                ease: 'power3.out',
                stagger: 0.03,
                triggerOnHover: true
            });
        }
    });

    // Initialize StaggeredMenu
    if (typeof initStaggeredMenu === 'function') {
        initStaggeredMenu();
    }
});

// Shuffle Component Implementation (React Bits variant in Vanilla JS)
function initShuffleText(el, options = {}) {
    if (!el || !window.gsap) return;
    
    const settings = {
        text: el.getAttribute('data-text') || el.textContent || "",
        shuffleDirection: options.shuffleDirection || 'right',
        duration: options.duration || 0.35,
        maxDelay: options.maxDelay || 0,
        ease: options.ease || 'power3.out',
        shuffleTimes: options.shuffleTimes !== undefined ? options.shuffleTimes : 1,
        animationMode: options.animationMode || 'evenodd',
        loop: options.loop || false,
        loopDelay: options.loopDelay || 0,
        stagger: options.stagger !== undefined ? options.stagger : 0.03,
        scrambleCharset: options.scrambleCharset || '',
        colorFrom: options.colorFrom || null,
        colorTo: options.colorTo || null,
        triggerOnHover: options.triggerOnHover !== undefined ? options.triggerOnHover : true
    };
    
    let wrappers = [];
    let tl = null;
    let playing = false;
    
    function teardown() {
        if (tl) {
            tl.kill();
            tl = null;
        }
        if (wrappers.length) {
            wrappers.forEach(wrap => {
                const inner = wrap.firstElementChild;
                const orig = inner ? inner.querySelector('[data-orig="1"]') : null;
                if (orig && wrap.parentNode) {
                    wrap.parentNode.replaceChild(orig, wrap);
                }
            });
            wrappers = [];
        }
        playing = false;
    }
    
    function build() {
        teardown();
        
        const textContent = settings.text;
        el.innerHTML = '';
        
        const chars = textContent.split('').map(ch => {
            const span = document.createElement('span');
            span.textContent = ch === ' ' ? '\u00A0' : ch;
            span.className = 'shuffle-char';
            el.appendChild(span);
            return span;
        });
        
        const rolls = Math.max(1, Math.floor(settings.shuffleTimes));
        const rand = set => set.charAt(Math.floor(Math.random() * set.length)) || '';
        
        chars.forEach(ch => {
            const parent = ch.parentElement;
            if (!parent) return;
            
            const rect = ch.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            if (!w) return;
            
            const wrap = document.createElement('span');
            wrap.className = 'shuffle-char-wrapper';
            Object.assign(wrap.style, {
                display: 'inline-block',
                overflow: 'hidden',
                width: w + 'px',
                height: settings.shuffleDirection === 'up' || settings.shuffleDirection === 'down' ? h + 'px' : 'auto',
                verticalAlign: 'bottom'
            });
            
            const inner = document.createElement('span');
            Object.assign(inner.style, {
                display: 'inline-block',
                whiteSpace: settings.shuffleDirection === 'up' || settings.shuffleDirection === 'down' ? 'normal' : 'nowrap',
                willChange: 'transform'
            });
            
            parent.insertBefore(wrap, ch);
            wrap.appendChild(inner);
            
            const firstOrig = ch.cloneNode(true);
            Object.assign(firstOrig.style, {
                display: settings.shuffleDirection === 'up' || settings.shuffleDirection === 'down' ? 'block' : 'inline-block',
                width: w + 'px',
                textAlign: 'center'
            });
            
            ch.setAttribute('data-orig', '1');
            Object.assign(ch.style, {
                display: settings.shuffleDirection === 'up' || settings.shuffleDirection === 'down' ? 'block' : 'inline-block',
                width: w + 'px',
                textAlign: 'center'
            });
            
            inner.appendChild(firstOrig);
            for (let k = 0; k < rolls; k++) {
                const c = ch.cloneNode(true);
                if (settings.scrambleCharset) c.textContent = rand(settings.scrambleCharset);
                Object.assign(c.style, {
                    display: settings.shuffleDirection === 'up' || settings.shuffleDirection === 'down' ? 'block' : 'inline-block',
                    width: w + 'px',
                    textAlign: 'center'
                });
                inner.appendChild(c);
            }
            inner.appendChild(ch);
            
            const steps = rolls + 1;
            
            let startX = 0, finalX = 0, startY = 0, finalY = 0;
            
            if (settings.shuffleDirection === 'right' || settings.shuffleDirection === 'down') {
                const firstCopy = inner.firstElementChild;
                const real = inner.lastElementChild;
                if (real) inner.insertBefore(real, inner.firstChild);
                if (firstCopy) inner.appendChild(firstCopy);
            }
            
            if (settings.shuffleDirection === 'right') {
                startX = -steps * w;
                finalX = 0;
            } else if (settings.shuffleDirection === 'left') {
                startX = 0;
                finalX = -steps * w;
            } else if (settings.shuffleDirection === 'down') {
                startY = -steps * h;
                finalY = 0;
            } else if (settings.shuffleDirection === 'up') {
                startY = 0;
                finalY = -steps * h;
            }
            
            if (settings.shuffleDirection === 'left' || settings.shuffleDirection === 'right') {
                window.gsap.set(inner, { x: startX, y: 0, force3D: true });
                inner.setAttribute('data-start-x', String(startX));
                inner.setAttribute('data-final-x', String(finalX));
            } else {
                window.gsap.set(inner, { x: 0, y: startY, force3D: true });
                inner.setAttribute('data-start-y', String(startY));
                inner.setAttribute('data-final-y', String(finalY));
            }
            
            if (settings.colorFrom) inner.style.color = settings.colorFrom;
            wrappers.push(wrap);
        });
    }
    
    function play() {
        const strips = wrappers.map(w => w.firstElementChild);
        if (!strips.length) return;
        
        playing = true;
        const isVertical = settings.shuffleDirection === 'up' || settings.shuffleDirection === 'down';
        
        tl = window.gsap.timeline({
            smoothChildTiming: true,
            repeat: settings.loop ? -1 : 0,
            repeatDelay: settings.loop ? settings.loopDelay : 0,
            onRepeat: () => {
                if (isVertical) {
                    window.gsap.set(strips, { y: (i, t) => parseFloat(t.getAttribute('data-start-y') || '0') });
                } else {
                    window.gsap.set(strips, { x: (i, t) => parseFloat(t.getAttribute('data-start-x') || '0') });
                }
            },
            onComplete: () => {
                playing = false;
                if (!settings.loop) {
                    // Clean up and set static text
                    wrappers.forEach(w => {
                        const strip = w.firstElementChild;
                        if (!strip) return;
                        const real = strip.querySelector('[data-orig="1"]');
                        if (!real) return;
                        strip.replaceChildren(real);
                        strip.style.transform = 'none';
                        strip.style.willChange = 'auto';
                    });
                    if (settings.colorTo) window.gsap.set(strips, { color: settings.colorTo });
                }
            }
        });
        
        const addTween = (targets, at) => {
            const vars = {
                duration: settings.duration,
                ease: settings.ease,
                force3D: true,
                stagger: settings.animationMode === 'evenodd' ? settings.stagger : 0
            };
            if (isVertical) {
                vars.y = (i, t) => parseFloat(t.getAttribute('data-final-y') || '0');
            } else {
                vars.x = (i, t) => parseFloat(t.getAttribute('data-final-x') || '0');
            }
            tl.to(targets, vars, at);
            if (settings.colorFrom && settings.colorTo) {
                tl.to(targets, { color: settings.colorTo, duration: settings.duration, ease: settings.ease }, at);
            }
        };
        
        if (settings.animationMode === 'evenodd') {
            const odd = strips.filter((_, i) => i % 2 === 1);
            const even = strips.filter((_, i) => i % 2 === 0);
            const oddTotal = settings.duration + Math.max(0, odd.length - 1) * settings.stagger;
            const evenStart = odd.length ? oddTotal * 0.7 : 0;
            if (odd.length) addTween(odd, 0);
            if (even.length) addTween(even, evenStart);
        } else {
            strips.forEach(strip => {
                const d = Math.random() * settings.maxDelay;
                const vars = {
                    duration: settings.duration,
                    ease: settings.ease,
                    force3D: true
                };
                if (isVertical) {
                    vars.y = parseFloat(strip.getAttribute('data-final-y') || '0');
                } else {
                    vars.x = parseFloat(strip.getAttribute('data-final-x') || '0');
                }
                tl.to(strip, vars, d);
            });
        }
    }
    
    build();
    setTimeout(() => {
        el.classList.add('is-ready');
        play();
    }, 50);
    
    if (settings.triggerOnHover) {
        el.addEventListener('mouseenter', () => {
            if (playing) return;
            build();
            play();
        });
    }
}

// StaggeredMenu Implementation
function initStaggeredMenu() {
    if (!window.gsap) return;

    let open = false;
    let isAnimating = false;

    const wrapper = document.getElementById('mobile-menu');
    const toggleBtn = document.getElementById('sm-toggle-btn');
    const panel = document.getElementById('staggered-menu-panel');
    const preContainer = document.getElementById('sm-prelayers');
    const preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
    const plusH = document.getElementById('sm-plus-h');
    const plusV = document.getElementById('sm-plus-v');
    const icon = document.getElementById('sm-icon');
    const textInner = document.getElementById('sm-text-inner');
    
    if (!toggleBtn || !panel) return;

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

    const offscreen = 100; // Position Right

    // Set initial GSAP states
    gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
    gsap.set(preContainer, { xPercent: 0, opacity: 1 });
    gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
    gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
    gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
    gsap.set(textInner, { yPercent: 0 });

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    let openTl = gsap.timeline({ paused: true, onComplete: () => isAnimating = false });

    // Build timeline
    preLayers.forEach((layer, i) => {
        openTl.fromTo(layer, { xPercent: offscreen }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });
    
    const panelInsertTime = (preLayers.length ? (preLayers.length - 1) * 0.07 : 0) + (preLayers.length ? 0.08 : 0);
    const panelDuration = 0.65;
    
    openTl.fromTo(panel, { xPercent: offscreen }, { xPercent: 0, duration: panelDuration, ease: 'power4.out' }, panelInsertTime);

    const itemsStart = panelInsertTime + panelDuration * 0.15;
    if (itemEls.length) {
        openTl.to(itemEls, { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } }, itemsStart);
        // Call the shuffle text animation for each menu item staggered in sync with slide-up
        itemEls.forEach((el, index) => {
            openTl.call(() => {
                if (typeof el.triggerShuffle === 'function') {
                    el.triggerShuffle();
                }
            }, null, itemsStart + index * 0.1);
        });
    }

    const socialsStart = panelInsertTime + panelDuration * 0.4;
    if (socialTitle) openTl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
    if (socialLinks.length) {
        openTl.to(socialLinks, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: { each: 0.08, from: 'start' } }, socialsStart + 0.04);
    }

    function toggleMenu() {
        if (isAnimating) return;
        isAnimating = true;
        open = !open;

        if (open) {
            if (wrapper) wrapper.style.pointerEvents = 'auto';
            openTl.play(0);
            gsap.to(icon, { rotate: 225, duration: 0.8, ease: 'power4.out', overwrite: 'auto' });
            gsap.to(textInner, { yPercent: -50, duration: 0.5 + 2 * 0.07, ease: 'power4.out' }); // 'Close' is at -50% (2nd of 2 lines)
        } else {
            closeMenu();
        }
    }

    function closeMenu() {
        openTl.kill();
        const all = [...preLayers, panel];
        gsap.to(all, {
            xPercent: offscreen, duration: 0.32, ease: 'power3.in', overwrite: 'auto',
            onComplete: () => {
                if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
                if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
                if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
                if (wrapper) wrapper.style.pointerEvents = 'none';
                isAnimating = false;
            }
        });
        gsap.to(icon, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
        gsap.to(textInner, { yPercent: 0, duration: 0.5 + 2 * 0.07, ease: 'power4.out' }); // 'Menu'
    }

    toggleBtn.addEventListener('click', toggleMenu);
    
    // Close on link click
    panel.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            if (open) {
                open = false;
                closeMenu();
            }
        });
    });
}
