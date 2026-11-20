import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Kalendarz | razem.",
    description: "Wspólny kalendarz Szymka i Oliwusi.",
    robots: { index: false, follow: false },
};

export default function CalendarLayout({ children }: { children: ReactNode }) {
    return children;
}
