'use strict';
const { ACCESS_COOKIE, authError, authRequest, body, json, method, parseCookies, rateLimit, sameOrigin } = require('../_shared');

function strong(value) {
  return value.length >= 12 && value.length <= 256 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
}

module.exports = async function handler(req, res) {
  if (!method(req, res, ['POST']) || !sameOrigin(req, res) || !rateLimit(req, res, 'update-password', 5)) return;
  const password = String(body(req).password || '');
  const token = parseCookies(req)[ACCESS_COOKIE];
  if (!token) return json(res, 401, { message: 'Your recovery session expired. Request a new reset link.' });
  if (!strong(password)) return json(res, 400, { message: 'Check the password rules and try again.' });
  try {
    await authRequest('/user', { method: 'PUT', token, body: { password } });
    return json(res, 200, { ok: true });
  } catch (error) { return authError(res, error); }
};
