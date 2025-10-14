let scrollDirection = 1;
let lastScrollTop = 0;
const marqueeTimelines = new Map();
let animationFrameId = null;

function initMarquee() {
  if (!document.querySelector(".marquee-container")) return;
  // Setup marquee containers
  document.querySelectorAll(".marquee-container").forEach((container) => {
    const content = container.querySelector(".marquee-content");
    const items = [...container.querySelectorAll(".marquee-item")];
    const speed = parseFloat(container.getAttribute("data-speed")) || 30;

    content.innerHTML = "";
    items.forEach((item) => content.appendChild(item.cloneNode(true)));

    const clonedItems = [...content.children];
    let totalWidth = 0;
    clonedItems.forEach((item) => (totalWidth += item.offsetWidth));

    const containerWidth = container.offsetWidth;
    const copiesNeeded = Math.ceil(containerWidth / totalWidth) + 4;

    for (let i = 0; i < copiesNeeded; i++) {
      clonedItems.forEach((item) => {
        content.appendChild(item.cloneNode(true));
      });
    }

    let fullWidth = 0;
    [...content.children].forEach((item) => (fullWidth += item.offsetWidth));

    gsap.set(content, {
      x: 0,
      willChange: "transform",
      force3D: true,
    });

    const duration = fullWidth / speed;
    const tl = gsap.timeline({ paused: true });
    tl.to(content, {
      x: -fullWidth,
      duration: duration,
      ease: "none",
      modifiers: {
        x: (x) => `${parseFloat(x) % fullWidth}px`,
      },
    });

    marqueeTimelines.set(container, {
      timeline: tl,
      fullWidth,
      speed,
      duration,
      progress: 0,
      content,
    });
  });

  // Start animation loop
  if (animationFrameId) cancelAnimationFrame(animationFrameId);

  const animate = () => {
    marqueeTimelines.forEach((data) => {
      const { timeline, duration, speed, fullWidth } = data;

      data.progress += (scrollDirection * speed) / (fullWidth / 16.67);

      if (data.progress < 0) {
        data.progress = duration + data.progress;
      }
      if (data.progress > duration) {
        data.progress = data.progress - duration;
      }

      timeline.progress(data.progress / duration);
    });

    animationFrameId = requestAnimationFrame(animate);
  };

  animationFrameId = requestAnimationFrame(animate);

  // Scroll listener
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
      scrollDirection = 1;
    } else if (scrollTop < lastScrollTop) {
      scrollDirection = -1;
    }

    lastScrollTop = scrollTop;
  });
}

// Initialize
initMarquee();
