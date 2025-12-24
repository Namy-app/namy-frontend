"use client";

import {
  Store,
  Users,
  BarChart3,
  Ticket,
  Settings,
  ShoppingBag,
  ArrowRight,
  Activity,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { useStoreStatistics, useUsers } from "@/domains/admin/hooks";
import { UserRole } from "@/domains/admin/types";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for client-side hydration
  useEffect(() => {
    // Mark as hydrated after Zustand rehydrates from localStorage
    // Use a small delay to ensure Zustand has fully rehydrated
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch real data
  const { data: storeStats, isLoading: storeStatsLoading } =
    useStoreStatistics();
  const { data: usersData, isLoading: usersLoading } = useUsers(1, 1000);

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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Calculate active users (users who are active)
  const activeUsersCount = usersData?.data.filter((u) => u.active).length ?? 0;

  const adminSections = [
    {
      title: "Stores Management",
      description: "Manage stores, discounts, and catalogs",
      icon: Store,
      color: "from-blue-500 to-blue-600",
      href: "/admin/stores",
      stats: [
        {
          label: "Total Stores",
          value: storeStatsLoading ? (
            <span className="h-4 w-4 block rounded-full border border-gray-600 animate-spin" />
          ) : (
            String(storeStats?.total ?? 0)
          ),
        },
        {
          label: "Active",
          value: storeStatsLoading ? (
            <span className="h-4 w-4 block rounded-full border border-gray-600 animate-spin" />
          ) : (
            String(storeStats?.active ?? 0)
          ),
        },
      ],
    },
    {
      title: "Users Management",
      description: "View and manage user accounts",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      href: "/admin/users",
      stats: [
        {
          label: "Total Users",
          value: usersLoading ? (
            <span className="h-4 w-4 block rounded-full border border-gray-600 animate-spin" />
          ) : (
            String(usersData?.paginationInfo.total ?? 0)
          ),
        },
        {
          label: "Active",
          value: usersLoading ? (
            <span className="h-4 w-4 block rounded-full border border-gray-600 animate-spin" />
          ) : (
            String(activeUsersCount)
          ),
        },
      ],
    },
    {
      title: "Coupons & Discounts",
      description: "Monitor coupon usage and redemptions",
      icon: Ticket,
      color: "from-green-500 to-green-600",
      href: "/admin/coupons",
      stats: [
        { label: "Generated", value: "-" },
        { label: "Redeemed", value: "-" },
      ],
      comingSoon: true,
    },
    {
      title: "Analytics",
      description: "View platform statistics and insights",
      icon: BarChart3,
      color: "from-orange-500 to-orange-600",
      href: "/admin/analytics",
      stats: [
        { label: "Revenue", value: "-" },
        { label: "Growth", value: "-" },
      ],
      comingSoon: true,
    },
  ];

  const quickStats = [
    {
      label: "Total Stores",
      value: storeStatsLoading ? "..." : String(storeStats?.total ?? 0),
      change: storeStats?.active ? `${storeStats.active} active` : "0 active",
      icon: Store,
      color: "text-blue-600",
    },
    {
      label: "Active Users",
      value: usersLoading ? "..." : String(activeUsersCount),
      change: usersData?.paginationInfo.total
        ? `of ${usersData.paginationInfo.total} total`
        : "0 total",
      icon: Activity,
      color: "text-green-600",
    },
    {
      label: "Total Users",
      value: usersLoading
        ? "..."
        : String(usersData?.paginationInfo.total ?? 0),
      change: activeUsersCount
        ? `${Math.round((activeUsersCount / (usersData?.paginationInfo.total ?? 1)) * 100)}% active`
        : "0%",
      icon: Users,
      color: "text-purple-600",
    },
    {
      label: "Store Types",
      value: storeStatsLoading
        ? "..."
        : `${storeStats?.byType.product ?? 0}P / ${storeStats?.byType.service ?? 0}S`,
      change: "Products/Services",
      icon: ShoppingBag,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Panel de administración
              </h1>
              <p className="text-muted-foreground">
                Bienvenido de nuevo, {user.displayName || user.email}
              </p>
            </div>

            {/* Namy Logo - Center */}
            <button
              onClick={() => router.push("/explore")}
              className="shrink-0 mx-8 cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Go to Explore"
            >
              <Image
                src="/namy-logo.webp"
                alt="Ñamy Logo"
                width={60}
                height={60}
                className="rounded-xl shadow-lg"
                priority
              />
            </button>

            <div className="flex-1 flex items-center justify-end gap-4">
              <div className="px-4 py-2 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-semibold text-foreground capitalize">
                  {user.role.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 bg-muted rounded-lg ${stat.color} bg-opacity-10`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-sm font-medium text-secondary-foreground">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Admin Sections */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Management Sections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminSections.map((section, index) => (
              <div
                key={index}
                onClick={() => !section.comingSoon && router.push(section.href)}
                className={`bg-card rounded-lg shadow overflow-hidden ${
                  section.comingSoon
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:shadow-xl cursor-pointer"
                } transition-all group`}
              >
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${section.color}`} />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-4 bg-gradient-to-br ${section.color} rounded-lg text-white shadow-lg`}
                      >
                        <section.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
                          {section.title}
                          {section.comingSoon ? (
                            <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                              Coming Soon
                            </span>
                          ) : null}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    {!section.comingSoon && (
                      <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                    {section.stats.map((stat, statIndex) => (
                      <div key={statIndex}>
                        <p className="text-sm text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push("/admin/stores")}
              className="p-4 bg-card rounded-lg shadow hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Store className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    View All Stores
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Manage store listings
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push("/admin/users")}
              className="p-4 bg-card rounded-lg shadow hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-purple-600 transition-colors">
                    View All Users
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Manage user accounts
                  </p>
                </div>
              </div>
            </button>

            <button
              disabled
              className="p-4 bg-card rounded-lg shadow opacity-50 cursor-not-allowed text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Configuración de Plataforma
                  </p>
                  <p className="text-sm text-muted-foreground">Próximamente</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
