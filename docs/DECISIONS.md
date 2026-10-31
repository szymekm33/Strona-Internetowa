# Decyzje i kwestie otwarte

Stan na 2026-10-31. Odróżniamy ustalenia produktu od roboczej kolejności implementacji.

## Ustalone kierunki produktu

| ID | Ustalenie |
| --- | --- |
| D-001 | Aplikacja prywatna dla dwóch oddzielnych kont, bez otwartej rejestracji. |
| D-002 | Własny interfejs z osobnymi kolumnami osób w kalendarzu. |
| D-003 | Aktualizowany plan AGH przez iCalendar, z osobno zapisanymi filtrami i wyjątkami użytkownika. |
| D-004 | Wspomnienia mają osobne wpisy z autorami oraz konfigurowalne okładki albumów. |
| D-005 | Marzenie, planowany wyjazd, wydarzenie i wspomnienie są osobnymi, opcjonalnie powiązanymi obiektami. |
| D-006 | Przypomnienia o wydarzeniach poprzedzają integrację Gmaila. |
| D-007 | Paleta: menu #8B50E6, kafelki #A977F2, aktywny #DEC4FF, tło #E9D5FF, karty #FFC4E4, tekst #3D185C, mocny różowy #FF4FA3 poza menu. Sidebar wąski z ikonami w kafelkach, rozwijany na hover. Szczegóły ekranów dalej projektujemy. |
| D-008 | Prace mogą rozpocząć się lokalnie, bez czekania na hosting. |
| D-009 | Plan i specyfikacje powstają w czatach tematycznych i dokumentacji repozytorium; implementacja z Codexem. |
| D-010 | Dwa osobne konta, wszystkie dane wspólne i widoczne dla obu. Autor i uczestnicy wydarzenia są niezależnymi informacjami; brak prywatnych wpisów. |
| D-011 | Wiele kalendarzy (m.in. AGH, wspólny, ważne daty), domyślnie połączony widok wszystkich i możliwość filtrowania. „Wspólny” to osobny kalendarz, a nie agregat. |
| D-012 | Frontend i backend w jednym projekcie Next.js (App Router) + React + TypeScript + Tailwind CSS. Lokalny szkielet działa; PostgreSQL jest planowany na kolejny etap, wybór ORM i uwierzytelniania nadal otwarty. |
| D-013 | Użytkownik uczy się programowania poprzez wspólne pisanie z Codexem. Najpierw małe kroki interfejsu, później prototyp kalendarza i po doprecyzowaniu modelu danych — trwały zapis i logowanie. |

## Plan roboczy

Pierwszy działający fragment: dwa konta, logowanie, kalendarz dnia i ręczne dodawanie wydarzeń osobistych oraz wspólnych. Kryteria odbioru opisano w [TASKS.md](TASKS.md).

Szkielet Next.js działa lokalnie i został wypchnięty na GitHuba; nie oznacza to jeszcze zaimplementowanych funkcji. Przed pełnym MVP realizujemy krótki etap edukacyjny: layout, sidebar i wizualny prototyp kalendarza bez prawdziwych danych.

## Kwestie otwarte przed implementacją fundamentu

| ID | Do rozstrzygnięcia | Miejsce ustaleń |
| --- | --- | --- |
| O-002 | Potwierdzenie konfiguracji PostgreSQL, wybór ORM i sposób zarządzania migracjami | Architektura i baza danych |
| O-003 | Utworzenie dwóch kont, logowanie i sesje | Architektura i baza danych |
| O-004 | Minimalny model użytkowników, wydarzeń i uczestników | Architektura i baza danych |
| O-005 | Formularz wydarzenia, kolizje terminów i uprawnienia edycji | Kalendarz |
| O-006 | Pierwszy wygląd dnia, nawigacja i oznaczenia autorów | Kalendarz oraz Wygląd i obsługa |

Hosting, budżet, domena, przechowywanie zdjęć i strategia kopii zapasowych wymagają osobnych decyzji przed wdrożeniem odpowiednich funkcji. Nie blokują dokumentacji ani lokalnego prototypu.

Google Calendar nie został wybrany jako obowiązkowy element architektury.

## Zmiana ustaleń

Nowa decyzja powinna zawierać datę, przyczynę i wpływ na zakres. Zatwierdzone wybory zastępują otwarte kwestie, a [SPEC.md](SPEC.md) oraz [TASKS.md](TASKS.md) należy aktualizować zgodnie z rzeczywistym stanem prac.
