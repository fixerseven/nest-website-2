# Nest 2.0 website

Static site patterned on WeWork: announcement bar, photo hero with a booking card, stories, feature sections, stats band, lead form and FAQ.

The home page splits visitors into two ways in, as sections of the same page:
- `#community` (Nest Community): saturated rounded-square tiles on near-black, for day passes, students and freelancers.
- `#business` (Nest for Business): calm oat band with one large photo, for memberships, offices, meeting rooms, studios and venues.

Shape language is squares and rounded squares (no arches or round bullets). Visual references are in `docs/references/`.

## Deploy (after Nath approves the preview)
From this folder, on a computer logged in to Cloudflare:

    npx wrangler deploy

That publishes the `public/` folder as the Worker `nest-workspaces`. It first goes live at a workers.dev address for checking.
Connect nestworkspaces.com and www only after the domain's DNS has moved to Cloudflare. Copy the Google Workspace MX records and the POS records first; the move is described in the Nest 2.0 Relaunch Plan.

## Before going live
- Confirm prices flagged in the plan: Flexi 15-Day Pass, dedicated desks, Flexi validity, Studio 3 minimum, Amphitheater, Podcast Studio.
- The Founding Flock banner (index.html, coworking.html) and Christmas at Nest (events.html) are marked with HTML comments. Remove them if they're not approved.
- Add the Meta Pixel and GA4 IDs where the commented placeholders are.
