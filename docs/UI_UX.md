# Wygląd i obsługa — zatwierdzone ustalenia UI/UX

Aktualne wymagania i kolejność wdrożenia kalendarza opisuje [plan kalendarza](kalendarz/KALENDARZ_WDROZENIE.md). W zakresie kalendarza zastępuje wcześniejsze ustalenia w tym dokumencie.

Stan: 2026-10-31. Źródło decyzji: czat projektowy „Wygląd i obsługa UI UX” oraz ustalenia dotyczące kalendarza. Dokument stanowi **specyfikację dla implementacji**, nie oznacza, że funkcje już działają.

## 0. Zaakceptowany prototyp referencyjny — ważne

W czacie projektowym „Wygląd i obsługa UI UX” powstały dwa lokalne prototypy HTML:
- `razem-prototyp.html` — wersja v1.0;
- **`razem-prototyp-v2.html` — wersja v2.0, zaakceptowana przez użytkownika 2026-10-31 jako aktualny wzorzec wyglądu.**

**Stan pliku źródłowego:** oryginalny HTML v2 **jest już w repozytorium** pod `design/reference/razem-prototyp-v2.html`. Dokładny kontrakt wymiarów, kolorów i animacji znajduje się w `design/SPECYFIKACJA_UI_UX_V2.md`. Przed implementacją UI odczytaj oba pliki, zamiast zgadywać parametry.

Z dotychczasowych ustaleń wynika, że prototyp v2 demonstruje: sidebar z kafelkami i rozwijaniem na hover, wyraźną paletę fioletowo-lawendowo-różową, animowane serca, widoki miesiąca/tygodnia/dnia, filtry kalendarzy, autorów wydarzeń, priorytety, oraz przełączanie jasnego/ciemnego motywu. Prototyp działał lokalnie jako interaktywny HTML z danymi testowymi, **bez backendu i trwałości danych**.

**Zasady korzystania z referencji:**
1. Przeczytaj oryginalny HTML, CSS i JavaScript, uruchom go lokalnie i porównaj efekt wizualny ze specyfikacją.
2. Traktuj go jako **główne źródło szczegółów wyglądu i animacji**, a ten dokument jako listę zatwierdzonych wymagań i ich kontekstu.
3. Przenieś stopniowo wygląd i zachowania do komponentów React/Next.js, ucząc użytkownika i nie nadpisując jego pracy. Nie kopiuj całego monolitycznego HTML jako gotowej aplikacji produkcyjnej.
4. Zachowaj oryginalny plik nienaruszony jako referencję. Jeśli między prototypem a późniejszą jawną decyzją użytkownika jest różnica, poproś o rozstrzygnięcie przed zmianą docelowego projektu.

**Od tej chwili** referencja jest dostępna; odwzorowując wygląd w Next.js porównuj układ z oryginałem przy identycznej rozdzielczości i powiększeniu, zachowując istniejącą pracę użytkownika. Nie przedstawiaj demonstracyjnych interakcji HTML jako gotowych funkcji backendu.

## 1. Kierunek wizualny

- Prywatna strona dla dwojga: styl minimalistyczny, ale przyjazny, ciepły i wyraźnie kolorowy.
- Nie projektować dominującego białego tła ani bezbarwnego korporacyjnego interfejsu.
- Paleta (zatwierdzona):
  - Sidebar / tło menu: `#8B50E6` (fiolet).
  - Kafelki menu: `#A977F2`.
  - Aktywny kafelek menu: `#DEC4FF` (jasna lawenda, **nie intensywny róż**).
  - Tło aplikacji: `#E9D5FF`.
  - Różowe karty: `#FFC4E4`.
  - Tekst: `#3D185C`.
  - Mocny róż jako akcent **poza menu**: `#FF4FA3`.
- Kontrast, czytelne stany aktywne i wygląd na węższych ekranach trzeba sprawdzić podczas implementacji.

## 2. Nawigacja i wspólny układ

