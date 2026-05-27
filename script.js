document.addEventListener('DOMContentLoaded', () => {

    /* ===== Dynamic Today's Date Update ===== */
    const dateEl = document.querySelector('.nav-date');
    if (dateEl) {
        const today = new Date();
        const day = today.getDate();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const month = monthNames[today.getMonth()];
        const year = today.getFullYear();
        dateEl.innerHTML = `${day} ${month}, ${year} &rarr;`;
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
    
    let stopRippleGrid = null;
    if (document.getElementById('ripple-grid-container')) {
        setTimeout(() => {
            if (typeof initRippleGrid === 'function') {
                stopRippleGrid = initRippleGrid();
            }
        }, 100);
    }
    
    // Hold splash screen for 5.5 seconds, then fade it out cleanly to the homepage
    setTimeout(() => {
        if (splashScreen) {
            splashScreen.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }
        if (stopRippleGrid) stopRippleGrid();
        
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
    }, 5500);

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

    // Initialize StaggeredMenu
    if (typeof initStaggeredMenu === 'function') {
        initStaggeredMenu();
    }
});

// RippleGrid Splash Screen Implementation
function initRippleGrid() {
    const container = document.getElementById('ripple-grid-container');
    const OGLObj = window.OGL || window.ogl;
    if (!container || !OGLObj) return;

    // Configurable Props mapping to React Bits spec
    const enableRainbow = false;
    const gridColor = '#ffffff';
    const rippleIntensity = 0.07;
    const gridSize = 14.0;
    const gridThickness = 14.0;
    const mouseInteraction = true;
    const mouseInteractionRadius = 0.6;
    const opacity = 0.8;
    const fadeDistance = 2.0;
    const vignetteStrength = 5.0;
    const glowIntensity = 1.0;
    const gridRotation = 0.0;

    const hexToRgb = hex => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
            : [1, 1, 1];
    };

    const { Renderer, Program, Triangle, Mesh } = OGLObj;
    const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true
    });
    const gl = renderer.gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    container.appendChild(gl.canvas);

    const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}`;

    const frag = `precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform bool enableRainbow;
uniform vec3 gridColor;
uniform float rippleIntensity;
uniform float gridSize;
uniform float gridThickness;
uniform float fadeDistance;
uniform float vignetteStrength;
uniform float glowIntensity;
uniform float opacity;
uniform float gridRotation;
uniform bool mouseInteraction;
uniform vec2 mousePosition;
uniform float mouseInfluence;
uniform float mouseInteractionRadius;
varying vec2 vUv;

float pi = 3.141592;

