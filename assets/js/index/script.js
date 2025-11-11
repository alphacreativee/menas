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
  // const yPos = window.innerHeight - 173;
  const YPOS = {
    mobile: window.innerHeight - 115,
    desktop: window.innerHeight - 173,
  };

  const yPos = window.innerWidth < 991 ? YPOS.mobile : YPOS.desktop;
  const ASPECT_RATIOS = {
    mobile: 3,
    desktop: 145 / 28,
  };
  const aspectRatio =
    window.innerWidth < 1024 ? ASPECT_RATIOS.mobile : ASPECT_RATIOS.desktop;
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
  if ($(window).width < 1024) return;

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
  const isMobile = window.innerWidth <= 991;

  function fadeInMobile(element, delay = 0) {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 20,
        willChange: "opacity, transform",
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "sine.out",
        delay: delay,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 80%",
        },
      }
    );
  }

  gsap.utils.toArray(".data-fade-in").forEach((element) => {
    const delay = parseFloat(element.getAttribute("data-delay")) || 0;
    fadeInMobile(element, delay);
  });

  gsap.utils.toArray(".effect-line-auto").forEach((description) => {
    const delay = parseFloat(description.getAttribute("data-delay")) || 0;

    if (isMobile) {
      fadeInMobile(description, delay);
    } else {
      const split = new SplitText(description, {
        type: "lines",
        linesClass: "line",
        mask: "lines",
      });

      gsap.fromTo(
        split.lines,
        { yPercent: 100, willChange: "transform" },
        {
          yPercent: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.05,
          delay: delay,
        }
      );
    }
  });

  gsap.utils.toArray(".effect-line").forEach((description) => {
    if (isMobile) {
      fadeInMobile(description);
    } else {
      const split = new SplitText(description, {
        type: "lines",
        linesClass: "line",
        mask: "lines",
      });

      gsap.fromTo(
        split.lines,
        { yPercent: 100, willChange: "transform" },
        {
          yPercent: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: description,
            start: "top 80%",
          },
        }
      );
    }
  });

  gsap.utils.toArray(".effect-line-box").forEach((description) => {
    if (isMobile) {
      fadeInMobile(description);
    } else {
      const split = new SplitText(description, {
        type: "lines",
        linesClass: "line",
        mask: "lines",
      });

      gsap.fromTo(
        split.lines,
        { yPercent: 100, willChange: "transform" },
        {
          yPercent: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: description,
            start: "top 80%",
          },
        }
      );
    }
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
    const btn = scrollItem.querySelector(".btn-view-all");
    const isMobile = window.innerWidth <= 768;
    const start = isMobile ? "top 85%" : "top 62%";

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollItem,
        start: start,
        toggleActions: "play none none none",
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

      if (isMobile) {
        // Mobile: ScrollTrigger riêng cho title
        gsap.to(split.chars, {
          y: "0%",
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.03,
          scrollTrigger: {
            trigger: title,
            start: "top 85%",
            toggleActions: "play none none none",
            // markers: true,
          },
        });
      } else {
        // Desktop: Dùng timeline chung
        tl.to(
          split.chars,
          {
            y: "0%",
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.03,
          },
          `-=${0.8 - delay}`
        );
      }
    }

    if (desc) {
      const descDelay = parseFloat(desc.getAttribute("data-delay")) || 0;

      if (isMobile) {
        // Mobile: ScrollTrigger riêng cho desc
        gsap.set(desc, { opacity: 0, y: 20 });

        gsap.to(desc, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: desc,
            start: "top 85%",
            toggleActions: "play none none none",
            // markers: true,
          },
        });
      } else {
        // Desktop: Animation từng dòng
        const splitDesc = new SplitText(desc, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
        });

        gsap.set(splitDesc.lines, { yPercent: 100, willChange: "transform" });

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
        );
      }
    }

    if (btn) {
      const btnDelay = parseFloat(btn.getAttribute("data-delay")) || 0;
      gsap.set(btn, { opacity: 0, y: 20 });

      if (isMobile) {
        // Mobile: ScrollTrigger riêng cho button
        gsap.to(btn, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: btn,
            start: "top 85%",
            toggleActions: "play none none none",
            // markers: true,
          },
        });
      } else {
        // Desktop: Dùng timeline chung
        tl.to(
          btn,
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "none",
            delay: btnDelay,
          },
          "<"
        );
      }
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
            item.innerHTML = `<span>${currentText}</span><img src="${currentImg}" alt="" />`;
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
function customDropdownSelectValue() {
  const allDropdowns = document.querySelectorAll(".dropdown-custom-select");

  allDropdowns.forEach(function (dropdownWrapper) {
    const toggleButton = dropdownWrapper.querySelector(".dropdown-custom-btn");
    const menuList = dropdownWrapper.querySelector(".dropdown-custom-menu");
    const menuOptions = dropdownWrapper.querySelectorAll(
      ".dropdown-custom-item"
    );
    const displayText = dropdownWrapper.querySelector(".dropdown-custom-text");

    toggleButton.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllDropdowns(dropdownWrapper);
      menuList.classList.toggle("dropdown--active");
      toggleButton.classList.toggle("--active");
    });

    document.addEventListener("click", function () {
      closeAllDropdowns();
    });

    menuOptions.forEach(function (option) {
      option.addEventListener("click", function (e) {
        e.stopPropagation();

        const optionText = option.textContent;

        displayText.textContent = optionText;

        dropdownWrapper.classList.add("selected");

        closeAllDropdowns();
      });
    });

    function closeAllDropdowns(currentDropdown) {
      document.querySelectorAll(".dropdown-custom-btn").forEach(function (btn) {
        btn.classList.remove("active");
      });

      allDropdowns.forEach(function (dropdown) {
        const menu = dropdown.querySelector(".dropdown-custom-menu");
        const btn = dropdown.querySelector(".dropdown-custom-btn");

        if (!currentDropdown || dropdown !== currentDropdown) {
          menu.classList.remove("dropdown--active");
          btn.classList.remove("--active");
        }
      });
    }
  });
}

