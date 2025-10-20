import { preloadImages } from "../../libs/utils.js";
("use strict");
$ = jQuery;
// setup lenis
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
function loading() {
  if (!document.querySelector(".loading")) return;
  const logo = document.getElementById("logo");
  const loadingAfter = document.querySelector(".loading");
  const yPos = window.innerHeight - 173;
  const aspectRatio = 145 / 28;
  const paddingTop = 12;

  gsap.set(logo, {
    y: yPos,
    scale: aspectRatio,
  });

  gsap.set(loadingAfter, {
    "--after-height": "0px",
  });

  gsap.to(logo, {
    y: 0,
    duration: 2,
    ease: "expo.in",
    onUpdate: function () {
      const logoRect = logo.getBoundingClientRect();
      const logoTop = logoRect.top;
      const afterHeight = window.innerHeight - logoTop + paddingTop;
      gsap.set(loadingAfter, {
        "--after-height": afterHeight + "px",
      });
    },
    onComplete: () => {
      gsap.to(logo, {
        scale: 1,
        duration: 1,
        ease: "expo.in",
        onComplete: () => {
          document.querySelector(".loading").classList.add("loaded");
        },
      });
    },
  });
}
// end lenis

function sectionFields() {
  if ($(".section-fields").length < 1) return;

  gsap.utils.toArray(".fields-item").forEach((item, index, array) => {
    const img = item.querySelector(".fields-item-img");
    const title = item.querySelector(".fields-item-name h3");
    const desc = item.querySelector(".fields-item-name .desc");

    // Hiệu ứng clipPath mở
    ScrollTrigger.create({
      trigger: item,
      start: "top bottom",
      end: "top top",
      scrub: 0.5,
      animation: gsap.fromTo(
        img,
        { clipPath: "polygon(25% 25%, 75% 40%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "none",
        }
      ),
    });

    // Hiệu ứng clipPath đóng
    if (index < array.length - 1) {
      ScrollTrigger.create({
        trigger: item,
        start: "bottom bottom",
        end: "bottom top",
        scrub: 0.5,
        animation: gsap.fromTo(
          img,
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 75% 60%, 25% 75%)",
            ease: "none",
          }
        ),
      });
    }

    if (title) {
      const splitTitle = SplitText.create(title, {
        type: "chars",
        mask: "chars",
      });
      gsap.set(splitTitle.chars, { y: "125%" });

      const tlTitle = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 20%",
          toggleActions: "play none none none",
          // markers: true
        },
      });

      tlTitle.to(splitTitle.chars, {
        y: "0%",
        ease: "power2.out",
        duration: 0.6,
        stagger: 0.03,
      });
    }

    if (desc) {
      const splitDesc = new SplitText(desc, {
        type: "lines",
        linesClass: "line",
        mask: "lines",
      });

      gsap.set(splitDesc.lines, { yPercent: 100 });

      const tlDesc = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 20%",
          toggleActions: "play none none none",
          // markers: true,
        },
      });

      tlDesc.to(splitDesc.lines, {
        yPercent: 0,
        ease: "power2.out",
        duration: 0.8,
        stagger: 0.1,
      });
    }

    const imgEl = item.querySelector(".fields-item-img img");

    if (imgEl) {
      gsap.fromTo(
        imgEl,
        { scale: 1.3 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: imgEl,
            start: "top bottom",
            end: "top top",
            scrub: 1,
            // markers: true
          },
        }
      );
    }

    // active tabs
    ScrollTrigger.create({
      trigger: item,
      start: "top center",
      end: "bottom center",
      // markers: true,
      onEnter: () => {
        $(".fields-tabs__item").removeClass("active");
        $(".fields-tabs__item").eq(index).addClass("active");
      },
      onEnterBack: () => {
        $(".fields-tabs__item").removeClass("active");
        $(".fields-tabs__item").eq(index).addClass("active");
      },
    });
  });

  ScrollTrigger.create({
    trigger: ".section-fields",
    start: "top center",
    end: "bottom+=40 bottom",
    // markers: true,
    onEnter: () => {
      $(".fields-tabs").addClass("active");
    },
    onLeave: () => {
      $(".fields-tabs").removeClass("active");
    },
    onEnterBack: () => {
      $(".fields-tabs").addClass("active");
    },
    onLeaveBack: () => {
      $(".fields-tabs").removeClass("active");
    },
  });
}

