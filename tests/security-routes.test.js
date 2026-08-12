'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');

function response() {
  return {
    headers: {},
    statusCode: 0,
    setHeader(name, value) { this.headers[name] = value; },
    end(value) { this.value = value; },
    get body() { return this.value ? JSON.parse(this.value) : null; },
  };
}

function request(overrides = {}) {
  return { method: 'POST', headers: {}, body: {}, socket: { remoteAddress: '127.0.0.1' }, ...overrides };
}

test('login fails closed without clinic credentials', async () => {
  const handler = require('../api/auth/login');
  const res = response();
  await handler(request({ body: { email: 'patient@example.com', password: 'ValidPassword!123' } }), res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.code, 'NOT_CONFIGURED');
});

test('contact request fails closed without secure storage and notification credentials', async () => {
  const handler = require('../api/contact');
  const res = response();
  await handler(request({ body: { firstName: 'Test', lastName: 'Patient', email: 'patient@example.com', preferredContact: 'email', requestType: 'general' } }), res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.code, 'NOT_CONFIGURED');
});

test('session endpoint returns no user when no protected cookies exist', async () => {
  const handler = require('../api/auth/session');
  const res = response();
  await handler(request({ method: 'GET' }), res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.user, null);
});

test('production post requests reject a foreign origin', async () => {
  const oldEnvironment = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  const handler = require('../api/auth/logout');
  const res = response();
  await handler(request({ headers: { host: 'clinic.example.org', origin: 'https://attacker.example.com' } }), res);
  process.env.NODE_ENV = oldEnvironment;
  assert.equal(res.statusCode, 403);
});

test('successful login stores both tokens in HttpOnly cookies', async () => {
  const oldFetch = global.fetch;
  process.env.SUPABASE_URL = 'https://clinic.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'publishable-test-key';
  global.fetch = async () => ({
    ok: true,
    json: async () => ({ access_token: 'access-test', refresh_token: 'refresh-test', expires_in: 3600, user: { id: 'user-1', email: 'patient@example.com' } }),
  });
  const handler = require('../api/auth/login');
  const res = response();
  await handler(request({ body: { email: 'patient@example.com', password: 'ValidPassword!123' } }), res);
  global.fetch = oldFetch;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_ANON_KEY;
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['Set-Cookie'].length, 2);
  assert.ok(res.headers['Set-Cookie'].every((value) => value.includes('HttpOnly') && value.includes('SameSite=Strict')));
});

test('clinic notification email contains no patient details', async () => {
  const oldFetch = global.fetch;
  process.env.SUPABASE_URL = 'https://clinic.supabase.co';
  process.env.SUPABASE_SECRET_KEY = 'secret-test-key';
  process.env.RESEND_API_KEY = 'resend-test-key';
  process.env.CONTACT_FROM_EMAIL = 'notifications@clinic.example';
  let notificationBody;
  global.fetch = async (url, options) => {
    if (url === 'https://api.resend.com/emails') {
      notificationBody = JSON.parse(options.body);
      return { ok: true };
    }
    if (options.method === 'PATCH') return { ok: true };
    return { ok: true, json: async () => [{ id: 'request-1' }] };
  };
  const handler = require('../api/contact');
  const res = response();
  await handler(request({ socket: { remoteAddress: '127.0.0.2' }, body: { firstName: 'PrivateFirst', lastName: 'PrivateLast', email: 'private@example.com', preferredContact: 'email', requestType: 'general' } }), res);
  global.fetch = oldFetch;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SECRET_KEY;
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_FROM_EMAIL;
  assert.equal(res.statusCode, 202);
  const serialized = JSON.stringify(notificationBody);
  assert.equal(serialized.includes('PrivateFirst'), false);
  assert.equal(serialized.includes('PrivateLast'), false);
  assert.equal(serialized.includes('private@example.com'), false);
});
