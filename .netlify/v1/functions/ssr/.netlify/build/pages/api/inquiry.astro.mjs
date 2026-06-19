export { renderers } from '../../renderers.mjs';

const prerender = false;
const need = (v) => typeof v === "string" && v.trim().length > 0;
const POST = async ({ request }) => {
  let data = {};
  try {
    const ct = request.headers.get("content-type") || "";
    if (ct.includes("application/json")) data = await request.json();
    else {
      const fd = await request.formData();
      fd.forEach((v, k) => {
        data[k] = String(v);
      });
    }
  } catch {
    return json({ ok: false, error: "Bad request" }, 400);
  }
  if (data.company) return json({ ok: true });
  if (!need(data.name) || !need(data.phone)) {
    return json({ ok: false, error: "Name and phone are required." }, 422);
  }
  ({
    type: data.type || "tour",
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: (data.email || "").trim(),
    child_age: (data.child_age || "").trim(),
    message: (data.message || data.preferred_time || "").trim(),
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  });
  const errors = [];
  return json({ ok: errors.length === 0, stored: errors.length === 0, errors });
};
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
