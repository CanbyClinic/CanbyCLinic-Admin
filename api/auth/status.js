'use strict';
const { isAuthConfigured, json, method } = require('../_shared');

module.exports = async function handler(req, res) {
  if (!method(req, res, ['GET'])) return;
  return json(res, 200, { configured: isAuthConfigured() });
};
