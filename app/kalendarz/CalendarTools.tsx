import { useState, type FormEvent } from "react";
import Dialog from "./Dialog";
import { addDays, clock, displayDate, freeTimes, included, minutes, newSlot } from "./calendar";
import type { CalendarData, ChoiceKind, Entry, Mutate, Slot } from "./calendar";

const courseTypeNames: Record<string, string> = {
    W: "Wykłady",
    CWL: "Laboratoria",
    CWA: "Ćwiczenia",
    CWP: "Projekty",
    LEKT: "Lektorat",
    WF: "Wychowanie fizyczne",
};

export function Availability({
    events,
    date,
    close,
    create,
}: {
    events: Entry[];
    date: string;
    close: () => void;
    create: (slot: Slot) => void;
}) {
    const [search, setSearch] = useState({ date, from: 480, to: 1200, minimum: 60 });
    const [error, setError] = useState("");
    const choices = Array.from({ length: 7 }, (_, i) => addDays(search.date, i)).flatMap((day) =>
        freeTimes(events, day, search.from, search.to, search.minimum).map((s) => ({ ...s, date: day })),
    );
    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const from = minutes(String(f.get("from"))),
            to = minutes(String(f.get("to")));
        if (from >= to) {
            setError("Koniec musi wypadać po początku.");
            return;
        }
        setError("");
        setSearch({ date: String(f.get("date")), from, to, minimum: Number(f.get("minimum")) });
    }
    return (
        <Dialog title="Wolne razem" onClose={close}>
            <form onSubmit={submit}>
                <div className="field-pair">
                    <label>
                        Szukaj od dnia
                        <input type="date" name="date" defaultValue={date} required />
                    </label>
                    <label>
                        Co najmniej
                        <select name="minimum" defaultValue={60}>
                            {[30, 60, 90, 120].map((n) => (
                                <option key={n} value={n}>
                                    {n} minut
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="field-pair">
                    <label>
                        Między
                        <input type="time" name="from" defaultValue="08:00" required />
                    </label>
                    <label>
                        A<input type="time" name="to" defaultValue="20:00" required />
                    </label>
                </div>
                <button className="btn" type="submit">
                    Szukaj w ciągu 7 dni
                </button>
                {error && <p role="alert">{error}</p>}
            </form>
            <div className="availability-results" aria-live="polite">
                {!choices.length && <p>Brak wspólnego wolnego w podanym zakresie.</p>}
                {choices.map((s) => (
                    <div className="availability-result" key={s.date + s.start}>
                        <div>
                            <strong>
                                {displayDate(s.date, { weekday: "long", day: "numeric", month: "short" })}
                            </strong>
                            <span>
                                {clock(s.start)}–{clock(s.end)}
                            </span>
                        </div>
                        <button
                            className="btn soft small"
                            onClick={() =>
                                create({
                                    ...newSlot(s.date),
                                    start: clock(s.start),
                                    end: clock(s.start + search.minimum),
                                })
                            }
                        >
                            Zaplanuj
                        </button>
                    </div>
                ))}
            </div>
        </Dialog>
    );
}

export function Universities({
    data,
    mutate,
    close,
    plan,
}: {
    data: CalendarData;
    mutate: Mutate;
    close: () => void;
    plan: (c: "ur" | "uken") => void;
}) {
    const [uni, setUni] = useState<"agh" | "ur" | "uken">("agh");
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState("");
    async function run(fn: () => Promise<void>, message: string) {
        setBusy(true);
        setStatus("");
        try {
            await fn();
            setStatus(message);
        } catch (e) {
            setStatus((e as Error).message);
        } finally {
            setBusy(false);
        }
    }
    const items = data.events.filter((e) => e.calendar === uni);
    const groups = new Map<string, Entry[]>();
    for (const event of items) {
        const group = groups.get(event.course);
        if (group) group.push(event);
        else groups.set(event.course, [event]);
    }
    function choice(kind: ChoiceKind, key: string, value: boolean | null) {
        void run(() => mutate({ action: "choice", kind, key, included: value }), "Zapisano zmiany dla obu kont.");
    }
    const selectedCount = items.filter((event) => included(data, event)).length;
    return (
        <Dialog title="Uczelnie" onClose={close} busy={busy}>
            <div className="view-tabs university-tabs" role="group" aria-label="Uczelnia">
                {(["agh", "ur", "uken"] as const).map((c) => (
                    <button
                        className={"view-tab " + (uni === c ? "active" : "")}
                        aria-pressed={uni === c}
                        key={c}
                        onClick={() => {
                            setUni(c);
                            setStatus("");
                        }}
                    >
                        {c.toUpperCase()}
                    </button>
                ))}
            </div>
            {uni !== "agh" ? (
                <>
                    <p>Plan Oliwusi · {items.length} terminów</p>
                    <button className="btn pink" onClick={() => plan(uni)}>
                        Ułóż plan tygodnia
                    </button>
                </>
            ) : (
                <fieldset className="agh-settings" disabled={busy}>
                    <legend className="sr-only">Plan AGH Szymka</legend>
                    <div className="agh-intro">
                        <h3>Plan AGH Szymka</h3>
                        <p className="agh-copy">Oboje widzicie ten plan i możecie go zmieniać. Zmiany zapisują się od razu.</p>
                    </div>
                    <p className="agh-copy">Pomijane zajęcia znikają z kalendarza i nie blokują „Wolne razem”. W każdej chwili możesz je włączyć ponownie.</p>
                    <p className="agh-count" aria-live="polite">W kalendarzu: {selectedCount} z {items.length} terminów</p>
                    <p className="agh-save-status" role="status">{busy ? "Zapisywanie…" : status}</p>

                    <div className="agh-course-list">
                        <h3>Wybierz przedmioty i terminy</h3>
                        <p className="agh-copy">Rozwiń przedmiot, aby wybrać, które zajęcia mają być w kalendarzu.</p>
                        {!items.length && <p className="agh-copy">Najpierw pobierz plan z AGH lub wczytaj plik poniżej.</p>}
                        {[...groups].map(([course, terms]) => {
                            const visibleCount = terms.filter((term) => included(data, term)).length;
                            const defaultCount = terms.filter((term) => data.choices.type[term.courseType] ?? true).length;
                            const defaultLabel = defaultCount === terms.length ? "pokaż" : defaultCount === 0 ? "pomiń" : "część terminów";
                            return (
                                <details className="agh-course" key={course}>
                                    <summary>
                                        {course}
                                        <span className="agh-course-count">W kalendarzu: {visibleCount} z {terms.length} terminów</span>
                                    </summary>
                                    <label>
                                        Cały przedmiot
                                        <select
                                            aria-label={`Pokazywanie przedmiotu: ${course}`}
                                            value={String(data.choices.course[course] ?? "inherit")}
                                            onChange={(e) => choice("course", course, e.target.value === "inherit" ? null : e.target.value === "true")}
                                        >
                                            <option value="inherit">Domyślnie: {defaultLabel}</option>
                                            <option value="true">Pokaż ten przedmiot</option>
                                            <option value="false">Pomiń ten przedmiot</option>
                                        </select>
                                    </label>
                                    <p className="agh-copy">„Domyślnie” korzysta z ustawień rodzajów zajęć poniżej. Pojedyncze daty możesz ustawić osobno.</p>
                                    <div className="agh-terms">
                                        {terms.map((term) => {
                                            const shown = included(data, term);
                                            const parentShown = data.choices.course[course] ?? data.choices.type[term.courseType] ?? true;
                                            const dateLabel = displayDate(term.date, { weekday: "short", day: "numeric", month: "long", year: "numeric" });
                                            return (
                                                <div className="agh-term" key={term.id}>
                                                    <div className="agh-term-heading">
                                                        <div>
                                                            <strong>{dateLabel}</strong>
                                                            <span>{term.allDay ? "Cały dzień" : `${term.start}–${term.end}`}</span>
                                                        </div>
                                                        <span className="agh-term-state" data-included={shown}>{shown ? "W kalendarzu" : "Pomijany"}</span>
                                                    </div>
                                                    <label>
                                                        Ten jeden termin
                                                        <select
                                                            aria-label={`Pokazywanie terminu: ${dateLabel}, ${course}`}
                                                            value={String(data.choices.term[term.source!] ?? "inherit")}
                                                            onChange={(e) => choice("term", term.source!, e.target.value === "inherit" ? null : e.target.value === "true")}
                                                        >
                                                            <option value="inherit">Jak przedmiot: {parentShown ? "pokaż" : "pomiń"}</option>
                                                            <option value="true">Pokaż ten termin</option>
                                                            <option value="false">Pomiń ten termin</option>
                                                        </select>
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </details>
                            );
                        })}
                    </div>

                    {!!items.length && (
                        <details className="agh-section">
                            <summary>Ustawienia dla całych rodzajów zajęć</summary>
                            <p className="agh-copy">Zaznacz, które rodzaje zajęć domyślnie pokazywać. Własny wybór przy przedmiocie lub pojedynczej dacie ma pierwszeństwo.</p>
                            {[...new Set(items.map((event) => event.courseType))].map((type) => (
                                <label className="option-line" key={type}>
                                    <input
                                        type="checkbox"
                                        checked={data.choices.type[type] ?? true}
                                        onChange={(e) => choice("type", type, e.target.checked)}
                                    />
                                    Pokaż {courseTypeNames[type] ? `${courseTypeNames[type]} (${type})` : type}
                                </label>
                            ))}
                        </details>
                    )}
                    <details className="agh-section agh-source" open={!items.length}>
                        <summary>Pobierz lub wczytaj plan</summary>
                        <p className="agh-copy">Sprawdź zmiany godzin i sal oraz nowe zajęcia w planie uczelni.</p>
                        <button
                            type="button"
                            className="btn soft"
                            onClick={() => run(() => mutate({ action: "import" }), "Pobrano aktualny plan AGH.")}
                        >
                            Pobierz aktualny plan z AGH
                        </button>
                        <p className="agh-copy">Pobiera plan teraz z podłączonego adresu AGH. Automatyczne pobieranie nie jest jeszcze włączone.</p>
                        <label>
                            Wczytaj plan z pliku (.ics)
                            <input
                                type="file"
                                accept=".ics,text/calendar"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    e.target.value = "";
                                    if (!file) return;
                                    void run(async () => {
                                        if (file.size > 2000000) throw Error("Wybierz plik do 2 MB.");
                                        await mutate({ action: "import", ics: await file.text() });
                                    }, "Wczytano plan z pliku.");
                                }}
                            />
                        </label>
                        <p className="agh-copy">Wybierz plik planu z komputera. Kolejne zmiany w pliku wczytasz, wybierając go ponownie.</p>
                    </details>
                </fieldset>
            )}
            {uni !== "agh" && <p role="status">{status}</p>}
        </Dialog>
    );
}
