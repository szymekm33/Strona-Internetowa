# Zadania i postępy

Stan na 2026-10-30.

Legenda: [x] wykonane, [ ] do wykonania. Samo opisanie funkcji nie oznacza jej implementacji.

## Etap 0 — przygotowanie

- [x] Zebrano główne potrzeby produktu.
- [x] Utworzono prywatne repozytorium.
- [x] Podzielono pracę na czaty tematyczne.
- [x] Przygotowano dokumentację startową i kryteria pierwszej lokalnej wersji.
- [ ] Zatwierdzić technologie aplikacji, silnik bazy i sposób lokalnego uruchamiania.
- [ ] Ustalić tworzenie dwóch kont oraz logowanie.
- [ ] Doprecyzować minimalny model danych i formularz wydarzenia.
- [ ] Uzgodnić pierwszy widok dnia.

**Następne zadanie:** w czacie „Architektura i baza danych” wybrać technologię oraz zaprojektować lokalne uruchomienie, korzystając z tej dokumentacji. Hosting pozostaje otwartą decyzją na późniejszy etap.

## Etap 1 — pierwsza działająca wersja lokalna

- [ ] Utworzyć projekt w wybranej technologii.
- [ ] Dodać lokalną bazę oraz sposób tworzenia i aktualizowania jej struktury.
- [ ] Przygotować dwa konta i logowanie, bez publicznej rejestracji.
- [ ] Ograniczyć odczyt i zapis danych do zalogowanych, uprawnionych kont.
- [ ] Dodać model wydarzenia z autorem, terminem i uczestnikami.
- [ ] Zaimplementować kalendarz dnia ze wspólną osią czasu i dwiema kolumnami.
- [ ] Dodać wydarzenie jednej osoby albo wspólne.
- [ ] Zapewnić trwały zapis i ponowne odczytanie danych.
- [ ] Dodać instrukcję lokalnej instalacji i uruchomienia.
- [ ] Przeprowadzić odbiór poniższych scenariuszy.

### Kryteria odbioru etapu 1

1. Każda osoba może zalogować się na własne konto.
2. Niezalogowana osoba nie może pobrać ani zmienić danych kalendarza.
3. Wydarzenie jednej osoby pojawia się w odpowiedniej kolumnie.
4. Wspólne wydarzenie jest zapisane raz i widoczne w obu kolumnach.
5. Autor i uczestnicy są rozróżniani, także gdy jedna osoba dodaje wydarzenie dla drugiej.
6. Po odświeżeniu strony i ponownym uruchomieniu aplikacji dane pozostają.
7. Po zalogowaniu na drugie konto i odświeżeniu kalendarza widać wcześniej zapisane wydarzenie.
8. Nieprawidłowy przedział czasu jest odrzucany z czytelnym komunikatem.
9. Wyświetlane godziny są zgodne z Europe/Warsaw.

Automatyczne odświeżanie drugiej przeglądarki w czasie rzeczywistym nie jest kryterium tego etapu.

## Dalsze etapy — orientacyjna kolejność

1. Rozwinięcie kalendarza: tydzień, telefon, edycja, usuwanie i kategorie.
2. Import i aktualizacja planu AGH z zachowaniem filtrów i wyjątków.
3. Wspólne wolne terminy oraz przypomnienia o wydarzeniach.
4. Wspomnienia, zdjęcia i konfigurowalne okładki.
5. Cele, marzenia i planowane wyjazdy z powiązaniami.
6. Nasza poczta połączona z Gmailem.

Kolejność tych etapów można zmienić w „Planie głównym”. Przed udostępnieniem aplikacji przez internet trzeba wybrać hosting, skonfigurować HTTPS, trwałe przechowywanie i kopie zapasowe oraz sprawdzić dostęp z obu kont.

## Raport z zakończenia zadania

W podsumowaniu zapisać:

- co wykonano i gdzie znajduje się zmiana;
- co faktycznie sprawdzono;
- które decyzje nadal są otwarte;
- jaki jest następny konkretny krok.
