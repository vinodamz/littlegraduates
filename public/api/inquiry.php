<?php
// Inserts website enquiries straight into the mtt CRM (inquiry_families) as a 'lead'.
// config.php holds mtt's DB credentials (reuse the same DB as mtt).
header('Content-Type: application/json');
$cfg = @include __DIR__ . '/config.php';
if (!is_array($cfg)) $cfg = [];

function out($a,$code=200){ http_response_code($code); echo json_encode($a); exit; }

$ct = $_SERVER['CONTENT_TYPE'] ?? '';
$data = stripos($ct,'application/json')!==false
  ? (json_decode(file_get_contents('php://input'), true) ?: [])
  : $_POST;

if (!empty($data['company'])) out(['ok'=>true]);                 // honeypot
$name  = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
if ($name===''||$phone==='') out(['ok'=>false,'error'=>'Name and phone are required.'],422);

$type   = trim($data['type'] ?? 'tour');
$email  = trim($data['email'] ?? '');
$age    = trim($data['child_age'] ?? '');
$msg    = trim(($data['message'] ?? '') ?: ($data['preferred_time'] ?? ''));
$ip     = $_SERVER['REMOTE_ADDR'] ?? '';
$ipHash = $ip ? hash('sha256', $ip) : null;

$noteParts = [];
$noteParts[] = 'Website enquiry ('.$type.')';
if ($age !== '') $noteParts[] = 'Child age: '.$age;
if ($msg !== '') $noteParts[] = $msg;
$notes = implode("\n", $noteParts);

$db = $cfg['db'] ?? $cfg;   // accept either ['db'=>[...]] (mtt style) or flat keys
$host = $db['host'] ?? 'localhost';
$dbn  = $db['name'] ?? '';
$usr  = $db['user'] ?? '';
$pwd  = $db['password'] ?? ($db['pass'] ?? '');

if ($dbn==='') out(['ok'=>false,'errors'=>['config']],200);

$errors = [];
try {
  $m = new mysqli($host,$usr,$pwd,$dbn);
  $m->set_charset($db['charset'] ?? 'utf8mb4');

  // optional light rate-limit: skip if same IP submitted in last 30s
  if ($ipHash) {
    $rl = $m->prepare("SELECT 1 FROM inquiry_families WHERE ip_hash=? AND created_at > (NOW() - INTERVAL 30 SECOND) LIMIT 1");
    if ($rl) { $rl->bind_param('s',$ipHash); $rl->execute(); $rl->store_result();
      if ($rl->num_rows>0){ $rl->close(); $m->close(); out(['ok'=>true,'stored'=>true]); }
      $rl->close();
    }
  }

  // find the active 'website' campaign (the "Website form" starter row)
  $campId = null;
  if ($res = $m->query("SELECT id FROM crm_campaigns WHERE channel='website' AND active=1 ORDER BY id LIMIT 1")) {
    if ($row = $res->fetch_row()) $campId = (int)$row[0];
    $res->free();
  }

  $sql = "INSERT INTO inquiry_families
            (primary_name, primary_phone, primary_email, source, status, priority, campaign_id, notes, ip_hash)
          VALUES (?, ?, ?, 'website', 'lead', 'normal', ?, ?, ?)";
  $st = $m->prepare($sql);
  $emailVal = $email !== '' ? $email : null;
  $st->bind_param('sssiss', $name, $phone, $emailVal, $campId, $notes, $ipHash);
  $st->execute();
  $st->close();
  $m->close();
} catch (Throwable $e) {
  $errors[] = 'db';
}

// optional email notification
if (!empty($cfg['notify_email'])) {
  $body = "New website enquiry\n\nType: $type\nName: $name\nPhone: $phone\nEmail: $email\nChild age: $age\nMessage: $msg";
  @mail($cfg['notify_email'], "New website enquiry — $type", $body, "From: ".($cfg['from_email'] ?? $cfg['notify_email']));
}

out(['ok'=>count($errors)===0,'stored'=>count($errors)===0,'errors'=>$errors]);
