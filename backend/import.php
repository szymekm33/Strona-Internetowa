<?php
declare(strict_types=1);
require __DIR__.'/vendor/autoload.php';

function readCalendar(array $d, string $url): array {
    $refresh = !array_key_exists('ics',$d);
    if ($refresh) {
        if (parse_url($url,PHP_URL_SCHEME) !== 'https') fail('Ustaw prywatny adres HTTPS planu AGH w konfiguracji serwera.');
        $context = stream_context_create(['http'=>['timeout'=>12,'follow_location'=>0,'header'=>"Accept: text/calendar\r\n"]]);
        $source = @file_get_contents($url,false,$context,0,2000001);
        if ($source === false) fail('Nie udało się pobrać planu AGH. Poprzedni plan jest nadal dostępny.',502);
    } else { $source = $d['ics']; }
    if (!is_string($source) || strlen($source)>2000000 || !str_starts_with(ltrim($source,"\xEF\xBB\xBF \t\r\n"),'BEGIN:VCALENDAR')) fail('Wybierz plik iCalendar do 2 MB.');
    $zone = new DateTimeZone('Europe/Warsaw');
    $today = new DateTimeImmutable('today',$zone);
    $until = $today->modify('+1 year');
    $items = [];
    try {
        $calendar = Sabre\VObject\Reader::read($source);
        if ($calendar->name !== 'VCALENDAR') fail('Nieprawidłowy kalendarz.');
        $expanded = $calendar->expand($today->modify('-1 year'),$until,$zone);
        foreach ($expanded->select('VEVENT') as $event) {
            $uid = trim((string)$event->UID);
            if ($uid === '' || !isset($event->DTSTART)) fail('Termin AGH nie ma identyfikatora lub początku.');
            $recurrence = $event->{'RECURRENCE-ID'} ?? null;
            $key = hash('sha256',$uid."\0".($recurrence ? utc($recurrence->getDateTime($zone)) : ''));
            if (strtoupper((string)$event->STATUS) === 'CANCELLED') { $items[$key] = null; continue; }
            $date = $event->DTSTART->getDateTime($zone);
            $allDay = !$event->DTSTART->hasTime();
            $end = isset($event->DTEND) ? $event->DTEND->getDateTime($zone) : null;
            if (!$end && isset($event->DURATION)) $end = $date->add(Sabre\VObject\DateTimeParser::parseDuration((string)$event->DURATION));
            $end ??= $date->modify($allDay ? '+1 day' : '+1 minute');
            if ($end <= $date) fail('Termin AGH ma nieprawidłowy czas trwania.');
            $summary = trim((string)$event->SUMMARY) ?: 'Zajęcia AGH';
            $category = trim((string)($event->{'X-COURSE-TYPE'} ?? $event->CATEGORIES));
            if (!$category && preg_match('/\b(CWL|CWA|CWP|LEKT|WF|W|wykład|laboratorium|ćwiczenia|projekt)\b/iu',$summary,$match)) $category = $match[1];
            $group = trim((string)($event->{'X-GROUP'} ?? ''));
            if (!$group && preg_match('/(?:^|\n)\s*(?:grupa|group)\s*:\s*([^\r\n]+)/iu',(string)$event->DESCRIPTION,$match)) $group = trim($match[1]);
            $course = $group === '' ? $summary : $summary.' · '.$group;
            $items[$key] = [mb_substr($summary,0,90),utc($date),utc($end),(int)$allDay,
                (int)(strtoupper((string)$event->TRANSP)!=='TRANSPARENT'),mb_substr((string)$event->LOCATION,0,90),
                mb_substr($course,0,160),mb_substr($category ?: 'Inne',0,80)];
            if (count($items)>10000) fail('Plan zawiera zbyt wiele terminów.');
        }
    } catch (DomainException $e) { throw $e; }
    catch (Throwable $e) { fail('Nie udało się odczytać dat lub powtórzeń z tego pliku iCalendar.'); }
    return [$items,$refresh,utc($today),utc($until)];
}

function mergeCalendar(PDO $db, array $import, int $author): void {
    [$items,$refresh,$from,$until] = $import;
    if ($refresh) {
        foreach (query($db,'SELECT source_key FROM events WHERE source_key IS NOT NULL AND starts_at>=? AND starts_at<?',[$from,$until]) as $row) {
            if (!array_key_exists($row['source_key'],$items)) $items[$row['source_key']] = null;
        }
    }
    foreach ($items as $key=>$item) {
        if (!$item) { query($db,'DELETE FROM events WHERE source_key=?',[$key]); continue; }
        query($db,"INSERT INTO events (title,starts_at,ends_at,all_day,zajmuje_czas,place,course,course_type,source_key,author_id,calendar_id)
            VALUES (?,?,?,?,?,?,?,?,?,?,'agh') ON DUPLICATE KEY UPDATE title=VALUES(title),starts_at=VALUES(starts_at),
            ends_at=VALUES(ends_at),all_day=VALUES(all_day),zajmuje_czas=VALUES(zajmuje_czas),place=VALUES(place),
            course=VALUES(course),course_type=VALUES(course_type)",[...$item,$key,$author]);
        $id = query($db,'SELECT event_id FROM events WHERE source_key=?',[$key])->fetchColumn();
        setPeople($db,(int)$id,'1');
    }
}
