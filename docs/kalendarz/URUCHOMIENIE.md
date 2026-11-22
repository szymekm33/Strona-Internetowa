# Kalendarz dla dwóch osób

## Na swoim komputerze

W katalogu projektu uruchom Docker Desktop. Przy pierwszym pobraniu repozytorium wykonaj `npm ci`, następnie uruchom:

```sh
npm run calendar:local
```

Otwórz [stronę lokalną](http://localhost:8088/). Przed wejściem na Start lub dowolną zakładkę zobaczysz logowanie. Wybierz login `szymek` lub `oliwusia`. Hasło odczytaj z odpowiedniego wiersza `SZYMEK_PASSWORD` lub `OLIWUSIA_PASSWORD` w pliku `.calendar-local/accounts.env`. Skrypt tworzy losowe hasła raz na danym komputerze. Plik jest pomijany przez Git. Nie wklejaj go do rozmów ani na hosting. Bezpośredni link, np. `/kalendarz/`, po zalogowaniu otworzy wybraną podstronę. Wylogowanie w nagłówku zamyka całą stronę.

Podczas zmian interfejsu możesz równolegle uruchomić `npm run dev` i wejść na [kalendarz z podglądem zmian](http://localhost:3000/kalendarz/). Oba adresy korzystają z tej samej lokalnej bazy. Polecenie `npm run calendar:local` buduje ponownie frontend, pobiera biblioteki PHP i uruchamia serwer. Dane pozostają w nazwanym wolumenie Dockera. Do przerwania pracy użyj `docker compose --env-file .calendar-local/accounts.env stop`, a do wznowienia `docker compose --env-file .calendar-local/accounts.env start`.

Port 3000 to serwer programistyczny Next.js z bramką logowania w interfejsie. Pełną ochronę HTML i danych React zapewnia Apache/PHP pod portem 8088: dokumenty bez sesji przekierowuje do `/logowanie/`, a prywatne żądania danych React odrzuca. Dla wdrożenia wymagane są reguły `.htaccess` i obsługa `mod_rewrite`; samo statyczne udostępnienie katalogu `out` nie wykonuje tej ochrony.

## Jak używać

Kliknij puste pole w dniu lub tygodniu. Osoba, data i godzina pochodzą z wybranej komórki. Ustaw tytuł, wybierz kalendarz i naciśnij „Zapisz wydarzenie”. „Razem” oznacza oboje uczestników. Kliknięcie zapisanego wydarzenia otwiera edycję i usuwanie. Usunięcie wymaga potwierdzenia.

„Miesiąc” pokazuje liczbę wpisów i wyróżnione daty. Wybierz datę, aby zobaczyć listę lub otworzyć dzień. Filtry dotyczą wyświetlania. „Wolne razem” liczy przedziały ze wszystkich uwzględnionych wpisów oznaczonych „Zajmuje czas”, w tym całodniowych. Kliknięcie znalezionego przedziału otwiera wspólny wpis.

W „Uczelnie” wybierz UR lub UKEN i „Ułóż plan tygodnia”. Kliknij godzinę Oliwusi, ustaw koniec semestru i zapisz. Możesz wybrać tydzień albo dwa tygodnie odstępu. Wybór „Tylko ten termin” pozwala przesunąć lub usunąć jeden dzień serii. „Ten i następne” liczy kolejność według pierwotnych dat terminów.

Dla AGH rozwiń „Pobierz lub wczytaj plan”. „Pobierz aktualny plan z AGH” pobiera subskrypcję HTTPS zapisaną w prywatnej konfiguracji; „Wczytaj plan z pliku (.ics)” wczytuje plik z komputera. Lokalnie dodaj do `.calendar-local/accounts.env` zmienną `AGH_URL` i uruchom ponownie `npm run calendar:local`. Okno importu obejmuje rok wstecz i rok do przodu. Powtórny import korzysta z UID i identyfikatora wystąpienia iCalendar. Plik scala wpisy. Odświeżenie pełnej subskrypcji dodatkowo uzgadnia przyszłe terminy w oknie importu. Historia pozostaje w bazie.

Lista przedmiotów pokazuje, ile terminów jest w kalendarzu. Po rozwinięciu wybierz „Pokaż ten przedmiot” lub „Pomiń ten przedmiot”, a niżej możesz ustawić pojedyncze daty. „Domyślnie: pokaż/pomiń” przywraca ustawienie rodzaju zajęć, a „Jak przedmiot: pokaż/pomiń” przywraca ustawienie przedmiotu dla jednej daty. Wyjątek pojedynczego terminu ma pierwszeństwo przed przedmiotem, a przedmiot przed rodzajem zajęć. Ustawienia rodzajów są w osobnej rozwijanej sekcji. Zmiany zapisują się od razu i obowiązują oba konta. Pomijane zajęcia nie są wyświetlane i nie blokują wspólnego wolnego, ale nadal można je ponownie włączyć w tym panelu.

## Jak przepływają dane

Powtórzenia i wyjątki w plikach iCalendar rozwija biblioteka sabre/vobject. [Dokumentacja obsługi serii iCalendar](https://sabre.io/vobject/recurrence/)

1. `AuthProvider` w `app/layout.tsx` sprawdza sesję przez `/api/calendar.php` i pokazuje formularz albo całą stronę z menu. Kalendarz korzysta z tej samej sesji i jej danych. PHP dodatkowo sprawdza dostęp przed podaniem dokumentów oraz każdym odczytem i zapisem danych. Użytkownik wybiera dzień, miesiąc albo tydzień.
2. Kliknięcie w siatkę przekazuje datę, godzinę i osobę do `EventDialog.tsx`. Formularz wysyła dane i token sesji do `/api/calendar.php`.
3. PHP ustala autora z sesji. Sprawdza pola, wersję kalendarza i przedział dat, a następnie w jednej transakcji zapisuje wydarzenie i uczestników. Wspólne wydarzenie ma jeden rekord oraz dwa powiązania w `event_participants`.
4. Baza przechowuje chwile w UTC. Formularz, granice dat całodniowych i wyświetlanie używają Europe/Warsaw. Kolejne zajęcia powstają o tej samej godzinie lokalnej także przez zmianę czasu. Przeglądarka dostaje zatwierdzone dane, umieszcza kafelki na osi i przelicza dostępność. Po odświeżeniu drugie konto pobiera ten sam plan.
5. Gdy dwie osoby jednocześnie zmieniają tę samą wersję kalendarza, serwer przyjmuje pierwszą transakcję. Drugiej osobie aplikacja pobiera nową wersję i pokazuje komunikat. W razie konfliktu zamknij formularz i otwórz ponownie aktualny wpis przed edycją.

## Hosting PHP bez konsoli

1. Potwierdź z administratorem obsługę PHP 8.2 lub nowszego, PDO MySQL, mbstring, DOM, XMLReader, XMLWriter, sesji, HTTPS, Apache `mod_rewrite` z regułami `.htaccess` oraz prywatnego katalogu obok katalogu strony. Przy innym serwerze administrator musi przygotować równoważną ochronę dokumentów przez PHP. Subskrypcja AGH używa wychodzącego HTTPS z PHP. Ręczny import .ics działa również bez połączenia z uczelnią.
2. W pustej bazie MySQL lub MariaDB zaimportuj `backend/schema.sql` przez phpMyAdmin. Do aplikacji użyj osobnego użytkownika bazy z dostępem do jej tabel.
3. Wykonaj lokalnie `npm run calendar:local`. Wgraj całą zawartość `out/`, **również ukryty `.htaccess`**, katalog `logowanie/` i oba pliki `api/calendar.php` oraz `api/site.php`, do katalogu strony. Do prywatnego katalogu **razem** obok niego wgraj `backend/calendar.php`, `events.php`, `import.php`, `site.php`, `session.php` i całe `backend/vendor/`. Publiczne pliki `api/*.php` dołączają prywatny kod z tej lokalizacji.
4. W prywatnym katalogu skopiuj `config.example.php` pod nazwą `config.php`. Podaj DSN, dane bazy i oddzielne hashe haseł dla obu kont. Możesz je wygenerować lokalnym PHP funkcją `password_hash($haslo, PASSWORD_DEFAULT)`. Konta powstają przy pierwszym logowaniu. Późniejsza zmiana hasła wymaga aktualizacji `users.password_hash`. Adres AGH jest opcjonalny. Flaga `CALENDAR_LOCAL` jest przeznaczona wyłącznie do lokalnego Dockera.
5. Otwórz stronę przez HTTPS. Dodaj testowy wpis z konta Szymka, odśwież kalendarz Oliwusi i sprawdź edycję. Odświeżenie AGH uruchamia przycisk. Automatyczny harmonogram wymaga wcześniejszego potwierdzenia możliwości hostingu.

## Sprawdzenie logowania

W oknie prywatnym otwórz `/`, `/kalendarz/` i `/wspomnienia/`: każda próba powinna prowadzić do logowania, bez menu. Po zalogowaniu przejdź między zakładkami, a następnie wyloguj się z dowolnej z nich. Odświeżenie lub ponowne wejście bez sesji znów wymaga logowania. Testy `npm run test:auth` sprawdzają bezpieczny adres powrotu oraz bramkę Apache/PHP w osobnym kontenerze na syntetycznych sesjach; wymagają działającego Dockera i nie używają właściwej bazy danych.
