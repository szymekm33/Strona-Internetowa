# Zadania i postępy

Aktualne wymagania i kolejność wdrożenia kalendarza opisuje [plan kalendarza](kalendarz/KALENDARZ_WDROZENIE.md). W zakresie kalendarza zastępuje wcześniejsze ustalenia w tym dokumencie.

Stan lokalnego kalendarza na 2026-11-20. [Uruchomienie i wdrożenie](kalendarz/URUCHOMIENIE.md)

Legenda: [x] wykonane, [ ] do wykonania. Samo opisanie funkcji nie oznacza jej implementacji.

## Etap 0 — przygotowanie

- [x] Zebrano główne potrzeby produktu.
- [x] Utworzono prywatne repozytorium.
- [x] Podzielono pracę na czaty tematyczne.
- [x] Przygotowano dokumentację startową i kryteria pierwszej lokalnej wersji.
- [x] Wybrać Next.js (React, TypeScript, Tailwind CSS) i uruchomić lokalnie; lokalny test statycznego eksportu przeszedł.
- [ ] Ustalić tworzenie dwóch kont oraz logowanie.
- [ ] Zapisać sprawdzoną lokalnie konfigurację eksportu w repozytorium i sprawdzić `/kalendarz/` na hostingu.
- [ ] Doprecyzować minimalny model danych i formularz wydarzenia.
- [ ] Uzgodnić pierwszy widok dnia.

**Następne zadanie dla Codexa:** rozpocząć etap 1 według planu kalendarza. Prototyp HTML jest dostępny w `design/reference/razem-kalendarz-prototyp.html`.

## Wzorzec interfejsu (prototyp v2)

- [x] Użytkownik zaakceptował prototyp `razem-prototyp-v2.html` w czacie „Wygląd i obsługa” (2026-10-31).
- [x] Oryginalny plik jest dostępny w repozytorium pod `design/reference/razem-prototyp-v2.html`; kontrakt wizualny znajduje się w `design/SPECYFIKACJA_UI_UX_V2.md`.
- [ ] Porównać HTML/CSS/JS prototypu z `docs/UI_UX.md`; wdrażać stopniowo jego zachowanie w React.

Referencja HTML jest dostępna. Menu porównano z jej parametrami i zrzutami; przenoszenie wyglądu pozostałych ekranów oraz ich animacji trwa.

## Etap nauki — interfejs bez bazy (przed pełnym MVP)

Wymagania wyglądu i interakcji opisano w [UI_UX.md](UI_UX.md).

