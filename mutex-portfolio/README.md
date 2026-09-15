# MUTEX — Josue Malobo Portfolio

A premium, light, classic-modern personal portfolio for Josue Malobo (MUTEX).

## Structure

```
mutex-portfolio/
├── client/                 static frontend
│   ├── index.html
│   ├── css/style.css
│   ├── js/main.js
│   └── assets/images/      edited portrait variants
├── server/                 Node/Express backend
│   ├── server.js
│   └── package.json
└── README.md
```

## Running it

**Easiest — just open the site:**
Double-click `client/index.html`, or drag it into a browser. Everything works
except the contact form's server round-trip — if the API isn't reachable,
the form automatically falls back to opening the visitor's email client.

**With the backend (recommended for the real contact form):**
```bash
cd server
npm install
npm start
```
Then open `http://localhost:3000`. The Express server serves the `client`
folder directly and handles `POST /api/contact` with validation and basic
rate limiting.

## What to customize

- **Images** — `client/assets/images/` holds four edited crops of the
  supplied photo (a duotone hero portrait, a sepia "journey" shot for About,
  a warm-toned contact avatar, and a mono mark). Swap in new photography the
  same way if you get a fresh shoot.
- **Projects** — the "Selected Work" section (`#work` in `index.html`) uses
  clearly-labelled placeholder entries. Replace the placeholder tiles with
  real screenshots and the `project-link` hrefs with live URLs as work ships.
- **Social links & email** — update the `href`s in the `.social-list` and the
  `mailto:` fallback address in `client/js/main.js`.
- **Contact delivery** — `server/server.js` currently logs submissions to the
  console. Wire the marked section up to an email provider (Resend,
  SendGrid, Nodemailer+SMTP) or a database.
- **Colors / type** — all design tokens live at the top of
  `client/css/style.css` under `:root`.

## Notes

- Respects `prefers-reduced-motion` throughout.
- No fabricated clients, employers, testimonials or stats — only real
  supplied facts and clearly-marked placeholders, per the brief.
