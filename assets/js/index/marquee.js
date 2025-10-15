let scrollDirection = 1;
let lastScrollTop = 0;
const marqueeData = new Map();
let animationFrameId = null;

function initMarquee() {
  document.querySelectorAll(".marquee-container").forEach((container) => {
    const content = container.querySelector(".marquee-content");
    const originalItems = [...container.querySelectorAll(".marquee-item")];
    const speed = parseFloat(container.getAttribute("data-speed")) || 30;

    content.innerHTML = "";

    originalItems.forEach((item) => {
      content.appendChild(item.cloneNode(true));
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const items = [...content.children];
        let totalWidth = 0;

        items.forEach((item) => {
          const rect = item.getBoundingClientRect();
          const style = getComputedStyle(item);
          const marginRight = parseFloat(style.marginRight) || 0;
          totalWidth += rect.width + marginRight;
        });

        const gap = parseFloat(getComputedStyle(content).gap) || 0;
        if (gap > 0 && items.length > 1) {
          totalWidth += gap * (items.length - 1);
        }

        const containerWidth = container.offsetWidth;
        const setsNeeded = Math.ceil((containerWidth * 2) / totalWidth) + 2;

        for (let i = 1; i < setsNeeded; i++) {
          originalItems.forEach((item) => {
            content.appendChild(item.cloneNode(true));
          });
        }

        // Key fix: Đảm bảo width chính xác bằng cách tính lại sau khi clone
        requestAnimationFrame(() => {
          const allItems = [...content.children];
          let preciseWidth = 0;

          allItems.slice(0, originalItems.length).forEach((item, idx) => {
            const rect = item.getBoundingClientRect();
            preciseWidth += rect.width;
            if (idx < originalItems.length - 1) {
              preciseWidth += gap || 0;
            }
          });

          gsap.set(content, {
            x: 0,
            willChange: "transform",
          });

          marqueeData.set(container, {
            content,
            loopWidth: preciseWidth, // Sử dụng width chính xác hơn
            speed,
            x: 0,
          });
        });
      });
    });
  });

  setTimeout(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    let lastTime = performance.now();

    const animate = (currentTime) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      marqueeData.forEach((data) => {
        if (!data.loopWidth) return;

        const { content, loopWidth, speed } = data;

        data.x -= scrollDirection * speed * deltaTime;

        // Improved seamless loop với modulo
        if (scrollDirection > 0) {
          // Scroll sang trái
          if (data.x <= -loopWidth) {
            data.x = data.x % loopWidth;
          }
        } else {
          // Scroll sang phải
          if (data.x >= 0) {
            data.x = -(loopWidth + (data.x % loopWidth));
          }
        }

        // Sử dụng transform trực tiếp thay vì GSAP để tránh conflict
        content.style.transform = `translate3d(${
          Math.round(data.x * 100) / 100
        }px, 0, 0)`;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
  }, 200); // Tăng timeout để đảm bảo layout ổn định

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