- Na komputerze po lewej jest **zawsze widoczny wąski sidebar** z ikonami funkcji. Przy szerokości okna do 760 px włącznie zastępuje go menu wysuwane przyciskiem.
- Aktualizacja ustaleń (2026-11-07): po próbie szerszego paska użytkownik zdecydował o zachowaniu wymiarów referencji — 76 px po zwinięciu, 252 px po rozwinięciu, z odsunięciem treści o 76 px. Serce w nagłówku pozostaje obrysowane, bez wypełnienia, zgodnie z osobnym ustaleniem użytkownika.
- Sidebar, tło `#E9D5FF` i kolor tekstu `#3D185C` są wspólne dla stron przez `app/layout.tsx`. Starterowe przełączanie kolorów na czarne tło według motywu systemu zostało usunięte; docelowy przełącznik motywu pozostaje osobnym etapem.
- Stopka zawiera dwa awatary i jeden własny podpis użytkownika; drugi wiersz podpisu z prototypu został pominięty na jego prośbę.
- Każda ikona znajduje się w **osobnym kafelku**; nie używać zwykłej tekstowej listy.
- Po najechaniu kursorem sidebar płynnie się rozszerza, pokazując nazwy; po opuszczeniu kursorem zwija się.
- Sidebar na komputerze rozwija się także przy fokusie klawiatury; wtedy pokazuje nazwy zakładek, markę i podpis stopki. Tab bez modyfikatorów z pustego obszaru strony kieruje na pierwszy link na komputerze, a na przycisk otwierania na małym ekranie. Alt+M przenosi do menu poza polami edycji i w razie potrzeby otwiera panel mobilny. Na komputerze kolejność Tab/Shift+Tab pozostaje naturalna. Skróty działają, gdy zdarzenie otrzymuje strona; pasek adresu i inne elementy przeglądarki pozostają poza jej kontrolą.
- Link wybrany klawiaturą ma obrys 3 px w kolorze `#FD75B9`. Obrys odsunięto do wewnątrz o 3 px, żeby przewijana lista nie przycinała jego boków; to celowe odstępstwo od zewnętrznego obrysu prototypu.
- Aktywny kafelek wyróżnia się lawendą `#DEC4FF`. W menu unikać jaskraworóżowego wyróżnienia.
- Główne obszary przewidziane w nawigacji: Start, Kalendarz, Wspomnienia, Cele i marzenia, Wyjazdy, Nasza poczta. Powiadomienia (dzwonek) i ustawienia również muszą mieć dostępne wejście; dokładne umiejscowienie do dopracowania.
- Nawigacja Next.js: Start `/`, Kalendarz `/kalendarz`, Wspomnienia `/wspomnienia`, Cele i marzenia `/cele`, Wyjazdy `/wyjazdy`, Nasza poczta `/poczta`, Powiadomienia `/powiadomienia`, Ustawienia `/ustawienia`. Nazwy folderów tras są małymi literami. Bieżący adres wyznacza aktywny kafelek i `aria-current="page"`; zmiana zakładki zachowuje wspólny layout. Nagłówki nowych ekranów nie oznaczają wdrożenia ich funkcji.
- Menu mobilne: przycisk 43×43 px w nagłówku wysokości 76 px, panel 252 px z prawymi rogami 23 px i zasłona `#29143e77` na warstwie 45 pod panelem (50), zgodnie z referencją. Nazwy zakładek, marka i podpis są od razu widoczne bez hover. Zamknięcie przez zasłonę, Escape lub nawigację; dodatkowy kafelek „Zamknij menu” zapewnia dostępne zamykanie wewnątrz panelu i jest celowym dodatkiem względem prototypu.
- Otwarte menu mobilne zachowuje fokus wewnątrz panelu, blokuje przewijanie i wyłącza interakcję z treścią pod nim. Po zamknięciu przywraca przewijanie oraz fokus przycisku. Zamknięty panel jest poza kolejnością klawiatury i ukryty dla technologii wspomagających. Zmiana na układ komputerowy usuwa zasłonę i blokady; powrót do małego okna zaczyna od zamkniętego menu. Ograniczenie animacji obejmuje również przejście mobilne.

## 3. Kalendarz — wspólne zasady

