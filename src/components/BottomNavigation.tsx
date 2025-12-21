"use client";

import { useRouter, usePathname } from "next/navigation";

export function BottomNavigation(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-card/95 to-card/90 backdrop-blur-sm bg-white/90 border-t border-border shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/explore")}
          className={`flex flex-col items-center justify-center gap-1 px-6 py-2 transition-all rounded-lg ${isActive("/explore") ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground hover:scale-105"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="text-xs font-medium">Explorar</span>
        </button>

        <button
          onClick={() => router.push("/coming-soon?feature=Top Ñamy")}
          // className="flex flex-col items-center justify-center gap-1 px-6 py-2 transition-all rounded-lg text-muted-foreground hover:text-foreground hover:scale-105"
          className="hidden flex-col items-center justify-center gap-1 px-6 py-2 transition-all rounded-lg text-muted-foreground hover:text-foreground hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
          <span className="text-xs font-medium">Top Ñamy</span>
        </button>

        <button
          onClick={() => router.push("/my-coupons")}
          className={`flex flex-col items-center justify-center gap-1 px-6 py-2 transition-all rounded-lg ${isActive("/my-coupons") ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground hover:scale-105"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v2" />
            <path d="M13 17v2" />
            <path d="M13 11v2" />
          </svg>
          <span className="text-xs font-medium">Cupones</span>
        </button>

        <button
          onClick={() => router.push("/profile")}
          className={`flex flex-col items-center justify-center gap-1 px-6 py-2 transition-all rounded-lg ${isActive("/profile") ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground hover:scale-105"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-xs font-medium">Perfil</span>
        </button>

        <button
          onClick={() => router.push("/coming-soon?feature=Mural")}
          className="hidden flex-col items-center justify-center gap-1 px-6 py-2 transition-all rounded-lg text-muted-foreground hover:text-foreground hover:scale-105"
          // className="flex flex-col items-center justify-center gap-1 px-6 py-2 transition-all rounded-lg text-muted-foreground hover:text-foreground hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <span className="text-xs font-medium">Mural</span>
        </button>

        <button
          onClick={() => router.push("/wallet")}
          className={`flex flex-col items-center justify-center gap-1 px-6 py-2 transition-all rounded-lg relative ${isActive("/wallet") ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground hover:scale-105"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
          </svg>
          <span className="text-xs font-medium">Billetera</span>
        </button>
      </div>
    </nav>
  );
}
