// Nest Workspaces site script: inquiry forms compose an email to hello@nestworkspaces.com.
(function () {
  var TO = "hello@nestworkspaces.com";

  document.querySelectorAll("form[data-mailto]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      var subject = form.getAttribute("data-mailto") || "Inquiry";
      var lines = [];
      form.querySelectorAll("input, select, textarea").forEach(function (el) {
        if (!el.name || !el.value) return;
        var label = form.querySelector('label[for="' + el.id + '"]');
        lines.push((label ? label.textContent.trim() : el.name) + ": " + el.value.trim());
      });
      var nameField = form.querySelector('[name="name"]');
      if (nameField && nameField.value) subject += " from " + nameField.value.trim();
      var href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n") + "\n");
      var status = form.querySelector(".form-status");
      if (status) status.textContent = "Your email app should open with this request filled in. If it doesn't, email " + TO + " directly.";
      window.location.href = href;
    });
  });

  // Close the mobile menu after picking a link.
  document.querySelectorAll(".menu a").forEach(function (a) {
    a.addEventListener("click", function () {
      var d = a.closest("details");
      if (d) d.open = false;
    });
  });

  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
