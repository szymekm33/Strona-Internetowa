# RAZEM. — kontrakt wizualny UI/UX v2.0

**Status:** zatwierdzony projekt wizualny.  
**Źródło prawdy:** `razem-prototyp-v2.html` (oryginalny, interaktywny prototyp zaakceptowany przez użytkownika).  
**Cel:** przenieść wygląd prototypu do aplikacji Next.js bez zgadywania wymiarów, geometrii, kolorów czy animacji.

## Zasada nadrzędna dla Codexa

Zanim zaimplementujesz lub zmienisz dowolny element UI, odczytaj odpowiednie reguły CSS i strukturę HTML w `razem-prototyp-v2.html`. Reprodukuj wizualne parametry dokładnie (nie „podobnie”). Jeśli nowa funkcjonalność wymaga zmiany wyglądu, zachowaj ustaloną estetykę, wskaż odchylenie i wyjaśnij jego powód. Zmiana architektury komponentów React/Next.js jest dozwolona; sam wygląd nie powinien zmieniać się bez zgody użytkownika.

## Paleta — dokładne wartości z prototypu

| Token | Wartość | Funkcja |
|---|---|---|
| `--bg` | `#E9D5FF` | Tło całej aplikacji |
| `--ink` | `#3D185C` | Tekst główny |
| `--muted` | `#7F5B99` | Tekst drugoplanowy |
| `--sidebar` | `#8B50E6` | Tło menu bocznego |
| `--tile` | `#A977F2` | Nieaktywne kafelki w menu |
| `--tile-active` | `#DEC4FF` | Aktywny kafelek w menu (NIE różowy) |
| `--pink` | `#FF4FA3` | Akcent różowy poza aktywnym kafelkiem menu |
| `--pink-lite` | `#FFC4E4` | Jasnoróżowe karty |
| `--violet` | `#8951DE` | Fiolet wydarzeń użytkownika |
| `--violet-lite` | `#D6B5FF` | Jaśniejszy fiolet |
| `--shared-a` | `#A96EEB` | Jeden koniec gradientu wspólnych wydarzeń |
| `--shared-b` | `#F69ACB` | Drugi koniec gradientu wspólnych wydarzeń |
| `--panel` | `#F9EDFF` | Karty i panele |
| `--panel2` | `#F3E1FF` | Dodatkowa powierzchnia |
| `--stroke` | `#D6B8F0` | Obramowania |

Główna czcionka prototypu: `'Segoe UI Variable', 'Segoe UI', system-ui, -apple-system, sans-serif`. Rozmiar tekstu bazowego: `15px`, line-height `1.55`.

## Menu boczne — wymagania dokładne

**Desktop:**
- Pozycja: `position: fixed; inset: 0 auto 0 0` — panel jest **przyklejony do lewej, górnej i dolnej krawędzi okna**, bez odstępu `margin` czy `top`.
- `z-index: 50`.
- Szerokość zwinięta: `76px` (`--side-w`).
- Szerokość po najechaniu/ustawieniu focus/pinned: `252px`.
- `padding: 18px 12px 15px`.
- Tło: `#8B50E6`.
- **Zaokrąglenie panelu: `border-radius: 0 24px 24px 0`.** Kolejność to: lewy górny = `0`, prawy górny = `24px`, prawy dolny = `24px`, lewy dolny = `0`. NIE stosuj `rounded-3xl` / `rounded-2xl` na wszystkie cztery narożniki, NIE odsuwaj menu od lewej krawędzi.
- `overflow: hidden`; `display: flex; flex-direction: column`.
- Cień zwinięty: `6px 0 28px rgba(72,28,133,.16)`.
- Cień rozwinięty: `10px 0 50px rgba(72,28,133,.27)`.
- Rozwijanie: `transition: width .28s cubic-bezier(.2,.72,.17,1), box-shadow .28s`.
- Menu rozwija się jako **nakładka na treść**: zawartość główna NIE przesuwa się po hoverze. `.main` ma stałe `margin-left: 76px`.

