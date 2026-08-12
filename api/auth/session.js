'use strict';
const { currentUser, json, method } = require('../_shared');

module.exports = async function handler(req, res) {
  if (!method(req, res, ['GET'])) return;
  try {
    const user = await currentUser(req, res);
    return json(res, 200, { user });
  } catch (error) {
    if (error?.code === 'NOT_CONFIGURED') return json(res, 503, { message: error.message, code: error.code });
    return json(res, 200, { user: null });
  }
};
