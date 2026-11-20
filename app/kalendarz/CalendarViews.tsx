import type { CSSProperties } from "react";
import {
    addDays,
    clock,
    displayDate,
    forDate,
    freeTimes,
    hourRange,
    names,
    newSlot,
    positions,
    today,
    tones,
    weekOf,
} from "./calendar";
import type { Calendar, Entry, Slot } from "./calendar";

export function Icon({ name, small = false }: { name: string; small?: boolean }) {
    return (
        <svg className={"icon" + (small ? " sm" : "")} viewBox="0 0 24 24" aria-hidden="true">
            <use href={"/calendar-icons.svg#i-" + name} />
        </svg>
    );
}
type ViewProps = { date: string; events: Entry[]; edit: (e: Entry) => void };
function accent(e: Entry): CSSProperties {
    return e.color
        ? { borderLeftColor: e.color, background: "color-mix(in srgb, " + e.color + " 24%, white)" }
        : {};
}
function name(e: Entry) {
    return (e.important ? "★ " : "") + e.title;
}
function Mini({ event, edit }: { event: Entry; edit: ViewProps["edit"] }) {
    return (
        <button
            type="button"
            className={"month-mini " + tones[event.person]}
            style={accent(event)}
            onClick={() => edit(event)}
            title={event.title}
        >
            {name(event)}
        </button>
    );
}
function Blocks({
    date,
    events,
    edit,
    first,
    height,
    week = false,
}: ViewProps & { first: number; height: number; week?: boolean }) {
    return positions(events, date).map(({ event, start, end, left, width }) => (
        <button
            key={event.id}
            type="button"
            className={(week ? "week-event week-timed " : "day-event ") + tones[event.person]}
            style={{
                top: (start / 60 - first) * height,
                height: Math.max(2, ((end - start) / 60) * height - 1),
                left: left + "%",
                width: width + "%",
                ...accent(event),
            }}
            aria-label={event.title + ", " + names[event.person] + ", " + event.start + "–" + event.end}
            title={event.title + " · " + event.start + "–" + event.end}
            onClick={() => edit(event)}
        >
            <small className="event-time">
                {clock(start)}
                <span className={week ? "week-end" : ""}>–{clock(end)}</span>
            </small>
            <strong>{name(event)}</strong>
        </button>
    ));
}
export function DayView({
    date,
    events,
    all,
    edit,
    create,
    planning,
    highlight,
    setHighlight,
}: ViewProps & {
    all: Entry[];
    create: (slot: Slot) => void;
    planning: Calendar | null;
    highlight: boolean;
    setHighlight: (v: boolean) => void;
}) {
    const hours = hourRange(events, [date]);
    const free = freeTimes(all, date, hours[0] * 60, (hours.at(-1)! + 1) * 60, 30);
    const allDay = forDate(events, date).filter((e) => e.allDay);
    return (
        <>
            <div className="day-tools">
                <label>
                    <input
                        type="checkbox"
                        checked={highlight}
                        onChange={(e) => setHighlight(e.target.checked)}
                    />{" "}
                    Pokaż wolne razem
                </label>
                <div className="free-slot-list">
                    {highlight &&
                        [...free]
                            .sort((a, b) => b.end - b.start - (a.end - a.start))
                            .slice(0, 3)
                            .sort((a, b) => a.start - b.start)
                            .map((s) => (
                                <button
                                    className="free-chip"
                                    key={s.start}
                                    onClick={() =>
                                        create({
                                            ...newSlot(date),
                                            start: clock(s.start),
                                            end: clock(Math.min(s.end, 1439)),
                                        })
                                    }
                                >
                                    {clock(s.start)}–{clock(s.end)}
                                </button>
                            ))}
                </div>
            </div>
            <section aria-label="Widok dnia" className="calendar-day">
                <div className="hours">Godz.</div>
                <div className="person szymek">
                    <span className="avatar" aria-hidden="true">
                        S
                    </span>
                    Szymek
                </div>
                <div className="person oliwusia">
                    <span className="avatar" aria-hidden="true">
                        O
                    </span>
                    Oliwusia
                </div>
                {allDay.length > 0 && (
                    <div className="all-day-row">
                        <small>Cały dzień</small>
                        {(["1", "2", "1,2"] as const).map((person) => {
                            const items = allDay.filter((e) => e.person === person);
                            if (person === "1,2" && !items.length) return null;
                            return (
                                <div key={person} className={"all-day-entries " + tones[person]}>
                                    {items.map((e) => <Mini key={e.id} event={e} edit={edit} />)}
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className="day-body">
                    {hours.map((hour) => (
                        <div key={hour} className="hour-row">
                            <time className="hour-label">{clock(hour * 60)}</time>
                            {(["1", "2"] as const).map((person) => (
                                <button
                                    key={person}
                                    className="hour-slot"
                                    disabled={!!planning && person === "1"}
                                    aria-label={
                                        "Dodaj wydarzenie, " + names[person] + ", " + clock(hour * 60)
                                    }
                                    aria-haspopup="dialog"
                                    onClick={() =>
                                        create({
                                            ...newSlot(date, person, hour, planning ?? "plans"),
                                            repeat: planning ? 7 : 0,
                                        })
                                    }
                                >
                                    <Icon name="plus" small />
                                </button>
                            ))}
                        </div>
                    ))}
                    <div className="day-overlay">
                        {highlight &&
                            free.map((s) => (
                                <div
                                    className="free-band"
                                    key={s.start}
                                    style={{
                                        top: (s.start / 60 - hours[0]) * 46,
                                        height: ((s.end - s.start) / 60) * 46,
                                    }}
                                />
                            ))}
                        <Blocks date={date} events={events} edit={edit} first={hours[0]} height={46} />
                    </div>
                </div>
            </section>
            {!forDate(events, date).length && (
                <p className="day-empty-note">Brak wydarzeń w wybranych kalendarzach.</p>
            )}
        </>
    );
}
export function WeekView({
    date,
    events,
    edit,
    openDay,
    create,
    planning,
}: ViewProps & {
    openDay: (s: string) => void;
    create: (s: Slot) => void;
    planning: Calendar | null;
}) {
    const days = weekOf(date);
    const hours = hourRange(events, days);
    return (
        <div className="week-scroll">
            <div className="week-board timed-week">
                <div className="week-axis">
                    <div className="week-axis-head">Godz.</div>
                    {hours.map((h) => (
                        <div key={h}>{clock(h * 60)}</div>
                    ))}
                </div>
                {days.map((d) => (
                    <article className={"week-day" + (d === today() ? " is-today" : "")} key={d}>
                        <button
                            className="week-head"
                            onClick={() => openDay(d)}
                            aria-label={"Otwórz dzień, " + displayDate(d)}
                        >
                            <span className="week-name">{displayDate(d, { weekday: "short" })}</span>
                            <strong className="week-num">{Number(d.slice(8))}</strong>
                        </button>
                        <div className="week-people">
                            <span>
                                <i>S</i>
                                <b>Szymek</b>
                            </span>
                            <span>
                                <i>O</i>
                                <b>Oliwusia</b>
                            </span>
                        </div>
                        <div className="week-all-day">
                            {forDate(events, d)
                                .filter((e) => e.allDay)
                                .map((e) => (
                                    <Mini key={e.id} event={e} edit={edit} />
                                ))}
                        </div>
                        <div className="week-hours" style={{ height: hours.length * 64 }}>
                            <div className="week-slots">
                                {hours.map((h) =>
                                    (["1", "2"] as const).map((person) => (
                                        <button
                                            key={h + person}
                                            disabled={!!planning && person === "1"}
                                            aria-label={
                                                "Dodaj wydarzenie, " +
                                                d +
                                                ", " +
                                                names[person] +
                                                ", " +
                                                clock(h * 60)
                                            }
                                            onClick={() =>
                                                create({
                                                    ...newSlot(d, person, h, planning ?? "plans"),
                                                    repeat: planning ? 7 : 0,
                                                })
                                            }
                                        >
                                            <Icon name="plus" small />
                                        </button>
                                    )),
                                )}
                            </div>
                            <Blocks date={d} events={events} edit={edit} first={hours[0]} height={64} week />
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
export function MonthView({
    date,
    events,
    edit,
    pick,
    openDay,
}: ViewProps & { pick: (s: string) => void; openDay: (s: string) => void }) {
    const first = date.slice(0, 7) + "-01";
    const start = weekOf(first)[0];
    const end = weekOf(addDays(addDays(first, 32).slice(0, 7) + "-01", -1))[6];
    const days: string[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);
    const agenda = forDate(events, date);
    return (
        <>
            <div className="month-weekdays">
                {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"].map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>
            <div className="month-grid">
                {days.map((d) => {
                    const items = forDate(events, d);
                    const important = items.find((e) => e.important);
                    const special = important ?? items.find((e) => e.calendar === "dates");
                    return (
                        <button
                            className={
                                "month-cell" +
                                (d.slice(0, 7) !== date.slice(0, 7) ? " other" : "") +
                                (important ? " priority" : "") +
                                (d === today() ? " today" : "")
                            }
                            key={d}
                            aria-label={displayDate(d) + ", wydarzenia: " + items.length}
                            aria-pressed={d === date}
                            onClick={() => pick(d)}
                        >
                            <span className="month-cell-head">
                                <strong>{Number(d.slice(8))}</strong>
                                {important && <Icon name="star" small />}
                            </span>
                            <span className="month-counts">
                                {(["1", "2", "1,2"] as const).map((person) => {
                                    const n = items.filter((e) => e.person === person).length;
                                    return (
                                        n > 0 && (
                                            <span
                                                key={person}
                                                className={"month-mini " + tones[person]}
                                                title={names[person]}
                                            >
                                                {names[person][0]} {n}
                                            </span>
                                        )
                                    );
                                })}
                            </span>
                            {special && <span className="month-priority-label">{special.title}</span>}
                        </button>
                    );
                })}
            </div>
            <section className="month-agenda">
                <div className="agenda-head">
                    <h2>{displayDate(date)}</h2>
                    <button className="btn soft small" onClick={() => openDay(date)}>
                        Otwórz dzień
                    </button>
                </div>
                {agenda.length ? (
                    <div className="agenda-items">
                        {agenda.map((e) => (
                            <button
                                key={e.id}
                                className={"week-event " + tones[e.person]}
                                style={accent(e)}
                                onClick={() => edit(e)}
                            >
                                <small>
                                    {e.allDay ? "Cały dzień" : e.start + "–" + e.end} · {names[e.person]}
                                </small>
                                <strong>{name(e)}</strong>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p>Brak wydarzeń na wybraną datę.</p>
                )}
            </section>
        </>
    );
}
