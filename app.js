// Andrew's Marine demo - front-end only.
// Production plan: replace the form handler with a Cloudflare Pages Function
// that emails submissions to Info@andrewsmarine.net.

(function () {
  // ----- Runtime styles for video loading, mobile quick actions, and gallery -----
  var runtimeStyles = document.createElement("style");
  runtimeStyles.textContent = [
    ".hero { background-color: #0c3831 !important; background-image: none !important; }",
    ".hero-background-video { opacity: 0; transition: opacity .3s ease; }",
    ".hero-background-video.is-ready { opacity: 1; }",
    ".facebook-gallery-intro { max-width: 62ch; margin: -8px 0 24px; color: #3c4a45; }",
    ".facebook-gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }",
    ".facebook-gallery figure { position: relative; margin: 0; overflow: hidden; border-radius: var(--radius); background: var(--lake-deep); aspect-ratio: 4 / 3; }",
    ".facebook-gallery figure:first-child { grid-column: 1 / -1; aspect-ratio: 16 / 8; }",
    ".facebook-gallery img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .25s ease; }",
    ".facebook-gallery figure:hover img { transform: scale(1.02); }",
    ".facebook-gallery figcaption { position: absolute; left: 10px; right: 10px; bottom: 10px; padding: 7px 10px; border-radius: 6px; background: rgba(12,56,49,.82); color: #f6f0e1; font-size: .78rem; line-height: 1.3; backdrop-filter: blur(4px); }",
    ".gallery-source-note { margin-top: 14px; color: #56635e; font-size: .84rem; }",
    "@media (min-width: 760px) {",
    "  .facebook-gallery { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }",
    "  .facebook-gallery figure:first-child { grid-column: span 2; grid-row: span 2; aspect-ratio: auto; min-height: 420px; }",
    "}",
    "@media (max-width: 899px) {",
    "  .mobile-bar { grid-template-columns: 1fr 1fr !important; transform: translateY(120%); opacity: 0; pointer-events: none; transition: transform .22s ease, opacity .22s ease; }",
    "  .mobile-bar.is-visible { transform: translateY(0); opacity: 1; pointer-events: auto; }",
    "}"
  ].join("\n");
  document.head.appendChild(runtimeStyles);

  // ----- Broaden engine-service language across the page -----
  document.title = "Andrew's Marine Maintenance & Repair | Lake Brownwood Boat Repair";
  var metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.content = "Lake Brownwood marine repair for inboards, sterndrives, outboards, PWCs, props, winterization, upholstery, marine audio, and parts. Call or text (325) 320-2018.";
  var ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.content = "Boat down? Lake Brownwood marine repair for inboards, sterndrives, outboards, PWCs, winterization, props, audio, and parts.";

  var heroSub = document.querySelector(".hero-sub");
  if (heroSub) heroSub.textContent = "Lake Brownwood's local shop for inboards, sterndrives, outboards, PWCs, winterization, marine audio, and parts.";

  var trustItems = document.querySelectorAll(".trust-item");
  if (trustItems.length) {
    trustItems[0].innerHTML = "<h2>Complete Marine Repair</h2><p>Inboards, sterndrives, outboards, and PWCs.</p>";
  }

  var serviceCards = document.querySelectorAll(".service-card");
  if (serviceCards.length) {
    serviceCards[0].innerHTML = "<h3>Inboard, Sterndrive & Outboard Repair</h3><p>From no-starts and drivability problems to routine maintenance, Andrew's Marine services inboards, inboard-outboards/sterndrives, and outboards.</p>";
  }

  // ----- Hero video path and first-load behavior -----
  var heroVideo = document.querySelector(".hero-background-video");
  if (heroVideo) {
    heroVideo.removeAttribute("poster");
    heroVideo.preload = "auto";
    heroVideo.src = "images/images:hero-lake-brownwood.mp4";
    function revealVideo() { heroVideo.classList.add("is-ready"); }
    heroVideo.addEventListener("loadeddata", revealVideo, { once: true });
    heroVideo.addEventListener("canplay", revealVideo, { once: true });
    heroVideo.addEventListener("playing", revealVideo, { once: true });
    heroVideo.load();
    var playPromise = heroVideo.play();
    if (playPromise && typeof playPromise.catch === "function") playPromise.catch(function () {});
  }

  // ----- Desktop header: text action beside the call button -----
  var headerCall = document.querySelector(".header-call");
  if (headerCall && !document.querySelector(".header-text")) {
    var headerText = document.createElement("a");
    headerText.href = "sms:+13253202018";
    headerText.className = "btn btn-ghost-dark header-call header-text";
    headerText.textContent = "Text the Shop";
    headerText.setAttribute("aria-label", "Text Andrew's Marine");
    headerCall.insertAdjacentElement("afterend", headerText);
  }

  // ----- Mobile sticky actions: Call/Text only after scrolling -----
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

  // ----- Project gallery from supplied Facebook photos -----
  var workSection = document.querySelector("#work .wrap");
  if (workSection) {
    var title = workSection.querySelector(".section-title");
    if (title) title.textContent = "Boats we've helped keep on the water";
    var oldGrid = workSection.querySelector(".work-grid");
    var oldNote = workSection.querySelector(".hours-note");
    if (oldGrid) oldGrid.remove();
    if (oldNote) oldNote.remove();

    var intro = document.createElement("p");
    intro.className = "facebook-gallery-intro";
    intro.textContent = "A look at wake boats, pontoons, personal watercraft, and seasonal service work featured by Andrew's Marine around Lake Brownwood.";
    workSection.appendChild(intro);

    var items = [
      ["images/facebook/gallery-1.jpg", "Malibu wake boat outside Andrew's Marine"],
      ["images/facebook/gallery-2.jpg", "Andrew's Marine roadside sign and personal watercraft"],
      ["images/facebook/gallery-3.jpg", "Wake boat prepared for seasonal service"],
      ["images/facebook/gallery-4.jpg", "Tige wake boat on a Lake Brownwood lift"],
      ["images/facebook/gallery-5.jpg", "Bennington pontoon at the shop"],
      ["images/facebook/gallery-6.jpg", "Sea-Doo Switch near Lake Brownwood"]
    ];

    var gallery = document.createElement("div");
    gallery.className = "facebook-gallery";
    items.forEach(function (item) {
      var figure = document.createElement("figure");
      var image = document.createElement("img");
      var caption = document.createElement("figcaption");
      image.src = item[0];
      image.alt = item[1];
      image.loading = "lazy";
      caption.textContent = item[1];
      figure.appendChild(image);
      figure.appendChild(caption);
      gallery.appendChild(figure);
    });
    workSection.appendChild(gallery);

    var sourceNote = document.createElement("p");
    sourceNote.className = "gallery-source-note";
    sourceNote.textContent = "Project photos from Andrew's Marine's public business page, included for private concept review.";
    workSection.appendChild(sourceNote);
  }

  // ----- Request Service form -----
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
      form.querySelectorAll("input, select, button").forEach(function (el) { el.disabled = true; });
      success.hidden = false;
      success.scrollIntoView({ block: "nearest" });
    });
  }

  // ----- Scroll reveal -----
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!reduce.matches && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll("main section .wrap");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }
})();
