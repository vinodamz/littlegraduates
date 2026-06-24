<?php
// Copy to config.php in this /api folder ON THE SERVER (never commit config.php).
//
// The website forms are proxied into the mtt CRM's intake endpoints
// (crm/bot_event.php + crm/book_visit.php). Those calls are authenticated with
// mtt's shared secret (wacrm_sso_secret). You can supply it EITHER way:
//
//   (A) Keep the 'db' block below (same database as mtt) — inquiry.php reads the
//       secret straight from app_settings. Nothing to paste. Easiest.
//   (B) Drop 'db' and set 'wacrm_sso_secret' explicitly (no DB access from here).
//
// 'mtt_crm_url' is optional; it defaults to https://mtt.thelittlegraduates.in/crm.
return [
  // (A) Same DB as mtt — the secret is read from app_settings automatically.
  'db' => [
    'host'     => 'localhost',
    'name'     => 'ideyyfbn_lg',      // <-- mtt's database name
    'user'     => 'ideyyfbn_lg',      // <-- mtt's database user
    'password' => 'MTT_DB_PASSWORD',  // <-- mtt's database password
    'charset'  => 'utf8mb4',
  ],

  // (B) Alternative to the 'db' block — paste mtt's app_settings.wacrm_sso_secret:
  // 'wacrm_sso_secret' => 'PASTE_SAME_VALUE_AS_mtt_wacrm_sso_secret',

  // Optional override (defaults to the live CRM URL), NO trailing slash.
  // 'mtt_crm_url'   => 'https://mtt.thelittlegraduates.in/crm',

  // Optional: email each enquiry to the school as well.
  'notify_email'     => 'info@thelittlegraduates.in',
  'from_email'       => 'website@thelittlegraduates.in',
];
