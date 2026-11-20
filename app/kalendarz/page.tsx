import "./day.css";

const firstHour = 8;
const endHour = 20;
const hours = Array.from({ length: endHour - firstHour }, (_, index) => firstHour + index);

export default function CalendarPage() {
    return (
        <main className="p-8">
            <h1 className="text-3xl font-semibold">Kalendarz</h1>
            <section aria-label="Widok dnia" className="calendar-day">
                <div className="hours">Godz.</div>
                <div className="person szymek">
                    <span aria-hidden="true" className="avatar">S</span>
                    Szymek
                </div>
                <div className="person oliwusia">
                    <span aria-hidden="true" className="avatar">O</span>
                    Oliwusia
                </div>
                {hours.map((hour) => {
                    const label = `${String(hour).padStart(2, "0")}:00`;
                    return (
                        <div className="hour-row" key={hour}>
                            <time className="hour-label" dateTime={label}>{label}</time>
                            <div className="hour-slot" />
                            <div className="hour-slot" />
                        </div>
                    );
                })}
            </section>
        </main>
    );
}
