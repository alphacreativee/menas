let scrollDirection = 1;
let lastScrollTop = 0;
const marqueeTimelines = new Map();

function initMarquee() {
  if (!document.querySelector(".marquee-container")) return;

  document.querySelectorAll(".marquee-container").forEach((container) => {
    const content = container.querySelector(".marquee-content");
    const items = [...container.querySelectorAll(".marquee-item")];
    const speed = parseFloat(container.getAttribute("data-speed")) || 50;

    // Clear and clone items
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

    // Calculate half width for seamless loop
    const halfWidth = fullWidth / 2;

    gsap.set(content, {
      x: 0,
      willChange: "transform",
      force3D: true,
    });

    const duration = halfWidth / speed;

    const tl = gsap.timeline({
      repeat: -1,
      paused: false,
    });

    tl.to(content, {
      x: -halfWidth,
      duration: duration,
      ease: "none",
    });

    marqueeTimelines.set(container, {
      timeline: tl,
      speed,
      baseTimeScale: 1,
    });
  });

  // Scroll listener
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
      scrollDirection = 1;
    } else if (scrollTop < lastScrollTop) {
      scrollDirection = -1;
    }

    marqueeTimelines.forEach((data) => {
      data.timeline.timeScale(scrollDirection * data.baseTimeScale);
    });

    lastScrollTop = scrollTop;
  });
}

// Initialize
initMarquee();
