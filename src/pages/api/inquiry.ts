import type { APIRoute } from 'astro';

export const prerender = false;

const need = (v: FormDataEntryValue | null) => typeof v === 'string' && v.trim().length > 0;

export const POST: APIRoute = async ({ request }) => {
  let data: Record<string, string> = {};
  try {
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) data = await request.json();
    else {
      const fd = await request.formData();
      fd.forEach((v, k) => { data[k] = String(v); });
    }
  } catch {
    return json({ ok: false, error: 'Bad request' }, 400);
  }

  // honeypot anti-spam
  if (data.company) return json({ ok: true });

  if (!need(data.name) || !need(data.phone)) {
    return json({ ok: false, error: 'Name and phone are required.' }, 422);
  }

  const record = {
    type: data.type || 'tour',
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: (data.email || '').trim(),
    child_age: (data.child_age || '').trim(),
    message: (data.message || data.preferred_time || '').trim(),
    source: 'website',
    created_at: new Date().toISOString(),
  };

  const errors: string[] = [];

  // 1) Store in Supabase (Postgres) if configured
  const SB_URL = import.meta.env.SUPABASE_URL;
  const SB_KEY = import.meta.env.SUPABASE_SERVICE_KEY;
  if (SB_URL && SB_KEY) {
    try {
      const r = await fetch(`${SB_URL}/rest/v1/inquiries`, {
        method: 'POST',
        headers: {
          apikey: SB_KEY,
          Authorization: `Bearer ${SB_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(record),
      });
      if (!r.ok) errors.push(`db:${r.status}`);
    } catch { errors.push('db:network'); }
  }

  // 2) Forward to existing CRM webhook if configured
  const CRM_URL = import.meta.env.CRM_WEBHOOK_URL;
  if (CRM_URL) {
    try {
      await fetch(CRM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(import.meta.env.CRM_API_KEY ? { Authorization: `Bearer ${import.meta.env.CRM_API_KEY}` } : {}),
        },
        body: JSON.stringify(record),
      });
    } catch { errors.push('crm:network'); }
  }

  // 3) Email fallback via Web3Forms if neither DB nor CRM took it
  const W3F = import.meta.env.WEB3FORMS_KEY;
  if (!SB_URL && !CRM_URL && W3F) {
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_key: W3F, subject: `New ${record.type} inquiry`, ...record }),
      });
    } catch { errors.push('email:network'); }
  }

  return json({ ok: errors.length === 0, stored: errors.length === 0, errors });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
