"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import EventDialog from "./EventDialog";
import { Availability, Universities } from "./CalendarTools";
import { DayView, Icon, MonthView, WeekView } from "./CalendarViews";
import { calendars, displayDate, included, names, newSlot, shift, today, weekOf } from "./calendar";
import type { Calendar, Command, Entry, Session, Slot, View } from "./calendar";
import "./day.css";
import "./calendar.css";
import "./workspace.css";

type Panel = { type: "event"; slot: Slot; entry?: Entry } | { type: "availability" | "universities" };
async function request(session?: Session, command?: Command, signal?: AbortSignal): Promise<Session> {
    const dev =
        process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1"].includes(location.hostname);
    const endpoint =
        (dev ? location.protocol + "//" + location.hostname + ":8088" : "") + "/api/calendar.php";
    let response: Response;
    try {
        response = await fetch(endpoint, {
            method: command ? "POST" : "GET",
            credentials: "include",
            cache: "no-store",
            signal,
            headers: command
                ? { "Content-Type": "application/json", "X-Calendar-CSRF": session?.csrf ?? "" }
                : undefined,
            body: command ? JSON.stringify({ ...command, revision: session?.calendar?.revision }) : undefined,
        });
    } catch (e) {
        if (signal?.aborted) throw e;
        throw Error(
            dev
                ? "Uruchom lokalny serwer poleceniem npm run calendar:local."
                : "Brak połączenia z kalendarzem. Spróbuj ponownie.",
        );
    }
    const result = await response.json().catch(() => ({ error: "Serwer kalendarza jest niedostępny." }));
    if (!response.ok || !("csrf" in result))
        throw Object.assign(Error(result.error ?? "Nie udało się pobrać kalendarza."), {
            status: response.status,
        });
    return result;
}
export default function CalendarPage() {
    const [session, setSession] = useState<Session>();
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [busy, setBusy] = useState(false);
    const [view, setView] = useState<View>("day");
    const [date, setDate] = useState(today);
    const [panel, setPanel] = useState<Panel | null>(null);
    const [filters, setFilters] = useState<Calendar[]>([]);
    const [highlight, setHighlight] = useState(true);
    const [planning, setPlanning] = useState<"ur" | "uken" | null>(null);
    const commandInProgress = useRef(false);
    const accept = useCallback((state: Session) => {
        setSession(state);
        setError("");
        if (!state.user) setPanel(null);
    }, []);
    const load = () =>
        request()
            .then(accept)
            .catch((e) => setError((e as Error).message));
    useEffect(() => {
        const controller = new AbortController();
        request(undefined, undefined, controller.signal)
            .then((state) => {
                if (!controller.signal.aborted) accept(state);
            })
            .catch((e) => {
                if (!controller.signal.aborted) setError(e.message);
            });
        return () => controller.abort();
    }, [accept]);
    async function mutate(command: Command) {
        if (commandInProgress.current) throw Error("Trwa już zapisywanie.");
        commandInProgress.current = true;
        setBusy(true);
        setNotice("");
        try {
            setSession(await request(session, command));
            setError("");
        } catch (e) {
            if ([401, 403, 409].includes((e as { status: number }).status)) await load();
            throw e;
        } finally {
            commandInProgress.current = false;
            setBusy(false);
        }
    }
    async function login(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        try {
            await mutate({ action: "login", login: form.get("login"), password: form.get("password") });
        } catch (err) {
            setError((err as Error).message);
        }
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
    const data = session?.calendar;
    if (!session?.user || !data)
        return (
            <main className="calendar-app" lang="pl">
                <h1 className="headline">Kalendarz</h1>
                {session ? (
                    <form className="calendar-login" onSubmit={login}>
                        <h2>Zaloguj się</h2>
                        <label>
                            Login
                            <input name="login" autoComplete="username" required />
                        </label>
                        <label>
                            Hasło
                            <input name="password" type="password" autoComplete="current-password" required />
                        </label>
                        <button className="btn pink" disabled={busy}>
                            Zaloguj
                        </button>
                    </form>
                ) : (
                    !error && <p>Ładowanie kalendarza…</p>
                )}
                {error && (
                    <p role="alert">
                        {error}{" "}
                        <button className="btn soft small" onClick={() => load()}>
                            Spróbuj ponownie
                        </button>
                    </p>
                )}
            </main>
        );

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
            <div className="calendar-account">
                <span>
                    razem.<span className="crumb"> / Kalendarz</span>
                </span>
                <span>
                    {names[String(session.user) as "1" | "2"]}{" "}
                    <button
                        className="btn soft small"
                        disabled={busy}
                        onClick={async () => {
                            try {
                                await mutate({ action: "logout" });
                                setPanel(null);
                                setPlanning(null);
                                setFilters([]);
                            } catch (e) {
                                setError((e as Error).message);
                            }
                        }}
                    >
                        Wyloguj
                    </button>
                </span>
            </div>
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
            {error && <p role="alert">{error}</p>}
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
