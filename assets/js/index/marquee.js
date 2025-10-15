let scrollDirection = 1;
let lastScrollTop = 0;
const marqueeData = new Map();
let animationFrameId = null;

function initMarquee() {
  document.querySelectorAll(".marquee-container").forEach((container) => {
    const content = container.querySelector(".marquee-content");
    const items = [...container.querySelectorAll(".marquee-item")];
    const speed = parseFloat(container.getAttribute("data-speed")) || 30;

    // Xóa hết
    content.innerHTML = "";

    // Tạo wrapper cho 1 set items
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.gap = getComputedStyle(content).gap || "0px";

    items.forEach((item) => wrapper.appendChild(item.cloneNode(true)));
    content.appendChild(wrapper);

    // Đợi render xong
    requestAnimationFrame(() => {
      // Lấy width THỰC của wrapper (bao gồm tất cả)
      const wrapperWidth = wrapper.getBoundingClientRect().width;

      // Clone wrapper nhiều lần
      const copiesNeeded = Math.ceil(container.offsetWidth / wrapperWidth) + 3;

      for (let i = 0; i < copiesNeeded; i++) {
        content.appendChild(wrapper.cloneNode(true));
      }

      gsap.set(content, {
        x: 0,
        display: "flex",
        willChange: "transform",
      });

      marqueeData.set(container, {
        content,
        wrapperWidth,
        speed,
        position: 0,
      });
    });
  });

  // Đợi tất cả marquee init xong
  setTimeout(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    let lastTime = performance.now();

    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      marqueeData.forEach((data) => {
        if (!data.wrapperWidth) return; // Chưa ready

        const { content, wrapperWidth, speed } = data;

        data.position += scrollDirection * speed * deltaTime;

        // Loop: khi đi hết 1 wrapper thì reset về 0
        if (data.position >= wrapperWidth) {
          data.position = data.position - wrapperWidth;
        } else if (data.position < 0) {
          data.position = wrapperWidth + data.position;
        }

        gsap.set(content, {
          x: -data.position,
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
  }, 100);

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