function magicCursor() {
  var circle = document.querySelector(".magic-cursor");

  gsap.set(circle, {
    xPercent: -50,
    yPercent: -50,
  });

  let mouseX = 0,
    mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    gsap.to(circle, {
      x: mouseX,
      y: mouseY,
      duration: 0.1,
    });
  });

  const items = document.querySelectorAll(".modal, [data-cursor-text]");
  var cursorDot = document.querySelector(".magic-cursor .cursor");
  var cursorText = document.querySelector(".magic-cursor .cursor .text");

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      let text = "";
      if (item.classList.contains("modal")) {
        text = "Đóng";
      } else {
        text = item.getAttribute("data-cursor-text");
      }

      // const text = item.getAttribute("data-cursor-text");
      cursorText.innerHTML = `<span class="b2-regular color-white">${text}</span>`;
      cursorDot.classList.add("show-text");
    });

    item.addEventListener("mouseleave", () => {
      cursorText.innerHTML = "";
      cursorDot.classList.remove("show-text");
    });
  });

  const itemsContent = document.querySelectorAll(".modal-dialog");
  itemsContent.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      cursorDot.classList.remove("show-text");
    });
    item.addEventListener("mouseleave", () => {
      cursorText.innerHTML = `<span class="b2-regular color-white">Đóng</span>`;
      cursorDot.classList.add("show-text");
    });
  });
}

function effectText() {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.utils.toArray(".data-fade-in").forEach((element) => {
    gsap.fromTo(
      element,
      {
        "will-change": "opacity, transform",
        opacity: 0,
        y: 20,
      },
      {
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 80%",
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "sine.out",
      }
    );
  });

  gsap.utils.toArray(".effect-line").forEach((description) => {
    const splitDescription = new SplitText(description, {
      type: "lines",
      linesClass: "line",
      mask: "lines",
    });

    gsap.fromTo(
      splitDescription.lines,
      {
        yPercent: 100,
        willChange: "transform",
      },
      {
        yPercent: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.05,

        scrollTrigger: {
          trigger: description,
          start: "top 80%",
          // markers: true,
        },
      }
    );
  });

  gsap.utils.toArray(".effect-title-auto").forEach((title) => {
    const delay = parseFloat(title.getAttribute("data-delay")) || 0;

    const splitTitle = SplitText.create(title, {
      type: "chars",
      mask: "chars",
    });

    gsap.set(splitTitle.chars, { y: "125%" });

    gsap.to(splitTitle.chars, {
      y: "0%",
      ease: "power3.out",
      duration: 1,
      stagger: 0.03,
      delay: delay,
    });
  });

  gsap.utils.toArray(".effect-title").forEach((title) => {
    const delay = parseFloat(title.getAttribute("data-delay")) || 0;

    const splitTitle = new SplitText(title, {
      type: "chars",
      charsClass: "char",
      mask: "chars",
    });

    gsap.set(splitTitle.chars, { y: "125%", opacity: 0 });

    gsap.to(splitTitle.chars, {
      y: "0%",
      opacity: 1,
      ease: "power3.out",
      duration: 1,
      stagger: 0.03,
      delay: delay,
      scrollTrigger: {
        trigger: title,
        start: "top 80%",
        toggleActions: "play none none none",
        // markers: true,
      },
    });
  });
}

function customDropdown() {
  const dropdowns = document.querySelectorAll(".dropdown-custom");

  dropdowns.forEach((dropdown) => {
    const btnDropdown = dropdown.querySelector(".dropdown-custom-btn");
    const dropdownMenu = dropdown.querySelector(".dropdown-custom-menu");
    const dropdownItems = dropdown.querySelectorAll(".dropdown-custom-item");
    const valueSelect = dropdown.querySelector(".value-select");

    // Toggle dropdown on button click
    btnDropdown.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllDropdowns(dropdown);
      dropdownMenu.classList.toggle("dropdown--active");
      btnDropdown.classList.toggle("--active");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function () {
      closeAllDropdowns();
    });

    // Handle item selection
    dropdownItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();

        // Store current values from the button
        const currentImgEl = valueSelect.querySelector("img");
        const currentImg = currentImgEl ? currentImgEl.src : "";
        const currentText = valueSelect.querySelector("span").textContent;
        const currentHtml = valueSelect.innerHTML;

        // Store clicked item values
        const clickedHtml = item.innerHTML;

        // Update the button with clicked item values
        valueSelect.innerHTML = clickedHtml;

        const isSelectTime = currentText.trim() === "Time";

        // Update the clicked item with the previous button values
        if (!isSelectTime) {
          if (currentImg) {
            item.innerHTML = `<img src="${currentImg}" alt="" /><span>${currentText}</span>`;
          } else {
            item.innerHTML = `<span>${currentText}</span>`;
          }
        }

        closeAllDropdowns();
      });
    });

    // Close dropdown on scroll
    window.addEventListener("scroll", function () {
      if (dropdownMenu.closest(".header-lang")) {
        dropdownMenu.classList.remove("dropdown--active");
        btnDropdown.classList.remove("--active");
      }
    });
  });

  function closeAllDropdowns(exception) {
    dropdowns.forEach((dropdown) => {
      const menu = dropdown.querySelector(".dropdown-custom-menu");
      const btn = dropdown.querySelector(".dropdown-custom-btn");

      if (!exception || dropdown !== exception) {
        menu.classList.remove("dropdown--active");
        btn.classList.remove("--active");
      }
    });
  }
}

