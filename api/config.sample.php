<?php
// Copy to config.php in this /api folder on the server (do NOT commit config.php).
// Reuse the SAME database credentials as mtt (includes/config.php in the mtt app),
// so website enquiries land in mtt's CRM (inquiry_families table).
return [
  'db' => [
    'host'     => 'localhost',
    'name'     => 'ideyyfbn_lg',      // <-- mtt's database name
    'user'     => 'ideyyfbn_lg',      // <-- mtt's database user
    'password' => 'MTT_DB_PASSWORD',  // <-- mtt's database password
    'charset'  => 'utf8mb4',
  ],
  'notify_email' => 'info@thelittlegraduates.in',
  'from_email'   => 'website@thelittlegraduates.in',
];
