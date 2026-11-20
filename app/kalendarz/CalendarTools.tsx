import { useState, type FormEvent } from "react";
import Dialog from "./Dialog";
import { addDays, clock, displayDate, freeTimes, included, minutes, newSlot } from "./calendar";
import type { CalendarData, ChoiceKind, Entry, Mutate, Slot } from "./calendar";

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
        void run(() => mutate({ action: "choice", kind, key, included: value }), "Zapisano wybór.");
    }
    return (
        <Dialog title="Uczelnie" onClose={close} busy={busy}>
            <div className="view-tabs university-tabs">
                {(["agh", "ur", "uken"] as const).map((c) => (
                    <button
                        className={"view-tab " + (uni === c ? "active" : "")}
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
                <fieldset disabled={busy}>
                    <p>Plan Szymka · {items.length} terminów</p>
                    <button
                        className="btn soft"
                        onClick={() => run(() => mutate({ action: "import" }), "Odświeżono plan AGH.")}
                    >
                        Odśwież subskrypcję
                    </button>
                    <label>
                        Importuj plik iCalendar
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
                                }, "Zaimportowano plan AGH.");
                            }}
                        />
                    </label>
                    {[...new Set(items.map((e) => e.courseType))].map((type) => (
                        <label className="option-line" key={type}>
                            <input
                                type="checkbox"
                                checked={data.choices.type[type] ?? true}
                                onChange={(e) => choice("type", type, e.target.checked)}
                            />
                            {type}
                        </label>
                    ))}
                    {[...groups].map(([course, terms]) => (
                        <details key={course}>
                            <summary>
                                {course} · {terms.length}
                            </summary>
                            <label>
                                Przedmiot lub grupa
                                <select
                                    value={String(data.choices.course[course] ?? "inherit")}
                                    onChange={(e) =>
                                        choice(
                                            "course",
                                            course,
                                            e.target.value === "inherit" ? null : e.target.value === "true",
                                        )
                                    }
                                >
                                    <option value="inherit">Według rodzaju zajęć</option>
                                    <option value="true">Uwzględnij</option>
                                    <option value="false">Pomiń</option>
                                </select>
                            </label>
                            {terms.map((t) => (
                                <label key={t.id}>
                                    {t.date} · {t.start} · {included(data, t) ? "uwzględniony" : "pominięty"}
                                    <select
                                        value={String(data.choices.term[t.source!] ?? "inherit")}
                                        onChange={(e) =>
                                            choice(
                                                "term",
                                                t.source!,
                                                e.target.value === "inherit"
                                                    ? null
                                                    : e.target.value === "true",
                                            )
                                        }
                                    >
                                        <option value="inherit">Według grupy</option>
                                        <option value="true">Uwzględnij termin</option>
                                        <option value="false">Pomiń termin</option>
                                    </select>
                                </label>
                            ))}
                        </details>
                    ))}
                </fieldset>
            )}
            <p role="status">{status}</p>
        </Dialog>
    );
}