- [ ] Uporządkować `app/page.tsx`, zachowując napisane samodzielnie elementy; usunąć domyślne przyciski i zbędne treści Next.js.
- [ ] Ustawić zatwierdzoną paletę i podstawową strukturę strony.
- [x] Zrobić komponent `Sidebar` z ikonami w kafelkach i rozwijaniem na hover.
- [x] Uzupełnić osiem ikon SVG menu i nagłówek z sercem oraz nazwą „razem.”; zachować wymiary kafelków i odstępy nagłówka prototypu v2. Po próbie szerokości 84 px przywrócono referencyjne 76 px i poziomy padding 12 px; serce ma sam obrys zgodnie z ustaleniem użytkownika.
- [x] Dodać rozjaśnienie nieaktywnych kafelków do `#BE96FF`, powiększenie do 105% i cień po najechaniu na ich przycisk, z przejściem 200 ms. Aktywny Start zachowuje lawendowe tło i własny cień. Przejścia kafelków respektują ograniczenie ruchu. Porównanie wizualne z prototypem pozostaje do wykonania.
- [x] Ustawić osiem etykiet menu na 13 px i grubość 750; dodać pojawianie z przesunięcia −5 px przez 200 ms, z opóźnieniem 90 ms przy rozwijaniu. Przejścia etykiet respektują ograniczenie ruchu. Porównanie wizualne pozostaje do wykonania.
- [x] Umieścić sidebar i wspólne kolory we wspólnym layoucie, odsunąć treść o 76 px i usunąć starterowe czarne tło dla ciemnego motywu systemu. Sprawdzono ESLint, odpowiedź HTTP 200 oraz lawendowe tło na zrzucie Chrome 1280×800 z wymuszonym ciemnym motywem. Pełne porównanie z prototypem pozostaje do wykonania.
- [x] Podłączyć osiem pozycji menu przez `Link`, dodać brakujące ekrany z nagłówkami i oznaczać aktywny kafelek według `usePathname`. Poprawiono nazwę folderu `Kalendarz` na `kalendarz`, aby link nie zwracał 404. Sprawdzono TypeScript, ESLint, HTTP 200 ośmiu tras, przejścia bez przeładowania dokumentu, Wstecz, odświeżenie i aktywny kafelek w Chrome. Obejrzano zrzuty zwiniętego i rozwiniętego menu 1280×800. Strony pozostają szkieletem bez docelowych funkcji.
- [x] Dodać rozwijanie całego menu klawiaturą, widoczny obrys wybranego linku, wejście Tabem z pustej strony i skrót Alt+M. W Chrome sprawdzono pierwszy Tab, kolejne pozycje, Shift+Tab, Enter, Alt+M, wyjście Tabem poza menu oraz brak przechwytywania klawiatury w polach formularza. TypeScript i ESLint przeszły; obejrzano zrzut menu otwartego klawiaturą.
- [x] Dokończyć menu mobilne: przycisk otwierania, zasłona, zamknięcie przez tło/Escape/przycisk/link, widoczne podpisy, dostępny fokus i przywracanie przewijania. Sprawdzono Chrome z emulacją dotyku 390×844, niskie okno, granicę 760/761 px, zmianę rozmiaru, wszystkie osiem linków i bieżącą zakładkę, Ctrl+klik, historię, Tab/Shift+Tab/Alt+M oraz ograniczenie ruchu. Obejrzano zrzuty menu zamkniętego, otwartego i w niskim oknie; testy desktopowe również przeszły. Fizyczny telefon i Safari pozostają do sprawdzenia.
- [ ] Dodać główny obszar „Plan dnia” z przykładowymi, wyraźnie testowymi wydarzeniami.
- [ ] Przećwiczyć JSX, komponenty, propsy i klasy Tailwind; sprawdzić wygląd na laptopie i w węższym oknie.

Powyższe ćwiczenia opisują wcześniejszy etap pracy nad interfejsem.

## Etap 1 — pierwsza działająca wersja lokalna

