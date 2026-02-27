"use client";

import { useRouter, usePathname } from "next/navigation";

import { useAuthStore } from "@/store/useAuthStore";

const ExploreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const MuralIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9a2 2 0 0 1 2-2h1" />
    <path d="M3 15v1a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <circle cx="12" cy="13" r="2" />
    <path d="M12 11v-1" />
    <line x1="9" y1="7" x2="15" y2="7" />
  </svg>
);

const LeagueIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="12" width="4" height="9" rx="1" />
    <rect x="10" y="7" width="4" height="14" rx="1" />
    <rect x="17" y="3" width="4" height="18" rx="1" />
  </svg>
);

const CouponsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2" />
    <path d="M13 17v2" />
    <path d="M13 11v2" />
  </svg>
);

const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

export function BottomNavigation(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  const navItems: NavItem[] = [
    { label: "Explorar", path: "/explore", icon: <ExploreIcon /> },
    { label: "Mural", path: "/mural", icon: <MuralIcon />, requiresAuth: true },
    {
      label: "Liga",
      path: "/league",
      icon: <LeagueIcon />,
      requiresAuth: true,
    },
    {
      label: "Cupones",
      path: "/my-coupons",
      icon: <CouponsIcon />,
      requiresAuth: true,
    },
    {
      label: "Perfil",
      path: "/profile",
      icon: <ProfileIcon />,
      requiresAuth: true,
    },
  ];

  const visibleItems = navItems.filter(
    (item) => !item.requiresAuth || isAuthenticated
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-5xl mx-auto px-2">
        {visibleItems.map((item) => {
          const active = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="flex items-center justify-center transition-all"
            >
              {active ? (
                <span className="flex items-center gap-1.5 bg-orange-500 text-white rounded-full px-4 py-2 font-bold text-sm">
                  {item.icon}
                  {item.label}
                </span>
              ) : (
                <span className="text-orange-400 p-2">{item.icon}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
