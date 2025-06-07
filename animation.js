


// Initialize variables
        const isMobile = window.innerWidth <= 768;
        
        // Enhanced movements arrays for both X and Y axes
        const movementsY = [-100, 80, 0, -120, 70, -50];
        const movementsX = [-20, -50, 0, 30, 10, 30]; // New X-axis movements
        
        // Immediately lock the scroll
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        
        // Release scroll after 5.5 seconds
        setTimeout(() => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
            document.body.style.position = '';
            document.body.classList.remove('no-scroll');
        }, 8000);
        
        // GSAP Animation Timeline
        const t1 = gsap.timeline({ delay: 1.3 });
        
        // Initial setup
        gsap.set("h1", {
            y: 0,
            opacity: 0,
            filter: "blur(0.5px) contrast(90%)"
        });
        
        // Main animation sequence
        t1.to("h1", {
            opacity: 1,
            filter: "blur(0px) contrast(110%)",
            duration: 0.7,
            ease: "expo.out",
            stagger: {
                each: 0.15,
                from: "center",
                ease: "power2.out"
            }
        })
        .fromTo("h1",
            { textShadow: "0 0 10px rgba(0,0,0,0.2)" },
            { textShadow: "0 0 0px rgba(0,0,0,0)", duration: 0.8 },
            "<"
        );
        
        // Micro movements
        t1.to("h1", {
            y: () => gsap.utils.random(isMobile ? -1 : -2, isMobile ? 1 : 2),
            duration: 0.5,
            ease: "sine.inOut",
            stagger: 0.05
        }, "<0.2");
        
        // Counter animation
        const counterSequence = gsap.timeline();
        counterSequence.to(".counter h4", { 
            y: -35, 
            duration: 0.3, 
            ease: "power2.inOut",
            delay: 0.4
        })
        .to(".counter h4", { 
            y: -70, 
            duration: 0.3, 
            ease: "power2.inOut",
            delay: 0.3
        })
        .to(".counter h4", { 
            y: -105, 
            duration: 0.3, 
            ease: "elastic.out(1, 0.5)",
            delay: 0.5
        });
        
        t1.add(counterSequence, "-=0.3");
        
        // Tagline entrance
        t1.from(".tagline", { 
            y: 80,
            opacity: 0,
            duration: 1,
            ease: "expo.out"
        }, "-=0.3");
        
        // Scaling animation
        t1.to("h1", { 
            fontSize: isMobile ? "5rem" : "18rem",
            duration: 1.2,
            ease: "expo.out",
            transformOrigin: "center center"
        });
        
        t1.to(".header-item", { 
            clipPath: "none", 
            duration: 1.2,
            ease: "expo.out"
        }, "<");
        
        // Block reveal
        t1.to(".block", {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 0.8,
            stagger: {
                amount: 0.8,
                from: "random",
                ease: "expo.out"
            }
        }, "<+=0.2");
        
        // Blocks fade out
        t1.to([".blocks"], {
            autoAlpha: 0,
            duration: 1,
            ease: "power2.inOut"
        }, "+=0.2");
        
        // Enhanced scatter animation with X-axis movement
        movementsY.forEach((moveY, index) => {
            const moveX = movementsX[index]; // Get corresponding X movement
            
            t1.to(`.h-${index + 1}`, {
                x: isMobile ? moveX * 0.6 : moveX,
                y: isMobile ? moveY * 0.6 : moveY,
                duration: 0.7,
                ease: "elastic.out(1, 0.5)"
            }, "<");
        });
        
        // Footer elements entrance
        t1.from(".logo, .link, footer p", {
            y: 30,
            opacity: 0,
            duration: 0.5,
            stagger: {
                amount: 0.4,
                ease: "back.out(1.7)"
            }
        }, "-=0.5");
        
        // After animations complete
        t1.call(() => {
            document.body.classList.remove('no-scroll');
            initParallax();
            initSmoothScroll();
            initScrollEffects();
        });
        
        // Enhanced Parallax with X-axis movement
        function initParallax() {
            const h1Letters = document.querySelectorAll('.h-1, .h-2, .h-3, .h-4, .h-5, .h-6');
            if (h1Letters.length === 0) return;
            
            let targetX = 0;
            let targetY = 0;
            let currentX = 0;
            let currentY = 0;
        
            // Mouse/Touch movement handler
            const handleMovement = (clientX, clientY) => {
                targetX = (clientX / window.innerWidth - 0.5) * (isMobile ? 15 : 30);
                targetY = (clientY / window.innerHeight - 0.5) * (isMobile ? 15 : 30);
            };
        
            // Mouse events
            document.addEventListener('mousemove', (e) => {
                handleMovement(e.clientX, e.clientY);
            });
        
            // Touch events
            document.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    handleMovement(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });
        
            // Animation loop
            gsap.ticker.add(() => {
                currentX = gsap.utils.interpolate(currentX, targetX, 0.08);
                currentY = gsap.utils.interpolate(currentY, targetY, 0.08);
        
                h1Letters.forEach((el, i) => {
                    const strength = isMobile ? (1 + i * 0.3) : (3 + i * 0.7);
                    const originalY = movementsY[i] * (isMobile ? 0.6 : 1);
                    const originalX = movementsX[i] * (isMobile ? 0.6 : 1);
                    
                    gsap.set(el, {
                        x: originalX + (currentX * strength),
                        y: originalY + (currentY * strength),
                    });
                });
            });
        }
        
        // Initialize smooth scrolling
        function initSmoothScroll() {
            const lenis = new Lenis({
                lerp: 0.1,
                smooth: true,
                direction: 'vertical'
            });
            
            lenis.on('scroll', (e) => {
                // Update nav style on scroll
                const nav = document.querySelector('nav');
                if (e.scroll > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            });
            
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            
            requestAnimationFrame(raf);
        }
        
        // Initialize scroll-based animations
        function initScrollEffects() {
            // Project items animation
            gsap.utils.toArray('.project-item').forEach(item => {
                gsap.from(item, {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                });
            });
            
            // Contact section animation
            gsap.from('.contact-container', {
                opacity: 0,
                y: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: '#contact',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        }
        
        // Smooth scroll to element
        function smoothScroll(target) {
            const element = document.querySelector(target);
            if (element) {
                gsap.to(window, {
                    duration: 1.5,
                    ease: "power2.inOut",
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    }
                });
            }
        }
        
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth <= 768 && !isMobile) {
                    location.reload();
                } else if (window.innerWidth > 768 && isMobile) {
                    location.reload();
                }
            }, 300);
        });
        
        // Enable pinch-zoom on mobile
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length >= 2) {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        });



gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function() {
    // Initial setup - start elements off-screen
    gsap.set("#description-about-me", { y: 80, opacity: 0, filter: "blur(5px)" });
    gsap.set("#bottom-part2", { y: 80, opacity: 0, filter: "blur(5px)" });
    gsap.set("#bottom-part2 img", { scale: 0.9, opacity: 0 });

    // Create timeline
    const aboutTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#description-about-me",
            start: "top 75%",
            toggleActions: "play none none none",
            markers: false // Set to true for debugging
        }
    });

    // Animate elements with glass effect enhancement
    aboutTimeline
        .to("#description-about-me", {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out"
        })
        .to("#bottom-part2", {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.4")
        .to("#bottom-part2 img", {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)"
        }, "-=0.6");
});



