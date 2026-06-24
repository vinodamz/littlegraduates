<?php
header('Content-Type: application/json');
$cfg = @include __DIR__ . '/config.php';
if (!is_array($cfg)) $cfg = [];

function out($a,$code=200){ http_response_code($code); echo json_encode($a); exit; }

$ct = $_SERVER['CONTENT_TYPE'] ?? '';
$data = stripos($ct,'application/json')!==false
  ? (json_decode(file_get_contents('php://input'), true) ?: [])
  : $_POST;

if (!empty($data['company'])) out(['ok'=>true]);            // honeypot
$name  = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
if ($name===''||$phone==='') out(['ok'=>false,'error'=>'Name and phone are required.'],422);

$rec = [
  'type'      => substr(trim($data['type'] ?? 'tour'),0,32),
  'name'      => substr($name,0,120),
  'phone'     => substr($phone,0,40),
  'email'     => substr(trim($data['email'] ?? ''),0,160),
  'child_age' => substr(trim($data['child_age'] ?? ''),0,40),
  'message'   => substr(trim(($data['message'] ?? '') ?: ($data['preferred_time'] ?? '')),0,2000),
  'source'    => 'website',
  'created_at'=> date('Y-m-d H:i:s'),
];

$errors = [];

// store in MySQL
if (!empty($cfg['db_host'])) {
  try {
    $m = new mysqli($cfg['db_host'],$cfg['db_user'],$cfg['db_pass'],$cfg['db_name']);
    $m->set_charset('utf8mb4');
    $s = $m->prepare('INSERT INTO inquiries (type,name,phone,email,child_age,message,source,created_at) VALUES (?,?,?,?,?,?,?,?)');
    $s->bind_param('ssssssss',$rec['type'],$rec['name'],$rec['phone'],$rec['email'],$rec['child_age'],$rec['message'],$rec['source'],$rec['created_at']);
    $s->execute(); $s->close(); $m->close();
  } catch (Throwable $e) { $errors[]='db'; }
}

// email notification
if (!empty($cfg['notify_email'])) {
  $body = "New {$rec['type']} inquiry\n\nName: {$rec['name']}\nPhone: {$rec['phone']}\nEmail: {$rec['email']}\nChild age: {$rec['child_age']}\nMessage: {$rec['message']}\nTime: {$rec['created_at']}";
  @mail($cfg['notify_email'], "New {$rec['type']} inquiry — website", $body, "From: ".($cfg['from_email'] ?? $cfg['notify_email']));
}

// forward to CRM
if (!empty($cfg['crm_webhook_url'])) {
  $ch = curl_init($cfg['crm_webhook_url']);
  curl_setopt_array($ch,[
    CURLOPT_POST=>true, CURLOPT_RETURNTRANSFER=>true, CURLOPT_TIMEOUT=>8,
    CURLOPT_HTTPHEADER=>array_filter(['Content-Type: application/json', !empty($cfg['crm_api_key'])?('Authorization: Bearer '.$cfg['crm_api_key']):null]),
    CURLOPT_POSTFIELDS=>json_encode($rec),
  ]);
  curl_exec($ch); if(curl_errno($ch)) $errors[]='crm'; curl_close($ch);
}

out(['ok'=>count($errors)===0,'stored'=>count($errors)===0,'errors'=>$errors]);
