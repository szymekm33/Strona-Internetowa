# Instrukcje pracy nad projektem

## Kontekst

Prywatna strona dla dwóch osób. Przed zmianami przeczytaj README.md, docs/SPEC.md, docs/DECISIONS.md, docs/TASKS.md oraz **docs/UI_UX.md** (źródło decyzji wizualnych). Przy zmianach wyglądu obowiązkowo przeczytaj też `design/SPECYFIKACJA_UI_UX_V2.md` i źródłowy prototyp `design/reference/razem-prototyp-v2.html` — to referencja dokładnych parametrów.

Rozmowy tematyczne służą ustaleniom; aktualne wymagania potrzebne do implementacji należy utrwalać w repozytorium.

## Aktualny etap

Szkielet aplikacji został uruchomiony lokalnie i dodany do repozytorium. Aktualnie projekt używa Next.js 16.4.3 (App Router), React, TypeScript i Tailwind CSS. Dalsze decyzje o PostgreSQL, warstwie dostępu do danych i logowaniu wymagają świadomego zaprojektowania oraz aktualizacji dokumentacji. Hosting nie jest wymagany do lokalnych prac.

Pierwsze funkcjonalne MVP obejmuje dwa loginy i widok dnia z trwałym zapisem. Sidebar i trasy już istnieją. Aktualny etap to wdrożenie kalendarza małymi krokami według [planu kalendarza](docs/kalendarz/KALENDARZ_WDROZENIE.md).

Uwaga: na GitHubie może być starsza wersja `app/page.tsx` niż na komputerze użytkownika. Przed propozycją zmian sprawdź aktualny lokalny plik, zachowaj jego samodzielnie napisane fragmenty i nie nadpisuj ich bez uzgodnienia.

## Zatwierdzony zakres i decyzje na dziś (2026-10-31)

- Jeden prywatny workspace dla **dwóch** użytkowników. Wszystkie dane są dla obu widoczne; osoba przypisana do wydarzenia to nie to samo co uprawnienia do jego odczytu.
- „Wszystkie” łączy AGH, UR, UKEN, Plany ręczne i Ważne daty. „Razem” oznacza wydarzenie obojga.
- Sidebar: wąski pasek ikon po lewej, rozwijany po najechaniu; ikony w osobnych kafelkach. Paleta: sidebar #8B50E6, kafelki #A977F2, aktywny #DEC4FF, tło #E9D5FF, karty #FFC4E4, tekst #3D185C, akcent różowy #FF4FA3 poza menu. Nie twórz dominującego białego interfejsu.
- Aktualnie stos: Next.js (App Router), React, TypeScript, Tailwind CSS. PostgreSQL planowany na backend, ale schemat i mechanizm dostępu do danych nie są jeszcze zaimplementowane. Integracja Gmail i importer AGH są etapami późniejszymi.

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

Przeczytaj [plan wdrożenia](docs/kalendarz/KALENDARZ_WDROZENIE.md) i otwórz `design/reference/razem-kalendarz-prototyp.html`. Dla kalendarza ta referencja określa aktualne interakcje, a ogólny prototyp v2 nadal opisuje wspólny wygląd strony. Zacznij od sprawdzenia trasy `/kalendarz` i zaplanowania z użytkownikiem pierwszego kroku widoku dnia oraz zapisu w PostgreSQL. Zachowaj edukacyjny tryb pracy.

## Wymagania do zachowania

- Dwa oddzielne konta; brak otwartej rejestracji.
- Sprawdzanie dostępu do danych po stronie aplikacji.
- Autor wydarzenia i jego uczestnicy to odrębne pojęcia.
- Wspólne wydarzenie jest zapisane raz i pokazywane w obu kolumnach.
- Odświeżenie importu AGH zachowuje wybory użytkownika.
- Marzenia, wyjazdy, wydarzenia i wspomnienia mają opcjonalne powiązania.

## Tryb nauki: programowanie w parze (bardzo ważne)

Celem projektu jest zarówno zbudowanie działającej strony, jak i nauczenie użytkownika programowania aplikacji webowych. Użytkownik zna podstawy Javy, Pythona i SQL, ale dopiero uczy się React, TypeScript i Next.js. Prowadź rozmowę po polsku, zrozumiale i bez nadmiaru teorii naraz.

- Domyślnie działaj jak cierpliwy mentor, a nie automat do generowania całych funkcji. Zanim zmienisz kod, krótko wyjaśnij cel, plik i najważniejszą koncepcję. Zaznacz, co użytkownik może spróbować napisać sam.
- Dziel funkcjonalności na małe zadania z widocznym efektem. Na początku zaproponuj zadanie do samodzielnego wykonania, wskazówki i możliwość sprawdzenia rozwiązania; nie podawaj od razu pełnej odpowiedzi, chyba że użytkownik poprosi.
- Najpierw naprowadzaj na rozwiązanie, następnie pokaż fragment lub przykład, a dopiero w razie potrzeby gotową implementację. Nie zastępuj pracy użytkownika bez jego wyraźnej prośby.
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
