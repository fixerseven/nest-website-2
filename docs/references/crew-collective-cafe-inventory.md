# Crew Collective & Café — site inventory (EN)

Source: https://crewcollectivecafe.com/en/ · scraped 2026-10-27 with Firecrawl
Covers the structure, facts, links and assets of the site. Body copy is summarised, not copied. For a full offline copy, run `../download-sites.sh`.

## Platform & third-party tools

| What | Detail |
| --- | --- |
| CMS | WordPress, custom theme `crewcollective` |
| Languages | WPML, EN at `/en/…`, FR at the root (`/crew/`, …) |
| Analytics | Site Kit by Google |
| Forms | Gravity Forms with an appointment-booking add-on (event visit and membership tour forms) |
| Brunch reservations | OpenTable (restRef 1523944) |
| Room, desk and virtual-office booking | Archie: `archieapp.co/crew-collective-cafe-1/public/…` |
| Online ordering | Koomi: `order.koomi.com/crew-collective-cafe-8erOozBrrP/en` |

## Brand tokens

- Background `#F7F6F1` (warm off-white), text `#181818`
- Font: Inter for headings and body
- Firecrawl's detected blues (`#3898EC`, `#0082F3`, `#2D40EA`) have low confidence (0.46 overall) and look like framework defaults. Check them before using.
- Logos: `wp-content/themes/crewcollective/assets/images/logo-long.svg`, `logo-short.svg`, `dark-arrow.svg` (CTA arrow); favicon/sigle `wp-content/uploads/2024/01/cropped-crew-sigle-{32x32,180x180,270x270}.png`
- Recurring tagline (top and bottom of the page): "— In striving forward must come a time where harmony binds progress and the classics from which they came."
- Section headings often split over two lines ("Become / a member 24/7"), and labels end with an em-dash ("CREW ⏤", "Café ⏤").

## Key business facts

- **Address:** 360 Saint-Jacques, Old Montreal. The building is the former Royal Bank of Canada head office, built in 1926 according to the Main Venue blurb.
- **Brunch:** daily, 9 AM–3 PM, booked through OpenTable
- **Café:** open 7 days; claims a 15-minute maximum wait; coffee from Traffic Coffee (Montreal roaster)
- **Café partners:** Fairmount Bagel, Traffic Coffee, Aube Boulangerie, Hof Kelsten, Briz
- **Member perk:** 20% off at the café
- **Live counters on /collective/:** 3 desks remaining, 114 active members
- **Booths:** 9 luxury booths, 3–6 people each
- **Members' meeting rooms:** 6–8 people, with whiteboard
- **Conference room:** on the mezzanine, 12+ people

### Membership pricing (/collective/memberships/)

| Plan | Price | Notes |
| --- | --- | --- |
| Floating Desk | $300/month | Access to the floating work area |
| Dedicated Desk | $675/month | 24/7 members' area, private events, 160 booking credits |
| Private Offices | from $6,000/month | On the mezzanine |
| P.O. Box (virtual) | $50/month | Mailing address only |
| Full Service Plan (virtual) | $80/month | Business address, mail, print, scan, copy, shred |
| Executive Office Plan (virtual) | $105/month | Full Service plus 40 meeting-room credits |

### Event spaces (/crew/)

| Space | URL | Summary |
| --- | --- | --- |
| Main Venue | /en/crew/main-venue/ | Former bank HQ hall: restored marble floor, painted-plaster ceiling, brass fixtures |
| East Wing | /en/crew/east-wing/ | Ground floor beside a 30 ft window; cocktails, presentations, shoots |
| West Wing | /en/crew/west-wing/ | The most intimate ground-floor area; banquets, happy hours |
| Balconies | /en/crew/balconies/ | East and west landings over the main staircase, behind locking glass doors |
| Zen Room | /en/crew/zen-room/ | The former bank president's office; dark wood and a skylight |
| Conference Rooms | /en/crew/conference-rooms/ | South-facing mezzanine rooms with locking glass doors |
| South Lounge | /en/crew/rear-room/ | The largest open area, with big south windows |

The event enquiry form offers these event types: corporate event, wedding, film production, photoshoot, other.

## Sitemap (EN)

✅ = scraped in this pass · ⬜ = found but not scraped yet

| | URL | Page title |
| --- | --- | --- |
| ✅ | /en/ | Crew Collective & Café – In striving forward… |
| ✅ | /en/crew/ | Crew – Crew Collective & Café |
| ⬜ | /en/crew/main-venue/ · east-wing/ · west-wing/ · balconies/ · zen-room/ · conference-rooms/ · rear-room/ | (space detail pages) |
| ✅ | /en/collective/ | Collective – Crew Collective & Café |
| ⬜ | /en/collective/booths/ · meeting-rooms/ · crew-suite/ · conference-room/ · floating-desks/ · dedicated-desk/ | (workspace detail pages) |
| ✅ | /en/collective/memberships/ | Memberships – Crew Collective & Café |
| ✅ | /en/cafe/ | Café – Crew Collective & Café |
| ⬜ | /en/about-us/ | About us |

Main navigation: Crew (Book your Next Event, Spaces) · Collective (Booths & Workspaces, Join the Crew) · Café (Order now) · Français · About us · Opening Hours (a Google Maps link)

## Page outlines

