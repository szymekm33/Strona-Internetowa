# Wygląd i obsługa — zatwierdzone ustalenia UI/UX

Stan: 2026-10-31. Źródło decyzji: czat projektowy „Wygląd i obsługa UI UX” oraz ustalenia dotyczące kalendarza. Dokument stanowi **specyfikację dla implementacji**, nie oznacza, że funkcje już działają.

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

- Po lewej **zawsze widoczny wąski sidebar** z ikonami funkcji.
- Każda ikona znajduje się w **osobnym kafelku**; nie używać zwykłej tekstowej listy.
- Po najechaniu kursorem sidebar płynnie się rozszerza, pokazując nazwy; po opuszczeniu kursorem zwija się.
- Aktywny kafelek wyróżnia się lawendą `#DEC4FF`. W menu unikać jaskraworóżowego wyróżnienia.
- Główne obszary przewidziane w nawigacji: Start, Kalendarz, Wspomnienia, Cele i marzenia, Wyjazdy, Nasza poczta. Powiadomienia (dzwonek) i ustawienia również muszą mieć dostępne wejście; dokładne umiejscowienie do dopracowania.
- Na urządzeniach dotykowych nie można polegać wyłącznie na hover; zaproponować odpowiednie otwieranie menu dotykiem przed wdrożeniem mobilnym.

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
