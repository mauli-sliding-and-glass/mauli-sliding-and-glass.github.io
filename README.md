# Mauli Sliding and Glass Arts: Website

A fast, bilingual (English / मराठी) one-page website for **Mauli Sliding and Glass Arts, Jamkhed, Maharashtra**.

- **Cost:** ₹0. Plain HTML, CSS and JavaScript, hosted free on Cloudflare Pages.
- **No frameworks, no build step, no dependencies.** Edit a file, upload it, and the site updates.
- **Size:** about 78 KB in total for the first visit. Lighthouse scores 100 for Performance, Accessibility, Best Practices and SEO.

Live address (after deployment): **https://mauli-sliding-and-glass.pages.dev**

---

## 1. Project structure

```
mauli-sliding-glass-arts/
├── index.html            ← all page content (English text lives here)
├── css/style.css         ← design: colours, layout, mobile styles
├── js/main.js            ← business details (phone, WhatsApp…) + language switch, menu, gallery
├── js/translations.js    ← Marathi text + WhatsApp message wording
├── assets/images/        ← gallery photos (work-1…6.webp) and share image (og-image.jpg)
├── assets/icons/         ← favicon and phone home-screen icon
└── README.md
```

### Why it is built this way (simple explanation)

| Decision | Why |
|---|---|
| No framework (React etc.) | Frameworks add 40–150 KB of JavaScript. This site needs only ~3.5 KB. |
| System fonts | Phones already have good fonts for English and Marathi (Devanagari), so nothing needs to download. |
| Hero picture drawn in SVG code | About 2 KB instead of a 150 KB photo, and sharp on every screen. |
| No embedded Google Map | An embedded map downloads about 1 MB. A button that opens Google Maps costs nothing. |
| English text in the HTML | Google reads it directly, and the page still works if JavaScript is blocked. |
| WhatsApp form instead of an email form | No server or paid service is needed, and customers in Jamkhed already use WhatsApp. |
| Gallery images `loading="lazy"` | Photos download only when the visitor scrolls to them. |

---

## 2. ⚠️ Information still needed (placeholders)

Placeholders appear on the site with a **yellow dashed box**. Nothing has been invented.

| Item | Where to add it |
|---|---|
| Phone number | `js/main.js` → `SITE.phone` |
| WhatsApp number | `js/main.js` → `SITE.whatsapp` (digits only, with 91, e.g. `919876543210`) |
| Business hours | `js/main.js` → `SITE.hours` (English + Marathi) |
| Street address | `js/main.js` → `SITE.street` |
| Owner name | `js/main.js` → `SITE.owner` |
| Years of experience | `js/main.js` → `SITE.experience` |
| Real project photos | `assets/images/work-1.webp` … `work-6.webp` (see §4) |
| Confirm services list | Six services are shown (sliding windows, sliding doors, glass partitions, decorative glass, mirrors, mosquito net windows). Remove or change any that are not offered: `index.html` + `js/translations.js`. |
| Google Maps link | The current link opens a place named **"Shinde chaha"**. Please confirm it points to the shop (see §7). |

**Example** (in `js/main.js`):

```js
const SITE = {
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  hours: { en: 'Mon–Sat, 9:00 am – 8:00 pm', mr: 'सोम–शनि, सकाळी 9 ते रात्री 8' },
  street: { en: 'Near Bus Stand, Beed Road', mr: 'बस स्टँडजवळ, बीड रोड' },
  owner: { en: '…', mr: '…' },
  experience: { en: '10+ years', mr: '10+ वर्षे' },
  mapsUrl: 'https://maps.app.goo.gl/akUdaipjxFDoyJ7B6'
};
```

Once the phone number and address are confirmed, also add them for Google in `index.html`, inside the `<script type="application/ld+json">` block:

```json
"telephone": "+91-98765-43210",
"address": { "@type": "PostalAddress", "streetAddress": "…", "addressLocality": "Jamkhed", … }
```

Also update the **About** facts and the **Hours** in both languages through `SITE`. The page fills them in automatically, and the yellow placeholder box disappears.

---

## 3. Preview on your own computer

From the project folder:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000.

**Working over SSH from home?** Connect with port forwarding, then open http://localhost:8000 in your home browser:

```bash
ssh -L 8000:localhost:8000 ramdas@<office-pc-address>
```

To test Marathi directly: http://localhost:8000/?lang=mr

---

## 4. Replacing the sample photos

