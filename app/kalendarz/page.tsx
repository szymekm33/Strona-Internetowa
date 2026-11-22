"use client";

import { useState } from "react";
import { useAuth } from "../components/AuthProvider";
import EventDialog from "./EventDialog";
import { Availability, Universities } from "./CalendarTools";
import { DayView, Icon, MonthView, WeekView } from "./CalendarViews";
import { calendars, displayDate, included, newSlot, shift, today, weekOf } from "./calendar";
import type { Calendar, Command, Entry, Slot, View } from "./calendar";
import "./day.css";
import "./calendar.css";
import "./workspace.css";

type Panel = { type: "event"; slot: Slot; entry?: Entry } | { type: "availability" | "universities" };
export default function CalendarPage() {
    const { session, mutate: mutateSession } = useAuth();
    const [notice, setNotice] = useState("");
    const [view, setView] = useState<View>("day");
    const [date, setDate] = useState(today);
    const [panel, setPanel] = useState<Panel | null>(null);
    const [filters, setFilters] = useState<Calendar[]>([]);
    const [highlight, setHighlight] = useState(true);
    const [planning, setPlanning] = useState<"ur" | "uken" | null>(null);
    async function mutate(command: Command) {
        setNotice("");
        await mutateSession(command);
    }
    const create = (slot: Slot) => setPanel({ type: "event", slot });
    const edit = (e: Entry) =>
        setPanel({
            type: "event",
            slot: { date: e.date, person: e.person, start: e.start, end: e.end, calendar: e.calendar },
            entry: e,
        });
    const openDay = (day: string) => {
        setDate(day);
        setView("day");
    };
    const data = session.calendar!;

    const all = data.events.filter((e) => included(data, e));
    const events = all.filter((e) => !filters.length || filters.includes(e.calendar));
    const days = weekOf(date);
    const period =
        view === "week"
            ? displayDate(days[0], { day: "numeric", month: "short" }) +
              " – " +
              displayDate(days[6], { day: "numeric", month: "short", year: "numeric" })
            : displayDate(date, view === "month" ? { month: "long", year: "numeric" } : undefined);
    function toggle(c: Calendar) {
        setFilters((current) => {
            const next = current.includes(c) ? current.filter((item) => item !== c) : [...current, c];
            return next.length === Object.keys(calendars).length ? [] : next;
        });
    }
    return (
        <main className="calendar-app" lang="pl">
            <header className="pagehead">
                <div>
                    <h1 className="headline">
                        Kalendarz <Icon name="sparkles" />
                    </h1>
                    <p className="description">Nasz wspólny plan tygodnia.</p>
                </div>
                <div className="header-actions">
                    <button className="btn soft" onClick={() => setPanel({ type: "universities" })}>
                        <Icon name="book" small /> Uczelnie
                    </button>
                    <button
                        className="btn pink"
                        onClick={() =>
                            create(
                                planning ? { ...newSlot(date, "2", 8, planning), repeat: 7 } : newSlot(date),
                            )
                        }
                    >
                        <Icon name="plus" small /> Dodaj wydarzenie
                    </button>
                </div>
            </header>
            <div className="calendar-top">
                <div className="view-tabs" aria-label="Widok kalendarza" role="group">
                    {(["month", "week", "day"] as const).map((v) => (
                        <button
                            key={v}
                            className={"view-tab " + (view === v ? "active" : "")}
                            aria-pressed={view === v}
                            onClick={() => setView(v)}
                        >
                            {{ day: "Dzień", week: "Tydzień", month: "Miesiąc" }[v]}
                        </button>
                    ))}
                </div>
                <div className="date-nav">
                    <button
                        className="arrow-btn"
                        aria-label="Poprzedni okres"
                        onClick={() => setDate(shift(date, view, -1))}
                    >
                        <Icon name="chevron-left" small />
                    </button>
                    <span className="date-title" aria-live="polite">
                        {period}
                    </span>
                    <button
                        className="arrow-btn"
                        aria-label="Następny okres"
                        onClick={() => setDate(shift(date, view, 1))}
                    >
                        <Icon name="chevron-right" small />
                    </button>
                    <button className="btn soft small" onClick={() => setDate(today())}>
                        Dzisiaj
                    </button>
                </div>
            </div>
            <div className="legend">
                {["Szymek", "Oliwusia", "Razem", "Ważne"].map((n, i) => (
                    <span className="legend-chip" key={n}>
                        {i === 3 ? (
                            <Icon name="star" small />
                        ) : (
                            <i className={"legend-marker " + ["", "her", "shared"][i]} />
                        )}
                        {n}
                    </span>
                ))}
            </div>
            <div className="calendar-filters">
                <strong className="filter-label">Kalendarze</strong>
                <button
                    className={"filter-chip " + (!filters.length ? "active" : "")}
                    aria-pressed={!filters.length}
                    onClick={() => setFilters([])}
                >
                    Wszystkie
                </button>
                {(Object.keys(calendars) as Calendar[]).map((c) => (
                    <button
                        className={"filter-chip " + (filters.includes(c) ? "active" : "")}
                        key={c}
                        aria-pressed={filters.includes(c)}
                        onClick={() => toggle(c)}
                    >
                        {calendars[c]}
                    </button>
                ))}
                <button
                    className="btn soft small availability-button"
                    onClick={() => setPanel({ type: "availability" })}
                >
                    <Icon name="clock" small /> Wolne razem
                </button>
            </div>
            {planning && (
                <p className="plan-banner">
                    Układasz plan {calendars[planning]} Oliwusi. Wybierz godzinę zajęć.{" "}
                    <button className="btn soft small" onClick={() => setPlanning(null)}>
                        Zakończ układanie
                    </button>
                </p>
            )}
            <div className="calendar-surface">
                {view === "day" && (
                    <DayView {...{ date, events, all, edit, create, planning, highlight, setHighlight }} />
                )}
                {view === "week" && <WeekView {...{ date, events, edit, openDay, create, planning }} />}
                {view === "month" && <MonthView {...{ date, events, edit, openDay }} pick={setDate} />}
            </div>
            <p role="status" className="state-line">
                {notice}
            </p>
            {panel?.type === "event" && (
                <EventDialog
                    slot={panel.slot}
                    entry={panel.entry}
                    semesterEnd={data.semesterEnd}
                    mutate={mutate}
                    close={() => setPanel(null)}
                    saved={(day, calendar) => {
                        setDate(day);
                        setNotice("Zaktualizowano kalendarz.");
                        setPanel(null);
                        if (calendar)
                            setFilters((current) =>
                                current.length && !current.includes(calendar)
                                    ? [...current, calendar]
                                    : current,
                            );
                    }}
                />
            )}
            {panel?.type === "availability" && (
                <Availability events={all} date={date} create={create} close={() => setPanel(null)} />
            )}
            {panel?.type === "universities" && (
                <Universities
                    data={data}
                    mutate={mutate}
                    close={() => setPanel(null)}
                    plan={(c) => {
                        setPlanning(c);
                        setFilters([c]);
                        setView("week");
                        setPanel(null);
                    }}
                />
            )}
        </main>
    );
}
