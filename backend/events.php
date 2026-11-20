<?php
declare(strict_types=1);

function query(PDO $db, string $sql, array $values = []): PDOStatement {
    $stmt = $db->prepare($sql);
    $stmt->execute($values);
    return $stmt;
}

function fail(string $message, int $status = 422): never {
    throw new DomainException($message, $status);
}

function textField(array $data, string $key, int $max): string {
    $value = $data[$key] ?? '';
    if (!is_string($value) || mb_strlen($value) > $max) fail('Sprawdź pole ' . $key . '.');
    return trim($value);
}

function dateValue(string $date): DateTimeImmutable {
    $value = DateTimeImmutable::createFromFormat('!Y-m-d', $date);
    if (!$value || $value->format('Y-m-d') !== $date || $date < '1001-01-01' || $date > '9998-12-31') fail('Nieprawidłowa data.');
    return $value;
}

function eventLocalTime(string $date, string $time): DateTimeImmutable {
    if (!preg_match('/^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/D', $time)) fail('Nieprawidłowa godzina.');
    $value = new DateTimeImmutable("$date $time");
    if ($value->format('Y-m-d H:i') !== "$date $time") fail('Ta godzina nie istnieje po zmianie czasu.');
    return $value;
}

function utc(DateTimeInterface $time): string {
    return DateTimeImmutable::createFromInterface($time)->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d H:i:s');
}

function localStamp(string $stamp): string {
    return (new DateTimeImmutable($stamp, new DateTimeZone('UTC')))->setTimezone(new DateTimeZone('Europe/Warsaw'))->format('Y-m-d H:i');
}

