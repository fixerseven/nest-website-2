// Nest Workspaces site script.
// Full-screen menu, the live "Open now" line, and inquiry forms that compose an email to
// hello@nestworkspaces.com.
(function () {
  var TO = "hello@nestworkspaces.com";

  // Menu: a <dialog> opened from the "Menu" button. Escape and the Close button shut it.
  var menu = document.getElementById("site-menu");
  if (menu && typeof menu.showModal === "function") {
    document.querySelectorAll("[data-menu-open]").forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", function () {
        menu.showModal();
        btn.setAttribute("aria-expanded", "true");
      });
    });
    menu.querySelectorAll("[data-menu-close]").forEach(function (btn) {
      btn.addEventListener("click", function () { menu.close(); });
    });
    menu.addEventListener("close", function () {
      document.querySelectorAll("[data-menu-open]").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    });
    // Close when a link to a section of the current page is used.
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { menu.close(); });
    });
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
      text.textContent = "Closed now · opens 7 AM";
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
