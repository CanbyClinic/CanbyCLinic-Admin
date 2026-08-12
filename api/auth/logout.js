'use strict';
const { ACCESS_COOKIE, authRequest, clearSession, json, method, parseCookies, sameOrigin } = require('../_shared');

module.exports = async function handler(req, res) {
  if (!method(req, res, ['POST']) || !sameOrigin(req, res)) return;
  const token = parseCookies(req)[ACCESS_COOKIE];
  if (token) {
    try { await authRequest('/logout', { token }); } catch (_) {}
  }
  clearSession(res);
  return json(res, 200, { ok: true });
};
