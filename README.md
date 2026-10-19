# OSGL Developers — Godrej MSR City

A fast, fully static landing page for **Godrej MSR City, Shettigere (North Bengaluru)**, built for OSGL Developers as an authorised channel partner.

The page is plain HTML, CSS and vanilla JavaScript. There is no framework, no build step and no backend. Leads are routed to WhatsApp on **+91 89711 81288**.

---

## 1. Preview locally

From this folder:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

Any static server works (`npx serve`, VS Code Live Server, etc.). The Google Map and WhatsApp links need an internet connection.

---

## 2. What's in the box

```
Osgl/
├── index.html                  the landing page
├── 404.html                    branded not-found page
├── assets/
│   ├── css/
│   │   ├── fonts.css           self-hosted @font-face declarations
│   │   └── styles.css          the complete design system
│   ├── fonts/                  Cormorant Garamond + Manrope (woff2)
│   ├── img/                    responsive WebP images, favicon, OG image
│   └── js/main.js              nav, gallery, filters, EMI, WhatsApp form
├── scripts/
│   └── build-images.sh         re-downloads and re-processes the stock image set
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── _headers                    Cloudflare cache + security headers
├── wrangler.jsonc              Cloudflare Workers static-assets config
└── CREDITS.md                  image + font sources
```

### Features

- Editorial, mobile-first design with a Mediterranean palette.
- Responsive 4K-sourced imagery, colour-graded for consistency, served as WebP at five widths.
- Sticky header, mobile drawer, scroll reveals, active-section navigation.
- Filterable 2 BHK / 3 BHK price list.
- Accessible image lightbox (keyboard arrows, Escape, focus management).
- Interactive EMI calculator with WhatsApp hand-off.
- Lead form that opens a pre-filled WhatsApp message (no backend required).
- UTM capture, so the WhatsApp message can include the lead source (e.g. `google / cpc / campaign`).
- SEO: canonical, Open Graph/Twitter cards, `ApartmentComplex` + `FAQPage` + `RealEstateAgent` JSON-LD, sitemap, robots.
- Accessibility: skip link, semantic landmarks, focus states, reduced-motion support, WCAG AA colour contrast.
- No cookies, no trackers, no third-party JS.

---

## 3. Deploy to Cloudflare

The repo is already configured for a **static-assets Worker** (this is how the current `osgl.reddyarambhumi.workers.dev` deployment runs).

### Option A — Workers (recommended, matches the current setup)

```bash
cd Osgl
npx wrangler login          # once
npx wrangler deploy
```

`wrangler.jsonc` uploads the whole folder, but `.assetsignore` excludes `.git`, `.cache`, `scripts`, the README and the old `banner.jpeg`.

Then attach the domain:

1. Open **Cloudflare dashboard → Workers & Pages → `osgl` → Settings → Domains & Routes**.
2. **Add custom domain** → `osgldevelopers.com`.
3. Add `www.osgldevelopers.com` too, and redirect `www` → apex with a Cloudflare Redirect Rule (or a Worker route).
4. If the DNS records are not already present, Cloudflare adds the required CNAME automatically when the domain is in the same account.

### Option B — Cloudflare Pages

1. **Workers & Pages → Create → Pages → Connect to Git**.
2. Select the `RedsAnalysis/Osgl` repository.
3. Framework preset: **None**. Build command: leave empty. Output directory: `/` (repo root).
4. Add `osgldevelopers.com` under **Custom domains**.

### After deploying

- Purge the Cloudflare cache for the changed files.
- Test `https://osgldevelopers.com/`, the WhatsApp links and the map on a real phone.
- Add the domain to **Google Search Console** and submit `https://osgldevelopers.com/sitemap.xml`.
- Optional: enable **Cloudflare Web Analytics** (cookie-free) and add its snippet before `</body>` if you want traffic numbers. No analytics is installed by default.

---

## 4. Editing the page

### Phone / WhatsApp number

The number appears in two places:

1. `index.html` — search for `8971181288` (links) and `89711 81288` (display text).
2. `assets/js/main.js` — `phoneNumber` and `waBase` at the top.

