"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const MOBILE_MENU_QUERY = "(max-width: 760px)";

function subscribeToMobileLayout(onChange: () => void) {
    const media = window.matchMedia(MOBILE_MENU_QUERY);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
}

function getMobileLayout() {
    return window.matchMedia(MOBILE_MENU_QUERY).matches;
}

export default function Sidebar() {
    const pathname = usePathname();
    const navRef = useRef<HTMLElement>(null);
    const panelRef = useRef<HTMLElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const headerRef = useRef<HTMLElement>(null);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const isMobile = useSyncExternalStore(subscribeToMobileLayout, getMobileLayout, () => false);
    const isMobileMenuOpen = isMobile && isMenuOpen;
    const labelClassName = "nav-label group-has-[:focus-visible]:opacity-100 group-has-[:focus-visible]:translate-x-0 group-has-[:focus-visible]:delay-[90ms] text-[13px] font-[750] whitespace-nowrap -translate-x-[5px] opacity-0 transition-[opacity,translate] duration-200 ease-[ease] group-hover:translate-x-0 group-hover:opacity-100 group-hover:delay-[90ms] motion-reduce:transition-none group-aria-[current=page]/item:text-[#FFF1FF]";

    function closeMobileMenu() {
        setMenuOpen(false);
    }

    useEffect(() => {
        const media = window.matchMedia(MOBILE_MENU_QUERY);

        function handleLayoutChange() {
            setMenuOpen(false);
            if (!media.matches && headerRef.current?.contains(document.activeElement)) {
                navRef.current?.querySelector<HTMLAnchorElement>("a[aria-current='page']")?.focus();
            }
        }

        function handleHistoryChange() {
            setMenuOpen(false);
        }

        media.addEventListener("change", handleLayoutChange);
        window.addEventListener("popstate", handleHistoryChange);
        return () => {
            media.removeEventListener("change", handleLayoutChange);
            window.removeEventListener("popstate", handleHistoryChange);
        };
    }, []);

    useEffect(() => {
        if (!isMobileMenuOpen) return;

        const panel = panelRef.current;
        const header = headerRef.current;
        const trigger = triggerRef.current;
        const nav = navRef.current;
        const content = document.querySelector<HTMLElement>(".page-content");
        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;
        const previousContentInert = content?.inert;
        const previousHeaderInert = header?.inert;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        if (content) content.inert = true;
        if (header) header.inert = true;
        nav?.querySelector<HTMLAnchorElement>("a[href]")?.focus({ preventScroll: true });

        function keepFocusInPanel(event: FocusEvent) {
            if (event.target instanceof Node && !panel?.contains(event.target)) {
                nav?.querySelector<HTMLAnchorElement>("a[href]")?.focus({ preventScroll: true });
            }
        }

        document.addEventListener("focusin", keepFocusInPanel);
        return () => {
            document.removeEventListener("focusin", keepFocusInPanel);
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
            if (content) content.inert = previousContentInert ?? false;
            if (header) header.inert = previousHeaderInert ?? false;

            if (window.matchMedia(MOBILE_MENU_QUERY).matches) {
                trigger?.focus({ preventScroll: true });
            } else if (panel?.contains(document.activeElement)) {
                nav?.querySelector<HTMLAnchorElement>("a[aria-current='page']")?.focus({ preventScroll: true });
            }
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        function handleMenuKeyDown(event: KeyboardEvent) {
            if (event.defaultPrevented || event.isComposing) return;

            if (event.key === "Escape" && isMobile && isMenuOpen) {
                event.preventDefault();
                setMenuOpen(false);
                return;
            }

            if (event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey
                && isMobile && isMenuOpen) {
                const items = panelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
                const first = items?.[0];
                const last = items?.[items.length - 1];
                const outsidePanel = !panelRef.current?.contains(document.activeElement);

                if (event.shiftKey && (document.activeElement === first || outsidePanel)) {
                    event.preventDefault();
                    last?.focus();
                } else if (!event.shiftKey && (document.activeElement === last || outsidePanel)) {
                    event.preventDefault();
                    first?.focus();
                }
                return;
            }

            const target = event.target;
            const isEditing = target instanceof HTMLElement
                && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
            const menuShortcut = !isEditing && event.altKey && !event.ctrlKey && !event.metaKey
                && !event.shiftKey && event.code === "KeyM";
            const tabFromPage = event.key === "Tab" && !event.shiftKey
                && !event.altKey && !event.ctrlKey && !event.metaKey
                && document.activeElement === document.body;

            if (!menuShortcut && !tabFromPage) return;

            if (isMobile) {
                event.preventDefault();
                if (menuShortcut) {
                    setMenuOpen(true);
                    if (isMenuOpen) navRef.current?.querySelector<HTMLAnchorElement>("a[href]")?.focus();
                } else {
                    triggerRef.current?.focus();
                }
                return;
            }

            const firstLink = navRef.current?.querySelector<HTMLAnchorElement>("a[href]");
            if (!firstLink) return;

            event.preventDefault();
            firstLink.focus();
        }

        document.addEventListener("keydown", handleMenuKeyDown);
        return () => document.removeEventListener("keydown", handleMenuKeyDown);
    }, [isMobile, isMenuOpen]);

    function getTileClassName(href: string) {
        const base = "w-[51px] h-[51px] shrink-0 flex items-center justify-center rounded-[15px] group-hover/item:scale-105 transition duration-200 ease-[ease] motion-reduce:transition-none";
        const colors = pathname === href
            ? "bg-[#DEC4FF] text-[#6425A6] shadow-[inset_0_0_0_1px_#CEACFF,0_5px_13px_#55249347]"
            : "bg-[#A977F2] group-hover/item:bg-[#BE96FF] group-hover/item:shadow-[0_8px_18px_#4c19874a]";

        return `${base} ${colors}`;
    }

    return (
        <>
            <header ref={headerRef} className="mobile-menu-header h-[76px] shrink-0 items-center px-4">
                <button
                    ref={triggerRef}
                    type="button"
                    aria-label="Otwórz menu"
                    onClick={() => setMenuOpen(true)}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="sidebar-menu"
                    className="grid place-items-center w-[43px] h-[43px] rounded-[14px] border border-[#DAC0F3] bg-[#F9EFFF] text-[#7545B2] focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-[#FD75B9] focus-visible:outline-offset-[3px]"
                >
                    <svg
                        viewBox="0 0 24 24"
                        className="w-[21px] h-[21px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.85}
                        strokeLinecap="round"
                        aria-hidden="true"
                    >
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </header>

            {isMobileMenuOpen && (
                <button
                    type="button"
                    className="mobile-menu-backdrop"
                    aria-label="Zamknij menu"
                    tabIndex={-1}
                    onClick={closeMobileMenu}
                />
            )}

            <aside ref={panelRef} id="sidebar-menu" data-open={isMobileMenuOpen} inert={isMobile && !isMenuOpen} aria-hidden={isMobile && !isMenuOpen ? true : undefined} role={isMobileMenuOpen ? "dialog" : undefined} aria-modal={isMobileMenuOpen ? true : undefined} aria-label="Menu główne" className="sidebar has-[:focus-visible]:w-[252px] has-[:focus-visible]:shadow-[10px_0_50px_rgba(72,28,133,0.27)] hover:shadow-[10px_0_50px_rgba(72,28,133,0.27)] shadow-[6px_0_28px_rgba(72,28,133,0.16)] rounded-r-[24px] group flex flex-col overflow-hidden fixed hover:w-[252px] transition-[width,box-shadow] duration-300 z-50 left-0 inset-y-0 w-[76px] bg-[#8B50E6] text-white px-3 pt-[18px] pb-[15px] motion-reduce:transition-none">
                <div className="mb-[17px] flex h-[62px] w-[224px] shrink-0 items-center gap-3 px-[2px] whitespace-nowrap">
                    <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[15px] bg-[#D9B9FF] text-[#7133C7] shadow-[inset_0_0_0_1px_#ffffff60]">
                        <svg
                            viewBox="0 0 24 24"
                            className="h-[33px] w-[33px]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.85}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M20.8 4.6a5.6 5.6 0 0 0-7.9 0l-.9.9-.9-.9a5.6 5.6 0 0 0-7.9 7.9l.9.9L12 21l7.9-7.6.9-.9a5.6 5.6 0 0 0 0-7.9Z" />
                        </svg>
                    </span>
                    <div className="brand-name -translate-x-2 text-[25px] leading-[1.55] font-[850] tracking-[-1.5px] opacity-0 transition-[opacity,translate] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-hover:delay-100 group-has-[:focus-visible]:translate-x-0 group-has-[:focus-visible]:opacity-100 group-has-[:focus-visible]:delay-100 motion-reduce:transition-none">
                        Razem.
                        <small className="-mt-1 block text-[10px] font-semibold tracking-[0.5px] text-[#F1DFFF]">NASZ WSPÓLNY KĄCIK;)</small>
                    </div>
                </div>
                <nav ref={navRef} aria-label={"Menu główne"} aria-keyshortcuts="Alt+M" className="flex min-h-0 flex-1 flex-col gap-[9px] overflow-x-hidden overflow-y-auto pt-px pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>a:focus-visible]:outline-solid [&>a:focus-visible]:outline-[3px] [&>a:focus-visible]:outline-[#FD75B9] [&>a:focus-visible]:outline-offset-[-3px]">

                    <Link href="/" onNavigate={closeMobileMenu} aria-label="Start" aria-current={pathname === "/" ? "page" : undefined} className="group/item shrink-0 w-[228px] h-[51px] flex items-center gap-[14px]">

                        <span className={getTileClassName("/")}>
                            <svg
                                viewBox="0 0 24 24"
                                className="h-[26px] w-[26px]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.85}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                            <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
                            </svg>

                        </span>
                        <span className={labelClassName}>Start</span>
                    </Link>

                    <Link href="/kalendarz" onNavigate={closeMobileMenu} aria-label="Kalendarz" aria-current={pathname === "/kalendarz" ? "page" : undefined} className="group/item shrink-0 w-[228px] h-[51px] flex items-center gap-[14px]">

                        <span className={getTileClassName("/kalendarz")}>
                            <svg
                                viewBox="0 0 24 24"
                                className="h-[26px] w-[26px]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.85}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >



                                <rect x="3" y="5" width="18" height="16" rx="2" />
                                <path d="M7 3v4M17 3v4M3 10h18M8 14h3v3H8z" />
                            </svg>
                        </span>

                        <span className={labelClassName}>Kalendarz</span>
                    </Link>

                    <Link href="/wspomnienia" onNavigate={closeMobileMenu} aria-label="Wspomnienia" aria-current={pathname === "/wspomnienia" ? "page" : undefined} className="group/item shrink-0 w-[228px] h-[51px] flex items-center gap-[14px]">
                        <span className={getTileClassName("/wspomnienia")}>

                            <svg
                                viewBox="0 0 24 24"
                                className="h-[26px] w-[26px]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.85}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect x="3" y="3" width="18" height="18" rx="3" />
                                <circle cx="8" cy="8" r="1.5" />
                                <path d="m21 15-5-5L5 21" />
                            </svg>
                        </span>
                        <span className={labelClassName}>Wspomnienia</span>

                    </Link>

                    <Link href="/cele" onNavigate={closeMobileMenu} aria-label="Cele i marzenia" aria-current={pathname === "/cele" ? "page" : undefined} className="group/item shrink-0 w-[228px] h-[51px] flex items-center gap-[14px]">
                        <span className={getTileClassName("/cele")}>
                            <svg
                                viewBox="0 0 24 24"
                                className="h-[26px] w-[26px]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.85}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <circle cx="12" cy="12" r="9" />
                                <circle cx="12" cy="12" r="5" />
                                <circle cx="12" cy="12" r="1" />
                            </svg>
                        </span>
                        <span className={labelClassName}>Cele i marzenia</span>
                    </Link>

                    <Link href="/wyjazdy" onNavigate={closeMobileMenu} aria-label="Wyjazdy" aria-current={pathname === "/wyjazdy" ? "page" : undefined} className="group/item shrink-0 w-[228px] h-[51px] flex items-center gap-[14px]">
                        <span className={getTileClassName("/wyjazdy")}>
                            <svg
                                viewBox="0 0 24 24"
                                className="h-[26px] w-[26px]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.85}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M21 3 3 10l7 3 3 7zM10 13l11-10" />
                            </svg>
                        </span>
                        <span className={labelClassName}>Wyjazdy</span>
                    </Link>

                    <Link href="/poczta" onNavigate={closeMobileMenu} aria-label="Nasza poczta" aria-current={pathname === "/poczta" ? "page" : undefined} className="group/item shrink-0 w-[228px] h-[51px] flex items-center gap-[14px]">
                        <span className={getTileClassName("/poczta")}>
                            <svg
                                viewBox="0 0 24 24"
                                className="h-[26px] w-[26px]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.85}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <path d="m3 7 9 7 9-7" />
                            </svg>
                        </span>
                        <span className={labelClassName}>Nasza poczta</span>
                    </Link>

                    <Link href="/powiadomienia" onNavigate={closeMobileMenu} aria-label="Powiadomienia" aria-current={pathname === "/powiadomienia" ? "page" : undefined} className="group/item shrink-0 w-[228px] h-[51px] flex items-center gap-[14px]">
                        <span className={getTileClassName("/powiadomienia")}>
                            <svg
                                viewBox="0 0 24 24"
                                className="h-[26px] w-[26px]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.85}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
                            </svg>
                        </span>
                        <span className={labelClassName}>Powiadomienia</span>
                    </Link>

                    <Link href="/ustawienia" onNavigate={closeMobileMenu} aria-label="Ustawienia" aria-current={pathname === "/ustawienia" ? "page" : undefined} className="group/item shrink-0 w-[228px] h-[51px] flex items-center gap-[14px]">
                        <span className={getTileClassName("/ustawienia")}>
                            <svg
                                viewBox="0 0 24 24"
                                className="h-[26px] w-[26px]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.85}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19 12a7 7 0 0 0-.1-1l2-1.6-2-3.5-2.4.9a7 7 0 0 0-1.8-1L14.3 3h-4.6L9.3 5.8a7 7 0 0 0-1.8 1L5.1 5.9l-2 3.5L5 11a7 7 0 0 0 0 2l-1.9 1.6 2 3.5 2.4-.9a7 7 0 0 0 1.8 1l.4 2.8h4.6l.4-2.8a7 7 0 0 0 1.8-1l2.4.9 2-3.5-2-1.6a7 7 0 0 0 .1-1z" />
                            </svg>
                        </span>
                        <span className={labelClassName}>Ustawienia</span>
                    </Link>













                    <button type="button" className="mobile-menu-close group/item shrink-0 w-[228px] h-[51px] items-center gap-[14px] focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-[#FD75B9] focus-visible:outline-offset-[-3px]" onClick={closeMobileMenu}>
                        <span className="w-[51px] h-[51px] shrink-0 flex items-center justify-center rounded-[15px] bg-[#A977F2] group-hover/item:bg-[#BE96FF]">
                            <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="none" stroke="currentColor" strokeWidth={1.85} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </span>
                        <span className="text-[13px] font-[750] whitespace-nowrap">Zamknij menu</span>
                    </button>
                </nav>
                <div className="flex items-center gap-3 w-[225px] shrink-0 mt-[14px] border-t border-[#DBBBFF66] pt-[15px] px-[3px]">
                    <div className="flex items-center min-w-[49px] shrink-0">

                        <span className="grid place-items-center w-[31px] h-[31px] rounded-full border-2 border-[#8B50E6] bg-[#DCC4FF] text-[#6834AC] text-[11px] font-[800]">
                        0
                        </span>
                        <span className="-ml-[12px] grid place-items-center w-[31px] h-[31px] rounded-full border-2 border-[#8B50E6] bg-[#FFC1E2] text-[#A43F7C] text-[11px] font-[800]">
                            S
                        </span>
                    </div>


                <div className="side-signature text-[12px] font-[750] text-[#F8EEFF] opacity-0 -translate-x-[6px] transition-[opacity,translate] duration-200 ease-[ease] group-hover:opacity-100 group-hover:translate-x-0 group-has-[:focus-visible]:opacity-100 group-has-[:focus-visible]:translate-x-0 motion-reduce:transition-none">
                    Oliweńcia i Szymek

                </div>

                </div>
                </aside>
            </>
    );
}
