# Andrew's Marine Maintenance & Repair - Demo Site

Single-page static demo built by Agavi AI for Andrew's Marine Maintenance and Repair, LLC (Brownwood, TX / Lake Brownwood). Plain HTML + CSS + vanilla JS, no build step. Everything unverified is a clearly labeled placeholder; nothing on the page is invented.

## Files

- `index.html` - the whole page
- `styles.css` - all styling (lake teal / warm sand / buoy orange, Big Shoulders Display)
- `app.js` - form handling (front-end only) and a reduced-motion-aware scroll reveal
- `README.md` - this file

## Deploy to Cloudflare Pages

Option A - direct upload (fastest for a demo):

1. Log in to the Cloudflare dashboard and go to **Workers & Pages > Create > Pages > Upload assets**.
2. Name the project (e.g. `andrews-marine-demo`).
3. Drag in the repo folder (or a zip of `index.html`, `styles.css`, `app.js`).
4. Deploy. The site is live at `https://<project>.pages.dev` in under a minute.

Option B - Git integration (auto-deploys on push):

1. **Workers & Pages > Create > Pages > Connect to Git** and pick this repository.
2. Build settings: framework preset **None**, build command **(leave empty)**, output directory **/** (repo root).
3. Save and deploy. Every push to the connected branch redeploys.

Post-deploy step (both options):

- Open `index.html` and replace the two relative `og-image.png` references in the social-preview meta tags with the absolute URL (`https://<project>.pages.dev/og-image.png`). Texting apps and Messenger ignore relative og:image paths; this one edit is what makes the link preview card show up when the demo URL is texted to Andrew.

Production notes:

- The Request Service form is front-end only in the demo. For production, add a Cloudflare Pages Function (e.g. `functions/api/request.js`) that emails submissions to `Info@andrewsmarine.net` (MailChannels or an SMTP API), and point the form at it.
- **Domain:** `andrewsmarine.net` is already owned - the shop's email runs on it. The production site can map to that domain in Pages > Custom domains instead of buying a new one.

## Pitch notes (field intel, use in the room)

- **Personal-experience opener.** You went to the shop as a real customer needing a boat part. Open with that: what it was like to find him, decide, and show up. You're not selling a theory, you're describing your own path to his counter.
- **The voicemail is the pitch.** His phone greeting effectively tells callers to text because the shop is too busy. That's proof of demand overflow, in his own recorded voice. It's exactly what the "Heading into a holiday weekend?" section and the request-a-callback form are built to absorb: the site takes the queue so his phone doesn't have to. If he confirms he prefers texts, a "Text the Shop" (`sms:`) button next to the call button is a five-minute add.
- **Implied reach.** Right now his Google presence is a bare listing with a conflicting address. Just having a real website with matching NAP data widens how far out on the lake he shows up, before any marketing spend. Frame the address fix (checklist item 1) as step one of that.
- **Phone-overflow upsell (roadmap, not demo).** An AI voice agent (e.g. xAI's voice agent) could answer overflow calls, take name/number/issue, and drop them into the same queue as the form. Pitch it as a later phase after the site proves itself; it pairs naturally with the "too busy to answer" problem the voicemail already admits.

## Pre-meeting checklist (do these before showing Andrew, or with him)

1. **Resolve the address conflict.** `7855 TX-279` and `3304 2nd St` both circulate in directories - an active NAP problem. Confirm the real address in person, then replace the two ADDRESS placeholders (hours section + footer). Fixing the wrong-address listings is part of the care-plan pitch.
2. **Certifications strip.** Ask Andrew: ABYC? Yamaha/Mercury/Suzuki OEM certs? TX doesn't license marine mechanics, so these are the trade's real trust signals. Populate only what he actually holds; if none, delete the strip entirely.
3. **Turnaround + priority policy.** Get realistic in-season vs off-season turnaround estimates and whether he triages holiday-week breakdowns. These fill the two placeholders in "Heading into a holiday weekend?" - the page's centerpiece. Ship his numbers, never invented ones.
4. **Harvest photos.** The Facebook page (1,032 followers) is the photo goldmine: engine teardown/rebuild, prop before/after, canvas job, Wetsound install, the shop, Andrew at the bench. Get his OK post-signing, then swap the six gallery placeholders and the hero placeholder.
5. **Harvest reviews.** Pull verbatim review text + first names from the Google listing and Facebook recommendations into the five review slots. Never paraphrase-as-quote, never invent. Keep star ratings and percentages off the page - platforms disagree.
6. **Confirm the callback promise.** "We'll call you back within one business day" appears above the form button. Adjust to whatever Andrew will actually honor before launch.
7. **Verify contact details.** Phone (325) 320-2018 and Info@andrewsmarine.net are wired throughout - confirm both are current.
