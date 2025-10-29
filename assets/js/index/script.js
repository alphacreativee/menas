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
  const paddingTop = 15;

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
        { clipPath: "inset(100px 100px 100px 100px)" }, // cách top, right, bottom, left 100px
        { clipPath: "inset(0px 0px 0px 0px)", ease: "none" } // full 100%
      ),
    });

    // Hiệu ứng clipPath đóng (thu nhỏ lại thành hình chữ nhật nhỏ)
    if (index < array.length - 1) {
      ScrollTrigger.create({
        trigger: item,
        start: "bottom bottom",
        end: "bottom top",
        scrub: 0.5,
        animation: gsap.fromTo(
          img,
          { clipPath: "inset(0px 0px 0px 0px)" }, // đang full
          { clipPath: "inset(100px 100px 100px 100px)", ease: "none" } // thu lại cách đều 100px
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
    start: "top top",
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
      cursorText.innerHTML = `<span class="color-white">${text}</span>`;
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
      cursorText.innerHTML = `<span class="color-white">Đóng</span>`;
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

  gsap.utils.toArray(".effect-line-auto").forEach((description) => {
    const delay = parseFloat(description.getAttribute("data-delay")) || 0;
    const splitDescription = new SplitText(description, {
      type: "lines",
      linesClass: "line",
      mask: "lines",
    });

    gsap.fromTo(
      splitDescription.lines,
      { yPercent: 100, willChange: "transform" },
      {
        yPercent: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.05,
        delay: delay,
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

  gsap.utils.toArray(".effect-line-box").forEach((description) => {
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
      type: "words,chars",
      mask: "words",
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
      type: "chars, words",
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
  gsap.registerPlugin(ScrollTrigger, SplitText);

  document.querySelectorAll(".scroll-wrap-item").forEach((scrollItem) => {
    const img = scrollItem.querySelector(".scroll-wrap-image");
    const title = scrollItem.querySelector(".title-box");
    const desc = scrollItem.querySelector(".description-box");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollItem,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });

    if (img) {
      gsap.set(img, { opacity: 0, y: 30 });
      tl.to(img, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
    }

    if (title) {
      const delay = parseFloat(title.getAttribute("data-delay")) || 0;
      const split = new SplitText(title, {
        type: "chars,words",
        charsClass: "char",
        mask: "chars",
      });
      gsap.set(split.chars, { y: "125%", opacity: 0 });
      tl.to(
        split.chars,
        { y: "0%", opacity: 1, duration: 1, ease: "power3.out", stagger: 0.03 },
        `-=${0.8 - delay}`
      );
    }

    if (desc) {
      const descDelay = parseFloat(desc.getAttribute("data-delay")) || 0;

      const splitDesc = new SplitText(desc, {
        type: "lines",
        linesClass: "line",
        mask: "lines",
      });

      // Ẩn ban đầu
      gsap.set(splitDesc.lines, { yPercent: 100, willChange: "transform" });

      // Animation từng dòng
      tl.fromTo(
        splitDesc.lines,
        {
          yPercent: 100,
        },
        {
          yPercent: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          delay: descDelay,
        },
        "<"
      ); // "<" = bắt đầu cùng lúc với animation trước
    }
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

  var interleaveOffset = 0.9;
  const progressBar = document.querySelector(".swiper-banner .progress-bar");

  var swiperBanner = new Swiper(".swiper-banner", {
    loop: true,
    speed: 1500,
    grabCursor: true,
    watchSlidesProgress: true,
    mousewheelControl: true,
    keyboardControl: true,
    navigation: {
      nextEl: ".swiper-banner .swiper-next",
      prevEl: ".swiper-banner .swiper-prev",
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    on: {
      autoplayTimeLeft(s, time, progress) {
        // progress: từ 0 -> 1
        progressBar.style.width = `${(1 - progress) * 100}%`;
      },
      progress: function (swiper) {
        swiper.slides.forEach(function (slide) {
          var slideProgress = slide.progress || 0;
          var innerOffset = swiper.width * interleaveOffset;
          var innerTranslate = slideProgress * innerOffset;
          // Kiểm tra nếu innerTranslate không phải là NaN
          if (!isNaN(innerTranslate)) {
            var slideInner = slide.querySelector(".slide-banner");
            if (slideInner) {
              slideInner.style.transform =
                "translate3d(" + innerTranslate + "px, 0, 0)";
            }
          }
        });
      },
      touchStart: function (swiper) {
        swiper.slides.forEach(function (slide) {
          slide.style.transition = "";
        });
      },
      setTransition: function (swiper, speed) {
        var easing = "cubic-bezier(0.25, 0.1, 0.25, 1)";
        swiper.slides.forEach(function (slide) {
          slide.style.transition = speed + "ms " + easing;
          var slideInner = slide.querySelector(".slide-banner");
          if (slideInner) {
            slideInner.style.transition = speed + "ms " + easing;
          }
        });
      },
    },
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
    y: -100,
    ease: "none",
    scrollTrigger: {
      trigger: "section.intro",
      start: "top 55%",
      end: "+=300",
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
        start: "top 55%",
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

function sectionAwards() {
  if ($(".section-awards").length < 1) return;

  document.querySelectorAll(".section-awards").forEach((section) => {
    const swiperEl = section.querySelector(".awards-slider");
    const isAwardsSlider = section.id.includes("awards");

    new Swiper(swiperEl, {
      slidesPerView: isAwardsSlider ? 3 : 4,
      spaceBetween: 30,
      loop: false,
      speed: 800,
      autoplay: false,
      navigation: {
        prevEl: section.querySelector(".arrow-prev"),
        nextEl: section.querySelector(".arrow-next"),
      },
      breakpoints: {
        768: {
          slidesPerView: isAwardsSlider ? 3 : 4,
        },
        480: {
          slidesPerView: 2,
        },
        0: {
          slidesPerView: 1,
        },
      },
    });
  });

  // fade each items
  gsap.utils.toArray(".section-awards").forEach((section) => {
    const items = section.querySelectorAll(".news-item");

    gsap.set(items, { y: 40, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
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
    const cloneCount = 20;

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
function hideMenuOnFooter() {
  gsap.registerPlugin(ScrollTrigger);
  // show menu chat
  ScrollTrigger.create({
    trigger: "body",
    start: "top top-=180vh",
    end: "bottom bottom",
    onEnter: () => {
      document.querySelector(".chat-button").classList.add("show-chat");
    },
    onLeaveBack: () => {
      document.querySelector(".chat-button").classList.remove("show-chat");
    },
    // markers: true
  });
  // show menu fixed on scroll
  ScrollTrigger.create({
    trigger: "body",
    start: "top top-=180vh",
    end: "bottom bottom",
    onEnter: () => {
      document
        .querySelector(".menu-fixed-bottom")
        .classList.add("show-menu-fixed");
    },
    onLeaveBack: () => {
      document
        .querySelector(".menu-fixed-bottom")
        .classList.remove("show-menu-fixed");
    },
    // markers: true
  });
  // hide menu fixed on footer
  ScrollTrigger.create({
    trigger: "footer",
    start: "top bottom+=50",
    end: "bottom bottom",
    // markers: true,
    onEnter: () => {
      document
        .querySelector(".menu-fixed-bottom")
        .classList.add("hide-menu-fixed");
    },
    onLeaveBack: () => {
      document
        .querySelector(".menu-fixed-bottom")
        .classList.remove("hide-menu-fixed");
    },
  });

  const heightFooter = document.querySelector("footer").offsetHeight;

  gsap.fromTo(
    ".footer-main",
    { y: 100 },
    {
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: `bottom-=${heightFooter} bottom`,
        end: "bottom bottom",
        scrub: true,
        // markers: true,
        toggleActions: "play reverse play reverse",
      },
    }
  );
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
  sectionAwards();
  ticket();
  responsibility();
  parallaxSection();
  hideMenuOnFooter();
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
