# OSGL Developers — Project Portfolio

A fast, fully static, WhatsApp-first website for **OSGL Developers**, an authorised channel partner for residential projects in North Bengaluru.

The site is now **four pages**:

| Page | URL | Purpose |
| --- | --- | --- |
| OSGL hub | `/` | Brand home + portfolio of Project A / B / C |
| Project A | `/godrej-msr-city/` | Godrej MSR City, Shettigere |
| Project B | `/project-b/` | Branded “coming soon” placeholder |
| Project C | `/project-c/` | Branded “coming soon” placeholder |

Every project page is intentionally short: a hero, a compact fact strip, price + blurred floor-plan teasers, location/gallery, and a final WhatsApp CTA. Project B and C are real pages but marked `noindex` until their details are announced.

No framework, no CMS, no build step and no backend. All enquiries go to **WhatsApp +91 89711 81288**.

---

## 1. Preview locally

```bash
cd Osgl
python3 -m http.server 8080
```

Open <http://localhost:8080>. The project switcher, map and WhatsApp links need an internet connection.

Any static server works.

---

## 2. Structure

```
Osgl/
├── index.html                     OSGL hub
├── godrej-msr-city/index.html     Project A
├── project-b/index.html           Project B placeholder
├── project-c/index.html           Project C placeholder
├── 404.html
├── assets/
│   ├── css/styles.css             the shared design system
│   ├── css/fonts.css              self-hosted Cormorant + Manrope
│   ├── fonts/
│   ├── img/                       high-rise WebP set, blurred plan SVGs, OG cards
│   └── js/main.js                 project switcher, mobile menu, sticky CTA bar
├── scripts/build-images.sh        optional image re-processing pipeline
├── robots.txt
├── sitemap.xml                    hub + Project A only (B/C are noindex)
├── site.webmanifest
├── _headers                       Cloudflare cache + security headers
├── wrangler.jsonc                 Cloudflare Workers static-assets config
└── CREDITS.md
```

### Page model

- **Project switcher**: a native `<details>` menu in the header, present on every page. It lists Project A / B / C and “View all projects”, with the current project marked.
- **Project A** is the flagship: 62-acre township, G+15 towers, 2 & 3 BHK, price list, blurred 2 BHK / 3 BHK / master-plan teasers, gallery strip, location and map.
- **Project B / C** are designed placeholders with a “coming soon” badge, three TBA facts, a blurred plan teaser and a register-interest CTA. They are `noindex, follow` until real details are added.
- **Enquiry path**: every header, hero, price row, plan card, location and footer CTA is a contextual `wa.me` link. There is no form and no server-side data collection.

---

## 3. Deploy to Cloudflare

The repo is configured as a **static-assets Worker** (the current deployment is `osgl.reddyarambhumi.workers.dev`).

```bash
cd Osgl
npx wrangler login          # once
npx wrangler deploy
```

`.assetsignore` keeps `.git`, `.cache`, `scripts`, the README and old source files out of the upload.

Then attach the domain:

1. **Cloudflare → Workers & Pages → `osgl` → Settings → Domains & Routes**.
2. Add `osgldevelopers.com`.
3. Add `www.osgldevelopers.com` and redirect `www` → apex with a Cloudflare Redirect Rule.
4. If DNS is already in the same Cloudflare account, Cloudflare adds the required record automatically.

### Cloudflare Pages alternative

- **Workers & Pages → Create → Pages → Connect to Git**.
- Select `RedsAnalysis/Osgl`.
- Framework preset: **None**. Build command: empty. Output directory: `/`.
- Add `osgldevelopers.com` under **Custom domains**.

### After deploying

- Purge the Cloudflare cache for the changed files.
- Test all four pages and the WhatsApp links on a real phone.
- Submit `https://osgldevelopers.com/sitemap.xml` in **Google Search Console**.
- Optional: add cookie-free Cloudflare Web Analytics before `</body>` on each page. No analytics is installed.

---

## 4. Editing the site

### Phone / WhatsApp number

The number is hard-coded in all four HTML files. Search for:

- `8971181288` — `tel:` and `wa.me` links
- `89711&nbsp;81288` — visible numbers

Keep the international format `+918971181288` in links.

### Project switcher

Each page has a `<details class="project-switcher">` block. To rename or reorder projects:

