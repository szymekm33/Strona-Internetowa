# Instrukcje pracy nad projektem

## Kontekst

Prywatna strona dla dwóch osób. Przed zmianami przeczytaj README.md, docs/SPEC.md, docs/DECISIONS.md, docs/TASKS.md oraz **docs/UI_UX.md** (źródło szczegółowych decyzji wizualnych).

Rozmowy tematyczne służą ustaleniom; aktualne wymagania potrzebne do implementacji należy utrwalać w repozytorium.

## Aktualny etap

Szkielet aplikacji został uruchomiony lokalnie i dodany do repozytorium. Aktualnie projekt używa Next.js 16.4.3 (App Router), React, TypeScript i Tailwind CSS. Dalsze decyzje o PostgreSQL, warstwie dostępu do danych i logowaniu wymagają świadomego zaprojektowania oraz aktualizacji dokumentacji. Hosting nie jest wymagany do lokalnych prac.

Pierwszym **pełnym funkcjonalnym MVP** pozostaje logowanie dwóch kont i kalendarz dnia z trwałym zapisem. **Najbliższy etap nauki i implementacji** jest mniejszy: zbudowanie wyglądu głównej strony i nawigacji bez bazy i logowania, następnie wizualny prototyp kalendarza na syntetycznych danych. W dalszej kolejności zaprojektujemy model danych, logowanie i PostgreSQL. Nie prezentuj prototypu jako gotowego kalendarza ani makiety jako zabezpieczonej aplikacji.

Uwaga: na GitHubie może być starsza wersja `app/page.tsx` niż na komputerze użytkownika. Przed propozycją zmian sprawdź aktualny lokalny plik, zachowaj jego samodzielnie napisane fragmenty i nie nadpisuj ich bez uzgodnienia.

## Zatwierdzony zakres i decyzje na dziś (2026-10-31)

- Jeden prywatny workspace dla **dwóch** użytkowników. Wszystkie dane są dla obu widoczne; osoba przypisana do wydarzenia to nie to samo co uprawnienia do jego odczytu.
- Wiele kalendarzy (np. AGH, wspólny, ważne daty), ale **domyślny widok pokazuje wszystkie naraz**; w przyszłości filtry po kalendarzach. „Wspólny” jest nazwą jednego z kalendarzy, nie nazwą zbiorczego widoku.
- Sidebar: wąski pasek ikon po lewej, rozwijany po najechaniu; ikony w osobnych kafelkach. Paleta: sidebar #8B50E6, kafelki #A977F2, aktywny #DEC4FF, tło #E9D5FF, karty #FFC4E4, tekst #3D185C, akcent różowy #FF4FA3 poza menu. Nie twórz dominującego białego interfejsu.
- Aktualnie stos: Next.js (App Router), React, TypeScript, Tailwind CSS. PostgreSQL planowany na backend, ale schemat i mechanizm dostępu do danych nie są jeszcze zaimplementowane. Integracja Gmail i importer AGH są etapami późniejszymi.

Wymagania szczegółowe dla menu, widoków kalendarza, hover i animowanych serc są w `docs/UI_UX.md`. Nie zastępuj ich własnymi domysłami i nie implementuj na raz całego zakresu.

## Referencja wizualna: zaakceptowany prototyp v2

Użytkownik zaakceptował prototyp `razem-prototyp-v2.html` z czatu „Wygląd i obsługa” 2026-10-31. To nie jest tylko pomysł: istnieje interaktywny plik z działającymi animacjami. **Jego oryginalna zawartość nie została jeszcze dodana do repozytorium.**

- Szczegóły i status: `docs/UI_UX.md`.
- Gdy plik `design/razem-prototyp-v2.html` pojawi się lokalnie, **przeczytaj go i użyj jako wzorca** przed implementacją zaawansowanego wyglądu; nie twórz arbitralnie odmiennego projektu.
- Dopóki pliku brakuje, nie twierdź, że znasz dokładnie oryginalne animacje i proporcje. Zaproponuj kontynuację małych ćwiczeń lub poproś użytkownika o przeniesienie oryginału do wskazanej ścieżki.
- Sam HTML jest wyłącznie prototypem bez backendu. Docelowy kod ma być wdrażany stopniowo w React/Next.js i zachowywać tryb nauki, nie przez bezrefleksyjne przekopiowanie całości.
- Uzgodniony w prototypie jest też przełącznik trybu jasnego/ciemnego; sposób jego implementacji w aplikacji dopracuj na podstawie oryginału.

## Najbliższe zadanie z Codexem: pierwszy interfejs

1. Najpierw pokaż użytkownikowi, które elementy dotychczasowej strony są jedynie starterem Next.js; nie usuwaj świadomie dodanych przez niego treści bez uzgodnienia.
2. Pracuj w małych iteracjach: (a) usunięcie niepotrzebnych przycisków startera i zmiana tytułu strony, (b) tło i kolory, (c) prosty komponent `Sidebar`, (d) kafelki nawigacji i rozwijanie na hover, (e) główny obszar „Plan dnia” z danymi przykładowymi.
3. Przy każdej iteracji wyznacz niewielki fragment kodu do samodzielnego napisania (komponent, props, JSX lub klasy Tailwind); wskazówki przed gotowcem. Omawiaj różnicę między statycznym widokiem a faktycznie działającymi funkcjami.
4. Unikaj przedwczesnego generowania logowania, bazy czy pełnego kalendarza. Dalszy etap wymaga uzgodnienia modelu danych i sposobu autoryzacji.
5. Zmiany zapisuj i sprawdzaj lokalnie; proponuj commit dopiero po weryfikacji i poinformowaniu użytkownika, co zostało zmienione.

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
