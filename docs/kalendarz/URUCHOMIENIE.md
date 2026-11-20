# Kalendarz dla dwóch osób

## Na swoim komputerze

W katalogu projektu uruchom Docker Desktop. Przy pierwszym pobraniu repozytorium wykonaj `npm ci`, następnie uruchom:

```sh
npm run calendar:local
```

Otwórz [kalendarz lokalny](http://localhost:8088/kalendarz/). Wybierz login `szymek` lub `oliwusia`. Hasło odczytaj z odpowiedniego wiersza `SZYMEK_PASSWORD` lub `OLIWUSIA_PASSWORD` w pliku `.calendar-local/accounts.env`. Skrypt tworzy losowe hasła raz na danym komputerze. Plik jest pomijany przez Git. Nie wklejaj go do rozmów ani na hosting.

Podczas zmian interfejsu możesz równolegle uruchomić `npm run dev` i wejść na [kalendarz z podglądem zmian](http://localhost:3000/kalendarz/). Oba adresy korzystają z tej samej lokalnej bazy. Polecenie `npm run calendar:local` buduje ponownie frontend, pobiera biblioteki PHP i uruchamia serwer. Dane pozostają w nazwanym wolumenie Dockera. Do przerwania pracy użyj `docker compose --env-file .calendar-local/accounts.env stop`, a do wznowienia `docker compose --env-file .calendar-local/accounts.env start`.

## Jak używać

Kliknij puste pole w dniu lub tygodniu. Osoba, data i godzina pochodzą z wybranej komórki. Ustaw tytuł, wybierz kalendarz i naciśnij „Zapisz wydarzenie”. „Razem” oznacza oboje uczestników. Kliknięcie zapisanego wydarzenia otwiera edycję i usuwanie. Usunięcie wymaga potwierdzenia.

„Miesiąc” pokazuje liczbę wpisów i wyróżnione daty. Wybierz datę, aby zobaczyć listę lub otworzyć dzień. Filtry dotyczą wyświetlania. „Wolne razem” liczy przedziały ze wszystkich uwzględnionych wpisów oznaczonych „Zajmuje czas”, w tym całodniowych. Kliknięcie znalezionego przedziału otwiera wspólny wpis.

W „Uczelnie” wybierz UR lub UKEN i „Ułóż plan tygodnia”. Kliknij godzinę Oliwusi, ustaw koniec semestru i zapisz. Możesz wybrać tydzień albo dwa tygodnie odstępu. Wybór „Tylko ten termin” pozwala przesunąć lub usunąć jeden dzień serii. „Ten i następne” liczy kolejność według pierwotnych dat terminów.

Dla AGH można zaimportować plik .ics lub odświeżyć subskrypcję HTTPS zapisaną w prywatnej konfiguracji. Lokalnie dodaj do `.calendar-local/accounts.env` zmienną `AGH_URL` i uruchom ponownie `npm run calendar:local`. Okno importu obejmuje rok wstecz i rok do przodu. Powtórny import korzysta z UID i identyfikatora wystąpienia iCalendar. Plik scala wpisy. Odświeżenie pełnej subskrypcji dodatkowo uzgadnia przyszłe terminy w oknie importu. Historia pozostaje w bazie. Wyjątek pojedynczego terminu ma pierwszeństwo przed wyborem grupy, a grupa przed rodzajem zajęć. Wybór „Według grupy” lub „Według rodzaju zajęć” przywraca dziedziczenie.

## Jak przepływają dane

Powtórzenia i wyjątki w plikach iCalendar rozwija biblioteka sabre/vobject. [Dokumentacja obsługi serii iCalendar](https://sabre.io/vobject/recurrence/)

1. React w `app/kalendarz/page.tsx` pobiera sesję. PHP zwraca dane kalendarza po zalogowaniu. Użytkownik wybiera dzień, miesiąc albo tydzień.
2. Kliknięcie w siatkę przekazuje datę, godzinę i osobę do `EventDialog.tsx`. Formularz wysyła dane i token sesji do `/api/calendar.php`.
3. PHP ustala autora z sesji. Sprawdza pola, wersję kalendarza i przedział dat, a następnie w jednej transakcji zapisuje wydarzenie i uczestników. Wspólne wydarzenie ma jeden rekord oraz dwa powiązania w `event_participants`.
4. Baza przechowuje chwile w UTC. Formularz, granice dat całodniowych i wyświetlanie używają Europe/Warsaw. Kolejne zajęcia powstają o tej samej godzinie lokalnej także przez zmianę czasu. Przeglądarka dostaje zatwierdzone dane, umieszcza kafelki na osi i przelicza dostępność. Po odświeżeniu drugie konto pobiera ten sam plan.
5. Gdy dwie osoby jednocześnie zmieniają tę samą wersję kalendarza, serwer przyjmuje pierwszą transakcję. Drugiej osobie aplikacja pobiera nową wersję i pokazuje komunikat. W razie konfliktu zamknij formularz i otwórz ponownie aktualny wpis przed edycją.

## Hosting PHP bez konsoli

1. Potwierdź z administratorem obsługę PHP 8.2 lub nowszego, PDO MySQL, mbstring, DOM, XMLReader, XMLWriter, sesji, HTTPS oraz prywatnego katalogu obok katalogu strony. Subskrypcja AGH używa wychodzącego HTTPS z PHP. Ręczny import .ics działa również bez połączenia z uczelnią.
2. W pustej bazie MySQL lub MariaDB zaimportuj `backend/schema.sql` przez phpMyAdmin. Do aplikacji użyj osobnego użytkownika bazy z dostępem do jej tabel.
3. Wykonaj lokalnie `npm run calendar:local`. Wgraj zawartość `out/` do katalogu strony. Do prywatnego katalogu **razem** obok niego wgraj `backend/calendar.php`, `events.php`, `import.php` i całe `backend/vendor/`. Publiczny plik `api/calendar.php` dołącza prywatny kod z tej lokalizacji.
4. W prywatnym katalogu skopiuj `config.example.php` pod nazwą `config.php`. Podaj DSN, dane bazy i oddzielne hashe haseł dla obu kont. Możesz je wygenerować lokalnym PHP funkcją `password_hash($haslo, PASSWORD_DEFAULT)`. Konta powstają przy pierwszym logowaniu. Późniejsza zmiana hasła wymaga aktualizacji `users.password_hash`. Adres AGH jest opcjonalny. Flaga `CALENDAR_LOCAL` jest przeznaczona wyłącznie do lokalnego Dockera.
5. Otwórz stronę przez HTTPS. Dodaj testowy wpis z konta Szymka, odśwież kalendarz Oliwusi i sprawdź edycję. Odświeżenie AGH uruchamia przycisk. Automatyczny harmonogram wymaga wcześniejszego potwierdzenia możliwości hostingu.