function hero() {
  if ($("section.hero").length < 1) return;

  var interleaveOffset = 0.9;
  const progressBar = document.querySelector(".swiper-banner .progress-bar");

  var swiperBanner = new Swiper(".swiper-banner", {
    loop: true,
    speed: 900,
    effect: "fade",
    grabCursor: true,
    watchSlidesProgress: true,
    mousewheelControl: true,
    keyboardControl: true,
    navigation: {
      nextEl: ".swiper-banner .swiper-next",
      prevEl: ".swiper-banner .swiper-prev",
    },
    pagination: {
      el: ".swiper-banner .swiper-pagination",
      type: "progressbar",
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    on: {
      init: function (swiper) {
        var activeSlide = swiper.slides[swiper.activeIndex];
        var img = activeSlide.querySelector(".slide-banner img");
        if (img) {
          img.style.transform = "scale(1.1)";
          setTimeout(function () {
            img.style.transition = "transform 5000ms ease-out";
            img.style.transform = "scale(1)";
          }, 50);
        }
      },
      // progress: function (swiper) {
      //   swiper.slides.forEach(function (slide) {
      //     var slideProgress = slide.progress || 0;
      //     var innerOffset = swiper.width * interleaveOffset;
      //     var innerTranslate = slideProgress * innerOffset;
      //     if (!isNaN(innerTranslate)) {
      //       var slideInner = slide.querySelector(".slide-banner");
      //       if (slideInner) {
      //         slideInner.style.transform =
      //           "translate3d(" + innerTranslate + "px, 0, 0)";
      //       }
      //     }
      //   });
      // },
      // touchStart: function (swiper) {
      //   swiper.slides.forEach(function (slide) {
      //     slide.style.transition = "";
      //   });
      // },
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
      slideChangeTransitionStart: function (swiper) {
        // Reset scale về 1.05 khi bắt đầu chuyển slide
        swiper.slides.forEach(function (slide) {
          var img = slide.querySelector(".slide-banner img");
          if (img) {
            img.style.transform = "scale(1.1)";
          }
        });
      },
      slideChangeTransitionEnd: function (swiper) {
        var activeSlide = swiper.slides[swiper.activeIndex];
        var img = activeSlide.querySelector(".slide-banner img");
        if (img) {
          img.style.transition = "transform 5000ms ease-out";
          img.style.transform = "scale(1)";
        }
      },
    },
  });

  if (
    $("section.hero").length > 0 &&
    $("section.intro").length > 0 &&
    $(window).width() > 991
  ) {
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
}

function sectionIntro() {
  if ($("section.intro").length < 1) return;

  if ($(".intro-overlay").length && $(window).width() > 991) {
    gsap.to(".intro-overlay", {
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: "section.intro",
        start: "top 60%",
        end: "+=300",
        scrub: true,
        // markers: true
      },
    });
  }

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

  if (
    $("section.hero").length > 0 &&
    $("section.intro").length > 0 &&
    $(window).width() > 991
  ) {
    gsap.to(".hero", {
      y: -200,
      ease: "none",
      scrollTrigger: {
        trigger: ".intro",
        start: "top 60%",
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
      slidesPerView: isAwardsSlider ? 2 : 4,
      spaceBetween: 30,
      loop: false,
      speed: 800,
      autoplay: false,
      navigation: {
        prevEl: section.querySelector(".arrow-prev"),
        nextEl: section.querySelector(".arrow-next"),
      },
      breakpoints: {
        1024: {
          slidesPerView: isAwardsSlider ? 3 : 4,
          spaceBetween: 24,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
        480: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        0: {
          slidesPerView: 1,
          spaceBetween: 24,
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

  // const heightFooter = document.querySelector("footer").offsetHeight;

  // gsap.fromTo(
  //   ".footer-main",
  //   { y: 100 },
  //   {
  //     y: 0,
  //     ease: "none",
  //     scrollTrigger: {
  //       trigger: "body",
  //       start: `bottom-=${heightFooter} bottom`,
  //       end: "bottom bottom",
  //       scrub: true,
  //       // markers: true,
  //       toggleActions: "play reverse play reverse",
  //     },
  //   }
  // );
  gsap.fromTo(
    ".footer-main",
    { y: 100 },
    {
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: () => {
          const heightFooter = document.querySelector("footer").offsetHeight;
          return `bottom-=${heightFooter} bottom`;
        },
        end: "bottom bottom",
        scrub: true,
        // markers: true,
        toggleActions: "play reverse play reverse",
        invalidateOnRefresh: true, // Quan trọng: tính lại khi refresh
      },
    }
  );
}
function wipe() {
  if (!document.querySelector(".wipe")) return;
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll(".wipe").forEach((wipe) => {
    const wipeImage = wipe.querySelector(".wipe-image");
    gsap.set(wipeImage, { "--clip": "inset(0% 0% 0% 0%)" });
    gsap.to(wipeImage, {
      "--clip": "inset(0% 0% 100% 0%)",
      duration: 1.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: wipe,
        start: "top 40%",
        end: "top 30%",
        // markers: true,
      },
    });
  });
}

function hoverVideo() {
  if ($(".item-hover-video").length < 1) return;

  document.querySelectorAll(".item-hover-video").forEach((item) => {
    const video = item.querySelector("video");

    item.addEventListener("mouseenter", () => {
      video.loop = true;
      video.play();
    });

    item.addEventListener("mouseleave", () => {
      video.pause();

      setTimeout(() => {
        video.currentTime = 0;
        video.load();
      }, 500);
    });
  });
}

function scrollTop() {
  $('a[href*="#"]').on("click", function (e) {
    const url = this.getAttribute("href");
    const hashIndex = url.indexOf("#");

    if (hashIndex === -1) return;

    const hash = url.slice(hashIndex);
    const currentPath = window.location.pathname.replace(/\/$/, "");
    const targetPath = this.pathname.replace(/\/$/, "");

    if (currentPath === targetPath || targetPath === "") {
      e.preventDefault();

      const headerHeight = $("header").outerHeight() || 0;

      if (hash === "#") {
        // Nếu chỉ là "#": scroll về top
        lenis.scrollTo(0, {
          offset: 0,
          duration: 0.6,
          easing: (t) => t,
        });
      } else {
        const $targetEl = $(hash);
        if ($targetEl.length) {
          lenis.scrollTo($targetEl[0], {
            offset: -headerHeight,
            duration: 0.6,
            easing: (t) => t,
          });
        }
      }
    }
  });
}
function parallaxSwiper() {
  if (!document.querySelector(".media-list")) return;

  const swiperRoom = new Swiper(".media-list", {
    centeredSlides: true,
    slidesPerView: 1.3,
    initialSlide: 1,
    speed: 900,
    parallax: true,
    loop: true,
    spaceBetween: 8,
    autoplay: {
      delay: 2000,
    },
    navigation: {
      nextEl: ".media .swiper-button-next",
      prevEl: ".media .swiper-button-prev",
    },
    breakpoints: {
      991: {
        slidesPerView: 1.7,
        autoplay: false,
        spaceBetween: 32,
      },
    },
  });
}

function header() {
  if ($(window).width() > 1200) return;

  const btnHambuger = document.querySelector(".header-hambuger");
  const headerMenu = document.querySelector(".header-menu");
  // const menuSub = document.querySelector("li.menu-item-has-children");

  if (!btnHambuger || !headerMenu) return;

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power2.out" },
  });

  tl.from(".header-menu > ul > li, .header-menu .header-cta", {
    y: 20,
    opacity: 0,
    stagger: 0.1,
    duration: 0.6,
  });

  function openMenu() {
    btnHambuger.classList.add("active");
    headerMenu.classList.add("active");
    headerMenu.classList.remove("closing");
    tl.play(0);
  }

  function closeMenu() {
    btnHambuger.classList.remove("active");
    headerMenu.classList.remove("active");
    // headerMenu.classList.add("closing");
    tl.reverse();

    // tl.eventCallback("onReverseComplete", () => {
    //   headerMenu.classList.remove("active", "closing");
    // });
  }

  btnHambuger.addEventListener("click", () => {
    if (headerMenu.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener("click", (e) => {
    if (
      !btnHambuger.contains(e.target) &&
      !headerMenu.contains(e.target) &&
      headerMenu.classList.contains("active")
    ) {
      menuSub?.classList.remove("active");
      closeMenu();
    }
  });

  const menuSub = $("li.menu-item-has-children > a");

  menuSub.on("click", function (e) {
    e.preventDefault();

    console.log($(this));

    const subMenu = $(this).siblings(".sub-menu");
    const allSubMenus = $("#header .sub-menu").not(subMenu);

    allSubMenus.each(function () {
      const el = $(this);
      el.css("max-height", el[0].scrollHeight + "px");
      el[0].offsetHeight;
      el.css("max-height", 0);
      el.removeClass("open");
    });

    if (subMenu.hasClass("open")) {
      subMenu.css("max-height", subMenu[0].scrollHeight + "px");
      subMenu[0].offsetHeight;
      subMenu.css("max-height", 0);
      subMenu.removeClass("open");
    } else {
      subMenu.addClass("open");
      subMenu.css("max-height", subMenu[0].scrollHeight + "px");

      subMenu.one("transitionend", function () {
        if (subMenu.hasClass("open")) {
          subMenu.css("max-height", "none");
        }
      });
    }
  });
}

function fieldSuggestion() {
  // Normalize string: remove Vietnamese accents
  function removeVietnameseTones(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove diacritics
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }

  // When input is focused
  $(".field-suggestion input").on("focus", function () {
    const $list = $(this).siblings(".field-suggestion__list");

    // Hide all other suggestion lists
    $(".field-suggestion__list").addClass("hidden");

    // Show current list
    $list.removeClass("hidden");
    filterList($list, ""); // show all items
  });

  // Filter when typing
  $(".field-suggestion input").on("input", function () {
    const value = removeVietnameseTones($(this).val().toLowerCase());
    const $list = $(this).siblings(".field-suggestion__list");
    filterList($list, value);
    $list.removeClass("hidden");
  });

  // Select item
  $(".field-suggestion").on("click", "li", function () {
    const text = $(this).text();
    const $input = $(this).closest(".field-suggestion").find("input");
    $input.val(text);
    $(this).parent().addClass("hidden");
  });

  // Click outside to hide all
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".field-suggestion").length) {
      $(".field-suggestion__list").addClass("hidden");
    }
  });

  // Function: filter list items (accent-insensitive)
  function filterList($list, value) {
    $list.find("li").each(function () {
      const text = $(this).text().toLowerCase();
      const normalizedText = removeVietnameseTones(text);
      $(this).toggle(normalizedText.includes(value));
    });
  }
}
function swiperNews() {
  if ($(".news-slider").length < 1) return;

  var swiperNewsContent = new Swiper(".news-slider-text", {
    effect: "fade",
    loop: true,
    slidesPerView: 1,
    speed: 900,
  });

  var swiperNews = new Swiper(".news-slider", {
    loop: true,
    speed: 900,
    effect: "fade",
    grabCursor: true,
    watchSlidesProgress: true,
    mousewheel: true,
    keyboard: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".news .swiper-button-next",
      prevEl: ".news .swiper-button-prev",
    },
    controller: {
      control: swiperNewsContent,
    },
  });

  swiperNewsContent.controller.control = swiperNews;
}
function formReruitment() {
  if ($("#formReruitment").length < 1) return;

  $("#formReruitment").on("submit", function (e) {
    e.preventDefault();

    const $form = $(this);
    const $inputName = $form.find("input[name='name']");
    const $inputEmail = $form.find("input[name='email']");
    const $inputFile = $form.find("input[type='file']");
    const $success = $form.find(".success-message");
    const $buttonSubmit = $form.find("button[type='submit']");
    const jobId = $buttonSubmit.attr("job-id");

    let isValid = true;

    $form.find("input").removeClass("error");

    if ($inputName.val().trim() === "") {
      $inputName.closest(".field-item").addClass("error");
      isValid = false;
    }

    if ($inputEmail.val().trim() === "") {
      $inputEmail.closest(".field-item").addClass("error");
      isValid = false;
    }

    if ($inputFile.get(0).files.length === 0) {
      $inputFile.closest(".field-item").addClass("error");
      isValid = false;
    }

    if (!isValid) return;

    $buttonSubmit.addClass("aloading");
    setTimeout(() => {
      $buttonSubmit.removeClass("aloading");
      $("#modalReruitmentSuccess").modal("show");
    }, 5000);

    const formData = new FormData();
    formData.append("action", "submit_recruitment_form");
    formData.append("name", $inputName.val().trim());
    formData.append("email", $inputEmail.val().trim());
    formData.append("cv", $inputCV.val().trim());
    formData.append("file", $inputFile.get(0).files[0]);
    formData.append("job_id", jobId);

    // $.ajax({
    //   url: ajaxUrl,
    //   type: "POST",
    //   data: formData,
    //   processData: false,
    //   contentType: false,
    //   beforeSend: function () {
    //     $buttonSubmit.addClass("aloading");
    //   },
    //   success: function (res) {
    //     $form[0].reset();

    //     const $labelSpan = $form
    //       .find("input[type='file']")
    //       .next("label")
    //       .find("span");
    //     $labelSpan.text("Upload file under 5MB").removeClass("has-file");

    //     if ($note.length > 0 && $success.length > 0) {
    //       $note.hide();
    //       $success.show();

    //       setTimeout(function () {
    //         $note.show();
    //         $success.hide();
    //       }, 5000);
    //     }

    //     $inputFile.removeClass("error");
    //     $buttonSubmit.removeClass("aloading");
    //   },
    //   error: function (xhr, status, error) {
    //     console.error("Lỗi khi gửi form:", error);
    //     $form.append(
    //       '<span class="contact-message body-sm-regular" style="color: #FF0000;">Có lỗi xảy ra, vui lòng thử lại sau.</span>'
    //     );
    //     $buttonSubmit.removeClass("aloading");
    //   }
    // });
  });
}

function uploadPdf() {
  const $uploadNote = $("form").find(".pdf-note");
  const originalNoteText = $uploadNote.text();

  $("input[name='upload']").on("change", function () {
    const file = this.files[0];
    const $input = $(this);
    const $labelSpan = $input.siblings("label[for='upload']");
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    const maxSize = 5 * 1024 * 1024;

    function truncateText(text, maxLength) {
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    }

    function formatFileName(name) {
      const lower = name.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }

    $input.removeClass("error");
    $labelSpan.text("Upload file under 5MB");

    if ($uploadNote) {
      $uploadNote.text(originalNoteText);
    }

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      $input.addClass("error");
      $input.val("");

      if ($uploadNote) {
        $uploadNote.text("Only PDF/DOC/DOCX/JPG/PNG files allowed");
      }

      return;
    }

    if (file.size > maxSize) {
      $input.addClass("error");
      $input.val("");

      if ($uploadNote) {
        $uploadNote.text("File too large (max 5MB)");
      }

      return;
    }

    const formattedName = formatFileName(truncateText(file.name, 35));
    $labelSpan.text(formattedName);
    $labelSpan.addClass("has-file");
  });
}

function formContact() {
  if ($("#formContact").length < 1) return;

  $("#formContact").on("submit", function (e) {
    e.preventDefault();

    const $form = $(this);
    const $inputName = $form.find("input[name='name']");
    const $inputPhone = $form.find("input[name='phonenumber']");
    const $inputEmail = $form.find("input[name='email']");
    const $inputRegion = $form.find("input[name='region']");
    const $inputCompany = $form.find("input[name='company']");
    const $inputWebsite = $form.find("input[name='website']");
    const $buttonSubmit = $form.find("button[type='submit']");

    let isValid = true;

    $form.find("input").removeClass("error");

    if ($inputName.val().trim() === "") {
      $inputName.closest(".form-field").addClass("error");
      isValid = false;
    }

    if ($inputPhone.val().trim() === "") {
      $inputPhone.closest(".form-field").addClass("error");
      isValid = false;
    }

    if ($inputEmail.val().trim() === "") {
      $inputEmail.closest(".form-field").addClass("error");
      isValid = false;
    }

    if ($inputRegion.val().trim() === "") {
      $inputRegion.closest(".form-field").addClass("error");
      isValid = false;
    }

    if (!isValid) return;

    $buttonSubmit.addClass("aloading");
    setTimeout(() => {
      $buttonSubmit.removeClass("aloading");
      $("#modalContactSuccess").modal("show");
    }, 5000);

    const formData = new FormData();
  });
}

function formCooperate() {
  if ($("#formCooperate").length < 1) return;

  $("#formCooperate").on("submit", function (e) {
    e.preventDefault();

    const $form = $(this);
    const $inputName = $form.find("input[name='name']");
    const $inputPosition = $form.find("input[name='position']");

    const $inputEmail = $form.find("input[name='email']");
    const $inputPhone = $form.find("input[name='phonenumber']");

    const $inputCompany = $form.find("input[name='company']");
    const $inputRegion = $form.find("input[name='region']");
    const $inputMST = $form.find("input[name='mst']");
    const $inputWebsite = $form.find("input[name='website']");

    const $inputCapcha = $form.find("input[name='capcha']");
    const $buttonSubmit = $form.find("button[type='submit']");

    const $selectRequired = $form.find(".dropdown-custom-select");

    let isValid = true;

    $form.find(".form-field").removeClass("error");

    if ($inputName.val().trim() === "") {
      $inputName.closest(".form-field").addClass("error");
      isValid = false;
    }

    if ($inputPosition.val().trim() === "") {
      $inputPosition.closest(".form-field").addClass("error");
      isValid = false;
    }

    if ($inputEmail.val().trim() === "") {
      $inputEmail.closest(".form-field").addClass("error");
      isValid = false;
    }

    if ($inputPhone.val().trim() === "") {
      $inputPhone.closest(".form-field").addClass("error");
      isValid = false;
    }

    if ($inputCompany.val().trim() === "") {
      $inputCompany.closest(".form-field").addClass("error");
      isValid = false;
    }

    if ($inputMST.val().trim() === "") {
      $inputMST.closest(".form-field").addClass("error");
      isValid = false;
    }

    if ($inputWebsite.val().trim() === "") {
      $inputWebsite.closest(".form-field").addClass("error");
      isValid = false;
    }

    if ($inputRegion.val().trim() === "") {
      $inputRegion.closest(".form-field").addClass("error");
      isValid = false;
    }

    const correctCaptcha = "lrjhfrt";
    if (
      $inputCapcha.val().trim() === "" ||
      $inputCapcha.val().trim().toLowerCase() !== correctCaptcha
    ) {
      $inputCapcha.closest(".form-field").addClass("error");
      isValid = false;
    }

    $selectRequired.each(function () {
      const wrapper = $(this);

      const formField = wrapper.closest(".form-field");

      if (!wrapper.hasClass("selected")) {
        formField.addClass("error");
        isValid = false;
      } else {
        formField.removeClass("error");
      }
    });

    $("input[name='upload'][fieldRequired]").each(function () {
      const $input = $(this);
      const $field = $input.closest(".form-field");

      if ($field) {
        if (this.files.length === 0) {
          $field.addClass("error");
        } else {
          $field.removeClass("error");
        }
      }
    });

    if (!isValid) return;

    $buttonSubmit.addClass("aloading");
    setTimeout(() => {
      $buttonSubmit.removeClass("aloading");
      $("#modalCooperateSuccess").modal("show");
    }, 5000);
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  // sectionFields();
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
  wipe();
  hoverVideo();
  scrollTop();
  customDropdownSelectValue();
  parallaxSwiper();
  header();
  fieldSuggestion();
  swiperNews();
  formReruitment();
  uploadPdf();
  formContact();
  formCooperate();

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
