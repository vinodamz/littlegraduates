<?php
// Copy to config.php in this /api folder ON THE SERVER (never commit config.php).
//
// The website forms are proxied into the mtt CRM's own intake endpoints
// (crm/bot_event.php + crm/book_visit.php), so this file no longer needs any
// database credentials — only the CRM base URL and the shared secret.
return [
  // mtt CRM base URL, NO trailing slash.
  'mtt_crm_url'      => 'https://mtt.thelittlegraduates.in/crm',

  // Must EXACTLY equal mtt's app_settings.wacrm_sso_secret
  // (mtt admin → settings, or the wacrm_sso_secret row in app_settings).
  'wacrm_sso_secret' => 'PASTE_SAME_VALUE_AS_mtt_wacrm_sso_secret',

  // Optional: email each enquiry to the school as well.
  'notify_email'     => 'info@thelittlegraduates.in',
  'from_email'       => 'website@thelittlegraduates.in',
];
