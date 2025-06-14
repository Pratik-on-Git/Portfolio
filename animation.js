gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Configuration
const isMobile = window.innerWidth <= 768;
const movementsY = [-100, 80, 0, -120, 70, -50];
const movementsX = [-20, -50, 0, 30, 10, 30];

// Lock scroll initially
document.body.style.cssText = `
  overflow: hidden;
  touch-action: none;
  position: fixed;
  width: 100%;
  height: 100%;
`;

// Release scroll after 8 seconds
setTimeout(() => {
  document.body.removeAttribute("style");
  document.body.classList.remove('no-scroll');
}, 8000);

// === Utility Animations ===

function fadeInStagger(selector, options = {}) {
  return gsap.to(selector, {
    opacity: 1,
    filter: "blur(0px) contrast(110%)",
    duration: 0.7,
    ease: "expo.out",
    stagger: {
      each: 0.15,
      from: "center",
      ease: "power2.out",
    },
    ...options
  });
}

function microMovement(selector) {
  return gsap.to(selector, {
    y: () => gsap.utils.random(isMobile ? -1 : -2, isMobile ? 1 : 2),
    duration: 0.5,
    ease: "sine.inOut",
    stagger: 0.05
  });
}

function slideFadeIn(selector, offsetY = 80, delay = 0) {
  return gsap.from(selector, {
    y: offsetY,
    opacity: 0,
    duration: 1,
    ease: "expo.out",
    delay
  });
}

// === Main GSAP Timeline ===

const t1 = gsap.timeline({ delay: 1.3 });

gsap.set("h1", { y: 0, opacity: 0, filter: "blur(0.5px) contrast(90%)" });

t1.add(fadeInStagger("h1"))
  .fromTo("h1", {
    textShadow: "0 0 10px rgba(0,0,0,0.2)"
  }, {
    textShadow: "0 0 0px rgba(0,0,0,0)",
    duration: 0.8
  }, "<")
  .add(microMovement("h1"), "<0.2");

// Counter Animation
t1.add(
  gsap.timeline()
    .to(".counter h4", { y: -35, duration: 0.3, ease: "power2.inOut", delay: 0.4 })
    .to(".counter h4", { y: -70, duration: 0.3, ease: "power2.inOut", delay: 0.3 })
    .to(".counter h4", { y: -105, duration: 0.3, ease: "elastic.out(1, 0.5)", delay: 0.5 }),
  "-=0.3"
);

// Tagline, Scaling, Clip, Block Reveal
t1.add(slideFadeIn(".tagline", 80), "-=0.3")
  .to("h1", {
    fontSize: isMobile ? "5rem" : "18rem",
    duration: 1.2,
    ease: "expo.out",
    transformOrigin: "center center"
  })
  .to(".header-item", {
    clipPath: "none",
    duration: 1.2,
    ease: "expo.out"
  }, "<")
  .to(".block", {
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    duration: 0.8,
    stagger: {
      amount: 0.8,
      from: "random",
      ease: "expo.out"
    }
  }, "<+=0.2")
  .to(".blocks", {
    autoAlpha: 0,
    duration: 1,
    ease: "power2.inOut"
  }, "+=0.2");

// Enhanced Scatter Animation
movementsY.forEach((moveY, i) => {
  const moveX = movementsX[i];
  t1.to(`.h-${i + 1}`, {
    x: isMobile ? moveX * 0.6 : moveX,
    y: isMobile ? moveY * 0.6 : moveY,
    duration: 0.7,
    ease: "elastic.out(1, 0.5)"
  }, "<");
});

// Footer Entrance
t1.from(".logo, .link, footer p", {
  y: 30,
  opacity: 0,
  duration: 0.5,
  stagger: {
    amount: 0.4,
    ease: "back.out(1.7)"
  }
}, "-=0.5");

t1.call(() => {
  document.body.classList.remove('no-scroll');
  initParallax();
  initSmoothScroll();
  initScrollEffects();
});

// === Enhanced Parallax ===

function initParallax() {
  const h1Letters = document.querySelectorAll('.h-1, .h-2, .h-3, .h-4, .h-5, .h-6');
  if (!h1Letters.length) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  const handleMovement = (x, y) => {
    targetX = (x / window.innerWidth - 0.5) * (isMobile ? 15 : 30);
    targetY = (y / window.innerHeight - 0.5) * (isMobile ? 15 : 30);
  };

  document.addEventListener('mousemove', e => handleMovement(e.clientX, e.clientY));
  document.addEventListener('touchmove', e => {
    if (e.touches.length) handleMovement(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  gsap.ticker.add(() => {
    currentX = gsap.utils.interpolate(currentX, targetX, 0.08);
    currentY = gsap.utils.interpolate(currentY, targetY, 0.08);

    h1Letters.forEach((el, i) => {
      const strength = isMobile ? (1 + i * 0.3) : (3 + i * 0.7);
      const baseX = movementsX[i] * (isMobile ? 0.6 : 1);
      const baseY = movementsY[i] * (isMobile ? 0.6 : 1);

      gsap.set(el, {
        x: baseX + currentX * strength,
        y: baseY + currentY * strength
      });
    });
  });
}

// === Smooth Scroll Setup ===

function initSmoothScroll() {
  const lenis = new Lenis({
    lerp: 0.1,
    smooth: true,
    direction: 'vertical'
  });

  lenis.on('scroll', ({ scroll }) => {
    const nav = document.querySelector('nav');
    nav.classList.toggle('scrolled', scroll > 50);
  });

  const raf = time => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);
}

// === Scroll-triggered Animations ===

function initScrollEffects() {
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

// === Smooth Scroll to Element ===

function smoothScroll(target) {
  const el = document.querySelector(target);
  if (el) {
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

// === Resize Handling ===

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile) location.reload();
  }, 300);
});

// === Pinch Zoom Blocker ===

document.addEventListener('touchstart', e => {
  if (e.touches.length >= 2) e.preventDefault();
}, { passive: false });

document.addEventListener('gesturestart', e => e.preventDefault());

// === About Section Scroll Animations ===

document.addEventListener("DOMContentLoaded", () => {
  gsap.set(["#description-about-me", "#bottom-part2"], { y: 80, opacity: 0, filter: "blur(5px)" });
  gsap.set("#bottom-part2 img", { scale: 0.9, opacity: 0 });

  const aboutTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: "#description-about-me",
      start: "top 75%",
      toggleActions: "play none none none"
    }
  });

  aboutTimeline
    .to("#description-about-me", {
      y: 0, opacity: 1, filter: "blur(0px)",
      duration: 0.8, ease: "power3.out"
    })
    .to("#bottom-part2", {
      y: 0, opacity: 1, filter: "blur(0px)",
      duration: 0.8, ease: "power3.out"
    }, "-=0.4")
    .to("#bottom-part2 img", {
      scale: 1, opacity: 1,
      duration: 1.2, ease: "elastic.out(1, 0.5)"
    }, "-=0.6");
});
4