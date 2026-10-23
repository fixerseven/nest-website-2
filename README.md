# Nest 2.0 website

Static site for Cloudflare Workers (static assets). No build step.

## Deploy (after Nath approves the preview)
From this folder, on a computer logged in to Cloudflare:

    npx wrangler deploy

That publishes the `public/` folder as the Worker `nest-workspaces`. It first goes live at a workers.dev address for checking.
Connect nestworkspaces.com and www only after the domain's DNS has moved to Cloudflare. Copy the Google Workspace MX records and the POS records first; the move is described in the Nest 2.0 Relaunch Plan.

## Before going live
- Confirm prices flagged in the plan: Flexi 15-Day Pass, dedicated desks, Flexi validity, Studio 3 minimum, Amphitheater, Podcast Studio.
- The Founding Flock banner (index.html, coworking.html) and Christmas at Nest (events.html) are marked with HTML comments. Remove them if they're not approved.
- Add the Meta Pixel and GA4 IDs where the commented placeholders are.
