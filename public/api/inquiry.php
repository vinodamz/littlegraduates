<?php
// Server-to-server proxy: forwards website form submissions into the mtt CRM's
// real intake endpoints so web leads are deduped, staged and logged exactly like
// WhatsApp leads. The marketing site holds NO database credentials — only the CRM
// base URL + the shared secret (config.php).
//
//   type=tour    -> crm/book_visit.php  (books an appointment + WhatsApp confirm)
//   type=fees    -> crm/bot_event.php   intent=asked_details  (-> Details shared)
//   type=contact -> crm/bot_event.php   intent=interested     (-> New)
//
// For fees/contact the bot_event reply_text is deliberately DISCARDED, so a web
// form never triggers an outbound WhatsApp to the parent.

header('Content-Type: application/json');

$cfg = @include __DIR__ . '/config.php';
if (!is_array($cfg)) $cfg = [];

function out($a, $code = 200) { http_response_code($code); echo json_encode($a); exit; }

$crmBase = rtrim((string)($cfg['mtt_crm_url'] ?? ''), '/');
$secret  = (string)($cfg['wacrm_sso_secret'] ?? '');
if ($crmBase === '' || $secret === '') out(['ok' => false, 'error' => 'Server not configured.'], 500);

$ct   = $_SERVER['CONTENT_TYPE'] ?? '';
$data = stripos($ct, 'application/json') !== false
  ? (json_decode(file_get_contents('php://input'), true) ?: [])
  : $_POST;

if (!empty($data['company'])) out(['ok' => true]);                 // honeypot

$name  = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
if ($name === '' || $phone === '') out(['ok' => false, 'error' => 'Name and phone are required.'], 422);

$type     = trim($data['type'] ?? 'contact');
$email    = trim($data['email'] ?? '');
$age      = trim($data['child_age'] ?? '');
$msg      = trim($data['message'] ?? '');
$clientIp = $_SERVER['REMOTE_ADDR'] ?? '';

/** POST to a CRM endpoint. Returns [httpCode:int, decodedJson:?array]. */
function crm_post(string $url, $body, array $headers): array {
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $body,          // form-encoded string or JSON string
    CURLOPT_HTTPHEADER     => $headers,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 20,
    CURLOPT_CONNECTTIMEOUT => 8,
  ]);
  $resp = curl_exec($ch);
  $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  return [$code, $resp !== false ? json_decode($resp, true) : null];
}

if ($type === 'tour') {
  // Real slot booking. book_visit.php trusts the forwarded client IP for its
  // per-parent rate limit because we present the shared secret.
  $form = http_build_query([
    'name'        => $name,
    'phone'       => $phone,
    'child_name'  => trim($data['child_name'] ?? ''),
    'programme'   => trim($data['programme'] ?? ''),
    'visit_date'  => trim($data['visit_date'] ?? ''),
    'visit_slot'  => trim($data['visit_slot'] ?? ''),
    'website_url' => '',                       // empty honeypot
    'format'      => 'json',
  ]);
  [$code, $j] = crm_post("$crmBase/book_visit.php", $form, [
    'Content-Type: application/x-www-form-urlencoded',
    'Accept: application/json',
    'X-Lead-Secret: ' . $secret,
    'X-Forwarded-For: ' . $clientIp,
  ]);
  if ($j === null) out(['ok' => false, 'error' => 'Could not reach the booking system. Please WhatsApp us.'], 502);
  if (!empty($j['ok'])) out(['ok' => true]);
  out(['ok' => false, 'error' => $j['error'] ?? 'Please check the date and time and try again.'], $code ?: 422);
}

// fees / contact -> bot_event.php (lead capture; reply_text discarded -> no WhatsApp).
$intent = $type === 'fees' ? 'asked_details' : 'interested';
$parts  = [$type === 'fees' ? 'Website fees enquiry' : 'Website contact form'];
if ($age !== '') $parts[] = 'Child age: ' . $age;
if ($msg !== '') $parts[] = $msg;

$payload = json_encode([
  'phone'   => $phone,
  'name'    => $name,
  'intent'  => $intent,
  'channel' => 'web',
  'source'  => 'website',
  'summary' => implode(' · ', $parts),
]);
[$code, $j] = crm_post("$crmBase/bot_event.php", $payload, [
  'Content-Type: application/json',
  'Accept: application/json',
  'X-Lead-Secret: ' . $secret,
]);

// Optional notification email to the school (best-effort).
if (!empty($cfg['notify_email'])) {
  $body = "New website enquiry\n\nType: $type\nName: $name\nPhone: $phone\nEmail: $email\nChild age: $age\nMessage: $msg";
  @mail($cfg['notify_email'], "New website enquiry — $type", $body, 'From: ' . ($cfg['from_email'] ?? $cfg['notify_email']));
}

if ($j === null) out(['ok' => false, 'error' => 'Could not reach the CRM. Please WhatsApp us.'], 502);
if (!empty($j['ok'])) out(['ok' => true]);
out(['ok' => false, 'error' => 'Something went wrong saving your enquiry. Please WhatsApp us.'], 502);
