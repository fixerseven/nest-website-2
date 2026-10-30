#!/usr/bin/env python3
"""Build the Nest Workspaces site into public/.

Pages live in src/pages/*.html and stories in src/stories/*.html. Each file starts with a
comment block of `key: value` lines (title, description and so on), followed by the page body.
This script wraps every body in the shared head, top bar, menu and footer, then writes
public/<name>.html and public/sitemap.xml.

    python3 build.py
"""
import html
import json
import re
import subprocess
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
OUT = ROOT / "public"
SITE = "https://nestworkspaces.com"

PHONE = "(0945) 451 0789"
PHONE_HREF = "tel:+639454510789"
EMAIL = "hello@nestworkspaces.com"
# Web3Forms access key for the Find your space form (web3forms.com, made with the inbox above).
# Leave empty and the form opens the visitor's email app instead.
FORM_KEY = ""
# The POS endpoint that files Find your space requests as leads (Quotes & Invoices → Leads).
POS_INTAKE_URL = "https://pos.nestworkspaces.com/api/intake/web"
MESSENGER = "https://m.me/nestworkspacesph"
MAPS = "https://www.google.com/maps/search/?api=1&amp;query=Nest%20Workspaces%20Horizons%20101%20Gen.%20Maxilom%20Ave%20Cebu%20City"
SOCIALS = ["https://www.instagram.com/nestworkspacesph/", "https://www.facebook.com/nestworkspacesph"]

# The business as search engines and AI assistants read it (schema.org JSON-LD on every page).
# Keep these facts in step with the page copy: hours, address and prices.
BUSINESS = {
    "@type": "LocalBusiness",
    "@id": f"{SITE}/#business",
    "name": "Nest Workspaces",
    "description": ("Coworking space and photo and video studios in Cebu City: day passes, memberships, "
                    "private offices, meeting rooms by the hour, studio rentals and an event venue for 60 to 100 guests. "
                    "Open to walk-ins daily 7 AM to 1 AM, and 24 hours for members."),
    "url": f"{SITE}/",
    "logo": f"{SITE}/favicon-512.png",
    "image": [f"{SITE}/img/og-image.jpg", f"{SITE}/img/og/studios.jpg", f"{SITE}/img/og/meeting-rooms.jpg"],
    "telephone": "+63 945 451 0789",
    "email": "hello@nestworkspaces.com",
    "priceRange": "₱400 to ₱39,000",
    "currenciesAccepted": "PHP",
    "paymentAccepted": "Cash, GCash, Credit Card, Debit Card, Bank Transfer",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "B1, Horizons 101 Condominiums, Gen. Maxilom Ave",
        "addressLocality": "Cebu City",
        "addressRegion": "Cebu",
        "postalCode": "6000",
        "addressCountry": "PH",
    },
    "hasMap": "https://www.google.com/maps/search/?api=1&query=Nest%20Workspaces%20Horizons%20101%20Gen.%20Maxilom%20Ave%20Cebu%20City",
    # Walk-in hours. Closing at 01:00 (before opening) means 1 AM the next day. Members have 24-hour access.
    "openingHoursSpecification": [{
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "07:00",
        "closes": "01:00",
    }],
    "amenityFeature": [
        {"@type": "LocationFeatureSpecification", "name": name, "value": True}
        for name in ["Free parking", "High-speed internet (300 Mbps)", "Free coffee, tea and water",
                     "24-hour access for members", "Meeting rooms", "Photo and video studios"]
    ],
    "sameAs": SOCIALS,
    "makesOffer": [
        {"@type": "Offer", "name": name, "price": price, "priceCurrency": "PHP", "url": f"{SITE}/{page}"}
        for name, price, page in [
            ("Coworking Day Pass, 7 AM to 1 AM", "400", "coworking"),
            ("Hotdesk Membership with 24-hour access, per month", "5500", "coworking"),
            ("Private office, per month", "20000", "coworking"),
            ("Small meeting room (6 seats), per hour", "400", "meeting-rooms"),
            ("Large meeting room (12 seats), per hour", "900", "meeting-rooms"),
            ("Studio 1 infinity wall, 4 hours", "9000", "studios"),
            ("Entire Studio for events of 60 to 100 guests, 4 hours", "14000", "events"),
        ]
    ],
}

# Page order for the menu and the footer. (file name, menu label)
NAV = [
    ("index", "Home"),
    ("coworking", "Coworking"),
    ("meeting-rooms", "Meeting rooms"),
    ("studios", "Studios"),
    ("events", "Events"),
    ("stories", "Stories"),
    ("faq", "FAQ"),
    ("visit", "Visit"),
]

