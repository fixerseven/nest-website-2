# Nest 2.0 website

Static site for Nest Workspaces. Layout and UX follow Crew Collective & Café (crewcollectivecafe.com): full-bleed photo heroes with a small floating info card, a giant serif "nest" wordmark with the street address, photo and text grids with thin dividers, and a "Menu" button that opens a full-screen menu. Type and colour are Nest's own: Roboto Serif for headlines and prices, Poppins for everything else, on the off-white, petrol and orange palette. References are in `docs/references/`.

Page names and URLs are unchanged, plus a new Visit page (`visit.html`) where every "Book a tour" button now leads.

## Editing pages

Pages are generated. Edit the sources, then rebuild:

    python3 build.py

- `src/pages/*.html`: one file per page (home, coworking, meeting rooms, studios, events, stories, FAQ, visit, 404). Each starts with a comment block holding its title and description.
- `src/stories/*.html`: one file per story. The stories page and "More stories" are built from these.
- `build.py`: the shared head, top bar, menu and footer, and `public/sitemap.xml`.
- `public/assets/site.css` and `site.js`: styles and behaviour, edited directly.

Don't edit the `.html` files in `public/` by hand; the next build overwrites them.

## Deploy (after Nath approves the preview)
From this folder, on a computer logged in to Cloudflare:

    npx wrangler deploy

Cloudflare Workers Builds is connected to this repo, so every merge to main publishes the `public/` folder as the Worker `nest-website-2` by itself. The manual command above does the same from a computer logged in to Cloudflare.
Connect nestworkspaces.com and www only after the domain's DNS has moved to Cloudflare. Copy the Google Workspace MX records and the POS records first; the move is described in the Nest 2.0 Relaunch Plan.

## Before going live
- Confirm prices flagged in the plan: Flexi 15-Day Pass, dedicated desks, Flexi validity, Studio 3 minimum, Amphitheater, Podcast Studio.
- Exam Mode (src/pages/meeting-rooms.html) is marked with an HTML comment. Remove it if it's not approved.
- The Meta Pixel (dataset "Nest Walk-In Data") is in the shared head in build.py. It tracks PageView, Lead (an inquiry form is sent) and Contact (Messenger, phone or email link). Add the GA4 ID where the commented placeholder is.