**Brand (logo) w menu:**
- Wiersz logo: wysokość `62px`, odstęp od nawigacji `17px`.
- Kafelek logo: `46×46px`, `border-radius: 15px`, tło `#D9B9FF`, ikona `#7133C7`.
- Nazwa: `font-size:25px`, `font-weight:850`, `letter-spacing:-1.5px`.
- Nazwa jest ukryta (`opacity:0`, przesunięcie `translateX(-8px)`) w zwiniętym menu i płynnie pojawia się po rozwinięciu.

**Kafelki nawigacyjne:**
- Odstęp pionowy między pozycjami: `9px`.
- Wiersz pozycji: `height: 51px`, `width: 228px`, `gap: 14px`.
- **Każda kategoria ma własny kafelek z ikoną**: `51×51px`, `border-radius:15px`, tło `#A977F2`.
- Etykieta: `font-size: 13px`, `font-weight: 750`.
- Hover kafelka: tło `#BE96FF`, `transform: scale(1.05)`, cień `0 8px 18px #4c19874a`.
- Aktywny kafelek: `#DEC4FF`, ikona/tekst `#6425A6`, subtelne obramowanie i cień w CSS wzorca.
- Etykiety rozwijają się przez zmianę opacity/transform z opóźnieniem `0.09s`; w zwiniętym menu etykiety niewidoczne.
- **Ikony nie są emoji.** Zachowuj styl ikon SVG zgodny z prototypem.

**Mobile:**
- Breakpoint `max-width: 760px`.
- Nie ma stale widocznego paska: sidebar startuje poza ekranem (`transform: translateX(-110%)`).
- Panel po otwarciu: `252px`, `border-radius: 0 23px 23px 0`.
- Otwieranie przyciskiem menu; za panelem półprzezroczysta zasłona `#29143e77`.
- Główna treść bez lewego marginesu (`margin-left:0`).

### CSS referencyjny: krytyczne reguły sidebaru

```css
:root {
  --sidebar: #8B50E6;
  --tile: #A977F2;
  --tile-active: #DEC4FF;
  --side-w: 76px;
}
.sidebar {
  position: fixed;
  z-index: 50;
  inset: 0 auto 0 0;
  width: var(--side-w);
  background: var(--sidebar);
  padding: 18px 12px 15px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 6px 0 28px rgba(72,28,133,.16);
  transition: width .28s cubic-bezier(.2,.72,.17,1), box-shadow .28s;
  border-radius: 0 24px 24px 0;
}
.sidebar:hover,
.sidebar:has(:focus-visible),
.sidebar.pinned {
  width: 252px;
  box-shadow: 10px 0 50px rgba(72,28,133,.27);
}
.nav { display: flex; flex-direction: column; gap: 9px; }
.nav-item { width: 228px; height: 51px; display: flex; align-items: center; gap: 14px; }
.nav-tile { width: 51px; height: 51px; flex: 0 0 51px; background: var(--tile); border-radius: 15px; }
.nav-item.active .nav-tile { background: var(--tile-active); color: #6425A6; }
.main { margin-left: var(--side-w); }
@media (max-width: 760px) {
  :root { --side-w: 0px; }
  .sidebar { width: 252px; transform: translateX(-110%); border-radius: 0 23px 23px 0; transition: transform .25s; }
  .sidebar.open { width: 252px; transform: translateX(0); }
  .main { margin-left: 0; }
}
```

To skrót do orientacji; **pełny CSS w pliku HTML jest nadrzędny**.

## Rozkład głównej części

- Główna treść: `.main { margin-left: var(--side-w); padding: 0 clamp(20px,4vw,66px) 70px; }`.
- Kontener: `max-width: 1390px; margin: auto`.
- Pasek nagłówka: `height: 94px` (mobile `76px`).
- Ogólne karty: tło `#F9EDFF`, ramka `1px solid #DCC0F4`, `border-radius:24px`, cień `0 13px 38px rgba(77,22,122,.10)`.
- Główny dashboard: kolumny `minmax(0,1.53fr) minmax(300px,.88fr)`, gap `20px`.
- Karta hero: min-height `294px`, padding `32px 33px`, gradient `linear-gradient(112deg,#9C63E9 0%,#C07DF0 57%,#F7A0CB 100%)`.
- Karta „dzisiaj”: tło `#FFE4F3`, border `1px solid #F6B3D8`, padding `23px 24px`.