# Story order on the stories page and in "Keep reading".
STORIES = ["story-nest-2-0", "story-studio-1", "story-study-day", "story-meeting-rooms", "story-christmas-party"]

ARROW = ('<svg class="arw" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h10M9 4l4 4-4 4"/></svg>')

ICONS = {
    "instagram": '<path d="M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM21.9 8c-.1-1.6-.4-3-1.6-4.2S17.6 2.2 16 2.1C14.4 2 9.6 2 8 2.1 6.4 2.2 5 2.5 3.8 3.7S2.2 6.4 2.1 8C2 9.6 2 14.4 2.1 16c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.6.1 6.4.1 8 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.6.1-6.4 0-8zm-2.1 9.8a3.3 3.3 0 0 1-1.8 1.8c-1.3.5-4.3.4-5.9.4s-4.6.1-5.9-.4a3.3 3.3 0 0 1-1.8-1.8C3.9 16.5 4 13.5 4 12s-.1-4.6.4-5.9a3.3 3.3 0 0 1 1.8-1.8C7.5 3.8 10.5 3.9 12 3.9s4.6-.1 5.9.4a3.3 3.3 0 0 1 1.8 1.8c.5 1.3.4 4.3.4 5.9s.1 4.6-.4 5.9z"/>',
    "facebook": '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/>',
    "messenger": '<path d="M12 2C6.4 2 2 6.1 2 11.7c0 2.9 1.2 5.5 3.2 7.2v3.4l3.1-1.7c1.1.3 2.3.5 3.7.5 5.6 0 10-4.1 10-9.7S17.6 2 12 2zm1 13l-2.6-2.7-5 2.7 5.5-5.8 2.6 2.7 5-2.7L13 15z"/>',
}


def parse(path):
    """Split a source file into (meta dict, body)."""
    text = path.read_text(encoding="utf-8")
    m = re.match(r"\s*<!--(.*?)-->\s*", text, re.S)
    meta = {}
    if m:
        for line in m.group(1).strip().splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
        text = text[m.end():]
    return meta, text


def url_for(name):
    return f"{SITE}/" if name == "index" else f"{SITE}/{name}"


def page_label(meta, name):
    """Short page name for breadcrumbs: the menu label, or the story heading."""
    return dict(NAV).get(name) or meta.get("heading") or meta["title"].split(" | ")[0]


def structured_data(meta, name, body):
    """schema.org JSON-LD for a page: the business, the site, the page, breadcrumbs, plus FAQ or article data."""
    url = url_for(name)
    graph = [BUSINESS, {
        "@type": "WebSite", "@id": f"{SITE}/#website", "url": f"{SITE}/", "name": "Nest Workspaces",
        "publisher": {"@id": f"{SITE}/#business"}, "inLanguage": "en",
    }, {
        "@type": "WebPage", "@id": f"{url}#webpage", "url": url, "name": meta["title"],
        "description": meta.get("description", ""), "isPartOf": {"@id": f"{SITE}/#website"},
        "about": {"@id": f"{SITE}/#business"}, "primaryImageOfPage": f"{SITE}/{og_image(meta, name)}", "inLanguage": "en",
    }]
    if name != "index":
        crumbs = [("Home", f"{SITE}/")]
        if name.startswith("story-"):
            crumbs.append(("Stories", url_for("stories")))
        crumbs.append((page_label(meta, name), url))
        graph.append({"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": i, "name": n, "item": u} for i, (n, u) in enumerate(crumbs, 1)]})
    if name.startswith("story-"):
        graph.append({
            "@type": "BlogPosting", "headline": meta["heading"], "description": meta.get("dek", ""),
            "image": f"{SITE}/{og_image(meta, name)}", "url": url, "mainEntityOfPage": {"@id": f"{url}#webpage"},
            "author": {"@id": f"{SITE}/#business"}, "publisher": {"@id": f"{SITE}/#business"},
            "datePublished": meta.get("published", ""), "dateModified": meta.get("modified", ""), "inLanguage": "en",
        })
    # Only the FAQ page carries FAQPage data; Google wants one page per set of questions.
    qa = re.findall(r"<details><summary>(.*?)</summary><div>(.*?)</div></details>", body, re.S) if name == "faq" else []
    if qa:
        clean = lambda s: html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s))).strip()
        graph.append({"@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": clean(q), "acceptedAnswer": {"@type": "Answer", "text": clean(a)}} for q, a in qa]})
    data = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, separators=(",", ":"))
    return '<script type="application/ld+json">\n' + data.replace("</", "<\\/") + "\n</script>\n"