1. Update the summary badge/name on each page.
2. Update the three `.ps-item` links in the panel.
3. Update the mobile menu’s `.mobile-project` links.
4. Update the footer’s project links.

### Project B and C

They are deliberate placeholders. Replace the name, hero image, copy and metadata when the real project is announced. Before launch:

- Replace `Project B` / `Project C` in the title, H1, switcher, footer and JSON-LD.
- Add the real location, configurations, price, RERA number and floor plans.
- Remove `<meta name="robots" content="noindex, follow">` and add the page to `sitemap.xml`.
- Replace the blurred plan SVG with the official plan (or keep it as a teaser).
- Use legally approved project imagery.

### Prices / configurations

In `godrej-msr-city/index.html`, search for `class="price-row"`. Each row contains the type, size, price and a pre-filled WhatsApp link. The plan cards below are separate WhatsApp links.

### Floor plans

The three blurred files are **representative, custom-drawn SVG layouts**, not the actual project plans:

- `assets/img/plan-2bhk.svg`
- `assets/img/plan-3bhk.svg`
- `assets/img/plan-master.svg`

They are blurred in CSS and labelled representative. Replace them with the developer’s official plans when available, then adjust the blur/overlay in `.plan-visual img` if you want the real plan to be readable.

### Images

The current set is high-rise stock photography (3 Pexels sources) plus a pool and an interior (Unsplash). All sources are 4K and are exported as responsive WebP at multiple widths.

Regenerate:

```bash
./scripts/build-images.sh
```

To use official project renders, replace the files in `assets/img/` with the same names/dimensions, or update the `srcset` lists in the HTML. Keep the representative-imagery disclaimer while stock images are in use.

---

## 5. Before going live — verify these

These were carried over from the previous page / project reference. Confirm them with the developer’s current cost sheet before publishing:

- **Land parcel: 62 acres** — used throughout this build (the previous page said 17).
- **G+15 towers** — ground plus 15 floors.
- **1,961 residences** — confirm whether this is the phase or the whole township.
- **RERA registration:** `PRM/KA/RERA/1250/303/PR/020626/006644` (BARCA AT GODREJ MSR CITY). The competitor page lists a different number, so verify the current registration on [rera.karnataka.gov.in](https://rera.karnataka.gov.in).
- **Prices:** 2 BHK ₹1.59 Cr*, 2 BHK Luxe ₹1.79 Cr*, 3 BHK + 2T Premium ₹2.32 Cr*, 3 BHK Grand ₹2.56 Cr* (1,930 sq.ft. on this page; the competitor lists 1,390 sq.ft.), 3 BHK Luxe ₹2.99 Cr*.
- **Possession:** 2030 onwards for selected residences.
- **Channel-partner authorisation:** keep the authorisation on file and keep the “not the official developer website” disclaimer.
- **Imagery:** all current photographs are representative stock. Replace with approved project renders before presenting them as the project.
- **Project B/C:** no names, prices, locations or RERA numbers have been invented. Keep them as placeholders until confirmed.

The footer carries the RERA line, channel-partner disclaimer, representative-imagery note and price disclaimer. Update them when details change.

---

## 6. SEO

- Hub and Project A are indexable, with unique titles, descriptions, canonical URLs, OG/Twitter cards and JSON-LD (`RealEstateAgent` + `ItemList`; `ApartmentComplex` + `Offer` + `BreadcrumbList`).
- Project B/C are `noindex, follow` and excluded from `sitemap.xml`.
- The project switcher uses real `<a>` links, so projects are discoverable.
- The map is a lazy Google Maps iframe; no API key is required for the basic embed.

---

## 7. Performance notes

- Hero images are preloaded with `imagesrcset`/`imagesizes`; the same portrait crops are reused for cards.
- Below-the-fold images are lazy-loaded with explicit dimensions.
- Fonts are self-hosted and preloaded; only Latin subsets are used (the rupee sign falls back to Manrope).
- CSS/JS are small and cacheable; Cloudflare Brotli/HTTP3 compresses the HTML/CSS further.
- No third-party JS, no analytics, no cookies set by the site itself (the Google Maps iframe has its own behaviour).

---

## 8. Credits

See [CREDITS.md](CREDITS.md) for photography sources and font licences.
