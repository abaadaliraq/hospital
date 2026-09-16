(function () {
  document.documentElement.classList.add("js");

  var header = document.querySelector("[data-header]");
  var nav = document.querySelector("[data-nav]");
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".main-nav a"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-section]"));
  var progress = document.querySelector(".scroll-progress span");
  var navIndicator = document.querySelector(".nav-indicator");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sectionNumbers = {
    home: "01 / 08",
    website: "02 / 08",
    doctors: "03 / 08",
    system: "04 / 08",
    management: "05 / 08",
    operations: "06 / 08",
    tour: "07 / 08",
    project: "08 / 08"
  };

  document.querySelectorAll(".image-shell img").forEach(function (img) {
    function markLoaded() {
      img.parentElement.classList.add("has-image");
      img.parentElement.classList.remove("is-missing");
    }

    function markMissing() {
      img.parentElement.classList.add("is-missing");
      img.parentElement.classList.remove("has-image");
    }

    img.addEventListener("load", markLoaded);
    img.addEventListener("error", markMissing);

    if (img.complete && img.naturalWidth === 0) {
      markMissing();
    } else if (img.complete) {
      markLoaded();
    }
  });

  function updateProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var percent = max > 0 ? (scrollTop / max) * 100 : 0;
    progress.style.width = percent + "%";
    header.classList.toggle("is-solid", scrollTop > 12);
  }

  function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    });

    document.querySelectorAll(".reveal, .reveal-title, .reveal-text, .reveal-number, .reveal-group, .reveal-line").forEach(function (item) {
      revealObserver.observe(item);
    });

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var id = entry.target.getAttribute("id");
        var theme = entry.target.getAttribute("data-theme");

        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });

        if (navIndicator && sectionNumbers[id]) {
          navIndicator.textContent = sectionNumbers[id];
        }

        header.classList.toggle("is-dark", theme === "dark");
        header.classList.toggle("is-light", theme !== "dark");
      });
    }, {
      threshold: 0.48
    });

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  } else {
    document.querySelectorAll(".reveal, .reveal-title, .reveal-text, .reveal-number, .reveal-group, .reveal-line").forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  if (!reduceMotion) {
    var parallaxItems = Array.prototype.slice.call(document.querySelectorAll(".parallax img"));
    var ticking = false;

    function updateParallax() {
      parallaxItems.forEach(function (img) {
        var rect = img.parentElement.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        var center = rect.top + rect.height / 2;
        var offset = (center - window.innerHeight / 2) * -0.025;
        img.style.transform = "translate3d(0," + offset.toFixed(2) + "px,0) scale(1.04)";
      });
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    updateParallax();
  }

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var dot = document.querySelector(".cursor-dot");
    var ring = document.querySelector(".cursor-ring");
    var cursorX = 0;
    var cursorY = 0;
    var ringX = 0;
    var ringY = 0;

    document.body.classList.add("has-cursor");

    window.addEventListener("mousemove", function (event) {
      cursorX = event.clientX;
      cursorY = event.clientY;
      dot.style.transform = "translate3d(" + cursorX + "px," + cursorY + "px,0) translate(-50%, -50%)";
    }, { passive: true });

    function animateCursor() {
      ringX += (cursorX - ringX) * 0.18;
      ringY += (cursorY - ringY) * 0.18;
      ring.style.transform = "translate3d(" + ringX + "px," + ringY + "px,0) translate(-50%, -50%)";
      window.requestAnimationFrame(animateCursor);
    }

    animateCursor();

    document.querySelectorAll("a, button, iframe").forEach(function (interactive) {
      interactive.addEventListener("mouseenter", function () {
        document.body.classList.add("cursor-hover");
      });
      interactive.addEventListener("mouseleave", function () {
        document.body.classList.remove("cursor-hover");
      });
    });
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
})();
