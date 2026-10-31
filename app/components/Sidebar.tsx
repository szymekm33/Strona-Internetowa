export default function Sidebar() {
    return (
        <aside className="overflow-hidden fixed hover:w-[252px] transition-[width] duration-300 z-50 left-0 inset-y-0 w-[76px] bg-[#8B50E6] text-white p-3 ">
            <nav aria-label={"Menu główne"} className="flex flex-col gap-[9px]">

                <button type="button" aria-label="Start" className="w-[228px] h-[51px] flex items-center gap-[14px]">

                    <span  aria-label="Start" className="w-[51px] h-[51px] shrink-0 flex items-center justify-center rounded-[15px] bg-[#DEC4FF] text-[#3D185C]">
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
                    <span className="whitespace-nowrap">Start</span>
                </button>

                <button type="button" className=" w-[51px] flex items-center justify-center h-[51px] rounded-[15px] bg-[#A977F2] ">
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

                </button>

                <button type="button" aria-label="Wspomnienia" className=" w-[51px] flex items-center justify-center h-[51px] rounded-[15px] bg-[#A977F2] ">
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


                </button>


            </nav>


            </aside>

    );
}