def og_image(meta, name):
    """The share image: og_image from the page's comment block, else img/og/<name>.jpg, else the default."""
    if "og_image" in meta:
        return meta["og_image"]
    return f"img/og/{name}.jpg" if (OUT / "img" / "og" / f"{name}.jpg").exists() else "img/og-image.jpg"


def head(meta, name, body=""):
    title = meta["title"]
    desc = meta.get("description", "")
    noindex = meta.get("noindex") == "yes"
    canonical = "" if noindex else f'<link rel="canonical" href="{url_for(name)}">\n'
    robots = '<meta name="robots" content="noindex">\n' if noindex else '<meta name="robots" content="index, follow, max-image-preview:large">\n'
    image = og_image(meta, name)
    image_alt = html.escape(meta.get("og_alt", "Inside Nest Workspaces, a coworking space and studio in Cebu City"))
    og_type = "article" if name.startswith("story-") else "website"
    schema = "" if noindex else structured_data(meta, name, body)
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
{robots}{canonical}<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="Nest Workspaces">
<meta property="og:locale" content="en_PH">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url_for(name)}">
<meta property="og:image" content="{SITE}/{image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{image_alt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{SITE}/{image}">
<meta name="geo.region" content="PH-CEB">
<meta name="geo.placename" content="Cebu City">
<link rel="manifest" href="/site.webmanifest">
{schema}<meta name="theme-color" content="#FFFCF7">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/roboto-serif-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/poppins-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://connect.facebook.net">
<link rel="stylesheet" href="/assets/site.css">
<script>
  // Mark JS as on (so motion styles apply) and show the intro loader once a day.
  (function (d) {{
    d.classList.add("js");
    // If site.js never runs, show everything rather than leave it hidden.
    setTimeout(function () {{ if (!d.classList.contains("motion-on")) d.classList.remove("js"); }}, 4000);
    try {{
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      var day = new Date().toDateString();
      if (localStorage.getItem("nest-intro") !== day) {{
        d.classList.add("show-loader");
        localStorage.setItem("nest-intro", day);
      }}
    }} catch (e) {{}}
  }})(document.documentElement);
</script>
<!-- Meta Pixel (dataset "Nest Walk-In Data" in the Nest business). -->
<script>
  !function(f,b,e,v,n,t,s){{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)}};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1346842319931970');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=1346842319931970&amp;ev=PageView&amp;noscript=1"></noscript>
<!-- Google Analytics 4: paste the gtag.js snippet here and replace G-XXXXXXXXXX. -->
</head>
"""


def status_line(cls=""):
    # Filled in by site.js with the live open/closed state in Cebu time.
    return f'<p class="status {cls}" data-status><span class="dot" aria-hidden="true"></span><span data-status-text>Walk-ins 7 AM to 1 AM · Members 24 hours</span></p>'


def topbar(name, on_photo):
    logo = ('<img src="img/nest-logo-white.png" alt="Nest Workspaces home" width="92" height="76">' if on_photo
            else '<img src="img/nest-logo.svg" alt="Nest Workspaces home" width="74" height="61">')
    current = ' aria-current="page"'
    links = "\n".join(
        f'      <li><a href="{n}.html"{current if n == name else ""}>{label}</a></li>'
        for n, label in NAV)
    return f"""<body>
<div class="loader" aria-hidden="true">
  <p class="loader-top"><span>Nest Workspaces</span><span>Cebu City</span></p>
  <div class="loader-bottom">
    <p class="loader-line">Walk-ins 7 AM to 1 AM · Members 24 hours</p>
    <p class="loader-mark">nest</p>
    <div class="loader-progress"><span></span></div>
  </div>
</div>
<a class="skip" href="#main">Skip to content</a>
<header class="topbar{' on-photo' if on_photo else ''}">
  <button class="menu-btn" type="button" aria-haspopup="dialog" aria-controls="site-menu" data-menu-open>Menu <svg viewBox="0 0 20 12" aria-hidden="true" focusable="false"><path d="M1 2h18M1 10h18"/></svg></button>
  <a class="logo" href="index.html">{logo}</a>
