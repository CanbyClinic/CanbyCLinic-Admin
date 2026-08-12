'use strict';

const ACCESS_COOKIE = 'canby_access';
const REFRESH_COOKIE = 'canby_refresh';
const attempts = new Map();

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function method(req, res, allowed) {
  if (allowed.includes(req.method)) return true;
  res.setHeader('Allow', allowed.join(', '));
  json(res, 405, { message: 'Method not allowed.' });
  return false;
}

function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.length <= 16000) {
    try { return JSON.parse(req.body); } catch (_) { return {}; }
  }
  return {};
}

function sameOrigin(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const source = req.headers.origin || req.headers.referer;
  if (!host || !source) {
    if (process.env.NODE_ENV !== 'production') return true;
    json(res, 403, { message: 'Request verification failed.' });
    return false;
  }
  try {
    if (new URL(source).host === host) return true;
  } catch (_) {}
  json(res, 403, { message: 'Request verification failed.' });
  return false;
}

function rateLimit(req, res, bucket, limit = 12, windowMs = 15 * 60 * 1000) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || now > current.reset) {
    attempts.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  current.count += 1;
  if (current.count <= limit) return true;
  res.setHeader('Retry-After', String(Math.ceil((current.reset - now) / 1000)));
  json(res, 429, { message: 'Too many attempts. Please wait and try again.' });
  return false;
}

function authConfig() {
  const url = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const anon = process.env.SUPABASE_ANON_KEY || '';
  return url && anon ? { url, anon } : null;
}

function isAuthConfigured() {
  return Boolean(authConfig());
}

async function authRequest(path, options = {}) {
  const config = authConfig();
  if (!config) {
    const error = new Error('The secure portal is not connected yet.');
    error.code = 'NOT_CONFIGURED';
    throw error;
  }
  const response = await fetch(`${config.url}/auth/v1${path}`, {
    method: options.method || 'POST',
    headers: {
      apikey: config.anon,
      Authorization: `Bearer ${options.token || config.anon}`,
      'Content-Type': 'application/json',
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error('The email or password could not be verified.');
    error.status = response.status;
    error.detail = result;
    throw error;
  }
  return result;
}

function parseCookies(req) {
  return String(req.headers.cookie || '').split(';').reduce((all, pair) => {
    const index = pair.indexOf('=');
    if (index < 0) return all;
    const key = pair.slice(0, index).trim();
    try { all[key] = decodeURIComponent(pair.slice(index + 1).trim()); } catch (_) {}
    return all;
  }, {});
}

function cookie(name, value, maxAge) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

function setSession(res, session) {
  const accessMax = Math.max(60, Number(session.expires_in) || 3600);
  res.setHeader('Set-Cookie', [
    cookie(ACCESS_COOKIE, session.access_token, accessMax),
    cookie(REFRESH_COOKIE, session.refresh_token, 60 * 60 * 24 * 30),
  ]);
}

function clearSession(res) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', [
    `${ACCESS_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`,
    `${REFRESH_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`,
  ]);
}

async function currentUser(req, res) {
  const cookies = parseCookies(req);
  if (!cookies[ACCESS_COOKIE] && !cookies[REFRESH_COOKIE]) return null;
  if (cookies[ACCESS_COOKIE]) {
    try {
      return await authRequest('/user', { method: 'GET', token: cookies[ACCESS_COOKIE] });
    } catch (_) {}
  }
  if (!cookies[REFRESH_COOKIE]) return null;
  try {
    const session = await authRequest('/token?grant_type=refresh_token', { body: { refresh_token: cookies[REFRESH_COOKIE] } });
    setSession(res, session);
    return session.user || null;
  } catch (_) {
    clearSession(res);
    return null;
  }
}

function email(value) {
  const clean = String(value || '').trim().toLowerCase();
  return clean.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) ? clean : '';
}

function text(value, max = 100) {
  return String(value || '').trim().replace(/[<>]/g, '').slice(0, max);
}

function authError(res, error) {
  if (error?.code === 'NOT_CONFIGURED') return json(res, 503, { message: error.message, code: error.code });
  return json(res, 401, { message: 'The email or password could not be verified.' });
}

module.exports = {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  authError,
  authRequest,
  body,
  clearSession,
  currentUser,
  email,
  json,
  isAuthConfigured,
  method,
  parseCookies,
  rateLimit,
  sameOrigin,
  setSession,
  text,
};
