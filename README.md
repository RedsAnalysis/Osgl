# OSGL Developers — Four-Project Portfolio

A fast, fully static, WhatsApp-first website for **OSGL Developers**, an authorised channel partner for residential projects in North Bengaluru.

The site now has **five pages: one hub and four project pages**.

| Page | URL | Project |
| --- | --- | --- |
| Hub | `/` | Four-project portfolio |
| A | `/godrej-msr-city/` | Godrej MSR City |
| B | `/project-b/` | Embassy Greenshore |
| C | `/project-c/` | Brigade Insignia |
| D | `/project-d/` | TVS Emerald Altura |

Every project page uses the same short template: hero → quick facts → price/plans → gallery → location → WhatsApp CTA. Prices are **on request** for Embassy, Brigade and TVS; Godrej keeps the existing starting prices. **No prices for the three new projects are published on the page** — every price row and CTA goes to a project-specific WhatsApp message.

No framework, no CMS, no build step and no backend. All enquiries go to **WhatsApp +91 89711 81288**.

---

## 1. Preview locally

```bash
cd Osgl
python3 -m http.server 8080
```

Open <http://localhost:8080>. The project switcher, maps and WhatsApp links need an internet connection.

---

## 2. Project data used

### A · Godrej MSR City — Shettigere
- 62-acre township · G+15 towers · 1,961 homes · 2030 possession.
- 2 BHK 1,200 sq.ft. ₹1.59 Cr* · 2 BHK Luxe 1,350 ₹1.79 Cr* · 3 BHK + 2T Premium 1,750 ₹2.32 Cr* · 3 BHK Grand 1,930 ₹2.56 Cr* · 3 BHK Luxe 2,275 ₹2.99 Cr*.
- RERA: `PRM/KA/RERA/1250/303/PR/020626/006644`.
- Hero image replaced with a residential community/pool image (Option B).

### B · Embassy Greenshore — Embassy Springs, Devanahalli
- 288-acre Embassy Springs township · 14-acre enclave · 8 towers · **878 homes** · 3.6-acre central park.
- 2, 3 & 4 BHK. 3 BHK 1,750–1,838 sq.ft. · 4 BHK 2,341–2,577 sq.ft.
- RERA: `PRM/KA/RERA/1250/303/PR/201125/008265`.
- Price and possession: **on request** via WhatsApp.

### C · Brigade Insignia — Yelahanka
- 6 acres · 6 towers · **430 homes** · **3B + S + 18 floors** · low-density.
- 3 BHK 2,145 · 3.5 BHK 2,481 · 4 BHK 3,066 · 5 BHK 4,137–5,827 sq.ft.
- RERA: `PRM/KA/RERA/1251/309/PR/180524/006894`.
- Price, offer and possession: **on request** via WhatsApp. The ₹3.89 Cr / ₹6.99 Cr / 50:50 details are intentionally **not published** on the page.

### D · TVS Emerald Altura — Sathanur
- 10.06 acres · 12 towers · **2B + G + 12** · **975 homes** · 71% open space · two clubhouses totalling **29,000+ sq.ft.** · 35+ amenities.
- 2 BHK 2T 1,110–1,223 · 3 BHK 2T 1,510–1,588 · 3 BHK 3T 1,892–2,123 sq.ft.
- RERA: `PRM/KA/RERA/1251/309/PR/040426/008572`.
- Price and possession: **on request** via WhatsApp.

