import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Icon } from "./CalendarViews";

export default function Dialog({
    title,
    onClose,
    children,
    busy = false,
}: {
    title: string;
    onClose: () => void;
    children: ReactNode;
    busy?: boolean;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        const node = ref.current!;
        const trigger = document.activeElement;
        node.showModal();
        node.querySelector<HTMLElement>("[data-initial-focus]")?.focus();
        return () => {
            if (node.open) node.close();
            if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
        };
    }, []);
    return (
        <dialog
            ref={ref}
            className="event-dialog"
            aria-labelledby="dialog-title"
            closedby={busy ? "none" : "any"}
            onCancel={(e) => {
                if (busy) e.preventDefault();
            }}
            onClose={(e) => {
                if (!e.currentTarget.open) onClose();
            }}
            onKeyDown={(e) => e.stopPropagation()}
        >
            <header>
                <h2 id="dialog-title">{title}</h2>
                <button
                    type="button"
                    className="dialog-close"
                    disabled={busy}
                    aria-label="Zamknij"
                    onClick={() => ref.current?.close()}
                >
                    <Icon name="x" />
                </button>
            </header>
            {children}
        </dialog>
    );
}
