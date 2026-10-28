/* Find your space: a few questions, a recommended Nest package, then the answers go to Nest by email.
   Questions and prices live in QUESTIONS and recommend() below. Delivery uses Web3Forms when the page
   has an access key (data-key), and falls back to opening the visitor's email app when it doesn't. */
(function () {
  "use strict";
  var root = document.querySelector("[data-fit]");
  if (!root) return;

  var TO = root.getAttribute("data-to") || "hello@nestworkspaces.com";
  var KEY = root.getAttribute("data-key") || "";
  var POS = root.getAttribute("data-pos") || "";
  var stage = root.querySelector("[data-fit-stage]");
  var bar = root.querySelector("[data-fit-bar]");
  var count = document.querySelector("[data-fit-count]");
  var photo = document.querySelector("[data-fit-photo]");
  var ARROW = '<svg class="arw" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

  var PHOTOS = {
    start: "img/nest-interior.jpg",
    work: "img/people/girls-laptop-orange.jpg",
    meet: "img/meeting-room-small.jpg",
    shoot: "img/studio-cyclorama.jpg",
    event: "img/studio-group.jpg",
    done: "img/lounge-create.jpg"
  };

  // Each question: id, the text, its options [value, label, hint], and which path it belongs to.
  var QUESTIONS = [
    { id: "goal", q: "What brings you to Nest?", opts: [
      ["work", "Work or study", "A seat for the day, the month or longer"],
      ["meet", "A meeting", "Interviews, workshops, study groups"],
      ["shoot", "A photo or video shoot", "Studios with lights and backdrops"],
      ["event", "An event", "Launches, talks, parties"],
      ["tour", "Just a tour for now", "See the space first, decide later"]] },

    { id: "who", path: "work", q: "Who's coming?", opts: [
      ["solo", "Just me"],
      ["small", "2 to 4 of us"],
      ["team", "A team of 5 or more"]] },
    { id: "often", path: "work", q: "How often will you come in?", opts: [
      ["once", "Just a day or two", "Trying it out, or a one-off"],
      ["few", "A few days a month"],
      ["most", "Most weekdays"],
      ["every", "Every day. I want a base."]] },
    { id: "when", path: "work", q: "When do you usually work?", opts: [
      ["day", "Daytime and evenings", "Walk-in hours are 7 AM to 1 AM"],
      ["night", "Late nights or overnight", "Night shifts, deadlines, different time zones"]] },
    { id: "setup", path: "work", only: function (a) { return a.often === "every" || a.often === "most"; },
      q: "What kind of space do you want?", opts: [
      ["any", "Any open desk is fine"],
      ["desk", "My own desk that stays set up"],
      ["room", "A room with a door"]] },

    { id: "size", path: "meet", q: "How many people, including you?", opts: [
      ["6", "Up to 6"],
      ["12", "7 to 12"],
      ["30", "13 to 30"],
      ["60", "More than 30"]] },
    { id: "hours", path: "meet", q: "How long do you need it?", opts: [
      ["2", "An hour or two"],
      ["4", "Half a day", "About 4 hours"],
      ["8", "A full day", "About 8 hours"]] },

    { id: "kind", path: "shoot", q: "What are you shooting?", opts: [
      ["wall", "On an infinity wall", "Clean backdrop, fashion, products, video"],
      ["set", "A small set", "Content, interviews, portraits"],
      ["big", "A big production", "I need the whole place"]] },
    { id: "crew", path: "shoot", q: "How big is the crew, talent included?", opts: [
      ["30", "Up to 30"],
      ["60", "31 to 60"],
      ["100", "More than 60"]] },
    { id: "hours", path: "shoot", q: "How many hours?", opts: [
      ["2", "About 2"],
      ["4", "About 4"],
      ["8", "A full day", "About 8 hours"],
      ["12", "Day and night", "About 12 hours"]] },

    { id: "guests", path: "event", q: "How many guests?", opts: [
      ["12", "Up to 12"],
      ["30", "13 to 30"],
      ["60", "31 to 60"],
      ["100", "61 to 100"]] },
    { id: "private", path: "event", q: "Do you want the place to yourselves?", opts: [
      ["yes", "Yes, just our guests", "The Entire Studio, closed to everyone else"],
      ["no", "No, a room is enough"]] },
    { id: "hours", path: "event", q: "How long is the event?", opts: [
      ["4", "Up to 4 hours"],
      ["8", "A full day or a long evening", "About 8 hours"],
      ["12", "All day and night", "About 12 hours"]] }
  ];

  function peso(n) { return "₱" + n.toLocaleString("en-US"); }

  function studio1(h) { return 9000 + Math.max(0, h - 4) * 2500; }
  function studio3(h) { return 2000 + Math.max(0, h - 2) * 1250; }
  function entire(h) {
    if (h <= 4) return 14000;
    if (h === 8) return 27000;
    if (h === 12) return 39000;
    return 14000 + (h - 4) * 3500;
  }

  var PICKS = {
    day: { name: "Day Pass", price: "₱400 a day", link: "coworking.html#passes",
      text: "One day at any open desk, 7 AM to 1 AM. Coffee, tea, water and 300 Mbps internet included. No booking needed: just walk in." },
    owl: { name: "Owl Pass", price: "₱550 for 24 hours", link: "coworking.html#passes",
      text: "A full 24 hours, for night shifts and deadline weeks." },
    week: { name: "Week Pass", price: "₱1,500 for 7 days", link: "coworking.html#passes",
      text: "Seven days in a row, 7 AM to 1 AM." },
    flexi7: { name: "Flexi 7-Day Pass", price: "₱2,490 for 7 days", link: "coworking.html#passes",
      text: "Seven days to use whenever you like within 30 days. Works out to about ₱356 a day." },
    flexi15: { name: "Flexi 15-Day Pass", price: "₱4,490 for 15 days", link: "coworking.html#passes",
      text: "Fifteen days to use within 45 days, for about ₱300 a day." },
    hotdesk: { name: "Hotdesk Membership", price: "₱5,500 a month", link: "coworking.html#memberships",
      text: "Any open desk, 24 hours a day with your own keycard. Includes 3 meeting room hours and 6 guest hours a month." },
    dedicated: { name: "Dedicated desk", price: "From ₱6,500 a month", link: "coworking.html#memberships",
      text: "Your own desk that no one else uses, in one of eight zones, with 24-hour access and the same member perks." },
    office: { name: "Private Office or Booth", price: "From ₱20,000 a month for 2 people", link: "coworking.html#offices",
      text: "A room with a door for 1 to 4 people, 24 hours a day. Each additional person is ₱5,500 a month." },
    small: { name: "Small Meeting Room", price: "₱400 an hour", link: "meeting-rooms.html",
      text: "Up to 6 people, with a smart TV, HDMI and a whiteboard. Coffee and parking included." },
    large: { name: "Large Meeting Room", price: "₱900 an hour", link: "meeting-rooms.html",
      text: "Up to 12 people, with a smart TV, HDMI and a whiteboard. Extra seats are ₱200 per person, per hour." },
    s3: { name: "Studio 3 · Multipurpose", price: "₱2,000 for the first 2 hours", link: "studios.html",
      text: "35.94 sqm for 25 to 30 people. Each extra hour is ₱1,250. Lights, stands and backdrops included." },
    s1: { name: "Studio 1 · Infinity Wall", price: "₱9,000 for the first 4 hours", link: "studios.html",
      text: "58.5 sqm with a 12 by 4 m cyclorama, for up to 60 people. Each extra hour is ₱2,500. Dressing room included." },
    amphi: { name: "Amphitheater", price: "From ₱2,000", link: "meeting-rooms.html",
      text: "Tiered seating in the coworking space, good for talks and study sessions." },
    tour: { name: "A tour of Nest", price: "Free", link: "visit.html",
      text: "We'll show you the desks, booths, offices, meeting rooms and studios, and answer your questions. Pick a day and time below, or just walk in any day from 7 AM to 1 AM." },
    entire: { name: "Entire Studio", price: "From ₱14,000 for 4 hours", link: "events.html",
      text: "Studio 1, Studio 3 and the dressing room, just for you, for 60 to 100 people. Tables, chairs, projector, mics and a speaker included." }
  };

  // Returns { main, alt, estimate } for the answers so far.
  function recommend(a) {
    var r = { alt: null, estimate: "" };
    var h = Number(a.hours || 0);
    if (a.goal === "tour") {
      r.main = "tour";
    } else if (a.goal === "work") {
      var group = a.who !== "solo";
      if (a.often === "once") {
        r.main = a.when === "night" ? "owl" : "day";
        r.alt = a.when === "night" ? "day" : "week";
        if (group) r.estimate = "Passes are per person, so bring the crew and each pays for their own.";
      } else if (a.often === "few") {
        r.main = a.when === "night" ? "hotdesk" : "flexi7";
        r.alt = a.when === "night" ? "flexi7" : "flexi15";
        if (group) r.estimate = "Passes are per person. Ask us about a group rate.";
      } else {
        if (a.setup === "room" || (a.who === "team" && a.setup !== "any")) r.main = "office";
        else if (a.setup === "desk") r.main = "dedicated";
        else r.main = "hotdesk";
        r.alt = r.main === "hotdesk" ? "dedicated" : r.main === "dedicated" ? "hotdesk" : "dedicated";
        if (r.main === "office" && a.who === "team") r.estimate = "For 5 or more people, we'll put together offices and booths that fit your team.";
        else if (group && r.main !== "office") r.estimate = "Memberships are per person: " + PICKS[r.main].price.toLowerCase() + " each.";
      }
    } else if (a.goal === "meet") {
      var size = Number(a.size);
      if (size <= 6) { r.main = "small"; r.alt = "large"; r.estimate = "About " + peso(400 * h) + " for " + h + " hours."; }
      else if (size <= 12) { r.main = "large"; r.alt = "s3"; r.estimate = "About " + peso(900 * h) + " for " + h + " hours."; }
      else if (size <= 30) { r.main = "s3"; r.alt = "amphi"; r.estimate = "About " + peso(studio3(h)) + " for " + h + " hours."; }
      else { r.main = "entire"; r.alt = "s1"; r.estimate = "About " + peso(entire(Math.max(4, h))) + " for " + Math.max(4, h) + " hours."; }
    } else if (a.goal === "shoot") {
      var crew = Number(a.crew);
      if (a.kind === "big" || crew > 60) r.main = "entire";
      else if (a.kind === "wall" || crew > 30) r.main = "s1";
      else r.main = "s3";
      r.alt = r.main === "s3" ? "s1" : r.main === "s1" ? "entire" : "s1";
      var cost = r.main === "entire" ? entire(Math.max(4, h)) : r.main === "s1" ? studio1(h) : studio3(h);
      var hrs = r.main === "s3" ? Math.max(2, h) : Math.max(4, h);
      r.estimate = "About " + peso(cost) + " for " + hrs + " hours.";
    } else if (a.goal === "event") {
      var guests = Number(a.guests);
      if (a.private === "yes" || guests > 60) r.main = "entire";
      else if (guests <= 12) r.main = "large";
      else if (guests <= 30) r.main = "s3";
      else r.main = "s1";
      r.alt = r.main === "entire" ? (guests <= 60 ? "s1" : null) : "entire";
      if (r.main === "entire") r.estimate = peso(entire(h)) + " for " + h + " hours.";
      else if (r.main === "large") r.estimate = "About " + peso(900 * h) + " for " + h + " hours.";
      else if (r.main === "s3") r.estimate = "About " + peso(studio3(h)) + " for " + h + " hours.";
      else r.estimate = "About " + peso(studio1(h)) + " for " + h + " hours.";
    }
    return r;
  }

  // The contact details, asked one at a time after the result.
  var FIELDS = [
    { name: "name", label: "What's your name?", type: "text", auto: "name", required: true },
    { name: "email", label: "What email should we reply to?", type: "email", auto: "email", required: true },
    { name: "phone", label: "Your mobile number", type: "tel", auto: "tel", required: true },
    { name: "date", label: "What day would you like to come in?", type: "date" },
    { name: "time", label: "What time works for you?", type: "time" },
    { name: "notes", label: "Anything else we should know?", type: "textarea" }
  ];

  var answers = {};
  var history = [];
  // Book a tour links arrive with ?tour; links from a service page can skip the first question with ?goal=work.
  var params = new URLSearchParams(window.location.search);
  var TOUR = params.has("tour");

  function steps() {
    return QUESTIONS.filter(function (q) {
      if (!q.path) return true;
      if (q.path !== answers.goal) return false;
      return !q.only || q.only(answers);
    });
  }

  function labelFor(q, value) {
    for (var i = 0; i < q.opts.length; i++) if (q.opts[i][0] === value) return q.opts[i][1];
    return value;
  }

  function setPhoto(key) {
    if (photo && PHOTOS[key] && photo.getAttribute("src") !== PHOTOS[key]) photo.src = PHOTOS[key];
  }

  function progress(i, total) {
    if (bar) bar.style.width = Math.round((i / total) * 100) + "%";
  }

  function focusStage() {
    var h = stage.querySelector("h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }

  function showQuestion(index) {
    var list = steps();
    var q = list[index];
    if (!q) return showResult();
    // Five steps is the usual length; the bar fills as you go.
    var total = answers.goal ? list.length + 1 : 5;
    progress(index, total);
    if (count) count.textContent = "Question " + (index + 1) + (answers.goal ? " of " + list.length : "");
    setPhoto(answers.goal || "start");
    var html = '<fieldset class="fit-q"><legend><h2 class="h-md">' + q.q + "</h2></legend><div class=\"fit-opts\">";
    q.opts.forEach(function (o) {
      var on = answers[q.id] === o[0];
      html += '<button type="button" class="fit-opt' + (on ? " is-on" : "") + '" data-value="' + o[0] + '">' +
        "<strong>" + o[1] + "</strong>" + (o[2] ? "<span>" + o[2] + "</span>" : "") + ARROW + "</button>";
    });
    html += "</div></fieldset>";
    if (index > 0) html += '<button type="button" class="fit-back" data-back>← Back</button>';
    stage.innerHTML = html;
    stage.querySelectorAll(".fit-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        if (q.id === "goal" && answers.goal !== b.getAttribute("data-value")) answers = {};
        answers[q.id] = b.getAttribute("data-value");
        history.push(index);
        showQuestion(index + 1);
      });
    });
    var back = stage.querySelector("[data-back]");
    if (back) back.addEventListener("click", function () { showQuestion(history.pop() || 0); });
    focusStage();
  }

  function summary() {
    return steps().map(function (q) { return [q.q, labelFor(q, answers[q.id])]; });
  }

  function card(key, cls) {
    var p = PICKS[key];
    return '<div class="fit-card ' + (cls || "") + '"><p class="label">' + (key === "tour" ? "Your visit" : cls === "is-main" ? "We recommend" : "Also worth a look") + "</p>" +
      '<h3 class="h-md">' + p.name + '</h3><p class="price">' + p.price + "</p><p>" + p.text + "</p>" +
      '<a class="text-link" href="' + p.link + '">' + (key === "tour" ? "Directions and hours " : "See details ") + ARROW + "</a></div>";
  }

  function showResult() {
    var r = recommend(answers);
    var list = steps();
    progress(list.length, list.length + 1);
    if (count) count.textContent = "Your match";
    setPhoto("done");
    var answered = summary().map(function (s) { return "<li><span>" + s[0] + "</span><strong>" + s[1] + "</strong></li>"; }).join("");
    stage.innerHTML =
      '<div class="fit-result">' +
      '<h2 class="h-md">' + (r.main === "tour" ? "Come see the space." : "Here\'s what fits.") + "</h2>" +
      card(r.main, "is-main") +
      (r.main === "tour" ? "" : '<p class="fit-estimate">' + (r.estimate ? r.estimate + " " : "") + "Students get 10% off. PWD and senior citizens get 20% off." +
        (TOUR ? " We'll show you around when you come in." : "") + "</p>") +
      (r.alt ? card(r.alt) : "") +
      '<details class="fit-answers"><summary>Your answers</summary><ul>' + answered + "</ul></details>" +
      "</div>" +
      '<form class="form fit-send" novalidate>' +
      '<h3 class="h-md">Send this to Nest</h3><p class="muted">A few details and we\'ll reply with availability.</p>' +
      FIELDS.map(function (f, i) {
        var input = f.type === "textarea"
          ? '<textarea id="fit-' + f.name + '" name="' + f.name + '"></textarea>'
          : '<input id="fit-' + f.name + '" name="' + f.name + '" type="' + f.type + '"' + (f.auto ? ' autocomplete="' + f.auto + '"' : "") + (f.required ? " required" : "") + ">";
        return '<div class="field fit-field" data-field="' + i + '"' + (i ? " hidden" : "") + '><span class="label">' + (i + 1) + " of " + FIELDS.length + "</span>" +
          '<label for="fit-' + f.name + '">' + f.label + (f.required ? "" : ' <span class="opt">(optional)</span>') + "</label>" + input + "</div>";
      }).join("") +
      '<input type="checkbox" name="botcheck" class="sr-only" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<div class="form-actions"><button class="btn btn-solid" type="submit" data-next>Next ' + ARROW + '</button>' +
      '<button type="button" class="fit-back" data-field-back hidden>← Back</button>' +
      '<button type="button" class="fit-back" data-restart>Start over</button></div>' +
      (KEY || POS ? "" : '<p class="form-note" data-send-note hidden>Sending opens your email app with everything filled in.</p>') +
      '<p class="form-status" role="status" aria-live="polite"></p></form>';
    stage.querySelector("[data-restart]").addEventListener("click", function () { answers = {}; history = []; showQuestion(0); });
    var form = stage.querySelector(".fit-send");
    var at = 0;
    var next = form.querySelector("[data-next]");
    var back = form.querySelector("[data-field-back]");
    var note = form.querySelector("[data-send-note]");
    // One detail at a time: Next checks the current field, then shows the following one.
    function showField(i) {
      at = i;
      form.querySelectorAll(".fit-field").forEach(function (el, n) { el.hidden = n !== i; });
      back.hidden = i === 0;
      if (note) note.hidden = i < FIELDS.length - 1;
      nextLabel();
      form[FIELDS[i].name].focus();
    }
    // An empty optional field reads "Skip"; the last one reads "Send to Nest".
    function nextLabel() {
      var f = FIELDS[at];
      next.innerHTML = (at === FIELDS.length - 1 ? "Send to Nest " : f.required || form[f.name].value ? "Next " : "Skip ") + ARROW;
    }
    form.addEventListener("input", nextLabel);
    back.addEventListener("click", function () { showField(at - 1); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var field = form[FIELDS[at].name];
      if (!field.reportValidity()) return;
      if (at < FIELDS.length - 1) showField(at + 1);
      else send(form, r);
    });
    focusStage();
  }

  function send(form, r) {
    if (!form.reportValidity()) return;
    if (form.botcheck.checked) return;
    var status = form.querySelector(".form-status");
    var button = form.querySelector('button[type="submit"]');
    var v = function (n) { return (form[n].value || "").trim(); };
    var main = PICKS[r.main];
    // Optional lines are null and get dropped.
    var lines = [
      "Recommended: " + main.name + " (" + main.price + ")",
      r.alt ? "Also suggested: " + PICKS[r.alt].name + " (" + PICKS[r.alt].price + ")" : null,
      r.estimate ? "Estimate: " + r.estimate : null,
      "",
      "Answers:"
    ].concat(summary().map(function (s) { return "- " + s[0] + " " + s[1]; })).concat([
      "",
      "Name: " + v("name"),
      "Email: " + v("email"),
      v("phone") ? "Mobile: " + v("phone") : null,
      v("date") ? "Visit date: " + v("date") : null,
      v("time") ? "Visit time: " + v("time") : null,
      v("notes") ? "Notes: " + v("notes") : null
    ]).filter(function (l) { return l !== null; });
    var tour = TOUR || answers.goal === "tour";
    if (tour && r.main !== "tour") lines.splice(lines.indexOf("Answers:") - 1, 0, "Wants a tour: Yes");
    var subject = (tour ? "Tour request: " : "Find your space: ") + main.name + " for " + v("name");
    // Count a sent form as a Lead when the Meta Pixel is on the page.
    function lead() { if (window.fbq) window.fbq("track", "Lead"); }

    var esc = function (t) { return t.replace(/[<>&"]/g, ""); };

    function thanks() {
      lead();
      stage.innerHTML = '<div class="fit-result"><h2 class="h-md">Thanks, ' + esc(v("name").split(" ")[0]) + ". It's on its way.</h2>" +
        "<p>We'll reply to " + esc(v("email")) + " or text " + esc(v("phone")) + " with availability soon. Need it sooner? Call <a href=\"tel:+639454510789\">(0945) 451 0789</a> or <a href=\"https://m.me/nestworkspacesph\">message us</a>.</p>" +
        '<div class="btn-row"><a class="btn" href="' + main.link + '">See ' + main.name + " " + ARROW + "</a></div></div>";
      progress(1, 1);
      focusStage();
    }

    function mailto() {
      lead();
      window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n") + "\n");
      button.disabled = false;
      status.textContent = "Your email app should open with this filled in. If it doesn't, email " + TO + " directly.";
    }

    // The POS files the request as a lead beside Quotes (Quotes & Invoices → Leads). Sent as
    // text/plain so the browser skips the CORS preflight; the POS reads it as JSON.
    function toPos() {
      if (!POS) return Promise.resolve(false);
      return fetch(POS, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          name: v("name"), phone: v("phone"), email: v("email"),
          goal: answers.goal,
          recommendation: main.name + " (" + main.price + ")",
          date: v("date"), time: v("time"), message: lines.join("\n")
        })
      }).then(function (res) { return res.ok; }).catch(function () { return false; });
    }

    // The email copy, through Web3Forms once FORM_KEY is set.
    function toEmail() {
      if (!KEY) return Promise.resolve(false);
      return fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: KEY, subject: subject, from_name: "Nest website",
          name: v("name"), email: v("email"), phone: v("phone"),
          recommendation: main.name + " (" + main.price + ")",
          message: lines.join("\n")
        })
      }).then(function (res) { return res.json(); })
        .then(function (data) { return !!data.success; })
        .catch(function () { return false; });
    }

    button.disabled = true;
    status.textContent = "Sending…";
    Promise.all([toPos(), toEmail()]).then(function (sent) {
      if (sent[0] || sent[1]) return thanks();
      // Neither reached Nest: fall back to the visitor's email app.
      mailto();
    });
  }

  var goal = params.get("goal");
  if (goal && QUESTIONS[0].opts.some(function (o) { return o[0] === goal; })) {
    answers.goal = goal;
    history.push(0);
    showQuestion(1);
  } else {
    showQuestion(0);
  }
})();
