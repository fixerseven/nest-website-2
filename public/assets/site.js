// Nest Workspaces site script.
// Motion (smooth scroll, reveals, parallax), the full-screen menu, the live "Open now" line,
// and inquiry forms that compose an email to hello@nestworkspaces.com.
(function () {
  var TO = "hello@nestworkspaces.com";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lenis = null;

  // ---------- Smooth scroll ----------
  if (!reduce && typeof window.Lenis === "function") {
    lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  }

  // Scroll to an element, leaving room for the sticky "On this page" bar.
  function scrollToEl(el) {
    var bar = document.querySelector(".subnav");
    var offset = bar ? -bar.offsetHeight - 8 : 0;
    if (lenis) {
      lenis.scrollTo(el, { offset: offset, duration: 1.4 });
    } else {
      var top = el.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
    }
  }
  function samePageTarget(a) {
    if (!a.hash || a.classList.contains("skip")) return null;
    if (a.pathname !== location.pathname || a.search !== location.search) return null;
    try { return document.querySelector(decodeURIComponent(a.hash)); } catch (e) { return null; }
  }
  document.addEventListener("click", function (event) {
    var a = event.target.closest && event.target.closest("a[href*='#']");
    if (!a || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
    var target = samePageTarget(a);
    if (!target) return;
    event.preventDefault();
    if (menu && menu.open) closeMenu(false);
    scrollToEl(target);
    if (history.pushState) history.pushState(null, "", a.hash);
  });

  // ---------- Menu ----------
  // A <dialog> opened from the "Menu" button. It slides in from the left and slides back out
  // on Close or Escape.
  var menu = document.getElementById("site-menu");
  function closeMenu(animate) {
    if (!menu || !menu.open) return;
    if (!animate || reduce) { menu.classList.remove("closing"); menu.close(); return; }
    if (menu.classList.contains("closing")) return;
    menu.classList.add("closing");
    var done = function () { menu.removeEventListener("animationend", onEnd); menu.classList.remove("closing"); if (menu.open) menu.close(); };
    var onEnd = function (e) { if (e.target === menu) done(); };
    menu.addEventListener("animationend", onEnd);
    setTimeout(done, 800);
  }
  if (menu && typeof menu.showModal === "function") {
    menu.querySelectorAll(".menu-nav li").forEach(function (li, i) { li.style.setProperty("--i", i); });
    document.querySelectorAll("[data-menu-open]").forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", function () {
        menu.classList.remove("closing");
        menu.showModal();
        btn.setAttribute("aria-expanded", "true");
        if (lenis) lenis.stop();
      });
    });
    menu.querySelectorAll("[data-menu-close]").forEach(function (btn) {
      btn.addEventListener("click", function () { closeMenu(true); });
    });
    menu.addEventListener("cancel", function (event) { event.preventDefault(); closeMenu(true); });
    menu.addEventListener("close", function () {
      menu.classList.remove("closing");
      if (lenis) lenis.start();
      document.querySelectorAll("[data-menu-open]").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    });
  }

  // ---------- Reveals ----------
  // Lists match the hidden states in site.css; html.js hides them until they scroll into view.
  var SCOPE = "main, .ways, .site-footer";
  var SPLIT = "h1, h2:not(.sr-only):not(.ways-intro), .giant, .a-serif, .a-caps, .way-name, .hour .t, .card h3, .float-card h3, .price, .big, .story-title, .cta-title";
  var FADE = ".label, .section-head:not(.wide-text) > p, .hero .info-card, .btn-row, .card > p:not(.price), .card .facts, .zones, .notice, .prose > :not(h2), .article-head > p, .ms-body > p, .tcell p, .way, .form, .rates-note, .lost .lead, .pill-tag, .feature-panel p:not(.big), .fw-side > p, .split > div > p:not(.s-big), .hour .d, .info-card > p";
  var LINES = ".rate, .faq-list details, .ticks li, .facts-grid > div, .wordmark, .split, .rates, .faq-list, .ticks:not(.cols), .footer-grid, .footer-base, .facts-grid, .section-head.ruled";
  var PHOTOS = ".ph, .story-ph, .article-hero, .float-card > img, .mark-logo, .hero, .photo-band, .hour";
  var SCRUB = ".wordmark .intro, .split .s-big, .page-intro > p, .ways-intro, .section-head.wide-text > p";

  function inScope(sel) {
    return Array.prototype.filter.call(document.querySelectorAll(sel), function (el) { return el.closest(SCOPE); });
  }

  // Wrap each word of an element's text in spans, keeping inner tags. Non-breaking spaces
  // stay inside a word so "Nest&nbsp;—" never splits.
  function splitWords(el, cls) {
    var words = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 1) { if (!child.matches("svg, br")) walk(child); return; }
        if (child.nodeType !== 3 || !child.nodeValue.trim()) return;
        var frag = document.createDocumentFragment();
        child.nodeValue.split(/([ \t\n\r]+)/).forEach(function (part) {
          if (!part) return;
          if (/^[ \t\n\r]+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var w = document.createElement("span");
          w.className = cls;
          if (cls === "w") {
            var inner = document.createElement("span");
            inner.className = "wi";
            inner.textContent = part;
            w.appendChild(inner);
          } else {
            w.textContent = part;
          }
          frag.appendChild(w);
          words.push(w);
        });
        node.replaceChild(frag, child);
      });
    })(el);
    return words;
  }

  // Delay each word by the line it sits on, so a headline rises line by line.
  function staggerLines(el) {
    var base = el.closest(".info-card") ? 0.15 : 0;
    var tops = [];
    el.querySelectorAll(".w").forEach(function (w) {
      var t = Math.round(w.offsetTop);
      var line = tops.indexOf(t);
      if (line === -1) { tops.push(t); line = tops.length - 1; }
      w.style.setProperty("--d", (base + line * 0.08).toFixed(2) + "s");
    });
  }

  // Stagger siblings that reveal together, such as rows of a rate list.
  function staggerSiblings(list) {
    list.forEach(function (el) {
      var parent = el.parentElement, i = 0;
      if (!parent) return;
      for (var c = parent.firstElementChild; c && c !== el; c = c.nextElementSibling) if (list.indexOf(c) !== -1) i++;
      if (i) el.style.setProperty("--d", Math.min(i * 0.07, 0.42).toFixed(2) + "s");
    });
  }

  var scrubs = [];
  var parallax = [];
  if (!reduce) {
    root.classList.add("motion-on");

    inScope(SPLIT).forEach(function (el) {
      if (el.closest(".menu")) return;
      splitWords(el, "w");
      el.classList.add("sp");
      staggerLines(el);
    });
    inScope(SCRUB).forEach(function (el) {
      var words = splitWords(el, "sw");
      words.forEach(function (w) { w.style.opacity = "0.15"; });
      scrubs.push({ el: el, words: words, seen: false });
    });
    var fades = inScope(FADE), lines = inScope(LINES);
    staggerSiblings(fades);
    staggerSiblings(lines);
    staggerSiblings(inScope(".pgrid > .ph, .photo-row .ph, .card.photo > .ph, .story-ph"));

    // Buttons roll their label: the visible copy slides up and an identical copy follows.
    document.querySelectorAll(".btn, .menu-btn").forEach(function (btn) {
      Array.prototype.slice.call(btn.childNodes).forEach(function (n) {
        if (n.nodeType !== 3 || !n.nodeValue.trim()) return;
        var text = n.nodeValue.trim();
        var roll = document.createElement("span");
        roll.className = "roll";
        roll.innerHTML = '<span class="roll-in"><span></span><span aria-hidden="true"></span></span>';
        roll.querySelectorAll(".roll-in > span").forEach(function (s) { s.textContent = text; });
        btn.replaceChild(roll, n);
      });
    });

    // Photos that drift as they cross the screen.
    document.querySelectorAll(".ph > img, .photo-band > img, .hour img, .story-ph img, .article-hero img").forEach(function (img) {
      parallax.push({ img: img, box: img.parentElement, cur: 0, visible: false });
    });
    var heroImg = document.querySelector(".hero > img");

    var revealList = inScope(SPLIT + ", " + FADE + ", " + LINES).concat(Array.prototype.slice.call(document.querySelectorAll(PHOTOS)));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -6% 0px" });

    var watch = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target._visible = e.isIntersecting; });
    }, { rootMargin: "10% 0px 10% 0px" });
    parallax.forEach(function (p) { watch.observe(p.box); });
    scrubs.forEach(function (s) { watch.observe(s.el); });

    // Wait for the intro loader before the first reveals start.
    var startDelay = root.classList.contains("show-loader") ? 1900 : 60;
    setTimeout(function () {
      root.classList.add("ready");
      revealList.forEach(function (el) { io.observe(el); });
    }, startDelay);
    setTimeout(function () { root.classList.remove("show-loader"); }, 3000);

    var vh = window.innerHeight;
    window.addEventListener("resize", function () { vh = window.innerHeight; });

    function frame(time) {
      if (lenis) lenis.raf(time);
      parallax.forEach(function (p) {
        if (!p.box._visible) return;
        var r = p.box.getBoundingClientRect();
        var progress = (vh - r.top) / (vh + r.height);
        var target = (Math.max(0, Math.min(1, progress)) - 0.5) * 12;
        p.cur += (target - p.cur) * 0.12;
        p.img.style.setProperty("--py", p.cur.toFixed(2) + "%");
      });
      if (heroImg) {
        var y = window.pageYOffset;
        if (y < vh * 1.2) heroImg.style.setProperty("--py", (y * 0.3).toFixed(1) + "px");
      }
      scrubs.forEach(function (s) {
        if (!s.el._visible) return;
        var r = s.el.getBoundingClientRect();
        var p = (vh * 0.88 - r.top) / (vh * 0.45 + r.height * 0.5);
        p = Math.max(0, Math.min(1, p));
        var n = s.words.length;
        s.words.forEach(function (w, i) {
          var t = Math.max(0, Math.min(1, (p * (n + 6) - i) / 6));
          var o = (0.15 + 0.85 * t).toFixed(2);
          if (w.style.opacity !== o) w.style.opacity = o;
        });
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    // FAQ answers open and close smoothly instead of jumping.
    document.querySelectorAll(".faq-list details").forEach(function (d) {
      var summary = d.querySelector("summary"), body = d.querySelector("summary + div");
      if (!summary || !body || !body.animate) return;
      var anim = null, closing = false;
      summary.addEventListener("click", function (event) {
        event.preventDefault();
        var from = body.offsetHeight;
        if (anim) anim.cancel();
        if (!d.open || closing) {
          closing = false;
          d.open = true;
          var to = body.scrollHeight;
          anim = body.animate([
            { height: (d.open && from ? from : 0) + "px", opacity: from ? 1 : 0, transform: from ? "none" : "translateY(1rem)" },
            { height: to + "px", opacity: 1, transform: "none" }
          ], { duration: 600, easing: "cubic-bezier(.19, 1, .22, 1)" });
        } else {
          closing = true;
          anim = body.animate([
            { height: from + "px", opacity: 1 },
            { height: "0px", opacity: 0 }
          ], { duration: 400, easing: "cubic-bezier(.645, .045, .355, 1)" });
          anim.onfinish = function () { d.open = false; closing = false; };
        }
      });
    });
  } else {
    root.classList.remove("js");
  }

  // Open now: walk-ins 7 AM to 1 AM, Cebu time (UTC+8, no daylight saving).
  function cebuHour() {
    var now = new Date();
    var utc = now.getTime() + now.getTimezoneOffset() * 60000;
    var cebu = new Date(utc + 8 * 3600000);
    return cebu.getHours() + cebu.getMinutes() / 60;
  }
  var h = cebuHour();
  var open = h >= 7 || h < 1;
  document.querySelectorAll("[data-status]").forEach(function (el) {
    var text = el.querySelector("[data-status-text]");
    if (!text) return;
    if (open) {
      text.textContent = "Open now · until 1 AM";
    } else {
      text.textContent = "Members only · opens 7 AM";
      el.classList.add("is-closed");
    }
  });

  // Preselect a dropdown from ?interest= (for example visit.html?interest=Meeting%20room).
  function preselect(value) {
    if (!value) return;
    document.querySelectorAll('select[name="interest"]').forEach(function (sel) {
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === value || sel.options[i].text === value) { sel.selectedIndex = i; break; }
      }
    });
  }
  try { preselect(new URLSearchParams(window.location.search).get("interest")); } catch (e) {}

  // Number steppers.
  document.querySelectorAll(".stepper").forEach(function (st) {
    var input = st.querySelector("input");
    st.querySelectorAll("button[data-step]").forEach(function (b) {
      b.addEventListener("click", function () {
        var min = Number(input.min || 1), max = Number(input.max || 999);
        var v = Number(input.value || min) + Number(b.getAttribute("data-step"));
        input.value = String(Math.min(max, Math.max(min, v)));
      });
    });
  });

  // Inquiry forms open the visitor's email app with the request filled in.
  document.querySelectorAll("form[data-mailto]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      var subject = form.getAttribute("data-mailto") || "Inquiry";
      var lines = [];
      form.querySelectorAll("input, select, textarea").forEach(function (el) {
        if (!el.name || !el.value) return;
        if (el.type === "checkbox") { if (!el.checked) return; }
        var label = form.querySelector('label[for="' + el.id + '"]');
        var text = label ? label.textContent.replace(/\(optional\)/i, "").trim() : el.name;
        lines.push(text + ": " + (el.type === "checkbox" ? "Yes" : el.value.trim()));
      });
      var nameField = form.querySelector('[name="name"]');
      if (nameField && nameField.value) subject += " from " + nameField.value.trim();
      var href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n") + "\n");
      var status = form.querySelector(".form-status");
      if (status) status.textContent = "Your email app should open with this request filled in. If it doesn't, email " + TO + " directly.";
      window.location.href = href;
    });
  });

  var y = document.querySelector("[data-year]");
  if (y) y.textContent = String(new Date().getFullYear());
})();