## Kalendarz — WYŁĄCZNIE wzorzec wizualny

**Uwaga:** docelowe zasady danych, kalendarzy, priorytetów, importu i uprawnień ustalane są w czacie „Architektura i Baza Danych”. Demo HTML nie jest autorytatywne dla backendu.

- Panel: `.calendar-surface` — tło `#F8EAFE`, border `1px solid #D3B4EB`, `border-radius:24px`, padding `17px`.
- Tydzień: `.week-board` — `display:flex`, gap `9px`, min-height `412px`.
- Dzień w tygodniu: `.week-day` — `border-radius:17px`, padding `14px 10px 12px`, tło `#FBF2FF`.
- Hover dnia: flex `1.45 1 0`, uniesienie `-4px`, pozostałe dni opacity `.61`, przejście flex `.27s`.
- Event użytkownika: tło `#DFC9FF`, lewa ramka `4px solid #8850DE`.
- Event dziewczyny: tło `#FFD4E9`, lewa ramka `#FF4FA3`.
- Event wspólny: `linear-gradient(115deg,#E6CBFF,#FFD7ED)`, lewa ramka `#BF6DD8`.
- Miesiąc: 7 kolumn, gap `7px`, dzień min-height `103px`, radius `14px`.
- Dzień: 2 kolumny osób + oś czasu `61px`.

## Animacje

- Przejście między ekranami `pageIn`: `.3s` (opacity + przesunięcie w pionie o `9px`).
- Unoszące się ozdobne serduszka w hero: animacja `heartFloat`, 4.4–6 sekund.
- Pulsujące serce w karcie dzisiejszych planów: `heartbeat 3.5s`.
- Karty wspomnień hover: unoszenie `-5px`, lekki obrót `-.6deg`, cień.
- Serduszka po interakcji: `particleUp 1.1s`, tylko okazjonalnie.
- Uwzględnij `prefers-reduced-motion: reduce` i wyłączanie animacji.

## Kryteria odbioru implementacji

1. Uruchom wersję Next.js i referencyjny prototyp obok siebie w **tym samym rozmiarze okna i przy tym samym zoomie**.
2. Zrób screeny: sidebar zwinięty, sidebar rozwinięty, Start, kalendarz tydzień/miesiąc/dzień, mobile.
3. Porównaj pozycję (przyklejenie do krawędzi), promienie narożników, szerokości, odstępy, fonty i kolory. Napraw różnice przed deklaracją ukończenia.
4. Nie wymyślaj nowych rozmiarów, opcji `border-radius` czy odstępów, gdy odpowiadająca reguła jest w prototypie.
5. Nie zastępuj istniejącej logiki backendu/demo; kopiuj wzorzec wyglądu do komponentów aplikacji.

## Tekst zadania dla Codexa

> Referencją wyglądu jest `design/reference/razem-prototyp-v2.html`, a kontraktem `design/SPECYFIKACJA_UI_UX_V2.md`. Przed pracą przeczytaj oba pliki. Implementuj interfejs w Next.js **wiernie względem prototypu, bez kreatywnego zmieniania wymiarów**. Zacznij od menu bocznego. Bardzo ważne: desktop sidebar ma `position:fixed; inset:0 auto 0 0; width:76px`, po hoverze `252px`, `border-radius: 0 24px 24px 0`, bez marginesu od krawędzi okna; kafelki ikon mają 51×51px i radius 15px. Wskaż, które komponenty/CSS zmieniłeś, i porównaj z referencją przy identycznej szerokości ekranu. W razie sprzeczności pomiędzy luźnym opisem a referencją HTML wybierz referencję HTML, o ile nie uzgodnimy inaczej.