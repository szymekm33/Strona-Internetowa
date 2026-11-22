# Instrukcje pracy nad projektem

## Kontekst

Prywatna strona dla dwóch osób. Przed zmianami przeczytaj README.md, docs/SPEC.md, docs/DECISIONS.md, docs/TASKS.md oraz **docs/UI_UX.md** (źródło decyzji wizualnych). Przy zmianach wyglądu obowiązkowo przeczytaj też `design/SPECYFIKACJA_UI_UX_V2.md` i źródłowy prototyp `design/reference/razem-prototyp-v2.html` — to referencja dokładnych parametrów.

Rozmowy tematyczne służą ustaleniom; aktualne wymagania potrzebne do implementacji należy utrwalać w repozytorium.

## Aktualny etap

Projekt używa Next.js 16.4.6 (App Router), React, TypeScript i Tailwind CSS. Kalendarz działa lokalnie z PHP i MariaDB. Frontend eksportujemy do `out`, a prywatną część PHP umieszczamy obok katalogu publicznego zgodnie z [instrukcją kalendarza](docs/kalendarz/URUCHOMIENIE.md).

Lokalny kalendarz obejmuje dwa loginy, trzy widoki, trwały zapis, wolne terminy i plany uczelni. Wdrożenie na rzeczywisty hosting i sprawdzenie prywatnej subskrypcji AGH wymagają konfiguracji właściciela. Wymagania znajdują się w [planie kalendarza](docs/kalendarz/KALENDARZ_WDROZENIE.md).

Aktualizacja 2026-11-22: logowanie poprzedza całą stronę, w tym Start i wszystkie bezpośrednie linki. `AuthProvider` we wspólnym layoucie udostępnia sesję kalendarzowi i ukrywa menu przed logowaniem. Apache/PHP sprawdza sesję przed podaniem HTML i eksportowanych danych React; wymagane są `out/.htaccess`, oba publiczne pliki `api/*.php` oraz prywatne `backend/site.php` i `backend/session.php`. Pełną ochronę lokalną sprawdzaj pod `localhost:8088`; port 3000 jest podglądem programistycznym interfejsu.

### Przekazanie pracy na kolejny komputer — 2026-11-20

- Wersję kalendarza z tej sesji zapisano w commicie `2d69b7e` („Calendar changes”). Sprawdzono dodanie wpisu przez jedno konto, edycję przez drugie i zachowanie danych po restarcie PHP i MariaDB. Import AGH przetestowano na syntetycznych plikach `.ics`.
- Na nowym komputerze sprawdź, czy checkout zawiera ten commit. Po `npm ci` i uruchomieniu Docker Desktop wykonaj `npm run calendar:local`. Dane z laptopa są w lokalnym wolumenie Dockera, a hasła w ignorowanym pliku `.calendar-local/accounts.env`. Świeże uruchomienie na drugim komputerze tworzy osobną bazę i nowe lokalne hasła.
- Przy wznowieniu użytkownik chciał zobaczyć bazę samodzielnie. Zacznij od pokazania mu tabel `events` i `event_participants` oraz sposobu odczytania uczestników jednego wydarzenia. Schemat jest w [backend/schema.sql](backend/schema.sql).

Uwaga: na GitHubie może być starsza wersja `app/page.tsx` niż na komputerze użytkownika. Przed propozycją zmian sprawdź aktualny lokalny plik, zachowaj jego samodzielnie napisane fragmenty i nie nadpisuj ich bez uzgodnienia.

## Zatwierdzony zakres i decyzje na dziś (2026-10-31)

- Jeden prywatny workspace dla **dwóch** użytkowników. Wszystkie dane są dla obu widoczne; osoba przypisana do wydarzenia to nie to samo co uprawnienia do jego odczytu.
- „Wszystkie” łączy AGH, UR, UKEN, Plany ręczne i Ważne daty. „Razem” oznacza wydarzenie obojga.
- Sidebar: wąski pasek ikon po lewej, rozwijany po najechaniu; ikony w osobnych kafelkach. Paleta: sidebar #8B50E6, kafelki #A977F2, aktywny #DEC4FF, tło #E9D5FF, karty #FFC4E4, tekst #3D185C, akcent różowy #FF4FA3 poza menu. Nie twórz dominującego białego interfejsu.
- Frontend: statyczny eksport Next.js, React, TypeScript i Tailwind CSS. Backend: PHP, sesje i MySQL lub MariaDB (silnik do potwierdzenia w phpMyAdmin). Import AGH i Gmail są etapami późniejszymi.

Wymagania szczegółowe dla menu, widoków kalendarza, hover i animowanych serc są w `docs/UI_UX.md`. Nie zastępuj ich własnymi domysłami i nie implementuj na raz całego zakresu.

## Referencja wizualna: zaakceptowany prototyp v2

Użytkownik zatwierdził prototyp UI/UX v2 z czatu „Wygląd i obsługa”. **Oryginalne pliki referencyjne są już w repozytorium**:

- `design/reference/razem-prototyp-v2.html` — źródłowy interaktywny HTML/CSS/JS; **źródło prawdy o geometrii i animacjach**.
- `design/SPECYFIKACJA_UI_UX_V2.md` — dokładny kontrakt kolorów, wymiarów, odstępów, animacji, kryteriów odbioru.
- `docs/UI_UX.md` — decyzje produktowe, kontekst oraz ograniczenia dotyczące funkcji.

