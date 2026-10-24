// Nest Workspaces site script.
// Inquiry forms compose an email to hello@nestworkspaces.com; the rest is small UI behaviour.
(function () {
  var TO = "hello@nestworkspaces.com";

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  // Announcement bar: dismiss and remember for this browser.
  var bar = document.querySelector(".announce");
  if (bar) {
    var id = bar.getAttribute("data-id") || "announce";
    if (store("nest-hide-" + id) === "1") bar.hidden = true;
    var close = bar.querySelector(".announce-close");
    if (close) close.addEventListener("click", function () { bar.hidden = true; store("nest-hide-" + id, "1"); });
  }

  // Desktop dropdowns: close on outside click or Escape.
  var dds = document.querySelectorAll("details.dd, details.menu");
  document.addEventListener("click", function (e) {
    dds.forEach(function (d) { if (d.open && !d.contains(e.target)) d.open = false; });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    dds.forEach(function (d) {
      if (d.open) { d.open = false; var s = d.querySelector("summary"); if (s) s.focus(); }
    });
  });
  document.querySelectorAll(".menu a, .dd a").forEach(function (a) {
    a.addEventListener("click", function () { var d = a.closest("details"); if (d) d.open = false; });
  });

  // Preselect "I'm interested in" from ?interest= or from the hero plan bar.
  function preselect(value) {
    if (!value) return;
    document.querySelectorAll('select[name="interest"]').forEach(function (sel) {
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === value || sel.options[i].text === value) { sel.selectedIndex = i; break; }
      }
    });
  }
  try { preselect(new URLSearchParams(window.location.search).get("interest")); } catch (e) {}

  document.querySelectorAll("form.plan").forEach(function (plan) {
    plan.addEventListener("submit", function (e) {
      var sel = plan.querySelector("select");
      var target = document.getElementById("contact");
      if (!target) return; // falls back to the form's action
      e.preventDefault();
      preselect(sel && sel.value);
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      var first = target.querySelector("input");
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 400);
    });
  });

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
        var label = form.querySelector('label[for="' + el.id + '"]');
        var text = label ? label.textContent.replace(/\(optional\)/i, "").trim() : el.name;
        lines.push(text + ": " + el.value.trim());
      });
      var nameField = form.querySelector('[name="name"]');
      if (nameField && nameField.value) subject += " from " + nameField.value.trim();
      var href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n") + "\n");
      var status = form.querySelector(".form-status");
      if (status) status.textContent = "Your email app should open with this request filled in. If it doesn't, email " + TO + " directly.";
      window.location.href = href;
    });
  });


  // Story filters: tabs show one category at a time; photo-only tiles appear under "All".
  document.querySelectorAll("[data-tabs]").forEach(function (tabs) {
    var grid = document.getElementById(tabs.getAttribute("data-tabs"));
    if (!grid) return;
    tabs.querySelectorAll("button[data-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        tabs.querySelectorAll("button[data-filter]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        grid.querySelectorAll(".story").forEach(function (card) {
          card.hidden = !(f === "all" || card.getAttribute("data-cat") === f);
        });
      });
    });
  });

  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