1. Take landscape photos (4:3 shape is best).
2. Open **https://squoosh.app** (free, made by Google, and the photo never leaves your computer).
3. Resize to **800 × 600**, choose **WebP**, quality about **70**. Aim for under **80 KB** per photo.
4. Save as `work-1.webp` … `work-6.webp`, replacing the files in `assets/images/`.
5. In `index.html`, update the `alt="…"` text (and in `js/translations.js` the matching `work.a1`… Marathi text). Remove the words "Sample image".
6. Delete the yellow "Sample images shown…" line in the **Our Work** section of `index.html` (the `<p class="ph ph-block" …>` line).

To add more photos, copy one `<li class="reveal">…</li>` gallery line and change the file name and caption.

---

## 5. Deploy for free: GitHub + Cloudflare Pages

**What these are:**

- **GitHub** stores the code.
- **Cloudflare Pages** takes the code from GitHub and serves it as a website.
- Every time you update GitHub, the website updates by itself within about a minute.

**Free plan (checked November 2026):** unlimited sites and visitors, no bandwidth charge for static sites, 500 deployments per month, free HTTPS. No card is required.

### Step 1: Put the code on GitHub

The repository is `github.com/ramdasjagtap/mauli-sliding-glass-arts`. From this folder:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

### Step 2: Connect Cloudflare Pages (one time only)

1. Go to **https://dash.cloudflare.com/sign-up** and create a free account (email + password).
2. In the left menu, open **Workers & Pages**.
3. Click **Create application** → choose the **Pages** tab → **Connect to Git**.
   - If you only see a "Workers" screen, look for the link **"Looking to deploy Pages? Get started"**.
4. Choose **GitHub**, sign in, and allow Cloudflare to access the **mauli-sliding-glass-arts** repository.
5. Select the repository → **Begin setup**.
6. Fill in:
   - **Project name:** `mauli-sliding-and-glass` (this becomes `mauli-sliding-and-glass.pages.dev`)
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** *(leave empty: the files are in the top folder)*
7. Click **Save and Deploy**. After about a minute your site is live at
   **https://mauli-sliding-and-glass.pages.dev** 🎉

> If that name is already taken, Cloudflare adds a few letters (e.g. `mauli-sliding-and-glass-abc.pages.dev`). In that case, replace the address in `index.html` (search for `pages.dev`, which appears 6 times) and push again.

### Step 3: Check it

- Open the site on your phone. Try **मराठी**, the menu, and the WhatsApp button.
- Test speed at **https://pagespeed.web.dev** (paste the address).
- Share the link on WhatsApp. The preview card uses `assets/images/og-image.jpg`.

---

## 6. Updating the website later

1. Edit the file (text in `index.html`, Marathi in `js/translations.js`, contact details in `js/main.js`).
2. Preview locally (§3).
3. Run:
   ```bash
   git add .
   git commit -m "Update phone number"
   git push
   ```
4. Cloudflare redeploys automatically. Refresh the site after about a minute.

If something breaks, Cloudflare keeps every past version: **Workers & Pages → your project → Deployments → … → Rollback**.

**Editing without the terminal:** on github.com, open a file → click the ✏️ pencil → edit → **Commit changes**. Cloudflare redeploys the same way.

---

## 7. Free extras worth doing (no code needed)

- **Google Business Profile** (free, https://business.google.com). This is the biggest win for local customers searching "glass work Jamkhed" on Google and Maps. It also gives you a correct Maps link with the shop's own name. Put that link in `SITE.mapsUrl` and in the three `href="https://maps.app.goo.gl/…"` places in `index.html`.
- **Google Search Console** (free). Add the site so Google indexes it faster.
- A custom domain (e.g. `maulislidingglass.in`) is **optional and not free** (about ₹500–900/year). The `.pages.dev` address works without one.

---

## 8. How the language switch works

- English text is written in `index.html`. Each translatable element has a key, e.g. `data-i18n="hero.title"`.
- `js/translations.js` holds the Marathi text for each key.
- Clicking **मराठी** swaps the text, and the choice is remembered on that device.
- A Marathi link can be shared directly: `https://mauli-sliding-and-glass.pages.dev/?lang=mr`

**To add a new sentence in both languages:**

1. In `index.html`: `<p data-i18n="about.p3">English sentence</p>`
2. In `js/translations.js` under `mr:`, add `'about.p3': 'मराठी वाक्य',`