- [x] Utworzyć i lokalnie uruchomić projekt Next.js; wysłać szkielet na GitHuba.
- [x] Uruchomić lokalną MariaDB i przygotować schemat SQL.
- [x] Przygotować dwa konta i logowanie, bez publicznej rejestracji.
- [x] 2026-11-22: przenieść logowanie przed całą stronę. Wspólny `AuthProvider` i sesja PHP obejmują Start, wszystkie zakładki, bezpośrednie linki oraz wylogowanie z każdej strony. Apache/PHP chroni HTML i eksportowane dane React. W izolowanym teście serwera sprawdzono oba syntetyczne konta, przekierowania, RSC/prefetch, fałszywe ciasteczka, CSRF i wylogowanie. W Chrome sprawdzono formularz na kilku trasach, nawigację, błędne hasło, powrót do podstrony, utratę sesji, wylogowanie z innej karty podczas zapisu oraz szerokość 390 px. Ochronę lokalną sprawdzono również przez HTTP na porcie 8088. Testy używały danych syntetycznych, bez haseł i wydarzeń użytkownika.
- [x] 2026-11-22: dodać powoli unoszące się serduszka na ekranie logowania, z powiększeniem i odchyleniem po najechaniu. W Chrome sprawdzono ruch, hover, kliknięcie pól i kolejność Tab, szerokości 1280×800 i 390×844 oraz zatrzymanie animacji i reakcji ruchowej przy ograniczeniu ruchu. Dekoracja SVG jest za formularzem i ukryta przed czytnikami ekranu; testy nie wymagały logowania ani zmiany danych.
- [x] 2026-11-22: wzbogacić dekorację logowania na prośbę użytkownika: 24 serca, sześć tekstur SVG z połyskiem i wgłębieniami, hover 190%, wybuch 12 cząstek po kliknięciu lub dotknięciu i odtworzenie serca. Dodać osobisty tekst o prywatnej przestrzeni Oliwci i Szymka. W Chrome sprawdzono stabilny hover, klik/tap, usuwanie i limit cząstek, poprawne gradienty i wzory, niezasłanianie formularza oraz szerokości 1280/390/320 px i ograniczony ruch. Obejrzano zrzuty, ESLint i TypeScript przeszły. Testy korzystały z syntetycznego anonimowego API.
- [x] 2026-11-22: dodać łagodne odpychanie serc od zbliżającej się myszy, z mocniejszą reakcją z bliska i bez zatrzymywania lotu na hover. W Chrome sprawdzono cztery kierunki, ograniczenie i płynność przesunięcia, powrót po oddaleniu/opuszczeniu okna, zachowanie wybuchu i formularza, brak odpychania na dotyku i przy ograniczeniu ruchu oraz wąskie ekrany. Ukrycie karty i odmontowanie komponentu zatrzymują pętlę animacji. ESLint i TypeScript przeszły; testy nie korzystały z prawdziwych kont ani bazy.
- [x] Ograniczyć odczyt i zapis danych do zalogowanych, uprawnionych kont.
- [x] Dodać model wydarzenia z autorem, terminem i uczestnikami.
- [x] Zaimplementować kalendarz dnia ze wspólną osią czasu i dwiema kolumnami.
- [x] Dodać wydarzenie jednej osoby albo wspólne.
- [x] Zapewnić trwały zapis i ponowne odczytanie danych.
- [x] Dodać instrukcję lokalnej instalacji i uruchomienia.
- [x] Sprawdzić scenariusze lokalnie na syntetycznych wpisach.
- [x] Dodać widoki tygodnia i miesiąca, filtry, wyszukiwanie wolnego, serie UR/UKEN i import AGH. Import testowano na plikach iCalendar.
- [x] Uprościć panel ustawień AGH: osobno cały przedmiot i pojedyncza data, polecenia „Pokaż” / „Pomiń”, widoczne wyniki ustawień domyślnych i liczby terminów, pełne nazwy rodzajów oraz informacja o obu kontach. Pobieranie subskrypcji i wczytanie pliku opisano oddzielnie. W Chrome na syntetycznym API sprawdzono wybory rodzajów/przedmiotów/terminów i usuwanie wyjątków, oba konta, klawiaturę oraz brak poziomego przewijania przy 1280×800 i 390×844. Obejrzano zrzuty panelu. ESLint, TypeScript i cztery istniejące testy logiki przeszły; prawdziwe dane i ustawienia użytkownika nie były zmieniane.
- [ ] Sprawdzić prywatną subskrypcję AGH i wdrożenie HTTPS na hostingu docelowym.

### Kryteria odbioru etapu 1

1. Każda osoba może zalogować się na własne konto.
2. Niezalogowana osoba nie może pobrać ani zmienić danych kalendarza.
3. Wydarzenie jednej osoby pojawia się w odpowiedniej kolumnie.
4. Wspólne wydarzenie jest zapisane raz i widoczne w obu kolumnach.
5. Autor i uczestnicy są rozróżniani, także gdy jedna osoba dodaje wydarzenie dla drugiej.
6. Po odświeżeniu strony i ponownym uruchomieniu aplikacji dane pozostają.
7. Po zalogowaniu na drugie konto i odświeżeniu kalendarza widać wcześniej zapisane wydarzenie.
8. Nieprawidłowy przedział czasu jest odrzucany z czytelnym komunikatem.
9. Wyświetlane godziny są zgodne z Europe/Warsaw.

Automatyczne odświeżanie drugiej przeglądarki w czasie rzeczywistym nie jest kryterium tego etapu.

## Dalsze etapy — orientacyjna kolejność

1. Rozwinięcie kalendarza: tydzień, telefon, edycja, usuwanie i kategorie.
2. Import i aktualizacja planu AGH z zachowaniem filtrów i wyjątków.
3. Wspólne wolne terminy oraz przypomnienia o wydarzeniach.
4. Wspomnienia, zdjęcia i konfigurowalne okładki.
5. Cele, marzenia i planowane wyjazdy z powiązaniami.
6. Nasza poczta połączona z Gmailem.

Kolejność tych etapów można zmienić w „Planie głównym”. Przed udostępnieniem aplikacji przez internet trzeba wybrać hosting, skonfigurować HTTPS, trwałe przechowywanie i kopie zapasowe oraz sprawdzić dostęp z obu kont.

## Raport z zakończenia zadania

W podsumowaniu zapisać:

- co wykonano i gdzie znajduje się zmiana;
- co faktycznie sprawdzono;
- które decyzje nadal są otwarte;
- jaki jest następny konkretny krok.
