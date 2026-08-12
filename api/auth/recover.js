'use strict';
const { authError, authRequest, body, email, json, method, rateLimit, sameOrigin } = require('../_shared');

module.exports = async function handler(req, res) {
  if (!method(req, res, ['POST']) || !sameOrigin(req, res) || !rateLimit(req, res, 'recover', 5, 60 * 60 * 1000)) return;
  const cleanEmail = email(body(req).email);
  if (!cleanEmail) return json(res, 400, { message: 'Enter a valid email address.' });
  const redirect = `${String(process.env.SITE_URL || '').replace(/\/$/, '')}/patient-portal.html`;
  try {
    await authRequest(`/recover?redirect_to=${encodeURIComponent(redirect)}`, { body: { email: cleanEmail } });
    return json(res, 202, { ok: true });
  } catch (error) {
    if (error?.code === 'NOT_CONFIGURED') return authError(res, error);
    return json(res, 202, { ok: true });
  }
};