Keep the international format without spaces in links: `+918971181288`.

### Prices / configurations

In `index.html`, search for `class="unit"`. Each card has `data-beds` (used by the 2/3 BHK filter), a price and a pre-filled WhatsApp message. The EMI calculator presets live in `#calculator` (`data-price`) and in `assets/js/main.js` (`presets` are read from the buttons). Default values are in the range inputs.

### Images

All images are in `assets/img/`, named by use and width, e.g. `hero-2400.webp`, `amenity-pool-1200.webp`.

To regenerate the whole stock set:

```bash
./scripts/build-images.sh
```

To use real project renders later, replace the files with the same names and dimensions (or regenerate with the script). Keep the widths in the `srcset` attributes in sync if you change them.

### Fonts

Self-hosted in `assets/fonts/`; declarations are in `assets/css/fonts.css`. Cormorant Garamond is used for display type, Manrope for body/UI.

### Styles and scripts

- `assets/css/styles.css` — design tokens, layout, components, responsive rules, reduced-motion/print styles.
- `assets/js/main.js` — all interactions, written as a single IIFE.

No npm install is required to run or deploy the site.

---

## 5. Before you go live — verify these

These details were carried over from the existing page / competitor reference. Please confirm them with the developer's current cost sheet before publishing:

- **RERA registration:** `PRM/KA/RERA/1250/303/PR/020626/006644` (BARCA AT GODREJ MSR CITY). The competitor page shows a different number (`...010425/007644`), so verify the correct current registration on [rera.karnataka.gov.in](https://rera.karnataka.gov.in).
- **Project facts:** 17 acres, 1,961 residences, 2B + G + 15 storeys, possession 2030 onwards.
- **Prices:** 2 BHK ₹1.59 Cr*, 2 BHK Luxe ₹1.79 Cr*, 3 BHK + 2T Premium ₹2.32 Cr*, 3 BHK Grand ₹1,930 sq.ft. at ₹2.56 Cr*, 3 BHK Luxe ₹2.99 Cr*. All are indicative pre-launch prices, exclusive of GST/registration/other charges.
- **3 BHK Grand size:** this page uses **1,930 sq.ft.** (your existing page). The competitor page lists **1,390 sq.ft.** — confirm the correct size.
- **Channel-partner authorisation:** the page describes OSGL Developers as an authorised channel partner and includes a clear "not the official developer website" disclaimer. Keep this wording, and keep the authorization on file.
- **Imagery:** all photographs are stock/representative. Replace them with the developer's approved renders when available. Do not present stock images as actual project photography.

The footer already carries the RERA number, the channel-partner disclaimer, the representative-imagery note and the price disclaimer. Update them if any detail changes.

---

## 6. Lead flow

1. Every CTA opens `https://wa.me/918971181288?text=...` with a context-specific message (cost sheet, floor plans, site visit, payment plan, brochure, amenity plan).
2. The callback form validates name + Indian mobile number, then opens WhatsApp with the name, number, interest and (if present) UTM source.
3. The EMI calculator updates its WhatsApp message with the selected price, down payment, rate, tenure and indicative EMI.
4. No data is stored on the server. If you want a CRM/email copy as well, add a form endpoint (Formspree, Cloudflare Worker, etc.) — the current form intentionally has no backend.

---

## 7. Performance notes

- Hero image is preloaded with `imagesrcset`/`imagesizes`; mobile gets a portrait crop.
- All below-the-fold images are lazy-loaded with explicit dimensions (no layout shift).
- Fonts are self-hosted and preloaded; only Latin subsets are used (the rupee sign falls back to Manrope).
- CSS/JS are small and cacheable. Cloudflare Brotli + HTTP/3 will compress the HTML/CSS further in production.
- Lighthouse (local, mobile emulation, uncompressed Python server): **89–90 performance, 100 accessibility, 100 best practices, 100 SEO**. Production should be better with Brotli/CDN and HTTP/3.

---

## 8. Credits

See [CREDITS.md](CREDITS.md) for the Unsplash source photographs and font licences.
