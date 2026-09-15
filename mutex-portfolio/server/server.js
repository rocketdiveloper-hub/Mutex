/**
 * MUTEX Portfolio — minimal backend
 * Serves the static client and exposes a validated /api/contact endpoint.
 *
 * Run:
 *   cd server
 *   npm install
 *   npm start
 *
 * Then open http://localhost:3000
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client')));

// Very small in-memory rate limit per IP to discourage spam submissions.
const submissions = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = submissions.get(ip) || { count: 0, start: now };
  if (now - entry.start > WINDOW_MS) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count += 1;
  submissions.set(ip, entry);
  return entry.count > MAX_PER_WINDOW;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

app.post('/api/contact', (req, res) => {
  const ip = req.ip;
  if (isRateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'Too many requests — please try again shortly.' });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Name, email and message are all required.' });
  }
  if (typeof name !== 'string' || name.length > 120) {
    return res.status(400).json({ ok: false, error: 'Name looks invalid.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Please provide a valid email address.' });
  }
  if (typeof message !== 'string' || message.length < 5 || message.length > 4000) {
    return res.status(400).json({ ok: false, error: 'Message should be between 5 and 4000 characters.' });
  }

  // Placeholder: wire this up to an email provider (Resend, SendGrid, Nodemailer + SMTP, etc.)
  // or persist to a database / notification service of your choice.
  console.log('New contact form submission:', { name, email, message, receivedAt: new Date().toISOString() });

  return res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`MUTEX portfolio server running at http://localhost:${PORT}`);
});
