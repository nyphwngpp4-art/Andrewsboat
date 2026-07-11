// Andrew's Marine demo - front-end only.
// Production plan: replace the form handler with a Cloudflare Pages Function
// that emails submissions to Info@andrewsmarine.net.

(function () {
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

  // ----- Scroll reveal: one gentle fade-up per section as it enters view.
  // Motivation: gives the long single page a sense of pace on first read.
  // Gated: skipped entirely under prefers-reduced-motion.
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