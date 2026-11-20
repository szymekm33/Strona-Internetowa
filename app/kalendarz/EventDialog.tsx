import { useState, type FormEvent } from "react";
import Dialog from "./Dialog";
import { addDays, calendars, names } from "./calendar";
import type { Calendar, Entry, Mutate, Slot } from "./calendar";

const palette = [
    ["", "Domyślny"],
    ["#8951DE", "Fioletowy"],
    ["#FF4FA3", "Różowy"],
    ["#EC5252", "Czerwony"],
    ["#F28A37", "Pomarańczowy"],
    ["#F5C344", "Żółty"],
    ["#55AF74", "Zielony"],
    ["#37A9AC", "Turkusowy"],
    ["#5485DC", "Niebieski"],
];
export default function EventDialog({
    slot,
    entry,
    semesterEnd,
    mutate,
    close,
    saved,
}: {
    slot: Slot;
    entry?: Entry;
    semesterEnd: string | null;
    mutate: Mutate;
    close: () => void;
    saved: (date: string, calendar?: Calendar) => void;
}) {
    const [allDay, setAllDay] = useState(entry?.allDay ?? false);
    const [repeat, setRepeat] = useState(slot.repeat ?? 0);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [scope, setScope] = useState("one");
    const [date, setDate] = useState(slot.date);
    const [endDate, setEndDate] = useState(entry && !entry.allDay ? entry.endDate : slot.date);
    const imported = !!entry?.source;

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (busy) return;
        setError("");
        const form = new FormData(e.currentTarget);
        const fields = Object.fromEntries(form);
        if (!confirmDelete && !imported) {
            if (!String(fields.title ?? "").trim()) {
                setError("Wpisz nazwę wydarzenia.");
                return;
            }
            if (!allDay && (endDate < date || (endDate === date && fields.end <= fields.start))) {
                setError("Koniec musi wypadać po początku wydarzenia.");
                return;
            }
        }
        setBusy(true);
        try {
            if (imported)
                await mutate({ action: "choice", kind: "term", key: entry!.source, included: false });
            else if (confirmDelete) await mutate({ action: "delete", id: entry!.id, scope });
            else
                await mutate({
                    ...fields,
                    action: "save",
                    id: entry?.id,
                    scope,
                    date,
                    endDate,
                    allDay,
                    repeat,
                    important: form.has("important"),
                    blocking: form.has("blocking"),
                });
            saved(
                confirmDelete || imported ? slot.date : date,
                confirmDelete || imported ? undefined : (fields.calendar as Calendar),
            );
        } catch (err) {
            setError((err as Error).message);
            setBusy(false);
        }
    }
    return (
        <Dialog
            title={
                imported
                    ? "Zajęcia AGH"
                    : confirmDelete
                      ? "Usunąć wydarzenie?"
                      : entry
                        ? "Edytuj wydarzenie"
                        : "Dodaj wydarzenie"
            }
            onClose={close}
            busy={busy}
        >
            <form onSubmit={submit}>
                {entry && (
                    <p className="event-author">
                        {entry.source
                            ? "Źródło: AGH"
                            : "Dodane przez: " + names[String(entry.author) as "1" | "2"]}
                    </p>
                )}
                {entry?.series && (
                    <label>
                        Zastosuj do
                        <select value={scope} onChange={(e) => setScope(e.target.value)}>
                            <option value="one">Tylko ten termin</option>
                            <option value="future">Ten i następne</option>
                            <option value="all">Cała seria</option>
                        </select>
                    </label>
                )}
                {imported || confirmDelete ? (
                    <p>
                        {entry?.title} · {slot.date} ·{" "}
                        {entry?.allDay ? "Cały dzień" : slot.start + "–" + slot.end}
                    </p>
                ) : (
                    <fieldset disabled={busy}>
                        {!entry && (
                            <div className="field-pair">
                                <label>
                                    Powtarzaj
                                    <select
                                        value={repeat}
                                        onChange={(e) => setRepeat(Number(e.target.value))}
                                    >
                                        <option value="0">Nie powtarzaj</option>
                                        <option value="7">Co tydzień</option>
                                        <option value="14">Co dwa tygodnie</option>
                                    </select>
                                </label>
                                {repeat > 0 && (
                                    <label>
                                        Do dnia
                                        <input
                                            name="until"
                                            type="date"
                                            required
                                            min={date}
                                            defaultValue={
                                                semesterEnd && semesterEnd >= date
                                                    ? semesterEnd
                                                    : addDays(date, 112)
                                            }
                                        />
                                    </label>
                                )}
                            </div>
                        )}
                        <label>
                            Nazwa
                            <input
                                data-initial-focus
                                name="title"
                                maxLength={90}
                                required
                                defaultValue={entry?.title}
                                placeholder="np. Spacer po zajęciach"
                            />
                        </label>
                        <div className="field-pair">
                            <label>
                                Data
                                <input
                                    name="date"
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => {
                                        if (endDate === date) setEndDate(e.target.value);
                                        setDate(e.target.value);
                                    }}
                                />
                            </label>
                            <label>
                                Dla kogo
                                <select name="person" defaultValue={slot.person}>
                                    {Object.entries(names).map(([key, name]) => (
                                        <option key={key} value={key}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        {!allDay && (
                            <>
                                <div className="field-pair">
                                    <label>
                                        Od
                                        <input type="time" name="start" defaultValue={slot.start} required />
                                    </label>
                                    <label>
                                        Do
                                        <input type="time" name="end" defaultValue={slot.end} required />
                                    </label>
                                </div>
                                <label>
                                    Data zakończenia
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={endDate}
                                        min={date}
                                        required
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </label>
                            </>
                        )}
                        <div className="check-options">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={allDay}
                                    onChange={(e) => setAllDay(e.target.checked)}
                                />
                                Cały dzień
                            </label>
                            <label>
                                <input type="checkbox" name="important" defaultChecked={entry?.important} />
                                Ważne ★
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="blocking"
                                    defaultChecked={entry?.blocking ?? true}
                                />
                                Zajmuje czas
                            </label>
                        </div>
                        <label>
                            Kalendarz
                            <select name="calendar" defaultValue={slot.calendar}>
                                {Object.entries(calendars)
                                    .filter(([key]) => key !== "agh")
                                    .map(([key, title]) => (
                                        <option key={key} value={key}>
                                            {title}
                                        </option>
                                    ))}
                            </select>
                        </label>
                        <fieldset className="color-choice">
                            <legend>Kolor wydarzenia</legend>
                            <div className="color-options">
                                {palette.map(([value, title]) => (
                                    <label className="color-swatch" key={title} title={title}>
                                        <input
                                            type="radio"
                                            name="color"
                                            value={value}
                                            defaultChecked={value === (entry?.color ?? "")}
                                            aria-label={title}
                                        />
                                        <span
                                            style={{
                                                background:
                                                    value ||
                                                    "linear-gradient(135deg,#dfc9ff 50%,#ffd4e9 50%)",
                                            }}
                                        />
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                        <label>
                            Miejsce · opcjonalnie
                            <input name="place" maxLength={90} defaultValue={entry?.place} />
                        </label>
                        <label>
                            Notatka · opcjonalnie
                            <textarea name="note" maxLength={500} defaultValue={entry?.note} />
                        </label>
                    </fieldset>
                )}
                {error && <p role="alert">{error}</p>}
                <footer>
                    {entry && !confirmDelete && !imported && (
                        <button
                            type="button"
                            className="danger"
                            disabled={busy}
                            onClick={() => setConfirmDelete(true)}
                        >
                            Usuń
                        </button>
                    )}
                    <button type="button" onClick={close} disabled={busy}>
                        Anuluj
                    </button>
                    <button className="primary" type="submit" disabled={busy}>
                        {busy
                            ? "Zapisywanie…"
                            : imported
                              ? "Pomiń termin"
                              : confirmDelete
                                ? "Potwierdź usunięcie"
                                : "Zapisz wydarzenie"}
                    </button>
                </footer>
            </form>
        </Dialog>
    );
}
