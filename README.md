# Universal QR Tool

Static, no-backend QR code generator + scanner. Plain HTML/CSS/JS — deploy as-is to Netlify, Vercel, GitHub Pages, or any static host.

## Before you deploy — checklist

1. **Domain placeholders** — search the project for `your-domain.com` and replace every occurrence with your real domain:
   - `index.html` (canonical, og:url, og:image, twitter:image, JSON-LD `url`)
   - `robots.txt` (Sitemap line)
   - `sitemap.xml` (`<loc>`)

2. **Google AdSense**
   - Apply for AdSense once the site is live on a real domain (AdSense will not approve `localhost` or unpublished sites).
   - Once approved, set `ADSENSE_CLIENT_ID` near the top of `js/app.js` to your `ca-pub-XXXXXXXXXXXXXXXX` value.
   - Uncomment the `<ins class="adsbygoogle">` blocks in `index.html` you want to activate (there are 4 placeholder slots: left/right sidebar, footer, and a dismissible mobile anchor ad — feel free to delete any you don't want, or add back an in-content/top-leaderboard slot later if traffic justifies it).
   - Add a `ads.txt` file at the site root with the line Google gives you in your AdSense account (Sites → your domain → View ads.txt guidance). This is required for AdSense to pay out correctly.
   - The site only injects the AdSense loader script after a visitor accepts the cookie-consent banner (see `loadAdsenseIfConsented()` in `js/app.js`), which keeps things consent-compliant.

3. **Camera scanning requires a secure context** — `getUserMedia` (camera access) only works over **HTTPS** or on `http://localhost`. Opening `index.html` directly via `file://` will always fail with a permission/security error — this is a browser restriction, not a bug. Test camera scanning either with a local dev server (`npx serve`, `python3 -m http.server`, etc.) or after deploying to Netlify.

4. **Legal pages** — a Privacy Policy section is included (`#privacyPolicy`, linked from the footer). Review the wording and update the "Contact" section with a real contact method before launch. If you expect EU/UK/California visitors, consider a more complete cookie-consent solution (the built-in banner is intentionally simple).

5. **Structured data** — `index.html` includes `WebApplication` and `FAQPage` JSON-LD. Update the FAQ JSON-LD if you change the on-page FAQ content, so they stay in sync.

6. **Google Analytics (optional)** — set `GA_MEASUREMENT_ID` near the top of `js/app.js` to your `G-XXXXXXXXXX` value to enable GA4. Like AdSense, it only loads after the visitor accepts the cookie banner (`loadAnalyticsIfConsented()`), so no extra consent wiring is needed. Leave it blank to keep analytics off entirely.

7. **Security headers** — `_headers` (read automatically by Netlify) sets safe defaults: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and a `Permissions-Policy` that restricts camera access to this origin. A stricter `Content-Security-Policy` line is included but commented out — read the note inside `_headers` before enabling it, since a wrong CSP silently breaks fonts/ads/analytics instead of throwing a visible error.

8. **Custom 404 page** — `404.html` is served automatically by Netlify for any unmatched path. It's intentionally kept single-language (English) since there's no visitor context to auto-detect a locale from on an error page.

## Project structure

```
index.html          Main page (all sections, ad placeholders, i18n data-attributes)
404.html             Branded not-found page (Netlify serves this automatically)
_headers             Netlify response headers (security defaults + a commented CSP)
css/style.css        All styles (light + dark theme)
js/app.js            All logic: i18n, theme, QR generation/scanning (incl. custom colors +
                     center logo), history, cookie consent, AdSense + GA4 loaders
images/logo-qr.svg    Brand logo/favicon — a real, scannable-looking QR pattern
images/favicon-32.png, icon-192.png, icon-512.png   Raster favicon fallbacks
images/og-image.png   1200x630 social share image
robots.txt, sitemap.xml   Basic SEO files (update the domain placeholder first)
```

## QR customization (color + center logo)

The generator lets visitors pick a foreground/background color and optionally upload a logo to place in the center of the QR code. This works by rendering the QR module matrix by hand (canvas for the on-screen preview/PNG, a hand-built SVG string for the vector download) instead of using the library's default black-and-white output — that's what makes custom colors and an embedded logo possible for both export formats.

Error correction is always fixed at level **H** (~30% of the code can be damaged/obscured and still scan correctly), and the logo is capped at ~22% of the QR's width with a background-color pad behind it — both deliberately conservative so a logo doesn't make the code unscannable. A low-contrast color combination triggers a warning message (not a hard block). None of this — colors or logo — is persisted to history/localStorage; regenerating an entry from history uses whatever colors/logo are currently set in the generator panel.

## Local development

```
python3 -m http.server 8000
# then open http://localhost:8000
```
Camera scanning and QR generation both load small third-party libraries from a CDN on first use (qrcode-generator + jsQR), so an internet connection is required even for local testing.
