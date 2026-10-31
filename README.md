# Strona Internetowa

Prywatna strona dla Szymka i jego dziewczyny: wspólny kalendarz, wspomnienia, cele, wyjazdy i powiadomienia.

## Stan projektu

Szkielet aplikacji Next.js 16.4.3 (React, TypeScript, Tailwind CSS) działa lokalnie i jest zapisany w repozytorium. Uczymy się teraz tworzenia interfejsu: pierwsza strona, sidebar i prototyp kalendarza. Pełne funkcje, logowanie i baza danych nie są jeszcze gotowe.

Planujemy PostgreSQL, ale sposób uwierzytelniania, ORM i migracje wymagają decyzji. Hosting nie jest warunkiem rozpoczęcia prac. Nie utworzono płatnych usług ani wdrożenia internetowego.

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