**Obowiązkowo przed zmianą wyglądu:** odczytaj specyfikację i odpowiedni fragment oryginalnego HTML/CSS. Nie dobieraj arbitralnie nowych wartości, jeśli istnieją w prototypie. Przykład sidebaru: `width:76px` zwinięty, `252px` rozwinięty, `border-radius:0 24px 24px 0`, `inset:0 auto 0 0` (bez marginesu od lewej krawędzi); osobne kafelki ikon `51×51px`, radius `15px`.

Po implementacji porównaj wersję Next.js z prototypem przy tej samej rozdzielczości i powiększeniu — także dla menu rozwiniętego i na telefonie. Jeśli narzędzie do zrzutów ekranu jest niedostępne, powiedz o tym zamiast deklarować porównanie.

Sam HTML jest **prototypem bez backendu**. Przenoś go stopniowo do komponentów React/Next.js, zachowując edukacyjny tryb pracy; nie wklejaj całego HTML jako aplikacji. Dane testowe i interakcje kalendarza w prototypie nie przesądzają o docelowym modelu bazy danych. Wzorzec zawiera również przełącznik jasnego/ciemnego motywu.

## Najbliższe zadanie z Codexem: kalendarz

Przy dalszych zmianach przeczytaj [plan wdrożenia](docs/kalendarz/KALENDARZ_WDROZENIE.md) i [instrukcję uruchomienia](docs/kalendarz/URUCHOMIENIE.md). Referencja `design/reference/razem-kalendarz-prototyp.html` określa interakcje, a ogólny prototyp v2 opisuje wspólny wygląd strony. Użytkownik poprosił o samodzielne dokończenie kalendarza i wyjaśnienie całości po implementacji.

## Wymagania do zachowania

- Dwa oddzielne konta; brak otwartej rejestracji.
- Sprawdzanie dostępu do danych po stronie aplikacji.
- Autor wydarzenia i jego uczestnicy to odrębne pojęcia.
- Wspólne wydarzenie jest zapisane raz i pokazywane w obu kolumnach.
- Odświeżenie importu AGH zachowuje wybory użytkownika.
- Marzenia, wyjazdy, wydarzenia i wspomnienia mają opcjonalne powiązania.

## Tryb nauki: programowanie w parze (bardzo ważne)

Celem projektu jest zarówno zbudowanie działającej strony, jak i nauczenie użytkownika programowania aplikacji webowych. Użytkownik zna podstawy Javy, Pythona i SQL, ale dopiero uczy się React, TypeScript i Next.js. Prowadź rozmowę po polsku, zrozumiale i bez nadmiaru teorii naraz.

- Codex pisze po jednym fragmencie o widocznym efekcie. Przed edycją krótko opisz cel i wskaż plik. Po sprawdzeniu fragmentu wyjaśnij na jego przykładzie, jak działa i jak zobaczyć efekt.
- Gdy użytkownik chce sam napisać fragment, zacznij od wskazówki i sprawdź jego rozwiązanie.
- Gdy użytkownik wklei kod lub pokaże błąd, pomóż znaleźć przyczynę i wytłumacz poprawkę. Używaj analogii do Javy i SQL, jeśli pomagają.
- Przy kodzie generowanym przez Codexa wyjaśnij najważniejsze linie, zależności i decyzje; zachęcaj użytkownika do uruchomienia, zmodyfikowania i przetestowania rozwiązania.
- Przy zadaniach konfiguracji, instalacji i infrastrukturze możesz wykonać większą część pracy, ale powiedz, co zrobiłeś i dlaczego. Nie żądaj ręcznego przepisywania długiego boilerplate'u.
- Przed większymi zmianami uzgodnij zakres. Na końcu podaj, jak uruchomić i zweryfikować efekt, czego użytkownik się nauczył i jaki jest kolejny mały krok.
- Nie zmieniaj świadomie napisanego kodu użytkownika bez wyjaśnienia. Nie opisuj testów jako wykonanych, jeśli ich nie uruchomiłeś.

## Dane i konfiguracja

Dane logowania do baz, klucze źródeł iCalendar, tokeny Gmaila i inne sekrety przechowuj w lokalnej lub serwerowej konfiguracji poza repozytorium. Przed dodaniem plików konfiguracyjnych przygotuj odpowiednie reguły ignorowania oraz przykład konfiguracji bez sekretów.

Do przykładów i testów używaj danych syntetycznych. Prywatne wiadomości, zdjęcia i rzeczywiste eksporty kalendarza nie są potrzebne w kodzie źródłowym.

## Zakończenie zadania

Przeprowadzaj sprawdzenia odpowiednie do zmiany. Dla implementacji fundamentu wykorzystaj scenariusze odbioru z docs/TASKS.md. Opisz wynik i ograniczenia, a status zadań aktualizuj dopiero zgodnie z faktycznie wykonanymi pracami.

Wyjaśniaj decyzje prostym językiem po polsku. Zmiany powinny pozostawać zrozumiałe dla osoby znającej podstawy programowania i SQL.
