'use strict';
const { body, email, json, method, rateLimit, sameOrigin, text } = require('./_shared');

const TYPES = new Set(['appointment', 'forms', 'language', 'volunteer', 'donation', 'general']);
const METHODS = new Set(['phone', 'email']);

module.exports = async function handler(req, res) {
  if (!method(req, res, ['POST']) || !sameOrigin(req, res) || !rateLimit(req, res, 'contact', 5, 60 * 60 * 1000)) return;
  const input = body(req);
  if (input.website) return json(res, 202, { ok: true });
  const record = {
    first_name: text(input.firstName, 80),
    last_name: text(input.lastName, 80),
    email: input.email ? email(input.email) : null,
    phone: input.phone ? text(input.phone, 30) : null,
    preferred_contact: text(input.preferredContact, 12),
    request_type: text(input.requestType, 24),
  };
  if (!record.first_name || !record.last_name || !METHODS.has(record.preferred_contact) || !TYPES.has(record.request_type)) return json(res, 400, { message: 'Check the required fields and try again.' });
  if (record.preferred_contact === 'phone' && !record.phone) return json(res, 400, { message: 'Enter a phone number for a phone reply.' });
  if (record.preferred_contact === 'email' && !record.email) return json(res, 400, { message: 'Enter a valid email address for an email reply.' });

  const supabaseUrl = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const resendKey = process.env.RESEND_API_KEY || '';
  const clinicEmail = process.env.CLINIC_EMAIL || 'info@puravidacc.org';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || '';
  if (!supabaseUrl || !serviceKey || !resendKey || !fromEmail) return json(res, 503, { message: 'Online requests are not connected yet.', code: 'NOT_CONFIGURED' });

  try {
    const insert = await fetch(`${supabaseUrl}/rest/v1/contact_requests`, {
      method: 'POST',
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify(record),
    });
    if (!insert.ok) throw new Error('storage');
    const rows = await insert.json().catch(() => []);
    const requestId = rows[0]?.id;
    const notice = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromEmail,
        to: [clinicEmail],
        subject: 'New secure website contact request',
        text: 'A new website contact request is available in the secure clinic queue. Sign in to the approved administrative system to review it. No patient details are included in this email.',
      }),
    }).catch(() => ({ ok: false }));
    if (requestId) {
      await fetch(`${supabaseUrl}/rest/v1/contact_requests?id=eq.${encodeURIComponent(requestId)}`, {
        method: 'PATCH',
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ notification_status: notice.ok ? 'sent' : 'failed' }),
      }).catch(() => {});
    }
    return json(res, 202, { ok: true });
  } catch (_) {
    return json(res, 502, { message: 'The request could not be sent securely.' });
  }
};
