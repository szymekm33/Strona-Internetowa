# Decyzje i kwestie otwarte

Stan na 2026-10-30. Odróżniamy ustalenia produktu od roboczej kolejności implementacji.

## Ustalone kierunki produktu

| ID | Ustalenie |
| --- | --- |
| D-001 | Aplikacja prywatna dla dwóch oddzielnych kont, bez otwartej rejestracji. |
| D-002 | Własny interfejs z osobnymi kolumnami osób w kalendarzu. |
| D-003 | Aktualizowany plan AGH przez iCalendar, z osobno zapisanymi filtrami i wyjątkami użytkownika. |
| D-004 | Wspomnienia mają osobne wpisy z autorami oraz konfigurowalne okładki albumów. |
| D-005 | Marzenie, planowany wyjazd, wydarzenie i wspomnienie są osobnymi, opcjonalnie powiązanymi obiektami. |
| D-006 | Przypomnienia o wydarzeniach poprzedzają integrację Gmaila. |
| D-007 | Kierunek wizualny: minimalistyczny, przyjazny i osobisty. Dokładny wygląd jest otwarty. |
| D-008 | Prace mogą rozpocząć się lokalnie, bez czekania na hosting. |
| D-009 | Plan i specyfikacje powstają w czatach tematycznych i dokumentacji repozytorium; implementacja z Codexem. |

## Plan roboczy

Pierwszy działający fragment: dwa konta, logowanie, kalendarz dnia i ręczne dodawanie wydarzeń osobistych oraz wspólnych. Kryteria odbioru opisano w [TASKS.md](TASKS.md).

Dokumentacja startowa porządkuje ustalenia. Nie stanowi potwierdzenia gotowego kodu ani wyboru technologii.

## Kwestie otwarte przed implementacją fundamentu

| ID | Do rozstrzygnięcia | Miejsce ustaleń |
| --- | --- | --- |
| O-001 | Technologie aplikacji i lokalny sposób uruchamiania | Architektura i baza danych |
| O-002 | Silnik bazy i sposób zarządzania zmianami jej struktury | Architektura i baza danych |
| O-003 | Utworzenie dwóch kont, logowanie i sesje | Architektura i baza danych |
| O-004 | Minimalny model użytkowników, wydarzeń i uczestników | Architektura i baza danych |
| O-005 | Formularz wydarzenia, kolizje terminów i uprawnienia edycji | Kalendarz |
| O-006 | Pierwszy wygląd dnia, nawigacja i oznaczenia autorów | Kalendarz oraz Wygląd i obsługa |

Hosting, budżet, domena, przechowywanie zdjęć i strategia kopii zapasowych wymagają osobnych decyzji przed wdrożeniem odpowiednich funkcji. Nie blokują dokumentacji ani lokalnego prototypu.

Google Calendar nie został wybrany jako obowiązkowy element architektury.

## Zmiana ustaleń

Nowa decyzja powinna zawierać datę, przyczynę i wpływ na zakres. Zatwierdzone wybory zastępują otwarte kwestie, a [SPEC.md](SPEC.md) oraz [TASKS.md](TASKS.md) należy aktualizować zgodnie z rzeczywistym stanem prac.
