// Andrew's Marine demo - front-end only.
// Production plan: replace the form handler with a Cloudflare Pages Function
// that emails submissions to Info@andrewsmarine.net.

(function () {
  // ----- Runtime styles for video loading and mobile quick actions -----
  var runtimeStyles = document.createElement("style");
  runtimeStyles.textContent = [
    ".hero { background-color: #0c3831 !important; background-image: none !important; }",
    ".hero-background-video { opacity: 0; transition: opacity .3s ease; }",
    ".hero-background-video.is-ready { opacity: 1; }",
    "@media (max-width: 899px) {",
    "  .mobile-bar {",
    "    grid-template-columns: 1fr 1fr !important;",
    "    transform: translateY(120%);",
    "    opacity: 0;",
    "    pointer-events: none;",
    "    transition: transform .22s ease, opacity .22s ease;",
    "  }",
    "  .mobile-bar.is-visible {",
    "    transform: translateY(0);",
    "    opacity: 1;",
    "    pointer-events: auto;",
    "  }",
    "}"
  ].join("\n");
  document.head.appendChild(runtimeStyles);

  // ----- Hero video path and first-load behavior -----
  var heroVideo = document.querySelector(".hero-background-video");
  if (heroVideo) {
    heroVideo.removeAttribute("poster");
    heroVideo.preload = "auto";
    heroVideo.src = "images/images:hero-lake-brownwood.mp4";

    function revealVideo() {
      heroVideo.classList.add("is-ready");
    }

    heroVideo.addEventListener("loadeddata", revealVideo, { once: true });
    heroVideo.addEventListener("canplay", revealVideo, { once: true });
    heroVideo.addEventListener("playing", revealVideo, { once: true });
    heroVideo.load();

    var playPromise = heroVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        // Autoplay can be blocked by browser settings. The hero remains a solid
        // deep teal instead of flashing an unrelated poster image.
      });
    }
  }

  // ----- Desktop header: restore text action beside the call button -----
  var headerCall = document.querySelector(".header-call");
  if (headerCall && !document.querySelector(".header-text")) {
    var headerText = document.createElement("a");
    headerText.href = "sms:+13253202018";
    headerText.className = "btn btn-ghost-dark header-call header-text";
    headerText.textContent = "Text the Shop";
    headerText.setAttribute("aria-label", "Text Andrew's Marine");
    headerCall.insertAdjacentElement("afterend", headerText);
  }

  // ----- Mobile sticky actions: Call/Text only, shown after scrolling -----
  var mobileBar = document.querySelector(".mobile-bar");
  if (mobileBar) {
    var requestAction = mobileBar.querySelector('a[href="#request"]');
    if (requestAction) requestAction.remove();

    function updateMobileBar() {
      var show = window.scrollY > 120;
      mobileBar.classList.toggle("is-visible", show);
      mobileBar.setAttribute("aria-hidden", show ? "false" : "true");
    }

    updateMobileBar();
    window.addEventListener("scroll", updateMobileBar, { passive: true });
  }

  // ----- Request Service form (demo: validate + confirm, no network) -----
  var form = document.getElementById("service-form");
  if (form) {
    var success = document.getElementById("form-success");

    function setInvalid(id, invalid) {
      var input = document.getElementById(id);
      var error = document.getElementById(id + "-error");
      input.closest(".field").classList.toggle("invalid", invalid);
      if (error) error.hidden = !invalid;
      input.setAttribute("aria-invalid", invalid ? "true" : "false");
      return invalid;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameEmpty = setInvalid("f-name", form.name.value.trim() === "");
      var phoneEmpty = setInvalid("f-phone", form.phone.value.trim() === "");
      if (nameEmpty || phoneEmpty) {
        (nameEmpty ? form.name : form.phone).focus();
        return;
      }
      form.querySelectorAll("input, select, button").forEach(function (el) {
        el.disabled = true;
      });
      success.hidden = false;
      success.scrollIntoView({ block: "nearest" });
    });
  }

  // ----- Scroll reveal: one gentle fade-up per section as it enters view. -----
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!reduce.matches && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll("main section .wrap");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    targets.forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }
})();