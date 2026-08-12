'use strict';
const { authError, authRequest, body, email, json, method, rateLimit, sameOrigin, setSession } = require('../_shared');

module.exports = async function handler(req, res) {
  if (!method(req, res, ['POST']) || !sameOrigin(req, res) || !rateLimit(req, res, 'login', 10)) return;
  const input = body(req);
  const cleanEmail = email(input.email);
  const password = String(input.password || '');
  if (!cleanEmail || !password || password.length > 256) return json(res, 400, { message: 'Enter a valid email and password.' });
  try {
    const session = await authRequest('/token?grant_type=password', { body: { email: cleanEmail, password } });
    setSession(res, session);
    return json(res, 200, { user: session.user });
  } catch (error) { return authError(res, error); }
};