function snapshot(PDO $db): array {
    $settings = $db->query('SELECT revision,semester_end FROM calendar_settings WHERE id=1')->fetch();
    $events = [];
    $rows = $db->query('SELECT e.*, p.people FROM events e JOIN
        (SELECT event_id,GROUP_CONCAT(user_id ORDER BY user_id) AS people FROM event_participants GROUP BY event_id) p
        ON p.event_id=e.event_id ORDER BY starts_at,event_id');
    foreach ($rows as $r) {
        $start = localStamp($r['starts_at']);
        $end = localStamp($r['ends_at']);
        $events[] = [
            'id'=>(int)$r['event_id'], 'author'=>(int)$r['author_id'], 'person'=>$r['people'],
            'calendar'=>$r['calendar_id'], 'title'=>$r['title'], 'date'=>substr($start,0,10),
            'start'=>substr($start,11), 'endDate'=>substr($end,0,10), 'end'=>substr($end,11),
            'allDay'=>(bool)$r['all_day'], 'blocking'=>(bool)$r['zajmuje_czas'], 'important'=>(bool)$r['important'],
            'color'=>$r['color'], 'place'=>$r['place'], 'note'=>$r['note'], 'series'=>$r['series'],
            'source'=>$r['source_key'], 'course'=>$r['course'], 'courseType'=>$r['course_type']
        ];
    }
    $choices = ['type'=>new stdClass(), 'course'=>new stdClass(), 'term'=>new stdClass()];
    foreach ($db->query('SELECT * FROM agh_choices') as $r) $choices[$r['kind']]->{$r['choice_key']} = (bool)$r['included'];
    return ['revision'=>(int)$settings['revision'], 'semesterEnd'=>$settings['semester_end'], 'events'=>$events, 'choices'=>$choices];
}

function editTargets(PDO $db, int $id, string $scope): array {
    $item = query($db, 'SELECT * FROM events WHERE event_id=?', [$id])->fetch();
    if (!$item) fail('Wydarzenie zostało już usunięte.', 409);
    if ($item['source_key']) fail('Terminy AGH zmieniasz w ustawieniach importu.');
    if (!in_array($scope,['one','future','all'],true)) fail('Nieprawidłowy zakres zmian.');
    if (!$item['series'] || $scope === 'one') return [[$item], $item];
    $sql = 'SELECT * FROM events WHERE series=?';
    $values = [$item['series']];
    if ($scope === 'future') { $sql .= ' AND original_date>=?'; $values[] = $item['original_date']; }
    return [query($db,$sql,$values)->fetchAll(), $item];
}

function setPeople(PDO $db, int $id, string $person): void {
    query($db, 'DELETE FROM event_participants WHERE event_id=?', [$id]);
    foreach (explode(',', $person) as $user) query($db,'INSERT INTO event_participants VALUES (?,?)',[$id,$user]);
}

function saveEvent(PDO $db, array $d, int $author): void {
    $title = textField($d,'title',90);
    $calendar = $d['calendar'] ?? '';
    $person = $d['person'] ?? '';
    if ($title === '' || !in_array($calendar,['ur','uken','dates','plans'],true) || !in_array($person,['1','2','1,2'],true)) fail('Uzupełnij nazwę, kalendarz i uczestników.');
    $date = dateValue(textField($d,'date',10));
    $allDay = ($d['allDay'] ?? false) === true;
    $endDay = $allDay ? $date : dateValue(textField($d,'endDate',10) ?: $date->format('Y-m-d'));
    $span = (int)$date->diff($endDay)->format('%r%a');
    if ($span < 0) fail('Data zakończenia poprzedza początek.');
    $color = textField($d,'color',7);
    if ($color !== '' && !preg_match('/^#[0-9a-f]{6}$/iD',$color)) fail('Wybierz kolor z palety.');
    $place = textField($d,'place',90);
    $note = textField($d,'note',500);
    $repeat = (int)($d['repeat'] ?? 0);
    if (!in_array($repeat,[0,7,14],true)) fail('Nieprawidłowe powtarzanie.');
    $series = null;
    $dates = [];
    if (!empty($d['id'])) {
        [$targets,$selected] = editTargets($db,(int)$d['id'],$d['scope'] ?? 'one');
        $offset = dateValue(substr(localStamp($selected['starts_at']),0,10))->diff($date)->format('%r%a');
        foreach ($targets as $row) {
            $old = dateValue(substr(localStamp($row['starts_at']),0,10));
            $dates[(int)$row['event_id']] = $old->modify("$offset days");
        }
    } elseif ($repeat) {
        $until = dateValue(textField($d,'until',10));
        if ($until < $date || $until > $date->modify('+1 year')) fail('Wybierz koniec serii w ciągu roku od pierwszego terminu.');
        $series = bin2hex(random_bytes(16));
        for ($day=$date; $day <= $until; $day=$day->modify("+$repeat days")) $dates[] = $day;
        query($db,'UPDATE calendar_settings SET semester_end=? WHERE id=1',[$until->format('Y-m-d')]);
    } else { $dates[] = $date; }
    foreach ($dates as $index=>$day) {
        $ymd = $day->format('Y-m-d');
        $start = $allDay ? $day : eventLocalTime($ymd,textField($d,'start',5));
        $end = $allDay ? $day->modify('+1 day') : eventLocalTime($day->modify("+$span days")->format('Y-m-d'),textField($d,'end',5));
        if ($end <= $start) fail('Koniec musi wypadać po początku wydarzenia.');
        $fields = [$title,$calendar,utc($start),utc($end),(int)$allDay,(int)(($d['blocking'] ?? true) === true),
            (int)(($d['important'] ?? false) === true),$color,$place,$note];
        if (!empty($d['id'])) {
            $id = (int)$index;
            query($db,'UPDATE events SET title=?,calendar_id=?,starts_at=?,ends_at=?,all_day=?,zajmuje_czas=?,important=?,color=?,place=?,note=? WHERE event_id=?',[...$fields,$id]);
        } else {
            query($db,'INSERT INTO events (title,calendar_id,starts_at,ends_at,all_day,zajmuje_czas,important,color,place,note,author_id,series,original_date)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',[...$fields,$author,$series,$series ? $ymd : null]);
            $id = (int)$db->lastInsertId();
        }
        setPeople($db,$id,$person);
    }
}
