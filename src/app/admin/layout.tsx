"use client";

import {
  Store,
  Users,
  Video,
  LayoutDashboard,
  ArrowLeft,
  FolderTree,
  Trophy,
  Images,
  Star,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { UserRole } from "@/domains/admin/types";
import { contentfulImageLoader } from "@/lib/image-utils";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Wait for client-side hydration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle redirects after hydration
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!user) {
      router.replace("/auth");
      return;
    }

    const isAdmin =
      user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

    if (!isAdmin) {
      router.replace("/");
    }
  }, [user, isHydrated, router]);

  // Show loading while hydrating or checking auth
  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Check if user is admin
  const isAdmin =
    user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="bg-card rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-6">
            You don&apos;t have permission to access the admin dashboard.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      label: "Stores",
      icon: Store,
      href: "/admin/stores",
      active: pathname?.startsWith("/admin/stores"),
    },
    {
      label: "Categories",
      icon: FolderTree,
      href: "/admin/categories",
      active: pathname?.startsWith("/admin/categories"),
    },
    {
      label: "Users",
      icon: Users,
      href: "/admin/users",
      active: pathname?.startsWith("/admin/users"),
    },
    {
      label: "Challenges",
      icon: Trophy,
      href: "/admin/challenges",
      active: pathname?.startsWith("/admin/challenges"),
    },
    {
      label: "Mural",
      icon: Images,
      href: "/admin/mural",
      active: pathname?.startsWith("/admin/mural"),
    },
    {
      label: "Reviews",
      icon: Star,
      href: "/admin/reviews",
      active: pathname?.startsWith("/admin/reviews"),
    },
  ];

  // Add Video Ads for super admins
  if (isSuperAdmin) {
    navItems.push({
      label: "Video Ads",
      icon: Video,
      href: "/admin/video-ads",
      active: pathname?.startsWith("/admin/video-ads"),
    });
  }

  const handleBackToDashboard = () => {
    router.push("/explore");
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Top Navigation Bar */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <button
              onClick={() => router.push("/explore")}
              className="shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Go to Explore"
            >
              <Image
                loader={contentfulImageLoader}
                src="/namy-logo.webp"
                alt="Ñamy Logo"
                width={40}
                height={40}
                className="rounded-xl shadow-lg"
                priority
              />
            </button>

            {/* Center: Navigation Links — hidden on small screens */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Right: User Info, Back Button & Hamburger */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">
                  {user.displayName || user.email}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.role.replace("_", " ")}
                </p>
              </div>
              <button
                onClick={handleBackToDashboard}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              {/* Hamburger — visible only below lg */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>

      {/* Drawer overlay */}
      {drawerOpen ? <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setDrawerOpen(false)}
        /> : null}

      {/* Slide-in drawer from right */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 bg-card shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {user.displayName || user.email}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user.role.replace("_", " ")}
            </p>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                router.push(item.href);
                setDrawerOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                item.active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={() => {
              handleBackToDashboard();
              setDrawerOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="font-medium">Back to App</span>
          </button>
        </div>
      </div>
    </div>
  );
}
