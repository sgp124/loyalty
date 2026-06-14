# Lokma CDN — loyalty signup + stamp card

A two-page system you host yourself:

- **`index.html`** — the public signup page (QR at the counter / link in IG bio). Verifies the customer's phone with a one-time code, gives a free scoop, and starts a stamp card with a 2-stamp head start.
- **`staff.html`** — the counter tool. Staff look a customer up by number and add stamps / redeem rewards. Reachable at `your-site.web.app/staff`.

Phone number = identity + anti-fraud (one number = one card = one free scoop, no duplicates). **Email = your marketing channel.** The phone is only ever used to send the one-time login code — no marketing texts, so there's no carrier registration to deal with.

---

## How a stamp gets added (the important part)

A stamp means *a real purchase happened*, so customers can never add their own — only staff can. The database rules enforce this: a customer's login can read their own card but cannot change the stamp count; only an allowlisted staff phone can write stamps.

At the counter, after a sale:
1. Staff opens `staff.html` (bookmark it on the counter tablet/phone).
2. Type the customer's number → **Find card**.
3. Tap **+1 stamp**. It appears on the customer's phone instantly.
4. At 8/8 the page shows **Free order ready** → hand over the item → tap **Redeem free order** (resets the card to 0 for the next round).
5. The one-time signup scoop has its own **Redeem signup scoop** button so it can't be claimed twice.

---

## One-time setup (~30 min)

### 1. Firebase project
1. Go to <https://console.firebase.google.com> → **Add project**.
2. **Build → Authentication → Sign-in method → Phone → Enable.**
3. **Build → Firestore Database → Create database → Production mode.**
4. **Upgrade to the Blaze plan** (gear icon → Usage and billing). Required to send SMS codes. First 10 SMS/day are free, then ~CA$0.01–0.03 each. Set a **budget alert** (e.g. $10/mo) so there are never surprises.
5. **Project settings → General → Your apps → Web app (`</>`)**. Copy the config values into **`firebase-config.js`**.

### 2. Add your card settings
In `firebase-config.js`, set `STAFF_PIN` (counter PIN) and `ORDER_URL` (your online-ordering link). `TOTAL_STAMPS` (8) and `HEAD_START` (2) are already tuned to the research — leave them unless you have a reason.

### 3. Add your staff allowlist
In Firestore, create a collection **`config`** with a document ID **`staff`** and one field:
- Field `phones` (type **array**) → add each manager/staff phone in full format, e.g. `+15145550123`.

Only these numbers can add stamps. (The page also has a soft PIN, but this list is the real lock.)

### 4. Deploy (free, commercial use allowed)
Install the CLI once: `npm install -g firebase-tools`, then from this folder:
```
firebase login
firebase init            # pick Hosting + Firestore, use this folder, don't overwrite files
firebase deploy
```
You'll get a URL like `https://lokma-cdn.web.app`. The staff tool is at `…/staff`. You can add a custom domain in **Hosting → Add custom domain**.

> Hosting note: we use **Firebase Hosting** (not Vercel) because Vercel's free tier prohibits commercial use. Cloudflare Pages or Netlify also work and allow commercial use if you ever want to move.

### 5. Authorized domains
**Authentication → Settings → Authorized domains** → make sure your `.web.app` domain (and custom domain) are listed, or the code-sending will be blocked.

---

## Connecting email marketing

The form already stores `email` + `marketingConsent` + `consentTimestamp` for everyone who opts in. To actually send promos, pipe those emails into a free email tool:

- **MailerLite** — free up to ~1,000 subscribers, good automations (birthday emails!).
- **Brevo** — free 300 emails/day, no subscriber cap.
- **Mailchimp** — free up to 500 contacts.

Two ways to get the emails over:
- **Quick start:** in Firestore, export the `members` collection to CSV and import to your email tool weekly.
- **Automatic (recommended once live):** a small Cloud Function on new-member creation that calls the email tool's API (or a Zapier/Make "Firestore → email tool" zap). Ask and this can be added.

Keep the `consentTimestamp` — under Canada's CASL you need to be able to show when and how someone opted in.

---

## Switching verification to email instead of SMS (optional, truly $0)

If you ever want to drop the Blaze plan / card-on-file: Firebase email-link ("magic link") sign-in is 100% free. The number then becomes an optional, unverified field. The tradeoff is weaker duplicate protection (email is easier to fake than a phone). Ask and this variant can be swapped in.

---

## Files
| File | What it is |
|---|---|
| `index.html` | Customer signup + card (bilingual EN/FR) |
| `staff.html` | Counter stamp tool (`/staff`) |
| `firebase-config.js` | Your keys + card settings |
| `firestore.rules` | Security: customers read own card, staff write stamps |
| `firebase.json` | Hosting + Firestore deploy config |

## Costs at one store
- Hosting + database: **$0** (Firebase free tier).
- SMS codes: first 10/day free, then a few cents each — typically a couple dollars a month.
- Email marketing: **$0** on the free tiers above.