### Home — /en/
1. **Hero (Brunch):** brunch hours and location → **Reserve** (OpenTable)
2. Three-way tab nav: Crew / Collective / Café, plus the address link
3. **"Welcome to CC&C — Achieve more in a day":** intro to the heritage building, open to all
4. **Meeting rooms** card → **Book Now** (Archie book-a-room)
5. **Day pass** card → **Day Pass** (also points to Archie *book-a-room*)
6. **"Our famous café":** baristas and Traffic Coffee
7. **Signature drink: Latte Dulce de Leche** → **Order Online** (Koomi product)
8. **"Become a member 24/7"** → **Memberships**
9. Tagline, then **Visit Us** (Google Maps)

### Crew (events) — /en/crew/
1. **Hero "CREW ⏤" (Private events)** → Spaces for Rent (#spaces)
2. **Corporate Events:** galas, cocktails, meetups, holiday parties → Plan your event (#book)
3. **"Perfect for your vows"** (weddings) → #book
4. **Available spaces:** "Book a visit" (free tour) followed by the 7 space cards listed above
5. **Business Gatherings** (recent event) → Host an Event
6. **"Visit our installations" form:** name, email, phone, contact preference (visit or call), budget, language, event type, guest count, preferred room, referral source, description, date. It embeds booking widgets titled "Visite des lieux" (1 h) and "Appel téléphonique" (1 h).
7. Footer CTA trio: Book (Crew) / Rent (Collective → Archie FR) / Order (Café → Koomi FR)
8. Footer: © 2026 CC&C, About us, czroArtsClub link

### Collective (coworking) — /en/collective/
1. **Hero "Semi-private haven" (Booths)** → Reserve a Booth (Archie)
2. Counters: 3 remaining desks, 114 active members
3. **"Work at CC&C — As guest or member":** anchor tabs for Day Pass, Booth, Meeting Room, Crew Suite, Conference Room, Virtual Office, Floating Desk, Dedicated Desk
4. **RENT ⏤ (Join the Crew)** → Book a Room
5. A card per product, each with booking and More Info links:
   - Day Pass → Archie *fr* book-a-desk
   - Booth → /collective/booths/
   - Meeting Room ("Rent a Meeting Desk") → /collective/meeting-rooms/
   - Crew Suite → /collective/crew-suite/
   - Conference Room (three private rooms above the vaulted ceiling) → /collective/conference-room/
   - Virtual Office (Old Port address) → Memberships
   - Floating Desk → /collective/floating-desks/
   - Dedicated Desk → /collective/dedicated-desk/
6. **"Privatize CC&C":** events teaser
7. **"Access the Zen Room"** → /crew/zen-room/
8. **"Become a member 24/7"** → Memberships

### Memberships — /en/collective/memberships/
1. Counters: 7/7 open, 15 minutes maximum wait
2. **"Become a member"** → Apply Now (#apply)
3. **Benefits for members:** café discount, Zen Room, meeting rooms for 6–8, semi-private rooms, a fully furnished kitchen with Breville appliances and free coffee
4. **Physical offices:** Floating / Dedicated / Private (see pricing table)
5. **Virtual offices:** P.O. Box / Full Service / Executive (→ Archie store/plans)
6. **Conference Room ⏤ (Productivity):** 12+ people → Book a Room
7. **"Join the crew" application form:** name, email, language, membership type, visit date (embedded "Visite des espaces de travail", 30 min), comments

### Café — /en/cafe/
1. **Hero "Café ⏤" (signature drinks)** → Order Online (Koomi)
2. Counters: 7/7, 15 minutes maximum wait
3. **"The best of the best":** baristas and Traffic Coffee, then the partner logo strip (5 partners)
4. **"Our favorites"** (6 items, each linking to Koomi): Latte Dulce de Leche, Cappuccino, Matcha Latte, Focaccia Sandwiches, Smoked Salmon Bagel, Chocolate Banana Bread
5. Long brand paragraph ("CC&C Est. 1920") about the historic café, marked up as an H1
6. **"Members' privileges — Get 20% off"** → Memberships

## Observations (useful for an audit or redesign)

- **Possible SEO blocker:** the scrape returned `robots: noindex,nofollow` for **/en/crew/** and **/en/collective/memberships/**, the two main conversion pages. Both pages embed the booking widget, which may be where the tag comes from (the metadata also showed duplicate `viewport` tags). If the tag is in the page `<head>`, Google will drop those pages, so check it in the page source.
- **Language mix-ups on the EN site:** footer Rent/Order links and the Day Pass link go to the **French** Archie and Koomi pages. Form dropdowns ("Salle Sud", "Balcon", "À Discuter") and booking widget titles are in French.
- **Inconsistent facts:** the café says "Est. 1920" but the Main Venue text says the building dates from 1926.
- **Typos** in the café H1 paragraph: "hearth of old Montreal" (should be heart) and "invites ou" (should be you). The paragraph is also the page's H1, which hurts SEO and accessibility.
- **Wrong product link:** on the café page, favourite #1 "Latte Dulce de Leche" links to the plain latte (`latte-12oz-5`). The homepage links the correct item (`dulce-de-latte-12oz-2731`).
- **Repeated blurbs on /collective/:** Day Pass, Booth and Dedicated Desk share one blurb, and Meeting Room, Crew Suite and Floating Desk share another. The Meeting Room CTA reads "Rent a Meeting Desk".
- **Wrong booking type:** the homepage "Day Pass" CTA goes to Archie *book-a-room*, not *book-a-desk*.