The project names, configurations, tower counts and RERA numbers were taken from the supplied brochures/brief. **Please verify every RERA number on [rera.karnataka.gov.in](https://rera.karnataka.gov.in) and confirm the final unit counts before publishing.**

---

## 3. Images and floor plans

The four project pages use **developer brochure renders** supplied by the client, who confirmed permission to reuse them:

- **Embassy Greenshore:** tower/lake hero, aerial community, central-park pavilion, interior, 3 BHK/4 BHK plans and master plan from the Embassy Greenshore brochure.
- **Brigade Insignia:** tower/garden hero, pool/clubhouse, interiors, family room, 3 BHK/4 BHK plans and master plan from the Insignia deck.
- **TVS Emerald Altura:** tower hero, pool, grand entrance, family lifestyle, 2 BHK/3 BHK plans and master from the TVS Altura/Sathanur decks.
- **Godrej:** new residential community + pool hero image from Unsplash; existing representative pool/interior gallery and representative SVG plans retained.

All brochure images are labelled **“Artist’s impression · representative”** and the footer carries the developer/representative-imagery disclaimer. Replace any image with an approved final render when the developer supplies one.

The floor plans are **blurred** in CSS for privacy; the full plans are sent on WhatsApp. The Godrej 2/3 BHK and master plans remain representative SVG drawings, not official plans.

---

## 4. Structure

```
Osgl/
├── index.html                     four-project hub
├── godrej-msr-city/index.html     Project A
├── project-b/index.html           Embassy Greenshore
├── project-c/index.html           Brigade Insignia
├── project-d/index.html           TVS Emerald Altura
├── 404.html
├── assets/
│   ├── css/styles.css
│   ├── css/fonts.css
│   ├── fonts/
│   ├── img/                       heroes, galleries, plan crops, OG cards
│   └── js/main.js                 switcher, mobile menu, sticky CTA bar
├── scripts/build-images.sh        optional image processing pipeline
├── robots.txt
├── sitemap.xml                    five indexable URLs
├── site.webmanifest
├── _headers
├── wrangler.jsonc
└── CREDITS.md
```

### Navigation
- Project switcher in the header on every page: **A Godrej · B Embassy · C Brigade · D TVS**.
- Mobile menu includes all four projects and the on-page links.
- Footer lists all four projects.
- All four project pages are indexable and included in `sitemap.xml`; the old placeholder `noindex` has been removed.

### Enquiry routing
Every enquiry link is a `wa.me` link to **+91 89711 81288** with a message naming the project. This includes header, hero, quick strip, price rows, plan cards, location, final CTA, footer and mobile/float buttons. There is no form and no server-side data collection.

---

## 5. Deploy

```bash
cd Osgl
npx wrangler login
npx wrangler deploy
```

The Worker is configured in `wrangler.jsonc` as `osgl` with static assets. Add `osgldevelopers.com` under **Workers & Pages → osgl → Settings → Domains & Routes** if it is not already attached.

After deploying:
- Purge the Cloudflare cache.
- Test all five pages and every WhatsApp link on a phone.
- Submit `https://osgldevelopers.com/sitemap.xml` in Google Search Console.

---

## 6. Before go-live — verify

- **Godrej:** 62 acres, G+15, 1,961 homes, 2030, the five prices and RERA `PRM/KA/RERA/1250/303/PR/020626/006644`. The 3 BHK Grand is shown as 1,930 sq.ft. from the previous page; a competitor lists 1,390 sq.ft., so verify that unit size before publishing.
- **Embassy:** 288-acre township, 14-acre enclave, 8 towers, 878 homes, 3.6-acre park, 3 BHK/4 BHK sizes, RERA `PRM/KA/RERA/1250/303/PR/201125/008265`.
- **Brigade:** 430 homes (from the brief, not explicit in the deck), 3B+S+18 floors, unit sizes, RERA `PRM/KA/RERA/1251/309/PR/180524/006894`. Price/offer and possession to be confirmed on WhatsApp only.
- **TVS:** 10.06 acres, 12 towers, 975 homes, 2B+G+12, 29,000+ sq.ft. clubhouses, unit sizes, RERA `PRM/KA/RERA/1251/309/PR/040426/008572`.
- **Images:** confirm each developer’s current approval for web use; all renders are artist’s impressions.
- **Prices:** Embassy, Brigade and TVS are deliberately “Price on request”. If you later publish a price, update the price rows, disclaimers and JSON-LD together.

---

## 7. Credits

See [CREDITS.md](CREDITS.md).
