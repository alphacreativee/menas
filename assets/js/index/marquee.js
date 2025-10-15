let scrollDirection = 1;
let lastScrollTop = 0;
const marqueeData = new Map();
let animationFrameId = null;

function initMarquee() {
  document.querySelectorAll(".marquee-container").forEach((container) => {
    const content = container.querySelector(".marquee-content");
    const originalItems = [...container.querySelectorAll(".marquee-item")];
    const speed = parseFloat(container.getAttribute("data-speed")) || 30;

    // Xóa content
    content.innerHTML = "";

    // Append items gốc
    originalItems.forEach((item) => {
      content.appendChild(item.cloneNode(true));
    });

    // Đợi browser tính toán layout
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Đo width của tất cả items (bao gồm gap)
        const items = [...content.children];
        let totalWidth = 0;

        items.forEach((item) => {
          const rect = item.getBoundingClientRect();
          const style = getComputedStyle(item);
          const marginRight = parseFloat(style.marginRight) || 0;
          totalWidth += rect.width + marginRight;
        });

        // Nếu có gap trên content
        const gap = parseFloat(getComputedStyle(content).gap) || 0;
        if (gap > 0) {
          totalWidth += gap * (items.length - 1);
        }

        // Clone đủ items để fill màn hình + buffer
        const containerWidth = container.offsetWidth;
        const setsNeeded = Math.ceil(containerWidth / totalWidth) + 2;

        for (let i = 1; i < setsNeeded; i++) {
          originalItems.forEach((item) => {
            content.appendChild(item.cloneNode(true));
          });
        }

        gsap.set(content, {
          x: 0,
          willChange: "transform",
        });

        marqueeData.set(container, {
          content,
          loopWidth: totalWidth,
          speed,
          x: 0,
        });
      });
    });
  });

  // Start animation
  setTimeout(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    let lastTime = performance.now();

    const animate = (currentTime) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      marqueeData.forEach((data) => {
        if (!data.loopWidth) return;

        const { content, loopWidth, speed } = data;

        // Update x position
        data.x -= scrollDirection * speed * deltaTime;

        // Seamless loop
        if (data.x <= -loopWidth) {
          data.x += loopWidth;
        } else if (data.x > 0) {
          data.x -= loopWidth;
        }

        // Apply transform
        content.style.transform = `translate3d(${data.x}px, 0, 0)`;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
  }, 150);

  window.addEventListener(
    "scroll",
    () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) scrollDirection = 1;
      else if (scrollTop < lastScrollTop) scrollDirection = -1;
      lastScrollTop = scrollTop;
    },
    { passive: true }
  );
}

initMarquee();
