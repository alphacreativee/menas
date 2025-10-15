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
    scale: aspectRatio
  });

  gsap.set(loadingAfter, {
    "--after-height": "0px"
  });

  gsap.to(logo, {
    y: 0,
    duration: 2.5,
    onUpdate: function () {
      const logoRect = logo.getBoundingClientRect();
      const logoTop = logoRect.top;
      const afterHeight = window.innerHeight - logoTop + paddingTop;
      gsap.set(loadingAfter, {
        "--after-height": afterHeight + "px"
      });
    },
    onComplete: () => {
      gsap.to(logo, {
        scale: 1,
        duration: 1,
        onComplete: () => {
          document.querySelector(".loading").classList.add("loaded");
        }
      });
    }
  });
}
// end lenis

function sectionFields() {
  if ($(".section-fields").length < 1) return;

  gsap.utils.toArray(".fields-item").forEach((item) => {
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
          ease: "none"
        }
      )
    });

    // Hiệu ứng clipPath đóng
    ScrollTrigger.create({
      trigger: item,
      start: "bottom bottom",
      end: "bottom top",
      scrub: 0.5,
      animation: gsap.fromTo(
        img,
        { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
        { clipPath: "polygon(0% 0%, 100% 0%, 75% 60%, 25% 75%)", ease: "none" }
      )
    });

    // Hiệu ứng title từng chữ nghiêng, xuất hiện dần
    if (title) {
      const splitTitle = SplitText.create(title, {
        type: "chars",
        mask: "chars"
      });
      gsap.set(splitTitle.chars, { y: "125%" });

      splitTitle.chars.forEach((char, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: `top+=${index * 25} center`,
          end: `top+=${index * 25} 40%`,
          scrub: 1,
          // markers: true,
          animation: gsap.fromTo(char, { y: "125%" }, { y: "0%", ease: "none" })
        });
      });
    }

    // Hiệu ứng desc line trượt lên, hoàn thành khi img chạm top
    if (desc) {
      const splitDesc = new SplitText(desc, {
        type: "lines",
        linesClass: "line",
        mask: "lines"
      });

      gsap.set(splitDesc.lines, { yPercent: 100 });

      ScrollTrigger.create({
        trigger: item,
        start: "top center",
        end: "top top",
        scrub: 1,
        animation: gsap.to(splitDesc.lines, {
          yPercent: 0,
          ease: "none"
        })
      });
    }
  });
}

function magicCursor() {
  var circle = document.querySelector(".magic-cursor");

  gsap.set(circle, {
    xPercent: -50,
    yPercent: -50
  });

  let mouseX = 0,
    mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    gsap.to(circle, {
      x: mouseX,
      y: mouseY,
      duration: 0.1
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
        y: 20
      },
      {
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 80%"
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "sine.out"
      }
    );
  });

  gsap.utils.toArray(".effect-line").forEach((description) => {
    const splitDescription = new SplitText(description, {
      type: "lines",
      linesClass: "line",
      mask: "lines"
    });

    gsap.fromTo(
      splitDescription.lines,
      {
        yPercent: 100,
        willChange: "transform"
      },
      {
        yPercent: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.05,

        scrollTrigger: {
          trigger: description,
          start: "top 80%"
          // markers: true,
        }
      }
    );
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  sectionFields();
  loading();
  magicCursor();
  effectText();
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
