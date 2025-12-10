"use client";

import {
  User,
  Ticket,
  Settings,
  LogOut,
  ChevronDown,
  Crown,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import { useAuthStore } from "@/store/useAuthStore";

interface ExploreHeaderProps {
  isAuthenticated: boolean;
}

export function ExploreHeader({
  isAuthenticated,
}: ExploreHeaderProps): React.JSX.Element {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return (): void =>
        document.removeEventListener("mousedown", handleClickOutside);
    }

    return undefined;
  }, [isDropdownOpen]);

  const handleLogout = (): void => {
    clearAuth();
    setIsDropdownOpen(false);
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-sm shadow-sm z-20">
      <div className="flex items-center justify-between h-14 max-w-5xl mx-auto px-4">
        <div className="flex-1">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md hover:bg-white transition-colors shadow-sm">
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
              className="w-4 h-4 text-foreground"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            <span className="text-sm font-medium text-foreground">
              Cómo funciona
            </span>
          </button>
        </div>

        <button
          onClick={() => router.push("/explore")}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Image
            src="/namy-logo.webp"
            alt="Ñamy Logo"
            width={40}
            height={40}
            className="h-10 w-auto rounded-lg"
          />
        </button>

        <div className="flex-1 flex justify-end gap-3">
          <button
            className="p-2 hover:bg-accent rounded-full transition-colors"
            aria-label="Notificaciones"
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
              className="w-5 h-5 text-muted-foreground"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>

          {/* User Dropdown */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-accent rounded-full transition-colors"
                aria-label="User menu"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center relative">
                  <User className="w-4 h-4 text-primary" />
                  {user?.isPremium ? (
                    <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Crown className="w-2 h-2 text-white" />
                    </div>
                  ) : null}
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:block">
                  {user?.displayName || "User"}
                </span>
                {user?.isPremium ? (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-full">
                    <Crown className="w-3 h-3" />
                    Premium
                  </span>
                ) : null}
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen ? (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-card border border-border overflow-hidden animate-slide-up">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {user?.displayName || "User"}
                      </p>
                      {user?.isPremium ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold rounded-full">
                          <Crown className="w-2.5 h-2.5" />
                          PREMIUM
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                    {user?.isPremium && user?.premiumEndDate ? (
                      <p className="text-[10px] text-yellow-600 mt-1">
                        Premium until{" "}
                        {new Date(user.premiumEndDate).toLocaleDateString()}
                      </p>
                    ) : null}
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        router.push("/my-coupons");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                    >
                      <Ticket className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        My Coupons
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        router.push("/subscription");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-colors text-left group"
                    >
                      <Crown className="w-4 h-4 text-yellow-500 group-hover:text-orange-500 transition-colors" />
                      <span className="text-sm font-medium text-foreground">
                        Premium Membership
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        router.push("/profile");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Settings
                      </span>
                    </button>

                    <div className="h-px bg-border my-2" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-destructive/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">
                        Logout
                      </span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <button
              onClick={() => router.push("/auth")}
              className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