mat2 rotate(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;

    if (gridRotation != 0.0) {
        uv = rotate(gridRotation * pi / 180.0) * uv;
    }

    float dist = length(uv);
    float func = sin(pi * (iTime - dist));
    vec2 rippleUv = uv + uv * func * rippleIntensity;

    if (mouseInteraction && mouseInfluence > 0.0) {
        vec2 mouseUv = (mousePosition * 2.0 - 1.0);
        mouseUv.x *= iResolution.x / iResolution.y;
        float mouseDist = length(uv - mouseUv);
        
        float influence = mouseInfluence * exp(-mouseDist * mouseDist / (mouseInteractionRadius * mouseInteractionRadius));
        
        float mouseWave = sin(pi * (iTime * 2.0 - mouseDist * 3.0)) * influence;
        rippleUv += normalize(uv - mouseUv) * mouseWave * rippleIntensity * 0.3;
    }

    vec2 a = sin(gridSize * 0.5 * pi * rippleUv - pi / 2.0);
    vec2 b = abs(a);

    float aaWidth = 0.5;
    vec2 smoothB = vec2(
        smoothstep(0.0, aaWidth, b.x),
        smoothstep(0.0, aaWidth, b.y)
    );

    vec3 color = vec3(0.0);
    color += exp(-gridThickness * smoothB.x * (0.8 + 0.5 * sin(pi * iTime)));
    color += exp(-gridThickness * smoothB.y);
    color += 0.5 * exp(-(gridThickness / 4.0) * sin(smoothB.x));
    color += 0.5 * exp(-(gridThickness / 3.0) * smoothB.y);

    if (glowIntensity > 0.0) {
        color += glowIntensity * exp(-gridThickness * 0.5 * smoothB.x);
        color += glowIntensity * exp(-gridThickness * 0.5 * smoothB.y);
    }

    float ddd = exp(-2.0 * clamp(pow(dist, fadeDistance), 0.0, 1.0));
    
    vec2 vignetteCoords = vUv - 0.5;
    float vignetteDistance = length(vignetteCoords);
    float vignette = 1.0 - pow(vignetteDistance * 2.0, vignetteStrength);
    vignette = clamp(vignette, 0.0, 1.0);
    
    vec3 t;
    if (enableRainbow) {
        t = vec3(
            uv.x * 0.5 + 0.5 * sin(iTime),
            uv.y * 0.5 + 0.5 * cos(iTime),
            pow(cos(iTime), 4.0)
        ) + 0.5;
    } else {
        t = gridColor;
    }

    float finalFade = ddd * vignette;
    float alpha = length(color) * finalFade * opacity;
    gl_FragColor = vec4(color * t * finalFade * opacity, alpha);
}`;

    const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },
        enableRainbow: { value: enableRainbow },
        gridColor: { value: hexToRgb(gridColor) },
        rippleIntensity: { value: rippleIntensity },
        gridSize: { value: gridSize },
        gridThickness: { value: gridThickness },
        fadeDistance: { value: fadeDistance },
        vignetteStrength: { value: vignetteStrength },
        glowIntensity: { value: glowIntensity },
        opacity: { value: opacity },
        gridRotation: { value: gridRotation },
        mouseInteraction: { value: mouseInteraction },
        mousePosition: { value: [0.5, 0.5] },
        mouseInfluence: { value: 0 },
        mouseInteractionRadius: { value: mouseInteractionRadius }
    };

    const geometry = new Triangle(gl);
    const program = new Program(gl, { vertex: vert, fragment: frag, uniforms });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        uniforms.iResolution.value = [w, h];
    };

    let targetMouse = { x: 0.5, y: 0.5 };
    let currentMouse = { x: 0.5, y: 0.5 };
    let mouseInfluence = 0.0;
    let targetInfluence = 0.0;

    const handleMouseMove = e => {
        if (!mouseInteraction || !container) return;
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1.0 - (e.clientY - rect.top) / rect.height; // Flip Y coordinate
        targetMouse = { x, y };
    };

    const handleMouseEnter = () => {
        if (!mouseInteraction) return;
        targetInfluence = 1.0;
    };

    const handleMouseLeave = () => {
        if (!mouseInteraction) return;
        targetInfluence = 0.0;
    };

    window.addEventListener('resize', resize);
    if (mouseInteraction) {
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);
    }
    resize();

    let requestID;
    const render = t => {
        uniforms.iTime.value = t * 0.001;

        const lerpFactor = 0.1;
        currentMouse.x += (targetMouse.x - currentMouse.x) * lerpFactor;
        currentMouse.y += (targetMouse.y - currentMouse.y) * lerpFactor;
        uniforms.mousePosition.value = [currentMouse.x, currentMouse.y];

        mouseInfluence += (targetInfluence - mouseInfluence) * 0.05;
        uniforms.mouseInfluence.value = mouseInfluence;

        renderer.render({ scene: mesh });
        requestID = requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    return () => {
        window.removeEventListener('resize', resize);
        if (mouseInteraction && container) {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
        }
        renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
        container?.removeChild(gl.canvas);
        cancelAnimationFrame(requestID);
    };
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
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list .sm-panel-item'));
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
    if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
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
        if (numberEls.length) {
            openTl.to(numberEls, { duration: 0.6, ease: 'power2.out', '--sm-num-opacity': 1, stagger: { each: 0.08, from: 'start' } }, itemsStart + 0.1);
        }
    }

    const socialsStart = panelInsertTime + panelDuration * 0.4;
    if (socialTitle) openTl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
    if (socialLinks.length) {
        openTl.to(socialLinks, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: { each: 0.08, from: 'start' }, onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' }) }, socialsStart + 0.04);
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
                if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
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