</header>
<dialog class="menu" id="site-menu" aria-label="Menu" data-lenis-prevent>
  <div class="menu-top">
    <button class="menu-btn" type="button" data-menu-close>Close <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4 4l12 12M16 4L4 16"/></svg></button>
    <a class="logo" href="index.html"><img src="img/nest-logo.svg" alt="Nest Workspaces home" width="74" height="61"></a>
  </div>
  <nav class="menu-nav" aria-label="Main">
    <ul>
{links}
    </ul>
  </nav>
  <div class="menu-side">
    {status_line()}
    <p>B1, Horizons 101 Condominiums<br>Gen. Maxilom Ave, Cebu City</p>
    <p>Walk-ins daily 7 AM to 1 AM.<br>Members 24 hours.</p>
    <div class="btn-row"><a class="btn btn-solid" href="find-your-space.html?tour">Book a tour {ARROW}</a><a class="btn" href="find-your-space.html">Find your space</a></div>
    <p><a href="{PHONE_HREF}">{PHONE}</a><br><a href="mailto:{EMAIL}">{EMAIL}</a></p>
  </div>
</dialog>
"""


def footer(name):
    nav = "".join(f'<li><a href="{n}.html">{label}</a></li>' for n, label in NAV)
    socials = "".join(
        f'<a href="{href}" aria-label="{label}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{ICONS[key]}</svg></a>'
        for key, label, href in [
            ("instagram", "Instagram", "https://www.instagram.com/nestworkspacesph/"),
            ("facebook", "Facebook", "https://www.facebook.com/nestworkspacesph"),
            ("messenger", "Messenger", MESSENGER),
        ])
    return f"""<section class="ways" aria-labelledby="ways-title">
  <h2 id="ways-title" class="ways-intro">— A coworking space and studio under one roof. <strong>Pick how you want to use it.</strong></h2>
  <p class="ways-quiz">Not sure which? <a class="text-link" href="find-your-space.html">Answer a few quick questions {ARROW}</a></p>
  <div class="ways-cards">
    <a class="way" href="coworking.html#passes"><span class="label">Coworking</span><span class="way-name">Work —</span><span class="way-text">Day passes, Flexi Passes and memberships, from ₱400.</span><span class="btn">See passes {ARROW}</span></a>
    <a class="way" href="studios.html#book"><span class="label">Studios</span><span class="way-name">Shoot —</span><span class="way-text">Two studios, or the Entire Studio to yourself, with lights included.</span><span class="btn">Request a booking {ARROW}</span></a>
    <a class="way" href="events.html#plan"><span class="label">Events</span><span class="way-name">Host —</span><span class="way-text">The Entire Studio for 60 to 100 guests.</span><span class="btn">Plan an event {ARROW}</span></a>
  </div>
</section>
<footer class="site-footer">
  <a class="address-line" href="visit.html"><span class="a-serif">Horizons 101</span><span class="a-caps">Gen. Maxilom Ave</span></a>
  <div class="footer-grid">
    <div>
      <p class="label">Visit</p>
      <p>B1, Horizons 101 Condominiums<br>Gen. Maxilom Ave, Cebu City</p>
      <p><a href="{MAPS}">Open in Google Maps</a></p>
    </div>
    <div>
      <p class="label">Hours</p>
      <p>Walk-ins 7 AM to 1 AM<br>Members 24 hours</p>
    </div>
    <div>
      <p class="label">Talk to us</p>
      <p><a href="{PHONE_HREF}">{PHONE}</a><br><a href="mailto:{EMAIL}">{EMAIL}</a></p>
      <div class="socials">{socials}</div>
    </div>
    <nav aria-label="Footer"><p class="label">Pages</p><ul>{nav}</ul></nav>
  </div>
  <div class="footer-base">
    <p>© <span data-year>{date.today().year}</span> Nest Workspaces</p>
    <a href="faq.html">FAQ</a>
    <a href="{MESSENGER}">Message us</a>
  </div>
</footer>
<script src="assets/vendor/lenis.min.js" defer></script>
<script src="assets/site.js" defer></script>
</body>
</html>
"""


def expand(body):
    body = body.replace("{{arrow}}", ARROW).replace("{{status}}", status_line())
    body = body.replace("{{email}}", EMAIL).replace("{{form_key}}", FORM_KEY).replace("{{pos_intake}}", POS_INTAKE_URL)
    # Keep the closing dash of a title ("Nest —") on the same line as its last word.
    body = re.sub(r" —(?=</h[1-3]>|<span)", "&nbsp;—", body)
    # Keep times together ("1 AM" never splits across lines).
    return re.sub(r"(\d) (AM|PM)\b", r"\1&nbsp;\2", body)


def story_card(slug, meta, cls=""):
    return (f'<a class="story-card {cls}" href="{slug}.html">'
            f'<span class="story-ph"><img src="{meta["image"]}" alt="" width="800" height="1000" loading="lazy" decoding="async" style="object-position: {meta["pos"]}"></span>'
            f'<span class="label">{meta["chip"]}</span>'
            f'<span class="story-title">{meta["heading"]}</span>'
            f'<span class="story-more">Read more {ARROW}</span></a>')


def story_page(slug, meta, body, stories):
    others = [s for s in STORIES if s != slug][:3]
    more = "".join(story_card(s, stories[s][0]) for s in others)
    return f"""<main id="main">
