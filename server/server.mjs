import express from 'express';
import cors from 'cors';
import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(here, '../data');
mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(resolve(dataDir, 'forward-auto.sqlite'));
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    locale TEXT NOT NULL,
    vehicle_value INTEGER NOT NULL,
    model_year INTEGER NOT NULL,
    tier TEXT NOT NULL,
    target INTEGER NOT NULL,
    estimate INTEGER NOT NULL,
    payload_json TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS claims (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    claim_type TEXT NOT NULL,
    incident_date TEXT,
    location TEXT,
    description TEXT,
    reference TEXT,
    status TEXT NOT NULL,
    payload_json TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS devices (
    token TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    device_name TEXT,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS notification_events (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    event_type TEXT NOT NULL,
    reference TEXT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL,
    response_json TEXT
  );
`);

const app = express();
app.use(cors());
app.use(express.json({ limit: '100kb' }));

const bad = (res, message) => res.status(400).json({ ok: false, error: message });
const text = (value) => typeof value === 'string' ? value.trim() : '';

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'forward-auto-api' }));

app.post('/api/quotes', (req, res) => {
  const body = req.body ?? {};
  const vehicleValue = Number(body.vehicleValue);
  const modelYear = Number(body.modelYear);
  const target = Number(body.target);
  const estimate = Number(body.estimate);
  const locale = text(body.locale) || 'en';
  const tier = text(body.tier);
  if (!Number.isFinite(vehicleValue) || vehicleValue < 10000) return bad(res, 'vehicleValue must be at least 10000');
  if (!Number.isInteger(modelYear) || modelYear < 1980 || modelYear > new Date().getFullYear() + 1) return bad(res, 'modelYear is invalid');
  if (!Number.isFinite(target) || target < 500 || target > 3000) return bad(res, 'target must be between 500 and 3000');
  if (!Number.isFinite(estimate) || estimate <= 0 || !tier) return bad(res, 'tier and estimate are required');
  const id = `FWD-Q-${randomUUID().slice(0, 8).toUpperCase()}`;
  const createdAt = new Date().toISOString();
  db.prepare('INSERT INTO quotes (id, created_at, locale, vehicle_value, model_year, tier, target, estimate, payload_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, createdAt, locale, Math.round(vehicleValue), modelYear, tier, Math.round(target), Math.round(estimate), JSON.stringify(body));
  res.status(201).json({ ok: true, id, createdAt, status: 'saved' });
});

app.get('/api/quotes/:id', (req, res) => {
  const row = db.prepare('SELECT id, created_at AS createdAt, locale, vehicle_value AS vehicleValue, model_year AS modelYear, tier, target, estimate FROM quotes WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ ok: false, error: 'Quote not found' });
  res.json({ ok: true, quote: row });
});

app.post('/api/claims', (req, res) => {
  const body = req.body ?? {};
  const claimType = text(body.claimType) || 'start';
  const incidentDate = text(body.incidentDate);
  const location = text(body.location);
  const description = text(body.description);
  const reference = text(body.reference);
  if (claimType === 'start') {
    if (!incidentDate || !location || description.length < 10) return bad(res, 'incidentDate, location, and a 10-character description are required');
  } else if (claimType === 'track' && reference.length < 6) return bad(res, 'reference is required');
  const id = `FWD-CLM-${randomUUID().slice(0, 8).toUpperCase()}`;
  const createdAt = new Date().toISOString();
  db.prepare('INSERT INTO claims (id, created_at, claim_type, incident_date, location, description, reference, status, payload_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, createdAt, claimType, incidentDate || null, location || null, description || null, reference || null, claimType === 'track' ? 'review_pending' : 'submitted', JSON.stringify(body));
  res.status(201).json({ ok: true, id, reference: reference || id, createdAt, status: claimType === 'track' ? 'review_pending' : 'submitted' });
});

app.get('/api/claims/:id', (req, res) => {
  const row = db.prepare('SELECT id, created_at AS createdAt, claim_type AS claimType, incident_date AS incidentDate, location, description, reference, status FROM claims WHERE id = ? OR reference = ?').get(req.params.id, req.params.id);
  if (!row) return res.status(404).json({ ok: false, error: 'Claim not found' });
  res.json({ ok: true, claim: row });
});

const expoPush = async (messages) => {
  if (!messages.length) return { data: [], skipped: true };
  const response = await fetch('https://exp.host/--/api/v2/push/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(messages) });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.errors?.[0]?.message || 'Expo push service rejected the request');
  return data;
};
const dispatchNotification = async ({ eventType, reference = null, title, body }) => {
  const id = `FWD-NOT-${randomUUID().slice(0, 8).toUpperCase()}`;
  const createdAt = new Date().toISOString();
  const devices = db.prepare('SELECT token FROM devices').all();
  const messages = devices.map((device) => ({ to: device.token, sound: 'default', title, body, data: { eventType, reference, notificationId: id } }));
  try {
    const result = await expoPush(messages);
    const status = messages.length ? 'sent_to_expo' : 'queued_no_devices';
    db.prepare('INSERT INTO notification_events (id, created_at, event_type, reference, title, body, status, response_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(id, createdAt, eventType, reference, title, body, status, JSON.stringify(result));
    return { id, eventType, reference, deviceCount: messages.length, status, provider: 'expo' };
  } catch (error) {
    db.prepare('INSERT INTO notification_events (id, created_at, event_type, reference, title, body, status, response_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(id, createdAt, eventType, reference, title, body, 'provider_error', JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
    throw error;
  }
};
app.post('/api/devices/register', (req, res) => {
  const token = text(req.body?.token);
  const platform = text(req.body?.platform) || 'unknown';
  const deviceName = text(req.body?.deviceName) || null;
  if (!token.startsWith('ExponentPushToken[')) return bad(res, 'A valid Expo push token is required');
  const updatedAt = new Date().toISOString();
  db.prepare('INSERT INTO devices (token, platform, device_name, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(token) DO UPDATE SET platform = excluded.platform, device_name = excluded.device_name, updated_at = excluded.updated_at').run(token, platform, deviceName, updatedAt);
  res.status(201).json({ ok: true, token, platform, updatedAt });
});
app.get('/api/notifications/devices', (_req, res) => {
  const rows = db.prepare('SELECT token, platform, device_name AS deviceName, updated_at AS updatedAt FROM devices ORDER BY updated_at DESC').all();
  res.json({ ok: true, devices: rows });
});
app.post('/api/notifications/events', async (req, res) => {
  const body = req.body ?? {};
  const eventType = text(body.eventType);
  const reference = text(body.reference) || null;
  const title = text(body.title);
  const message = text(body.body);
  if (!eventType || !title || !message) return bad(res, 'eventType, title, and body are required');
  try { res.status(201).json({ ok: true, ...(await dispatchNotification({ eventType, reference, title, body: message })) }); }
  catch (error) { res.status(502).json({ ok: false, error: error instanceof Error ? error.message : 'Push provider error' }); }
});
app.post('/api/notifications/test', async (req, res) => {
  try { res.status(201).json({ ok: true, ...(await dispatchNotification({ eventType: 'test', reference: text(req.body?.reference) || null, title: text(req.body?.title) || 'Forward test notification', body: text(req.body?.body) || 'Your Forward notification channel is working.' })) }); }
  catch (error) { res.status(502).json({ ok: false, error: error instanceof Error ? error.message : 'Push provider error' }); }
});
app.post('/api/policies/:id/renewal-reminder', async (req, res) => {
  const policyId = text(req.params.id);
  if (!policyId) return bad(res, 'policy id is required');
  try { res.status(201).json({ ok: true, ...(await dispatchNotification({ eventType: 'policy_renewal', reference: policyId, title: 'Your Forward policy is due for renewal', body: text(req.body?.body) || `Policy ${policyId} is due for renewal soon. Open Forward to review your premium and payment options.` })) }); }
  catch (error) { res.status(502).json({ ok: false, error: error instanceof Error ? error.message : 'Push provider error' }); }
});
app.patch('/api/claims/:id/status', async (req, res) => {
  const claimId = text(req.params.id);
  const status = text(req.body?.status);
  const allowed = new Set(['submitted', 'under_review', 'more_information_needed', 'approved', 'settled', 'closed']);
  if (!claimId || !allowed.has(status)) return bad(res, 'claim id and a valid status are required');
  const claim = db.prepare('SELECT id, reference FROM claims WHERE id = ? OR reference = ?').get(claimId, claimId);
  if (!claim) return res.status(404).json({ ok: false, error: 'Claim not found' });
  db.prepare('UPDATE claims SET status = ? WHERE id = ?').run(status, claim.id);
  try { res.json({ ok: true, claimId: claim.id, status, notification: await dispatchNotification({ eventType: 'claim_status', reference: claim.reference || claim.id, title: 'Forward claim update', body: text(req.body?.message) || `Your claim ${claim.reference || claim.id} is now ${status.replaceAll('_', ' ')}.` }) }); }
  catch (error) { res.status(502).json({ ok: false, claimId: claim.id, status, error: error instanceof Error ? error.message : 'Push provider error' }); }
});
const port = Number(process.env.PORT || 3001);
app.listen(port, '0.0.0.0', () => console.log(`Forward Auto API listening on http://0.0.0.0:${port}`));
