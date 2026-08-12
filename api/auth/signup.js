'use strict';
const { authError, authRequest, body, email, json, method, rateLimit, sameOrigin, text } = require('../_shared');

function strong(value) {
  return value.length >= 12 && value.length <= 256 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
}

module.exports = async function handler(req, res) {
  if (!method(req, res, ['POST']) || !sameOrigin(req, res) || !rateLimit(req, res, 'signup', 6, 60 * 60 * 1000)) return;
  const input = body(req);
  const cleanEmail = email(input.email);
  const password = String(input.password || '');
  const firstName = text(input.firstName, 80);
  const lastName = text(input.lastName, 80);
  if (!cleanEmail || !firstName || !lastName || !strong(password)) return json(res, 400, { message: 'Check the required fields and password rules.' });
  const redirect = `${String(process.env.SITE_URL || '').replace(/\/$/, '')}/patient-portal.html`;
  if (!redirect.startsWith('https://') && process.env.NODE_ENV === 'production') return json(res, 503, { message: 'The secure portal is not connected yet.' });
  try {
    await authRequest(`/signup?redirect_to=${encodeURIComponent(redirect)}`, { body: { email: cleanEmail, password, data: { first_name: firstName, last_name: lastName } } });
    return json(res, 202, { message: 'Check your email to verify your account.' });
  } catch (error) {
    if (error?.code === 'NOT_CONFIGURED') return authError(res, error);
    return json(res, 202, { message: 'Check your email to continue if this address can be registered.' });
  }
};
