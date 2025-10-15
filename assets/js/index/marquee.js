let scrollDirection = 1;
let lastScrollTop = 0;
const marqueeData = new Map();
let animationFrameId = null;

function initMarquee() {
  document.querySelectorAll(".marquee-container").forEach((container) => {
    const content = container.querySelector(".marquee-content");
    const items = [...container.querySelectorAll(".marquee-item")];
    const speed = parseFloat(container.getAttribute("data-speed")) || 30;

    // Clear content
    content.innerHTML = "";

    // Append original items
    items.forEach((item) => content.appendChild(item.cloneNode(true)));

    // Force reflow để lấy chính xác computed width
    content.offsetHeight;

    // Tính CHÍNH XÁC width của content (bao gồm cả gaps)
    const originalItems = [...content.children];
    const contentWidth = content.scrollWidth; // scrollWidth chính xác hơn offsetWidth

    // Clone đủ để fill + buffer
    const containerWidth = container.offsetWidth;
    const copiesNeeded = Math.ceil((containerWidth * 2) / contentWidth) + 1;

    for (let i = 0; i < copiesNeeded; i++) {
      originalItems.forEach((item) => {
        content.appendChild(item.cloneNode(true));
      });
    }

    // Force reflow again
    content.offsetHeight;

    gsap.set(content, {
      x: 0,
      willChange: "transform",
      force3D: true,
    });

    marqueeData.set(container, {
      content,
      loopWidth: contentWidth,
      speed,
      position: 0,
    });
  });

  if (animationFrameId) cancelAnimationFrame(animationFrameId);

  let lastTime = performance.now();

  const animate = (currentTime) => {
    const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1); // Cap deltaTime
    lastTime = currentTime;

    marqueeData.forEach((data) => {
      const { content, loopWidth, speed } = data;

      data.position += scrollDirection * speed * deltaTime;

      // Modulo để loop mượt
      data.position = ((data.position % loopWidth) + loopWidth) % loopWidth;

      // Apply với round để tránh sub-pixel rendering
      const xPos = Math.round(-data.position * 100) / 100;

      gsap.set(content, {
        x: xPos,
      });
    });

    animationFrameId = requestAnimationFrame(animate);
  };

  animationFrameId = requestAnimationFrame(animate);

  window.addEventListener(
    "scroll",
    () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      scrollDirection =
        scrollTop > lastScrollTop
          ? 1
          : scrollTop < lastScrollTop
          ? -1
          : scrollDirection;
      lastScrollTop = scrollTop;
    },
    { passive: true }
  );
}

initMarquee();
