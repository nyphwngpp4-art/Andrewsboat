# Andrew's Marine Maintenance & Repair - Demo Site

Single-page static demo built by Agavi AI for Andrew's Marine Maintenance and Repair, LLC (Brownwood, TX / Lake Brownwood). Plain HTML + vanilla JS with one tiny build step (Tailwind CSS + metadata stamping). Everything unverified is a clearly labeled placeholder; nothing on the page is invented.

## File structure

- `index.html` - the whole page: markup, custom styles, and all scripts (single source of truth)
- `assets/site.css` - **generated** Tailwind CSS (committed so the deployed site needs no build server)
- `og-image.png` - 1200x630 social preview card (referenced by the OG/Twitter meta tags)
- `images/` - hero video (`hero-lake-brownwood.mp4`), poster (`hero-poster.jpg`), and photos harvested for future gallery slots (pending Andrew's OK)
- `site.config.json` - deployed origin + indexing switches (see below)
- `build.mjs`, `tailwind.config.js`, `src/tailwind.css` - the build
- `robots.txt`, `sitemap.xml` - **generated** by the build from `site.config.json`

Former `styles.css` / `app.js` from an earlier iteration were unused by `index.html` and have been removed (history has them if ever needed).

## Build and preview

```
npm install        # pinned: tailwindcss 3.4.17 (exact, via package-lock.json)
npm run build      # compiles assets/site.css, stamps metadata, writes robots.txt + sitemap.xml
npm run preview    # serves the repo root at http://localhost:8080
```

Run `npm run build` after editing `index.html` (new Tailwind classes) or `site.config.json`. Generated outputs are committed, so the **deployment output directory is the repo root** - no build runs on the host.

## Production origin and indexing (`site.config.json`)

- `origin` - the URL this build will be served from. For the demo deploy, set it to the `*.pages.dev` URL so the texted link's social preview card resolves absolute `og:image`/`og:url`. For launch, the production origin.
- `originConfirmed` - **launch blocker**: `andrewsmarine.net` is owned (shop email runs on it), but the final hostname and www vs non-www preference must be confirmed with Andrew. Keep `false` until then.
- `indexingEnabled` - keep `false` for every pre-approval/preview deploy: the build emits `<meta name="robots" content="noindex, nofollow">` and a `Disallow: /` robots.txt so the unapproved demo is never indexed as the official site. At launch, set both flags `true` and rebuild: the noindex meta is replaced by the canonical link, robots.txt opens up and references `sitemap.xml`.

The canonical URL is intentionally absent until both flags are true - no guessed or placeholder canonicals ship.

## Seasonal winterization banner (fall campaign)

The slim banner below the nav is controlled by one switch: `SITE_CONFIG.seasonalBannerEnabled` in the inline script at the bottom of `index.html`. Set it to `false` after the campaign to hide the banner site-wide; the winterization section, its CTAs, and the form's winterization option remain available either way. Visitor dismissal of the banner lasts for the browser session (`sessionStorage`).

The shop's minimum serviced model year lives in the same config object (`SITE_CONFIG.minServiceYear`, currently 2005) and drives both the form hint text and validation. The upper bound is always the current calendar year + 1.

## Current form behavior (SMS draft)

The Request Service form is front-end only: it validates (required service selection; model year within policy), then builds an SMS draft in the **customer's own messaging app** - the customer reviews and taps Send. The site never sends anything itself and never claims a request was received or an appointment booked.

## Deferred post-approval work

- **Live intake delivery** - e.g. a Cloudflare Pages Function emailing `Info@andrewsmarine.net` or a texting integration Andrew prefers, keeping the SMS draft as fallback. Not implemented; do not enable automated delivery or send test messages to Andrew before approval.
- **Customer reviews** - harvest verbatim Google/Facebook review text only with permission; never paraphrase-as-quote, never invent.
- **Automations** - AI voice/overflow handling and any automated status updates are roadmap only; the site currently claims none.

## Owner approvals required before launch

1. Final hostname and www/non-www preference (`originConfirmed`), then enable indexing.
2. Platinum program pricing, terms, eligibility, and coverage specifics.
3. Photos (Facebook harvest), logo file, and any gallery content.
4. Reviews harvest permission.
5. Address confirmation (7855 Hwy 279 vs directory conflicts) and contact details.
6. Go-ahead to activate live form delivery.

## Deploy to Cloudflare Pages

Option A - direct upload (fastest for a demo):

1. Log in to the Cloudflare dashboard and go to **Workers & Pages > Create > Pages > Upload assets**.
2. Name the project (e.g. `andrews-marine-demo`).
3. Run `npm run build` locally (after setting `origin` in `site.config.json` to the `pages.dev` URL), then drag in the repo folder minus `node_modules`.
4. Deploy. The site is live at `https://<project>.pages.dev` in under a minute.

Option B - Git integration (auto-deploys on push):

1. **Workers & Pages > Create > Pages > Connect to Git** and pick this repository.
2. Build settings: framework preset **None**, build command **(leave empty)**, output directory **/** (repo root). Generated files are committed, so no host-side build is needed.
3. Save and deploy. Every push to the connected branch redeploys.

Post-deploy step (both options):

- Set `origin` in `site.config.json` to the deployed URL, run `npm run build`, and redeploy/commit - this makes `og:url`/`og:image` absolute for that host so the link preview card shows when the demo URL is texted to Andrew. Keep `indexingEnabled` false for the demo.

Production notes:

- The Request Service form is front-end only in the demo. For production, add a Cloudflare Pages Function (e.g. `functions/api/request.js`) that emails submissions to `Info@andrewsmarine.net` (MailChannels or an SMTP API), and point the form at it.
- **Domain:** `andrewsmarine.net` is already owned - the shop's email runs on it. The production site can map to that domain in Pages > Custom domains instead of buying a new one.

## Pitch notes (field intel, use in the room)

- **Personal-experience opener.** You went to the shop as a real customer needing a boat part. Open with that: what it was like to find him, decide, and show up. You're not selling a theory, you're describing your own path to his counter.
- **The voicemail is the pitch.** His phone greeting effectively tells callers to text because the shop is too busy. That's proof of demand overflow, in his own recorded voice. It's exactly what the "Heading into a holiday weekend?" section and the request-a-callback form are built to absorb: the site takes the queue so his phone doesn't have to. If he confirms he prefers texts, a "Text the Shop" (`sms:`) button next to the call button is a five-minute add.
- **Implied reach.** Right now his Google presence is a bare listing with a conflicting address. Just having a real website with matching NAP data widens how far out on the lake he shows up, before any marketing spend. Frame the address fix (checklist item 1) as step one of that.
- **Warm intro, not a cold pitch.** Andrew has worked with the family for years, and there's now an open, positive text thread: Jay did a Tige impeller swap himself, Andrew gave tips on reassembly over text, the fix held, Jay said he'd reach out if anything else came up, and Andrew closed warm ("That's great to hear Jay! Thank you for reaching out."). That closing is a natural, non-pushy re-entry point. Send the demo link into that thread once it is deployed; the pitch arrives as a neighbor showing him something, not a vendor call.
- **Leave the Google review first.** Write an honest Google review of the impeller experience before the pitch. It helps him today, it seeds goodwill, and it becomes the first verbatim, verifiable quote for a review slot on the site. The private text thread itself stays private: never quote or paraphrase it on the page without his OK.
- **He already helps customers over text for free.** Coaching a customer through a reassembly by text IS a service, currently uncaptured. It's more ammunition for the membership (make text-me-first a member perk) and for the eventual voice/queue tooling. Name it in the pitch as value he gives away that the site can organize.
- **The membership is the recurring-revenue story.** He already sells priority + discounts at the counter (verified in person). The site gives it a permanent home today and, in a later phase, online sign-up and payment. That turns the care-plan pitch from "I'll maintain your website" into "your website sells your membership while you're wrenching."
- **The storefront widens the site's job.** Parts and gear in stock (verified in person) means photo ops for the gallery's wide slot and, down the road, a parts-counter page or simple inventory highlights. Note it, don't scope it into phase one.
- **He has a real logo.** The road sign carries a sunrise-over-water mark, not just text. The demo uses a text wordmark by design (we had no logo file); dropping his actual mark into the header is an easy, high-impact "make it yours" beat in the pitch. Ask him for a clean logo file (or photograph the sign) and it swaps into the header in minutes. Do not recreate or fake the logo from the sign photo.
- **Do not publish the Google Street View image.** The lot/storefront shot from Google Maps is copyrighted by Google (watermarked, dated) and can't go on the site. It's reference only. Shoot your own wide storefront-plus-inventory photo in person for the gallery's wide slot.
- **Phone-overflow upsell (roadmap, not demo).** An AI voice agent (e.g. xAI's voice agent) could answer overflow calls, take name/number/issue, and drop them into the same queue as the form. Pitch it as a later phase after the site proves itself; it pairs naturally with the "too busy to answer" problem the voicemail already admits.

## Pre-meeting checklist (do these before showing Andrew, or with him)

1. **Resolve the address conflict.** `7855 TX-279` and `3304 2nd St` both circulate in directories - an active NAP problem. Confirm the real address in person, then replace the two ADDRESS placeholders (hours section + footer). Fixing the wrong-address listings is part of the care-plan pitch.
2. **Certifications strip.** Ask Andrew: ABYC? Yamaha/Mercury/Suzuki OEM certs? TX doesn't license marine mechanics, so these are the trade's real trust signals. Populate only what he actually holds; if none, delete the strip entirely.
3. **Turnaround + priority policy.** Get realistic in-season vs off-season turnaround estimates and whether he triages holiday-week breakdowns. These fill the two placeholders in "Heading into a holiday weekend?" - the page's centerpiece. Ship his numbers, never invented ones.
4. **Harvest photos.** Two real photos from his Google Business profile are already in: the boat-in-tow shot (hero) and the PWCs-on-the-lake shot (gallery lead). The Facebook page (1,032 followers) is the goldmine for the remaining six labeled slots: engine teardown/rebuild, prop before/after, canvas job, Wetsound install, the shop, Andrew at the bench. Get his OK post-signing. Optimized web copies live in `images/`; keep new ones under ~200KB each.
5. **Harvest reviews.** Pull verbatim review text + first names from the Google listing and Facebook recommendations into the five review slots. Never paraphrase-as-quote, never invent. Keep star ratings and percentages off the page - platforms disagree.
6. **Confirm the callback promise.** "We'll call you back within one business day" appears above the form button. Adjust to whatever Andrew will actually honor before launch.
7. **Get membership specifics.** The program exists (priority service + member discounts, confirmed by Andrew in person, July 2026), but name, price, what's included, and how folks sign up are all unknown. They fill the MEMBERSHIP placeholder in the "Priority membership" section.
8. **Get the logo file.** Andrew has a real sunrise-over-water logo (visible on the road sign). Ask for a clean image file to replace the text wordmark in the header. Do not recreate it from the sign photo.
9. **Verify contact details.** Phone (325) 320-2018 and Info@andrewsmarine.net are wired throughout - confirm both are current.
