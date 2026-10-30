# Instrukcje pracy nad projektem

## Kontekst

Prywatna strona dla dwóch osób. Przed zmianami przeczytaj README.md, docs/SPEC.md, docs/DECISIONS.md oraz docs/TASKS.md.

Rozmowy tematyczne służą ustaleniom; aktualne wymagania potrzebne do implementacji należy utrwalać w repozytorium.

## Aktualny etap

Dokumentacja startowa, przed implementacją. Pierwszym planowanym fragmentem jest lokalne logowanie dwóch kont i kalendarz dnia.

Technologie i silnik bazy pozostają otwarte. Przygotuj konkretną rekomendację przed tworzeniem szkieletu, zamiast traktować wcześniejsze propozycje jako zatwierdzony wybór. Hosting nie jest wymagany do rozpoczęcia lokalnych prac.

## Wymagania do zachowania

- Dwa oddzielne konta; brak otwartej rejestracji.
- Sprawdzanie dostępu do danych po stronie aplikacji.
- Autor wydarzenia i jego uczestnicy to odrębne pojęcia.
- Wspólne wydarzenie jest zapisane raz i pokazywane w obu kolumnach.
- Odświeżenie importu AGH zachowuje wybory użytkownika.
- Marzenia, wyjazdy, wydarzenia i wspomnienia mają opcjonalne powiązania.

## Dane i konfiguracja

Dane logowania do baz, klucze źródeł iCalendar, tokeny Gmaila i inne sekrety przechowuj w lokalnej lub serwerowej konfiguracji poza repozytorium. Przed dodaniem plików konfiguracyjnych przygotuj odpowiednie reguły ignorowania oraz przykład konfiguracji bez sekretów.

Do przykładów i testów używaj danych syntetycznych. Prywatne wiadomości, zdjęcia i rzeczywiste eksporty kalendarza nie są potrzebne w kodzie źródłowym.

## Zakończenie zadania

Przeprowadzaj sprawdzenia odpowiednie do zmiany. Dla implementacji fundamentu wykorzystaj scenariusze odbioru z docs/TASKS.md. Opisz wynik i ograniczenia, a status zadań aktualizuj dopiero zgodnie z faktycznie wykonanymi pracami.

Wyjaśniaj decyzje prostym językiem po polsku. Zmiany powinny pozostawać zrozumiałe dla osoby znającej podstawy programowania i SQL.
