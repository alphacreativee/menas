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
  const logo = document.getElementById("logo");
  const yPos = window.innerHeight - 173;
  const aspectRatio = 145 / 28;
  gsap.set(logo, {
    y: yPos,
    scale: aspectRatio,
  });
  gsap.to(logo, {
    y: 0,
    duration: 2.5,
    onComplete: () => {
      gsap.to(logo, {
        scale: 1,
        duration: 1,
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

  gsap.utils.toArray(".fields-item").forEach((item) => {
    const img = item.querySelector(".fields-item-img");
    const nameH1 = item.querySelector(".fields-item-name h1");

    const split = SplitText.create(nameH1, {
      type: "chars",
      mask: "chars",
    });

    gsap.set(split.chars, { y: "125%" });

    split.chars.forEach((char, index) => {
      ScrollTrigger.create({
        trigger: item,
        start: `top+=${index * 25 - 250} top`,
        end: `top+=${index * 25 - 100} top`,
        scrub: 1,
        // Giữ nguyên
        animation: gsap.fromTo(char, { y: "125%" }, { y: "0%", ease: "none" }),
      });
    });

    // Giữ nguyên trigger, chỉ đổi clip-path
    ScrollTrigger.create({
      trigger: item,
      start: "top bottom",
      end: "top top",
      scrub: 0.5,
      animation: gsap.fromTo(
        img,
        {
          // 70% thu nhỏ: tương đương cách 140px 2 bên, 60px trên dưới theo màn hình 1440
          clipPath: "polygon(9.7% 6.7%, 90.3% 6.7%, 90.3% 93.3%, 9.7% 93.3%)",
        },
        {
          // full 100%
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "none",
        }
      ),
    });

    ScrollTrigger.create({
      trigger: item,
      start: "bottom bottom",
      end: "bottom top",
      scrub: 0.5,
      animation: gsap.fromTo(
        img,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(9.7% 6.7%, 90.3% 6.7%, 90.3% 93.3%, 9.7% 93.3%)",
          ease: "none",
        }
      ),
    });
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  sectionFields();
  loading();
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
