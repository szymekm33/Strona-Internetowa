# Wdrożenie kalendarza Razem

Lokalny frontend i API PHP z MariaDB są zaimplementowane. Aktualny sposób uruchomienia oraz rozmieszczenie plików na hostingu opisuje [instrukcja kalendarza](URUCHOMIENIE.md). Poniżej zachowano uzgodnioną kolejność i kryteria prac.

## Wzorzec i reguły

Otwórz lokalnie [prototyp HTML](../../design/reference/razem-kalendarz-prototyp.html). Startuje bez wydarzeń i zajęć. Ręcznie dodane wpisy zapisuje tylko w przeglądarce. W aplikacji dane i ustawienia uczelni zapisuj w MySQL lub MariaDB przez PHP, sprawdzając sesję przy każdym odczycie i zapisie.

- Dwa osobne loginy, wspólne dane. Autor wpisu i osoby, których wpis dotyczy, to osobne pola. Oba konta mogą dodawać i edytować wspólne dane.
- „Wszystkie” łączy AGH, UR, UKEN, Plany ręczne i Ważne daty. „Razem” oznacza uczestnictwo obojga. Gwiazdka wyróżnia wpis w miesiącu niezależnie od kalendarza. Kolor można nadpisać z palety okrągłych próbek.
- Dzień i tydzień używają wspólnej osi godzin, z Szymkiem po lewej i Oliwusią po prawej. Pozycje i wysokości kafelków odpowiadają rzeczywistym godzinom, także przy nakładaniu. Wspólny wpis rozciąga się na obie kolumny, gdy pozwala na to układ kolizji.
- W tygodniu dzień rozszerza się po najechaniu, a etykiety pokazują „Szymek | Oliwusia”. Przy przewijaniu w poziomie panel godzin jest przypięty do lewej, ma kryjące lawendowe tło, zaokrągloną ramkę i cień. „Godz.” i godziny są wyśrodkowane poziomo. Pasek przewijania jest fioletowy. Pod siatką tygodnia nie dodawaj tekstu instruktażowego.
- Miesiąc pokazuje liczby wpisów osobistych i wspólnych oraz ważne daty. Kliknięcie daty rozwija listę z godzinami i przejście do dnia.
- Pole „Zajmuje czas” decyduje o dostępności. Filtrowanie widoku nie zmienia zajętości. Pominięty termin jej nie blokuje.

## Eksport i hosting

Lokalnie sprawdzono `output: "export"` i `trailingSlash: true` w `next.config.ts`. `npm run build` generuje `out`, a `py -m http.server 8000 --directory out` pozwala przetestować wejście na `/kalendarz/` z menu i bezpośrednio oraz odświeżenie. Konfigurację trzeba jeszcze zapisać w repozytorium. Wgrywaj zawartość `out` do katalogu strony, a schemat SQL importuj w phpMyAdmin. Produkcyjne poświadczenia bazy przechowuj po stronie PHP poza repozytorium. Obsługę crona i połączeń HTTPS wychodzących potwierdź przed automatyzacją importu AGH.

## Kolejność prac

1. Sprawdź aktualną gałąź i istniejące instrukcje. Podłącz ręczne wydarzenia do PHP i MySQL lub MariaDB, z dostępem po zalogowaniu. Zacznij od widoku dnia, dodawania, edycji i usuwania. Sprawdź, czy wpis utworzony na jednym koncie jest dostępny na drugim po ponownym zalogowaniu.
2. Odtwórz tydzień, miesiąc, filtrowanie i wyszukiwanie wspólnego wolnego. Porównaj godziny 08:00 i 08:30 w sąsiednich kolumnach. Sprawdź wyrównanie skali i brak prześwitów podczas przewijania na komputerze i telefonie.
3. Dodaj „Uczelnie”. UR i UKEN to osobne kalendarze ręcznego planu Oliwusi. „Ułóż plan tygodnia” uzupełnia uczelnię, osobę i klikniętą godzinę oraz domyślnie wybiera „Co tydzień”. Obsłuż „Co dwa tygodnie”, koniec semestru i powrót do tego samego widoku po zapisie. Zwykłe dodawanie domyślnie jest jednorazowe. Przy edycji lub pomijaniu domyślnie zmieniaj tylko kliknięty termin. Obsłuż też „Ten i następne” oraz „Cała seria”. Przetestuj przesunięcie wtorkowych zajęć na środę bez zmiany sąsiednich tygodni.
4. Dla AGH dodaj serwerowy import iCalendar, z trwałym wyborem według rodzaju zajęć, przedmiotu i grupy albo pojedynczego terminu. Powtórne pobranie aktualizuje istniejące terminy bez duplikatów i zachowuje wybory po przesunięciu terminu. Link planu traktuj jako prywatny. Częstotliwość automatycznego odświeżania ustal przy wdrożeniu.