- Kilka osobnych kalendarzy (np. AGH, Wspólny, Ważne daty), ale **domyślny główny widok łączy wszystkie**; później przełączniki/filtry widoczności.
- Kalendarz „Wspólny” jest jednym z kalendarzy, a nie nazwą połączonego widoku.
- Oboje widzą wszystkie dane. Rozróżnienie „moje / dziewczyny / wspólne” opisuje osoby, których dotyczy wydarzenie, a nie dostęp do odczytu.
- Kolory autorów/uczestników w kalendarzu: użytkownik — fiolet, dziewczyna — róż, wspólne — **trzeci kolor do ostatecznego zatwierdzenia**. Kolor źródłowego kalendarza i kolor osoby są niezależnymi informacjami; sposób połączenia tych oznaczeń wymaga doprojektowania.
- Zachować informację **kto dodał wpis**, nawet gdy wydarzenie dotyczy obu osób.

### Widok dnia

- Wspólna oś godzin; osobne kolumny dwóch osób z widocznymi nazwami.
- Wydarzenie wspólne jest jednym rekordem, ale jest prezentowane w obu kolumnach.
- Docelowo wspólne wolne przedziały i dodawanie wydarzeń kliknięciem pustego miejsca; szczegóły interakcji uzgodnić w czacie „Kalendarz”.

### Widok tygodnia

- Czytelne rozróżnienie osób i wydarzeń wspólnych.
- Po najechaniu na kafelek wydarzenia ma się on powiększać/rozszerzać, aby pokazać więcej informacji, bez utraty czytelności sąsiednich wpisów.
- Dopracować sposób obsługi nakładających się wydarzeń; szczegóły zachowania jeszcze niezatwierdzone.

### Widok miesiąca

- Ważne wydarzenia/priorytety mają otrzymać widoczne wyróżnienie.
- Hover na dzień: jego kafelek się powiększa/wyróżnia, a pozostałe są nieco przygaszone.
- Kliknięcie dnia przechodzi do widoku tego dnia.
- Nie utrudniać nawigacji klawiaturą/dotykiem; alternatywne stany focus/tap przy implementacji.

## 4. Animacje i charakter strony

- Delikatne, osobiste animacje serc **na wybranych elementach**, a nie stale na całej stronie.
- Zatwierdzone kierunki: subtelne pulsowanie, reakcja na hover, unoszenie serduszek po kliknięciu, efekt „łączenia” przy ważnym wspólnym wydarzeniu.
- Unikać nadmiaru animacji, zachować czytelność. Wykonać z uwzględnieniem preferencji ograniczonego ruchu (`prefers-reduced-motion`).

## 5. Kolejność wdrożenia i tryb nauki

1. Uporządkować istniejące `app/page.tsx` (usunąć elementy startera Next.js, zachować ćwiczenia użytkownika po uzgodnieniu).
2. Ustawić kolory, podstawowy układ strony, czytelny nagłówek i obszar treści.
3. Wyodrębnić prosty komponent Sidebar; kafelki z ikonami, aktywny stan, rozwijanie hover.
4. Zbudować na danych testowych statyczny „Plan dnia”, następnie interaktywny prototyp dnia/tygodnia/miesiąca.
5. Dopiero po odpowiednich decyzjach architektonicznych podłączyć PostgreSQL, logowanie, zapis i import danych.

Codex ma **uczyć użytkownika**: rozbijać prace na małe zadania, tłumaczyć JSX/TSX, komponenty i Tailwind, zostawiać miejsce na samodzielne pisanie i recenzować kod. Nie generować na raz całego interfejsu.

## 6. Jeszcze nieuzgodnione

- Dokładny kolor wydarzeń wspólnych i jednoczesny sposób pokazywania autorów oraz kolorów kalendarzy.
- Dokładne układy podstron, mobilna nawigacja, zachowanie kolizji kalendarza.
- Skala i częstotliwość animacji.
- Rozmieszczenie dzwonka i ustawień.

Nie traktować tych punktów jako zatwierdzonej decyzji; przed zaawansowaną implementacją zapytać odpowiedni czat projektowy.
