<?php
declare(strict_types=1);
require_once __DIR__ . '/events.php';
require_once __DIR__ . '/session.php';
date_default_timezone_set('Europe/Warsaw');

function database(array $cfg): PDO {
    return new PDO($cfg['dsn'], $cfg['db_user'], $cfg['db_password'], [
        PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES=>false
    ]);
}

function login(PDO $db, array $cfg, array $d, bool $local): void {
    $login = strtolower(textField($d,'login',24));
    $accounts = ['szymek'=>1,'oliwusia'=>2];
    if (!isset($accounts[$login])) fail('Nieprawidłowy login lub hasło.',401);
    $db->beginTransaction();
    foreach ($accounts as $name=>$id) {
        if (query($db,'SELECT user_id FROM users WHERE user_id=?',[$id])->fetchColumn()) continue;
        $password = getenv(strtoupper($name).'_PASSWORD');
        if ($local && !$password) fail('Brak lokalnego hasła konta.',503);
        $hash = $local ? password_hash($password, PASSWORD_DEFAULT) : ($cfg[$name.'_hash'] ?? '');
        if (empty(password_get_info($hash)['algo'])) fail('Uzupełnij konfigurację obu kont.',503);
        query($db,'INSERT IGNORE INTO users (user_id,login,password_hash) VALUES (?,?,?)',[$id,$name,$hash]);
    }
    $row = query($db,'SELECT *,last_failure > UTC_TIMESTAMP() - INTERVAL 5 MINUTE AS recent FROM users WHERE login=? FOR UPDATE',[$login])->fetch();
    if ($row['recent'] && $row['failures'] >= 10) fail('Spróbuj ponownie za pięć minut.',429);
    $password = $d['password'] ?? '';
    if (!is_string($password) || strlen($password)>1024 || !password_verify($password,$row['password_hash'])) {
        query($db,'UPDATE users SET failures=?,last_failure=UTC_TIMESTAMP() WHERE user_id=?',[($row['recent'] ? $row['failures'] : 0)+1,$row['user_id']]);
        $db->commit();
        fail('Nieprawidłowy login lub hasło.',401);
    }
    query($db,'UPDATE users SET failures=0,last_failure=NULL WHERE user_id=?',[$row['user_id']]);
    $db->commit();
    session_regenerate_id(true);
    $_SESSION = ['user'=>(int)$row['user_id'], 'csrf'=>bin2hex(random_bytes(32))];
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: private, no-store');
header('X-Content-Type-Options: nosniff');
$local = getenv('CALENDAR_LOCAL') === '1';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($local && in_array($origin,['http://localhost:3000','http://127.0.0.1:3000'],true)) {
    header('Access-Control-Allow-Origin: '.$origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, X-Calendar-CSRF');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

try {
    startSiteSession();
    $method = $_SERVER['REQUEST_METHOD'];
    if (!in_array($method,['GET','POST'],true)) fail('Niedozwolona metoda.',405);
    $d = [];
    if ($method === 'POST') {
        if (!hash_equals($_SESSION['csrf'],$_SERVER['HTTP_X_CALENDAR_CSRF'] ?? '')) fail('Odśwież sesję.',403);
        $raw = file_get_contents('php://input',false,null,0,3000001);
        if (strlen($raw)>3000000) fail('Plik jest za duży.');
        $d = json_decode($raw,true,12,JSON_THROW_ON_ERROR);
        if (!is_array($d)) fail('Nieprawidłowe dane.');
    }
    $action = $method === 'GET' ? 'load' : ($d['action'] ?? '');
    if ($action === 'logout') {
        $_SESSION = [];
        session_regenerate_id(true);
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    if ($action !== 'load' && $action !== 'logout' && $action !== 'login' && !isSiteUser()) fail('Zaloguj się ponownie.',401);
    if ($action === 'login' || isSiteUser()) {
        $cfg = $local ? ['dsn'=>'mysql:host=database;dbname=razem;charset=utf8mb4','db_user'=>'razem','db_password'=>getenv('DB_PASSWORD')] : require __DIR__.'/config.php';
        $db = database($cfg);
        if ($action === 'login') login($db,$cfg,$d,$local);
        $mutating = !in_array($action,['load','login','logout'],true);
        if ($action === 'import') {
            require_once __DIR__.'/import.php';
            $import = readCalendar($d, $cfg['agh_url'] ?? getenv('AGH_URL') ?: '');
        }
        $db->beginTransaction();
        if ($mutating) {
            $revision = (int)$db->query('SELECT revision FROM calendar_settings WHERE id=1 FOR UPDATE')->fetchColumn();
            if ($revision !== ($d['revision'] ?? null)) fail('Kalendarz zmienił się na drugim koncie. Pobrano aktualne dane. Sprawdź je i ponów operację.',409);
            switch ($action) {
                case 'save': saveEvent($db,$d,(int)$_SESSION['user']); break;
                case 'delete':
                    [$targets] = editTargets($db,(int)($d['id'] ?? 0),$d['scope'] ?? 'one');
                    foreach ($targets as $row) query($db,'DELETE FROM events WHERE event_id=?',[$row['event_id']]);
                    break;
                case 'import': mergeCalendar($db,$import,(int)$_SESSION['user']); break;
                case 'choice':
                    $kind = $d['kind'] ?? '';
                    $key = textField($d,'key',160);
                    if (!in_array($kind,['type','course','term'],true) || $key==='') fail('Nieprawidłowy wybór.');
                    if (($d['included'] ?? null) === null) query($db,'DELETE FROM agh_choices WHERE kind=? AND choice_key=?',[$kind,$key]);
                    elseif (is_bool($d['included'])) query($db,'INSERT INTO agh_choices VALUES (?,?,?) ON DUPLICATE KEY UPDATE included=VALUES(included)',[$kind,$key,(int)$d['included']]);
                    else fail('Nieprawidłowy wybór.');
                    break;
                default: fail('Nieznana operacja.',400);
            }
            $db->exec('UPDATE calendar_settings SET revision=revision+1 WHERE id=1');
        }
        $state = snapshot($db);
        $db->commit();
    }
    echo json_encode(['user'=>isSiteUser() ? $_SESSION['user'] : null,'csrf'=>$_SESSION['csrf'],'calendar'=>$state ?? null],JSON_THROW_ON_ERROR);
} catch (Throwable $e) {
    if (isset($db) && $db->inTransaction()) $db->rollBack();
    $expected = $e instanceof DomainException;
    http_response_code($expected ? $e->getCode() : ($e instanceof JsonException ? 400 : 500));
    if (!$expected) error_log('Calendar request failed: '.get_class($e).' in '.basename($e->getFile()).':'.$e->getLine());
    echo json_encode(['error'=>$expected ? $e->getMessage() : 'Nie udało się obsłużyć żądania. Sprawdź konfigurację serwera.']);
}
