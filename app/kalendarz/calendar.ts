export const calendars = { agh: "AGH", ur: "UR", uken: "UKEN", plans: "Plany ręczne", dates: "Ważne daty" };
export type Calendar = keyof typeof calendars;
export const names = { "1": "Szymek", "2": "Oliwusia", "1,2": "Razem" };
export type Person = keyof typeof names;
export const tones = { "1": "you", "2": "her", "1,2": "shared" };
export type View = "day" | "week" | "month";
export type ChoiceKind = "type" | "course" | "term";
export type Entry = {
    id: number;
    author: number;
    title: string;
    date: string;
    endDate: string;
    start: string;
    end: string;
    person: Person;
    calendar: Calendar;
    allDay: boolean;
    blocking: boolean;
    important: boolean;
    color: string;
    place: string;
    note: string;
    series: string | null;
    source: string | null;
    course: string;
    courseType: string;
};
export type Slot = {
    date: string;
    start: string;
    end: string;
    person: Person;
    calendar: Calendar;
    repeat?: number;
};
export type CalendarData = {
    events: Entry[];
    revision: number;
    semesterEnd: string | null;
    choices: Record<ChoiceKind, Record<string, boolean>>;
};
export type Session = { user: number | null; csrf: string; calendar: CalendarData | null };
export type Command = Record<string, unknown> & { action: string };
export type Mutate = (command: Command) => Promise<void>;
export function today() {
    return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Warsaw" }).format(new Date());
}
export function addDays(date: string, n: number) {
    const value = new Date(date + "T12:00:00Z");
    value.setUTCDate(value.getUTCDate() + n);
    return value.toISOString().slice(0, 10);
}
export function weekOf(date: string) {
    const weekday = new Date(date + "T12:00:00Z").getUTCDay();
    const first = addDays(date, -((weekday + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => addDays(first, i));
}
export function shift(date: string, view: View, direction: number) {
    if (view !== "month") return addDays(date, direction * (view === "week" ? 7 : 1));
    const value = new Date(date.slice(0, 7) + "-01T12:00:00Z");
    value.setUTCMonth(value.getUTCMonth() + direction);
    const month = value.toISOString().slice(0, 7);
    value.setUTCMonth(value.getUTCMonth() + 1, 0);
    return month + "-" + String(Math.min(Number(date.slice(8)), value.getUTCDate())).padStart(2, "0");
}
export function displayDate(
    date: string,
    options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long", year: "numeric" },
) {
    return new Intl.DateTimeFormat("pl-PL", { ...options, timeZone: "UTC" }).format(
        new Date(date + "T12:00:00Z"),
    );
}
export function minutes(time: string) {
    return Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
}
export function clock(minute: number) {
    return [Math.floor(minute / 60), minute % 60].map((n) => String(n).padStart(2, "0")).join(":");
}
export function forDate(events: Entry[], date: string) {
    return events.filter(
        (e) => e.date <= date && (e.endDate > date || (e.endDate === date && e.end > "00:00")),
    );
}
export function dayTimes(e: Entry, date: string) {
    return { start: e.date < date ? 0 : minutes(e.start), end: e.endDate > date ? 1440 : minutes(e.end) };
}
export function included(data: CalendarData, event: Entry) {
    if (!event.source) return true;
    return (
        data.choices.term[event.source] ??
        data.choices.course[event.course] ??
        data.choices.type[event.courseType] ??
        true
    );
}
export function freeTimes(events: Entry[], date: string, from: number, to: number, minimum: number) {
    const busy = forDate(events, date)
        .filter((e) => e.blocking)
        .map((e) => (e.allDay ? { start: from, end: to } : dayTimes(e, date)))
        .sort((a, b) => a.start - b.start);
    const free: { start: number; end: number }[] = [];
    let next = from;
    for (const slot of busy) {
        if (slot.start >= to) break;
        if (slot.start - next >= minimum) free.push({ start: next, end: slot.start });
        next = Math.max(next, slot.end);
    }
    if (to - next >= minimum) free.push({ start: next, end: to });
    return free;
}
export function hourRange(events: Entry[], dates: string[]) {
    const times = dates.flatMap((date) =>
        forDate(events, date)
            .filter((e) => !e.allDay)
            .map((e) => dayTimes(e, date)),
    );
    const first = Math.floor(times.reduce((a, t) => Math.min(a, t.start), 480) / 60);
    const end = Math.ceil(times.reduce((a, t) => Math.max(a, t.end), 1200) / 60);
    return Array.from({ length: end - first }, (_, i) => first + i);
}
export function positions(events: Entry[], date: string) {
    const timed = forDate(events, date)
        .filter((e) => !e.allDay)
        .map((event) => ({ event, ...dayTimes(event, date) }))
        .sort((a, b) => a.start - b.start || b.end - a.end);
    const groups: (typeof timed)[] = [];
    let end = -1;
    for (const item of timed) {
        if (item.start >= end) {
            groups.push([]);
            end = -1;
        }
        groups[groups.length - 1].push(item);
        end = Math.max(end, item.end);
    }
    return groups.flatMap((group) => {
        const shared = group.some((s) => s.event.person === "1,2");
        const separate = group.some((s) => s.event.person !== "1,2");
        const side = shared ? (separate ? 34 : 0) : 50;
        return (Object.keys(names) as Person[]).flatMap((person) => {
            const laneEnds: number[] = [];
            const items = group
                .filter((s) => s.event.person === person)
                .map((slot) => {
                    let lane = laneEnds.findIndex((t) => t <= slot.start);
                    if (lane === -1) lane = laneEnds.length;
                    laneEnds[lane] = slot.end;
                    return { ...slot, lane };
                });
            const left = person === "1" ? 0 : person === "2" ? 100 - side : side;
            const width = (person === "1,2" ? 100 - 2 * side : side) / (laneEnds.length || 1);
            return items.map((s) => ({ ...s, left: left + s.lane * width, width }));
        });
    });
}
export function newSlot(date: string, person: Person = "1,2", hour = 18, calendar: Calendar = "plans"): Slot {
    return { date, person, calendar, start: clock(hour * 60), end: clock(Math.min(1439, (hour + 1) * 60)) };
}
