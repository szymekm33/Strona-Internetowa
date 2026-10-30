# Specyfikacja funkcjonalna

Stan na 2026-10-30. Dokument zbiera ustalenia produktu. Szczegóły techniczne i nierozstrzygnięte zachowania oznaczono osobno.

## 1. Cel i dostęp

Prywatna strona dla dwóch osób, z oddzielnymi kontami. Rejestracja nie jest otwarta. Dostęp do danych i zdjęć mają wyłącznie uprawnieni, zalogowani użytkownicy.

Głównym urządzeniem jest komputer; interfejs ma być użyteczny także na telefonie. Styl: minimalistyczny, przyjazny, osobisty, z kolorem i dobrymi ustawieniami domyślnymi. Dokładny projekt graficzny pozostaje do ustalenia.

## 2. Pierwsza wersja lokalna — plan roboczy

Pierwszy fragment obejmuje logowanie i kalendarz dnia:

1. Każda osoba loguje się na własne konto.
2. Kalendarz pokazuje wspólną oś czasu i dwie kolumny osób.
3. Można dodać wydarzenie przypisane jednej osobie albo obu.
4. Wspólne wydarzenie jest jednym rekordem logicznym, pokazywanym w obu kolumnach.
5. Autor wpisu jest odróżniony od uczestników wydarzenia.
6. Dane zachowują się po odświeżeniu i ponownym uruchomieniu aplikacji.
7. Drugie konto widzi zapisane wydarzenia zgodnie z ich przypisaniem do kolumn.
8. Osoba niezalogowana nie ma dostępu do danych kalendarza.

„Osobiste wydarzenie” opisuje uczestnictwo jednej osoby. Ukrywanie wydarzeń przed partnerem nie jest częścią dotychczas ustalonego zakresu.

Sposób tworzenia dwóch kont, logowanie, pola formularza, obsługa nakładania się wydarzeń oraz uprawnienia edycji i usuwania wymagają doprecyzowania przed odpowiednią implementacją.

## 3. Docelowy kalendarz

- Spotkania, randki, plany osobiste i wspólne.
- Dwie kolumny osób w obrębie dnia, również w widoku tygodnia.
- Kategorie, kolory, ikonki i kafelki wydarzeń.
- Wspólne wolne przedziały wyliczane na podstawie uwzględnionych wydarzeń blokujących czas.
- Strefa użytkowa Europe/Warsaw, z poprawną obsługą zmian czasu.
- Własny interfejs kalendarza. Integracja z Google Calendar pozostaje opcjonalnym kierunkiem do osobnej decyzji.

### Import planu AGH

Źródłem aktualizacji jest subskrypcja adresu iCalendar, pobierana po stronie serwera. Wgrywanie pliku .ics daje dodatkowo import jednorazowy.

- Import przechowuje dane źródłowe oraz osobno wybory użytkownika.
- Można pomijać typ zajęć, przedmiot/grupę i pojedynczy termin.
- Wyjątek dotyczący konkretnego terminu ma pierwszeństwo przed regułą grupową.
- Pominięte zajęcia nie blokują wyliczania wspólnego wolnego czasu.
- Aktualizacje zachowują wybory użytkownika i nie tworzą duplikatów.
- Brak terminu w źródle typu „upcoming” nie oznacza automatycznego usunięcia historii.

Częstotliwość odświeżania i zasady rozpoznawania zmian lub odwołania zajęć wymagają projektu importera. Prywatny adres źródła i jego klucze nie są częścią dokumentacji repozytorium.

## 4. Wspomnienia i zdjęcia

- Wspomnienie może dotyczyć wyjazdu, rocznicy albo zwykłego dnia.
- Ma tytuł, datę lub zakres dat, opcjonalne miejsce i wspólną galerię.
- Każda osoba dodaje osobne wpisy jako kafelki, z oznaczeniem autora i czasem dodania.
- Okładka wspomnienia może być kolażem wybranych zdjęć, pokazem slajdów albo własnym obrazem, także spoza albumu.
- Konfiguracja obejmuje m.in. wybór zdjęć, kolejność, kadrowanie i akcent kolorystyczny.
- Możliwe jest powiązanie wspomnienia z wyjazdem i wydarzeniem.

Uprawnienia do edycji cudzych wpisów i zarządzania wspólną galerią pozostają do zatwierdzenia.

## 5. Cele, marzenia i planowane wyjazdy

Cele mogą dotyczyć jednej osoby albo obojga, np. zdobycia pracy lub wspólnego mieszkania. Mają tytuł, opcjonalny opis i obraz oraz możliwość oznaczenia spełnienia.

Planowany wyjazd jest osobnym obiektem: miejsce, opcjonalny termin, notatki, linki i przygotowania. Rozbudowany plan dzień po dniu pozostaje opcją do decyzji.

Powiązania są dobrowolne:

- marzenie może prowadzić do utworzenia planowanego wyjazdu;
- ustalenie terminu wyjazdu pozwala dodać powiązane wspólne wydarzenie;
- zmiana terminu wyjazdu aktualizuje ten sam powiązany wpis;
- po wyjeździe można dodać wspomnienie i oznaczyć marzenie jako spełnione.

Każdy z tych obiektów może istnieć samodzielnie.

## 6. Powiadomienia

Przypomnienia o randkach i wydarzeniach oraz centrum powiadomień na stronie. Przykładowe wyprzedzenia to dzień i godzina przed wydarzeniem; ustawienia wymagają dopracowania.

Powiadomienia systemowe poza otwartą stroną to osobny etap wymagający obsługi Web Push i zgody użytkownika. Szczegóły dostarczania i urządzenia docelowe wymagają weryfikacji podczas implementacji.

Przypomnienia o wydarzeniach wdrażamy przed integracją Gmaila.

## 7. Nasza poczta — etap późniejszy

Każda osoba osobno łączy własne konto Gmail z aplikacją. Skrzynka na stronie pokazuje wybrane wiadomości od partnera z uzgodnionym oznaczeniem w temacie, np. [DLA NAS].

Zakres: nadawca, temat, data, podgląd i treść wiadomości, stan przeczytania na stronie oraz powiadomienie o nowej pasującej wiadomości.

Oznaczenie tematu, zakres uprawnień, synchronizacja i sposób wykrywania nowych wiadomości wymagają osobnej specyfikacji. Stan przeczytania na stronie nie zakłada automatycznie zmiany stanu w Gmailu. Wysyłanie poczty z aplikacji nie jest obecnie ustaloną funkcją.

## 8. Uruchamianie i przechowywanie

Najpierw wersja lokalna. Hosting kolegi jest możliwością do sprawdzenia; dostawca zastępczy i budżet pozostają otwarte.

Docelowy model logiczny: przeglądarka komunikuje się z aplikacją, aplikacja obsługuje konta i dane w bazie oraz dostęp do zdjęć. Miejsce przechowywania zdjęć i kopii zapasowych wymaga decyzji technicznej.

Niezależnie od dostawcy dane muszą być trwałe, a dostęp ograniczony do dwóch uprawnionych kont.
