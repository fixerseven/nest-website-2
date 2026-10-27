# The Work Project (Singapore) — site inventory

Source: https://theworkproject.com/sg · scraped 2026-10-27 with Firecrawl
Covers the structure, facts, links and assets of the site. Body copy is summarised, not copied. For a full offline copy, run `../download-sites.sh`.

## Platform & stack

| What | Detail |
| --- | --- |
| Backend | Ruby on Rails (`authenticity_token` CSRF meta tags) |
| Frontend | Vite-built assets (`/vite/assets/…`), Tailwind CSS (according to Firecrawl's detection) |
| Images | S3 buckets `twp-production` **and `twp-staging`** (ap-southeast-1), plus CloudFront (`d1jon7yhqgd8mo`, `d2dvdwsn4l86jk`) |
| Amenity icons | `/assets/revamp/amenities_icon/*.svg` (Rails asset pipeline) |

## Brand tokens

- **Primary:** `#C36D15` (copper/amber). Bullets use `#A85A10`, icon accents `#E4A666`, light accent `#EFE2D2`.
- **Text:** `#2E2E2E` (arrows/icons) and `#44403B` (secondary buttons). Secondary button border: `#D6D3D1`.
- **Background:** `#FFFFFF`
- **Fonts:** headings in **Domaine** (serif, falling back to Georgia/Times); body in the system sans stack
- **Buttons:** pill-shaped. The primary button is solid copper with white text; the secondary is transparent with a stone border. Inputs are rounded at 70px.
- **Logos:** `https://theworkproject.com/vite/assets/twp_logo_white-KYXzmFUp.svg`, favicon `/favicon.png`, and the Bridge+ partner logo `/vite/assets/bridge-plus-wBb_zS2O.png`
- **Tone:** professional and hospitality-led ("conceived by hoteliers"); copy is heavy on SEO keywords ("coworking space", "shared office space for rent")

## Key business facts

- Founded 2016, backed by CapitaLand. Says it is "Singapore's largest premium serviced office operator", with **11 locations and 141,000 sq ft**.
- Markets in the location picker: Singapore, Sydney, Perth, Brisbane, Melbourne, London
- Design partners mentioned: HASSELL (studio), Patrick Blanc (vertical gardens), Gallery HUUE (art). Has a Forbes "most beautiful coworking" mention.
- MARK Lounge: a members-only business club
- Sales email: sales.sg@theworkproject.com

### Pricing (as listed)

| Product | Price |
| --- | --- |
| Day Pass | $60/day (Mon–Fri, 9am–6pm) |
| Hot Desk membership | from $408/month |
| Dedicated Desk | from $750/month |
| Private Office | from $650/desk/month (Standard). Elsewhere "from $800/month" |
| Virtual Office | from $85/month |
| Enterprise Office | on request |

Office rate table (/sg/office):

| Team size | Office type | From | Includes |
| --- | --- | --- | --- |
| 1–5 pax (80–250 sq ft) | Small Private Office | $800/month | rent, Wi-Fi, utilities, cleaning, reception, mail, 10 meeting-room credits/month |
| 5–10 pax | Standard Office | $4,000/month | the above, plus a phone line and 20 credits/month |
| 10–15 pax | Standard Office | $8,000/month | the above, plus priority event-space booking |
| 15–20 pax | Enterprise Office | $12,000/month | the above, plus custom layout and branded signage |
| 20+ pax | Enterprise Office | $16,000/month | full custom fit-out, reception, private pantry, IT |

### Meeting-room products (/sg/meeting-rooms)

| Type | Capacity | Rental |
| --- | --- | --- |
| Meeting Rooms | up to 12 pax. 4-pax rooms are free for members; 1–2 pax phone booths | hourly / daily |
| Boardrooms | "up to 24 pax" (bullets say 12–16) | hourly / daily |
| Conference Rooms | 10+ pax, custom layout | half day / full day |
| Event Venues | off-sites, conferences | half day / full day |

Policies: full refund for cancellations made more than 24 h ahead; standard hours 9:00–18:00, Mon–Fri; catering costs extra.

### Locations (11)

| # | Location | Address | Area | Notes |
| --- | --- | --- | --- | --- |
| 1 | OUE Downtown Gallery | 6A Shenton Way, Levels 4 & 5, S068815 | Tanjong Pagar | |
| 2 | 6 Battery Road | 6 Battery Road, Levels 7, 6 & 3, S049909 | Raffles Place | |
| 3 | Bugis | 600 North Bridge Rd, Level 10, Parkview Square, S188778 | Bugis | Level 7 "New Opening" campaign |
| 4 | Capital Tower | 168 Robinson Rd, Levels 20, 19 & 12, S068912 | Tanjong Pagar | |
| 5 | Asia Square | 12 Marina View, Levels 11 & 10, Asia Square Tower 2, S018961 | Marina Bay | |
| 6 | Great World City | 1 Kim Seng Promenade, Level 11, East Tower, S237994 | "Orchard" | |
| 7 | CapitaGreen | 138 Market Street, Levels 6 & 5, S048956 | Raffles Place | |
| 8 | CapitaSpring | 88 Market Street, Levels 40, 39 & 21, S048948 | Raffles Place | 66,000 sq ft; designed with HASSELL |
| 9 | CapitaSky | 79 Robinson Road, Levels 7, 6 & 2, S068897 | Tanjong Pagar | Operated by Bridge+ |
| 10 | Ascent | 2 Science Park Drive, #01-08, S118222 | Science Park | Operated by Bridge+ |
| 11 | Geneo | 1A Science Park Drive, Levels 1 & 2, S119314 | Science Park | Operated by Bridge+ |

## Sitemap (/sg)

✅ = scraped in this pass · ⬜ = found but not scraped yet

| | URL | `<title>` |
| --- | --- | --- |
| ✅ | /sg | Coworking Space & Shared Office Space Singapore \| Workspace |
| ✅ | /sg/office | Single Small Private Office Space for Rent in Singapore |
| ✅ | /sg/desk | Hot Desk Office & Dedicated Desk Space Rental in Singapore |
| ✅ | /sg/virtual-office | Virtual Office Address For Rent In Singapore |
| ✅ | /sg/meeting-rooms | Meeting Rooms For Rent \| Hourly Meeting Room Rental |
| ⬜ | /sg/event-spaces | — |
| ✅ | /sg/locations | Best Coworking Spaces In Singapore By The Work Project |
| ✅ | /sg/capitaspring | Raffles Place Coworking \| The Work Project CapitaSpring |
| ⬜ | /sg/oue-downtown-gallery · 6-battery-road · bugis · capital-tower · asia-square · great-world-city · capitagreen · bridge+-capitasky · bridge+-ascent · bridge+-geneo | (location pages, same template as CapitaSpring) |
| ⬜ | /campaign/promotion-parkview-square-l7 | Parkview Square L7 campaign |
| ⬜ | /blog (global, not SG-specific) | — |

## Page outlines

### Home — /sg
1. **Hero:** "Make it your own" with a location search (6 markets)
2. **H1:** coworking and shared office space in Singapore. Intro on CBD locations and flexible plans with no long leases.
3. Trust ticker: premium locations, CapitaLand-backed, Forbes-recognised design, teams of 1–300+
4. **"Shared office space for rent":** 4 product cards (Private Offices from $800/month, Hot/Dedicated Desks from $60/day or $408/month, Virtual Offices from $85/month, Meeting Rooms), each with an explore CTA
5. **"Who is coworking ideal for?":** 3 personas (Startups 1–5, SMEs 5–15, Enterprise 15–300+)
6. **"Workspace for rent by team size":** tabs for 1–5, 5–10, 10–15 and 15–20 pax
7. **Membership plans:** 5 pricing cards (Day Pass, Full-Time Hot Desk, Dedicated Desk, Private Office, Enterprise), followed by day-pass and monthly-membership explainers
8. **"10 coworking spaces in Singapore":** location carousel → View all
9. **About:** founded 2016, 11 locations, 141k sq ft
10. **"The TWP Distinction":** 8-card carousel (prime locations, landlord partnerships, hospitality, MARK Lounge, meeting and event venues, premium buildings, community, flexible terms)
11. Member testimonial, then "In the news" (EdgeProp, Lifestyle Asia)
12. Latest 3 blog posts
13. **FAQ** (8 questions: cost, one-day rental, coworking vs shared office, enterprise suitability, security, switching locations, extra charges, trial passes)
14. Contact CTA

### Private Offices — /sg/office
H1 on private office rental → usage bullets (Grade A buildings, custom fit-out, all-inclusive pricing) → **Standard Office** (from $650/desk/month; 1–5, 5–10 and 10–15 pax tiers) → **Enterprise Office** (15–300+, pricing on request, custom fit-out and branding) → amenities list (7) → locations grouped by district (Raffles Place, Marina Bay, Tanjong Pagar, Bugis, Science Park, Orchard) → rental by team size → **rate table** → "Why choose" carousel (4 cards) → 3-step "How to rent" (tour, choose, move in) → FAQ (10 questions, including a serviced-office vs traditional-lease comparison table)

### Hot & Dedicated Desk — /sg/desk
H1 → 3 accordion USPs → **Hot Desk** card ($60/day or $408/month) → **Dedicated Desk** card ($750/month) → shared amenities (9) → pricing trio (Day Pass, Hot Desk, Dedicated) → location carousel → client meeting rooms (2–20 pax) → personas (startups, freelancers, corporates) → testimonial → "Why choose" carousel (6) → 3 steps → **Hot vs Dedicated comparison table** → FAQ (12 questions)

### Virtual Office — /sg/virtual-office
H1 → highlights (address, individuals or companies, mail handling, optional call answering) → location carousel → "Why choose" carousel (quick setup, premium address, meeting-room use, dedicated phone number, mail forwarding) → 4 benefits → 3 steps → FAQ (7 questions, covering ACRA registered-address eligibility, phone number, receptionist and using the address on a website)

### Meeting Rooms — /sg/meeting-rooms
H1 → intro bullets → 4 room types (see table) → location carousel ("network of 10") → hourly vs day rental → facilities carousel (technology, comfort, convenience, support) → 3 steps → FAQ (6 questions: viewing, cancellation, AV costs, catering, hours, equipment)

### Locations — /sg/locations
Hero → location search → **"New Opening" banner for Parkview Square Level 7** (→ campaign page) → 11 location cards with addresses → General FAQ (workspace types, membership benefits, extra fees, hours, global access)

### Location template (sample: /sg/capitaspring)
Gallery → name and address → 2 highlights (MRT access, signature suites) → 4 short sections (intro, location, design with HASSELL, workspace types) → **"Available Coworking Plans in Raffles Place"** (6 product cards: Standard Office 1–24 pax, Enterprise, Dedicated Desk, Hot Desk, Virtual Office, Meeting Rooms up to 16) → **Getting there** (map; MRT: Raffles Place EW14/NS26 3–5 min, Telok Ayer DT18 5–7 min, Maxwell TE18 10 min; bus stops 03021/03041/03071; car parks) → amenities (13) → FAQ (4 questions) → "Other locations" carousel

## Meta descriptions

| Page | Meta description |
| --- | --- |
| /sg | "…premium coworking spaces in Singapore. Rent shared office workspace across 11 CBD locations with flexible, all-inclusive plans." |
| /sg/office | "Private office rental in Singapore across 11 premium CBD locations. Fully furnished, all-inclusive, move-in ready. Flexible terms for teams of 1–300+ pax." |
| /sg/desk | "…flexible hot desk and dedicated desk coworking spaces in Singapore's CBD. Grade A buildings, 5-star amenities, no long-term contracts." |
| /sg/virtual-office | "…prime virtual office addresses in Singapore… dedicated phone number, call handling, and mail forwarding." |
| /sg/meeting-rooms | "…meeting rooms for rent in Singapore. Book hourly meeting room rentals for 4 pax or boardrooms for 12-16 pax." |
| /sg/locations | "…10 top coworking spaces in the CBD and other key business districts." |
| /sg/capitaspring | "…coworking spaces, serviced offices, and meeting rooms for rent in Raffles Place in a 66,000 sqft space." |

## Observations (useful for an audit or redesign)

- **Wrong city in copy:** the intro bullets on the /sg/meeting-rooms page talk about **Brisbane**.
- **Location count disagrees:** "10 coworking spaces" (home heading, meeting rooms, locations meta) vs "11 locations" (About, office page, home meta). The site lists 11 cards.
- **Pricing contradictions:** private office "from $650/desk/month" vs "from $800/month"; a desk-page testimonial mentions a "$50 day pass" while the listed price is $60.
- **Team-size ranges disagree:** Standard Office is "1 to 25", "1–15" or "1–24" depending on the page; the Enterprise heading says "more than 25 pax" while the copy below says "15 to 300+" and "10 pax and above".
- **Duplicate copy:** on /sg/office, the "Superior Quality Private Office" card repeats the "Highly Customisable Office Spaces" text word for word.
- **Typos:** "Singaporee" and a stray "office." fragment in the home FAQ; "Keep your business runnings smoothly" on /sg/office.
- **Outdated markets:** the locations FAQ mentions Hong Kong, but the location picker shows London and no Hong Kong.
- **Inconsistent links:** some go to `/meeting-rooms` and `/desk/` without the `/sg` prefix, and one goes to `/sg/parkview-square/` while the location page lives at `/sg/bugis`.
- **Staging bucket in production:** many images on the live site load from the `twp-staging` S3 bucket.
