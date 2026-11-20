# Strona Internetowa

Prywatna strona dla Szymka i jego dziewczyny: wspólny kalendarz, wspomnienia, cele, wyjazdy i powiadomienia.

## Stan projektu

**Kalendarz ma działającą wersję lokalną z dwoma kontami, PHP i MariaDB.** Po uruchomieniu Docker Desktop wykonaj `npm run calendar:local`. Adres, dostęp do lokalnych kont oraz sposób wdrożenia na hosting opisuje [uruchomienie kalendarza](docs/kalendarz/URUCHOMIENIE.md).

Frontend działa w Next.js 16.4.6, React, TypeScript i Tailwind CSS. Sidebar prowadzi do ośmiu ekranów i obsługuje klawiaturę oraz telefon. Kalendarz obejmuje dzień, tydzień i miesiąc, wspólny zapis wydarzeń, wolne terminy oraz plany uczelni. Pozostałe zakładki są na etapie szkieletu.

Docelowo frontend eksportujemy statycznie z Next.js, a PHP obsłuży logowanie i zapis w MySQL lub MariaDB. Silnik bazy i działanie na hostingu kolegi pozostają do potwierdzenia. Szczegóły opisuje [plan kalendarza](docs/kalendarz/KALENDARZ_WDROZENIE.md).

## Pierwszy działający fragment

Roboczy zakres pierwszego etapu:

- dwa oddzielne konta i logowanie, bez otwartej rejestracji;
- kalendarz dnia z dwiema kolumnami osób i wspólną osią czasu;
- dodawanie wydarzenia dotyczącego jednej osoby albo Was obojga;
- zapis w bazie, zachowanie danych po odświeżeniu i widoczność na drugim koncie.

## Dokumentacja

- [Specyfikacja funkcjonalna](docs/SPEC.md) — ustalone potrzeby i zakres pierwszej wersji.
- [Decyzje](docs/DECISIONS.md) — zatwierdzone kierunki, plan roboczy i kwestie otwarte.
- [Zadania i postępy](docs/TASKS.md) — kolejność prac oraz kryteria odbioru.
- [Instrukcje dla Codexa](AGENTS.md) — zasady kontynuowania projektu.

## Sposób pracy

„Plan główny” służy koordynacji. Szczegóły ustalamy w czatach tematycznych, a aktualne decyzje zapisujemy w tym repozytorium. Codex korzysta z dokumentacji przy implementacji.

Uruchomienie lokalne: zainstaluj Node.js, wykonaj `npm ci`, następnie `npm run dev` i otwórz `http://localhost:3000`. Przed zmianami z Codexem sprawdź `AGENTS.md` oraz `docs/TASKS.md`. Projekt ma służyć także nauce samodzielnego programowania.