function hero() {
  if ($("section.hero").length < 1) return;

  $(".hero-slider").each(function () {
    let $slider = $(this);

    let $dataSpeed;
    let $dataLoop = $slider.attr("data-loop");
    let $dataAutoplay = $slider.data("autoplay")
      ? { delay: $slider.data("autoplay") }
      : $slider.data("autoplay");
    if ($slider.is("[data-speed]")) {
      $dataSpeed = $slider.data("speed");
    } else {
      $dataSpeed = 900;
    }

    new Swiper($slider[0], {
      direction: "horizontal",
      rtl: true,
      speed: $dataSpeed,
      loop: $dataLoop,
      autoplay: $dataAutoplay,
      preloadImages: true,
      parallax: true,
      lazy: {
        loadPrevNext: true,
      },
      allowTouchMove: false,
      simulateTouch: false,
      mousewheel: false,
      pagination: {
        el: ".hero .swiper-pagination",
        clickable: false,
        renderBullet: function (i, className) {
          return `
            <button class="${className}">
            <svg class="progress" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle class="circle-origin" cx="14" cy="14" r="13" stroke="white"/>
            </svg>
            </button>`;
        },
      },
      // navigation: {
      //   nextEl: ".hero .swiper-button-next",
      //   prevEl: ".hero .swiper-button-prev"
      // },
      on: {
        init: function () {
          let $this = this;
          $($this.slides[$this.activeIndex]);
        },
      },
    });
  });

  ScrollTrigger.create({
    start: 0,
    end: "max",
    // markers: true,
    onUpdate: (self) => {
      const threshold = window.innerHeight * 1.4;
      if (self.scroll() >= threshold) {
        $(".hero").addClass("hidden-section");
      } else {
        $(".hero").removeClass("hidden-section");
      }
    },
  });
}

function sectionIntro() {
  if ($("section.intro").length < 1) return;

  gsap.to(".intro-overlay", {
    y: -200,
    ease: "none",
    scrollTrigger: {
      trigger: "section.intro",
      start: "top 80%",
      end: "bottom top",
      scrub: true,
      // markers: true
    },
  });

  gsap.utils
    .toArray([".image-small img", ".image-large img"])
    .forEach((img) => {
      gsap.fromTo(
        img,
        {
          scale: 1.2,
          // yPercent: 10
        },
        {
          scale: 1,
          // yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: "section.intro",
            start: "top 80%",
            end: "bottom top",
            scrub: true,
            // markers: true
          },
        }
      );
    });

  gsap.utils
    .toArray([".image-small img", ".image-large img"])
    .forEach((img) => {
      gsap.fromTo(
        img,
        {
          scale: 1.2,
          // yPercent: 10
        },
        {
          scale: 1,
          // yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: "section.intro",
            start: "top 80%",
            end: "bottom top",
            scrub: true,
            // markers: true
          },
        }
      );
    });

  gsap.utils.toArray(".item-translate").forEach((el) => {
    const yValue = parseFloat(el.getAttribute("data-y")) || 0;

    gsap.to(el, {
      y: yValue,
      ease: "none",
      scrollTrigger: {
        trigger: "section.intro",
        start: "top 80%",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  if ($(".intro").length > 0) {
    gsap.to(".hero", {
      y: -200,
      ease: "none",
      scrollTrigger: {
        trigger: ".intro",
        start: "top bottom",
        end: "top top",
        scrub: true,
        // markers: true
      },
    });
  }
}
function scrollWrap() {
  if (document.querySelectorAll(".scroll-wrap").length < 1) return;
  document.querySelectorAll(".scroll-wrap").forEach((wrap) => {
    const triggers = wrap.querySelectorAll(".scroll-trigger");
    const items = wrap.querySelectorAll(".scroll-item");

    triggers.forEach((trigger, index) => {
      const item = items[index];

      if (index === 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: trigger,
            start: "top top",
            end: "bottom top",
            scrub: true,
            // markers: true,
          },
          defaults: { ease: "none" },
        });

        tl.fromTo(
          item,
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }
        );
      } else if (index === items.length - 1) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: trigger,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
            // markers: true,
          },
          defaults: { ease: "none" },
        });

        tl.fromTo(
          item,
          { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }
        );
      } else {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
          defaults: { ease: "none" },
        });

        tl.fromTo(
          item,
          { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }
        );

        tl.to(item, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        });
      }
    });
  });
}
function sectionNews() {
  if ($(".section-news").length < 1) return;

  const items = gsap.utils.toArray(".section-news .grid-news__item");

  gsap.set(items, { y: 40, opacity: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section-news",
      start: "top 70%",
      end: "bottom bottom",
      toggleActions: "play none none none",
      // markers: true,
    },
  });

  tl.to(items, {
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.2,
  });
}

