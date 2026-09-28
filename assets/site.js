// Andrew's Marine: page behaviors. Plain JS, no dependencies.
(function () {
  "use strict";

  var SHOP_SMS = "+13253202018";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var byId = function (id) { return document.getElementById(id); };

  // ----- Header: transparent while it sits over the hero video, solid after -----
  var header = document.querySelector(".site-header");
  var sentinel = document.querySelector("[data-hero-sentinel]");
  if (header && sentinel && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      var entry = entries[0];
      var overHero = entry.isIntersecting || entry.boundingClientRect.top > 0;
      header.toggleAttribute("data-solid", !overHero);
    }).observe(sentinel);
  } else if (header) {
    header.setAttribute("data-solid", "");
  }

  // ----- Hero video: muted autoplay loop, pause control, reduced-motion aware -----
  // The poster (also the section background) shows while loading and on errors.
  var video = document.querySelector("[data-hero-video]");
  var toggle = document.querySelector("[data-video-toggle]");
  if (video) {
    var userPaused = reduceMotion.matches;
    var inView = true;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");

    var play = function () {
      if (userPaused || !inView) return;
      var p = video.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
    };
    var syncToggle = function () {
      if (!toggle) return;
      var paused = video.paused;
      toggle.setAttribute("data-state", paused ? "paused" : "playing");
      toggle.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
    };
    var showPoster = function () {
      video.style.display = "none";
      if (toggle) toggle.hidden = true;
    };

    video.addEventListener("play", syncToggle);
    video.addEventListener("pause", syncToggle);
    ["loadedmetadata", "loadeddata", "canplay"].forEach(function (type) {
      video.addEventListener(type, play);
    });
    video.addEventListener("error", showPoster);
    var source = video.querySelector("source");
    if (source) source.addEventListener("error", showPoster);

    if (userPaused) video.pause(); else play();
    syncToggle();

    // Some mobile browsers (e.g. iOS Low Power Mode) block autoplay until a gesture.
    var kickstart = function () {
      play();
      ["touchstart", "click", "scroll"].forEach(function (type) {
        window.removeEventListener(type, kickstart);
      });
    };
    ["touchstart", "click", "scroll"].forEach(function (type) {
      window.addEventListener(type, kickstart, { passive: true });
    });
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) play();
    });

    // Stop decoding video while it is scrolled out of view.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) play(); else if (!video.paused) video.pause();
      }).observe(video);
    }

    if (toggle) {
      toggle.addEventListener("click", function () {
        if (video.paused) { userPaused = false; play(); }
        else { userPaused = true; video.pause(); }
      });
    }
    reduceMotion.addEventListener("change", function (e) {
      if (e.matches) { userPaused = true; video.pause(); }
    });
  }

  // ----- Hours: live open/closed status in shop time (Central) -----
  var status = document.querySelector("[data-open-status]");
  if (status && window.Intl) {
    try {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23"
      }).formatToParts(new Date());
      var part = function (type) {
        for (var i = 0; i < parts.length; i++) if (parts[i].type === type) return parts[i].value;
        return "";
      };
      var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(part("weekday"));
      var minutes = (parseInt(part("hour"), 10) % 24) * 60 + parseInt(part("minute"), 10);
      var OPEN = 9 * 60, CLOSE = 17 * 60;
      var weekday = day >= 2 && day <= 5; // Tuesday - Friday

      var state, text;
      if (weekday && minutes >= OPEN && minutes < CLOSE) {
        state = "open"; text = "Open now until 5 PM";
      } else if (weekday && minutes < OPEN) {
        state = "closed"; text = "Closed, opens 9 AM today";
      } else if (day === 6) {
        state = "appt"; text = "Today by appointment";
      } else {
        var tomorrow = day === 1 || (day >= 2 && day <= 4);
        state = "closed"; text = "Closed, opens " + (tomorrow ? "tomorrow" : "Tuesday") + " 9 AM";
      }

      if (day >= 0) {
        status.textContent = text;
        status.setAttribute("data-state", state);
        status.hidden = false;
        document.querySelectorAll(".hours-row[data-days]").forEach(function (row) {
          if (row.getAttribute("data-days").split(",").indexOf(String(day)) !== -1) {
            row.setAttribute("data-today", "");
          }
        });
      }
    } catch (err) { /* leave the static hours as-is */ }
  }

  // ----- Request Service form: builds a structured SMS to the shop -----
  var form = byId("serviceForm");
  if (!form) return;

  var nameField = byId("name");
  var yearField = byId("unitYear");
  var yearNote = byId("unitYear-note");
  var serviceField = byId("serviceType");
  var messageField = byId("message");
  var fallback = byId("sms-fallback");
  var preview = byId("sms-preview");
  var copyButton = byId("copy-sms");

  var focusName = function () {
    window.setTimeout(function () {
      if (nameField) nameField.focus({ preventScroll: true });
    }, reduceMotion.matches ? 0 : 450);
  };

  // Shop policy: no service on units built before 2005. Warn, don't block
  // (a parts question for an older boat is still worth sending).
  if (yearField && yearNote) {
    yearField.addEventListener("input", function () {
      var year = parseInt(yearField.value, 10);
      yearNote.hidden = !(yearField.value.length === 4 && year < 2005);
    });
  }

  // Platinum CTA: tag the form as a Platinum inquiry.
  document.querySelectorAll("[data-prefill-service]").forEach(function (el) {
    el.addEventListener("click", function () {
      var value = el.getAttribute("data-prefill-service");
      Array.prototype.some.call(serviceField.options, function (option) {
        if (option.value === value || option.text === value) {
          serviceField.value = option.value;
          return true;
        }
        return false;
      });
      if (!messageField.value) {
        messageField.value = "I'd like to learn more about the Platinum Service Customer program.";
      }
      focusName();
    });
  });

  // Text CTAs route through the structured intake.
  document.querySelectorAll("[data-text-intake]").forEach(function (el) {
    el.addEventListener("click", focusName);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var body = [
      "Hi Andrew, I'd like to request service.",
      "",
      "Name: " + nameField.value.trim(),
      "Phone: " + byId("phone").value.trim(),
      "Boat/PWC year: " + yearField.value.trim(),
      "Service needed: " + serviceField.value,
      "Details: " + (messageField.value.trim() || "No additional details provided.")
    ].join("\n");

    // Desktop browsers without a messaging app ignore sms: links, so always
    // leave a copyable version of the message on the page.
    preview.value = body;
    fallback.hidden = false;

    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var separator = isIOS ? "&" : "?";
    window.location.href = "sms:" + SHOP_SMS + separator + "body=" + encodeURIComponent(body);
  });

  if (copyButton) {
    var label = copyButton.querySelector("[data-copy-label]");
    var copied = function () {
      label.textContent = "Copied";
      window.setTimeout(function () { label.textContent = "Copy Message"; }, 2000);
    };
    copyButton.addEventListener("click", function () {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(preview.value).then(copied, function () {
          preview.select();
        });
      } else {
        preview.select();
        try { if (document.execCommand("copy")) copied(); } catch (err) { /* text stays selected */ }
      }
    });
  }
})();