<article class="article">
  <header class="article-head">
    <p class="crumbs"><a href="stories.html">Stories</a> · <span>{meta["chip"]}</span></p>
    <h1>{meta["heading"]}</h1>
    <p class="dek">{meta["dek"]}</p>
    <p class="article-meta">Nest Workspaces · {meta["date"]} · {meta["read"]}</p>
  </header>
  <figure class="article-hero"><img src="{meta["image"]}" alt="{meta["alt"]}" width="1600" height="1000" fetchpriority="high" style="object-position: {meta["pos"]}"></figure>
  <div class="prose">
{body.strip()}
  </div>
  <aside class="article-cta">
    <p class="label">Nest Workspaces</p>
    <p class="cta-title">Ready for your next thing?</p>
    <p>B1 Horizons 101, Gen. Maxilom Ave, Cebu City. Walk-ins 7 AM to 1 AM, and 24 hours for members.</p>
    <a class="btn" href="{meta["cta_href"]}">{meta["cta_label"]} {ARROW}</a>
  </aside>
</article>
<section class="section-head">
  <h2>More stories</h2>
  <p><a class="text-link" href="stories.html">All stories {ARROW}</a></p>
</section>
<div class="story-grid more">{more}</div>
</main>
"""


def clean_links(page):
    """Link pages by their clean URL (/coworking, not coworking.html), the address Cloudflare serves and the
    canonical URL, so visitors and crawlers skip a redirect."""
    page = re.sub(r'href="index\.html(?=["#?])', 'href="/', page)
    return re.sub(r'href="([a-z0-9-]+)\.html(?=["#?])', r'href="/\1', page)


def last_changed(path, first=False):
    """Date a source file last changed in git (so the sitemap only moves when content does).
    With first=True, the date it was added."""
    try:
        out = subprocess.run(["git", "log", "--format=%cs", "--", str(path)],
                             cwd=ROOT, capture_output=True, text=True, check=True).stdout.split()
        return (out[-1] if first else out[0]) if out else date.today().isoformat()
    except (OSError, subprocess.CalledProcessError):
        return date.today().isoformat()


def main():
    stories = {s: parse(SRC / "stories" / f"{s}.html") for s in STORIES}
    built = []

    for path in sorted((SRC / "pages").glob("*.html")):
        name = path.stem
        meta, body = parse(path)
        body = expand(body)
        if "{{story_cards}}" in body:
            cards = "".join(story_card(s, stories[s][0], "wide" if i == 0 else "") for i, s in enumerate(STORIES))
            body = body.replace("{{story_cards}}", cards)
        page = head(meta, name, body) + topbar(name, meta.get("hero") == "photo") + body + footer(name)
        (OUT / f"{name}.html").write_text(clean_links(page), encoding="utf-8")
        if meta.get("noindex") != "yes":
            built.append((name, last_changed(path)))

    for slug, (meta, body) in stories.items():
        meta = dict(meta)
        meta.setdefault("og_alt", meta["alt"])
        meta.setdefault("published", last_changed(SRC / "stories" / f"{slug}.html", first=True))
        meta.setdefault("modified", last_changed(SRC / "stories" / f"{slug}.html"))
        page = head(meta, slug) + topbar(slug, False) + story_page(slug, meta, expand(body), stories) + footer(slug)
        (OUT / f"{slug}.html").write_text(clean_links(page), encoding="utf-8")
        built.append((slug, last_changed(SRC / "stories" / f"{slug}.html")))

    urls = "\n".join(f"  <url><loc>{url_for(n)}</loc><lastmod>{d}</lastmod></url>"
                     for n, d in sorted(built, key=lambda b: (b[0] != "index", b[0])))
    (OUT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "\n</urlset>\n", encoding="utf-8")
    print(f"Built {len(built)} pages into {OUT}")


if __name__ == "__main__":
    main()