function sectionAwards() {
  if ($(".section-awards").length < 1) return;

  const awardsSwiper = new Swiper(".awards-slider", {
    slidesPerView: 3,
    spaceBetween: 24,
    loop: false,
    speed: 800,
    autoplay: false,
    navigation: {
      prevEl: ".section-awards .arrow-prev",
      nextEl: ".section-awards .arrow-next",
    },
    breakpoints: {
      768: {
        slidesPerView: 3,
      },
      480: {
        slidesPerView: 2,
      },
      0: {
        slidesPerView: 1,
      },
    },
  });
}
function ticket() {
  const tickets = document.querySelectorAll(".ticket");

  if (!tickets.length) return;

  tickets.forEach((item) => {
    const ticketInner = item.querySelector(".ticket-inner");
    const ticketContent = ticketInner.querySelector(".ticket-content");
    const duration =
      parseFloat(item.getAttribute("data-ticket-duration")) || 10;

    // Số lượng bản clone
    const cloneCount = 10;

    // Xóa các clone cũ
    ticketInner.innerHTML = "";
    ticketInner.append(ticketContent);

    // Clone các phần tử
    for (let i = 0; i < cloneCount; i++) {
      const ticketContentClone = ticketContent.cloneNode(true);
      ticketInner.append(ticketContentClone);
    }

    // Lấy tất cả các ticket-content
    const ticketContentAll = gsap.utils.toArray(".ticket-content", ticketInner);

    // Tính chiều rộng của một phần tử
    const contentWidth = ticketContent.offsetWidth;

    // Animation marquee
    gsap.to(ticketContentAll, {
      x: -contentWidth,
      repeat: -1,
      duration: duration,
      ease: "linear",
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % contentWidth),
      },
    });

    // Diamond rotation animation
    const diamonds = ticketInner.querySelectorAll(".diamond");
    diamonds.forEach((diamond) => {
      const rotationTimeline = gsap.to(diamond, {
        rotation: -360,
        repeat: -1,
        duration: 3,
        ease: "linear",
      });
    });
  });
}

function responsibility() {
  if ($(".responsibility").length < 1) return;

  const responsibilityItems = gsap.utils.toArray(
    ".responsibility .responsibility-item"
  );

  gsap.set(responsibilityItems, { y: 50, opacity: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".responsibility-grid",
      start: "top 70%",
      end: "bottom bottom",
      toggleActions: "play none none none",
      // markers: true,
    },
  });

  tl.to(responsibilityItems, {
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.2,
  });

  const responsibilityItemsMove = $(".responsibility .responsibility-item");

  responsibilityItemsMove.mousemove(function (e) {
    let offset = $(this).offset();
    let x = e.pageX - offset.left;
    let y = e.pageY - offset.top;

    $(this).css("--x", x + "px");
    $(this).css("--y", y + "px");
  });
}

function parallaxSection() {
  if ($(".parallax-section").length < 1) return;

  $(".parallax-section").each(function () {
    const $section = $(this);
    const $overlay = $section.find(".section-overlay-parallax");

    if ($overlay.length < 1) return;

    gsap.to($overlay, {
      y: -200,
      ease: "none",
      scrollTrigger: {
        trigger: $section[0],
        start: "top 80%",
        end: "bottom top",
        scrub: true,
        // markers: true
      },
    });
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  sectionFields();
  loading();
  magicCursor();
  effectText();
  customDropdown();
  hero();
  sectionIntro();
  scrollWrap();
  sectionNews();
  sectionAwards();
  ticket();
  responsibility();
  parallaxSection();
  ScrollTrigger.refresh();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});

// loadpage
let isLinkClicked = false;
$("a").on("click", function (e) {
  // Nếu liên kết dẫn đến trang khác (không phải hash link hoặc javascript void)
  if (this.href && !this.href.match(/^#/) && !this.href.match(/^javascript:/)) {
    isLinkClicked = true;
  }
});

$(window).on("beforeunload", function () {
  if (!isLinkClicked) {
    $(window).scrollTop(0);
  }
  isLinkClicked = false;
});
