'use strict';
const { authError, authRequest, body, json, method, rateLimit, sameOrigin, setSession } = require('../_shared');

module.exports = async function handler(req, res) {
  if (!method(req, res, ['POST']) || !sameOrigin(req, res) || !rateLimit(req, res, 'accept-session', 8)) return;
  const input = body(req);
  const accessToken = String(input.accessToken || '');
  const refreshToken = String(input.refreshToken || '');
  if (!accessToken || !refreshToken || accessToken.length > 5000 || refreshToken.length > 5000) return json(res, 400, { message: 'The verification link is invalid or expired.' });
  try {
    const user = await authRequest('/user', { method: 'GET', token: accessToken });
    setSession(res, { access_token: accessToken, refresh_token: refreshToken, expires_in: 3600 });
    return json(res, 200, { user, type: String(input.type || '') });
  } catch (error) { return authError(res, error); }
};
