"use client";

import {
  // Flame,
  Wallet,
  // Star,
  Zap,
  // Settings,
  // User as UserIcon,
  // CreditCard,
  HelpCircle,
  Phone,
  LogOut,
  ChevronRight,
  Crown,
  Percent,
  Copy,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useWallet, useWalletBalance } from "@/domains/payment/hooks";
import { useStores } from "@/domains/store/hooks";
import { useLogout, useCurrentUser } from "@/domains/user/hooks";
import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { useToast } from "@/hooks/use-toast";
import { BasicLayout } from "@/layouts/BasicLayout";
import { getInitials, getUserLevelTitle } from "@/lib/user.lib";
import { extractErrorMessage } from "@/lib/utils";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfilePage(): React.JSX.Element | null {
  const router = useRouter();
  const { toast } = useToast();
  const { user, updateUser } = useAuthStore();
  const { data: myLevel } = useMyLevel();
  const { data: currentUser } = useCurrentUser();
  const logoutMutation = useLogout();
  const [expandPoints, setExpandPoints] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync current user data with auth store
  useEffect(() => {
    if (currentUser) {
      updateUser(currentUser);
    }
  }, [currentUser, updateUser]);

  const { data: storesResult, isLoading: storesLoading } = useStores();
  const { data: wallet } = useWallet({ userId: user?.id });
  const { data: walletBalance, isLoading: walletLoading } = useWalletBalance(
    wallet?.id || ""
  );
  const allStores = storesResult?.data ?? [];
  const discountPercentage =
    (user?.isPremium ? 15 : myLevel?.discountPercentage) ?? 10;

  if (!user) {
    return null;
  }

  const getTotalForLevel = (level: number | undefined): number => {
    // Define total usage counts required for each level
    if (level === 3 || level === 2) {
      return 10;
    } else {
      return 5;
    }
  };

  const handleCopyReferralCode = async () => {
    if (user.referralCode) {
      const copyText = `Use my referral code "${user.referralCode}" to win 1 month free subscription!`;
      await navigator.clipboard.writeText(copyText);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);

      toast({
        title: "Referral Code Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
      router.push("/");
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast({
        variant: "destructive",
        title: "Error al cerrar sesión",
        description: errorMessage || "No se pudo cerrar sesión",
      });
    }
  };

  return (
    <ProtectedRoute>
      <BasicLayout>
        {/* Hero Section */}
        <div className="bg-linear-to-b from-gradient-primary to-transparent p-6 pb-8 pt-20">
          <div className="text-center max-w-5xl mx-auto">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <div className="text-4xl">{getInitials(user.displayName)}</div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {user.displayName || user.email}
            </h1>
            {user.isPremium ? (
              <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors border-0 bg-gradient-primary text-white shadow-glow ml-2">
                <Crown className="w-4 h-4 mr-1" />
                Miembro Premium
              </div>
            ) : null}
            <p className="text-muted-foreground mb-4">
              @{user.email?.split("@")[0]}
            </p>

            {/* Wallet Section */}
            <div className="inline-block mb-4">
              <p className="text-sm text-muted-foreground mb-1">
                Saldo Disponible
              </p>
              <div
                id="wallet-display"
                className="flex justify-center items-center gap-2 px-4 py-3 rounded-lg bg-card border border-border"
              >
                <Wallet className="w-5 h-5 text-primary" />
                {walletLoading ? (
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-2xl font-bold text-foreground">
                    ${walletBalance?.balance || "0"}{" "}
                    {walletBalance?.currency || "MXN"}
                  </span>
                )}
              </div>

              {/* Referral Code */}
              {user.referralCode ? (
                <div className="mt-2">
                  <button
                    onClick={() => void handleCopyReferralCode()}
                    className="flex items-center w-full justify-center gap-1.5 px-3 py-1.5 rounded-md bg-card/50 border border-border/50 hover:bg-muted transition-colors text-xs"
                  >
                    <span className="text-muted-foreground">Código:</span>
                    <span className="font-mono font-semibold text-foreground">
                      {user.referralCode}
                    </span>
                    {copiedCode ? (
                      <CheckCircle className="w-3 h-3 text-lime-700 ml-0.5" />
                    ) : (
                      <Copy className="w-3 h-3 text-primary ml-0.5" />
                    )}
                  </button>
                  <p className="text-[10px] text-muted-foreground text-center mt-1">
                    🎁 Gana 1 mes Premium gratis cuando alguien use tu código
                  </p>
                </div>
              ) : null}
            </div>

            {/* Points Card */}
            {/* TODO: Hide until points is implemented */}
            {/* <Card className="mt-4 p-4 bg-card border-border">
              <div className="text-3xl font-bold text-primary mb-1">
                8,450 🍽️
              </div>
              <p className="text-sm text-muted-foreground">Ñamy Points</p>
            </Card> */}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-6 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-4 gap-3">
            {[
              // { icon: Flame, label: "Streaks", color: "bg-gradient-primary", href: "#" },
              {
                icon: Wallet,
                label: "Ve a mi billetera",
                // label: "Mi Billetera",
                color: "bg-gradient-secondary",
                href: "/wallet",
              },
              // { icon: Star, label: "Reviews", color: "bg-accent/20", href: "#" },
              // { icon: Zap, label: "Mi nivel", color: "bg-accent/20", href: "#" },
            ].map((item) => (
              <Link
                key={item.label}
                className="flex flex-col col-span-4 items-center hover:shadow-card transition-all"
                href={item.href}
              >
                {/* <Link
                key={item.label}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card hover:shadow-card transition-all"
                href={item.href}
              > */}
                {/* TODO:Put Back once we start implementing other features */}
                {/* <div
                  className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center`}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-foreground">
                  {item.label}
                </span> */}
                <div
                  className={`w-full h-12 rounded-sm font-bold text-gray-800 ${item.color} flex items-center justify-center`}
                >
                  {item.icon ? <item.icon className="w-6 h-6 mr-2" /> : null}
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 space-y-6 max-w-5xl mx-auto w-full">
          {/* Daily Streak Card */}
          <Card className="p-6 bg-gradient-primary text-white border-0 shadow-glow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  🔥 Level {myLevel?.level} -{" "}
                  {getUserLevelTitle(myLevel?.level ?? 1)}
                </h3>
                <p className="text-white/90 text-sm">
                  <b className="text-base">{myLevel?.usesUntilNextLevel}</b>{" "}
                  {(myLevel?.level ?? 1) < 3
                    ? "usos más para el siguiente nivel"
                    : "Para mantener su estatus de nivel 3"}
                </p>
              </div>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{
                  width: `${((myLevel?.monthlyUsageCount ?? 0) / getTotalForLevel(myLevel?.level)) * 100}%`,
                }}
              />
            </div>
            {/* TODO: Hide until leadership is implemented */}
            {/* <div className="flex items-start justify-between mb-4"> */}
            {/* <div className="items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  🔥 Daily Ñamy Streak: 5 Days
                </h3>
                <p className="text-white/90 text-sm">
                  Open daily to earn +10 bonus points
                </p>
              </div>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: "71.4286%" }}
              />
            </div> */}
            <div className="hidden pt-4 border-t border-white/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-white">
                  Level 8 – Savory Explorer 🍝
                </h4>
                <span className="text-white/90 text-sm">65%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: "65%" }}
                />
              </div>
              <p className="text-white/80 text-xs mt-2">350 XP to next level</p>
            </div>
          </Card>

          {/* Points Breakdown */}
          {/* TODO: Hide until leadership is implemented */}
          <Card className="p-5 bg-card border-border hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">
                📊 Points Breakdown
              </h3>
              <button
                onClick={() => setExpandPoints(!expandPoints)}
                className="text-sm font-medium hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md transition-colors"
              >
                {expandPoints ? "Collapse" : "Expand"}
              </button>
            </div>
            <div className="space-y-3">
              {[
                { icon: "📊", label: "Use a Discount", points: "+15 pts" },
                { icon: "💬", label: "Leave a Text Review", points: "+10 pts" },
                {
                  icon: "📸",
                  label: "Add a Photo to a Review",
                  points: "+5 pts",
                },
                {
                  icon: "🔥",
                  label: "Visit a Featured Restaurant",
                  points: "x2 multiplier",
                },
                ...(expandPoints
                  ? [
                      {
                        icon: "👥",
                        label: "Invite a Friend Who Signs Up",
                        points: "+50 pts",
                      },
                      {
                        icon: "📅",
                        label: "Daily Login Streak",
                        points: "+25 pts",
                      },
                      {
                        icon: "⚡",
                        label: "Complete a Challenge",
                        points: "+50–100 pts",
                      },
                      {
                        icon: "👑",
                        label: "Bono de Membresía Premium",
                        points: "Multiplicador 1.25x",
                      },
                    ]
                  : []),
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span>{item.icon}</span>
                    <span className="text-sm text-foreground">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-bold text-primary">{item.points}</span>
                </div>
              ))}
            </div>
            {expandPoints ? (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Detailed earning history and dates will appear here.
                </p>
              </div>
            ) : null}
          </Card>

          {/* Available Discounts */}
          <Card className="p-5 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">
                🎁 Descuentos Disponibles
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/restaurants")}
              >
                Ver Todos
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            {storesLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Cargando descuentos...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {allStores.slice(0, 3).map((store) => (
                  <button
                    key={store.id}
                    onClick={() => router.push(`/stores/${store.id}`)}
                    className="w-full flex items-center gap-4 p-3 rounded-lg bg-gradient-hero hover:shadow-card transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Percent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground">
                        {store.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {store.categoryId || "Restaurant"} •{" "}
                        {store.city || "Location"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary text-lg">
                        {discountPercentage}% OFF
                      </p>
                      {/* <p className="text-xs text-muted-foreground">+100 pts</p> */}
                    </div>
                  </button>
                ))}
                {allStores.length === 0 && !storesLoading && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No hay descuentos disponibles
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Leaderboard: TODO: Hide until leadership is implemented */}
          <Card className="p-5 bg-card border-border hidden">
            <h3 className="text-lg font-bold text-foreground mb-4">
              🏆 You&apos;re ranked #23 in Cancún!
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Earn 1,200 more points to reach Top 10 and unlock 1 week Premium.
            </p>
            <div className="space-y-2 mb-4">
              {[
                {
                  rank: "1",
                  name: "Sofia M.",
                  points: "12,500 pts",
                  isCrown: true,
                },
                { rank: "2", name: "Carlos R.", points: "11,200 pts" },
                { rank: "3", name: "Ana L.", points: "10,800 pts" },
              ].map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                >
                  {item.isCrown ? (
                    <Crown className="w-4 h-4 text-yellow-500 absolute -top-2 -right-2" />
                  ) : null}
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-white">
                    {item.rank}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.points}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">
              View Full Leaderboard
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          {/* Premium Section */}
          {!user.isPremium ? (
            <Card className="p-6 bg-gradient-secondary text-secondary-foreground border-0 shadow-glow text-center">
              <Zap className="w-12 h-12 mx-auto mb-3 text-secondary-foreground" />
              <h3 className="text-xl font-bold mb-2">
                🚀 Upgrade to Ñamy Premium
              </h3>
              <p className="text-secondary-foreground/90 mb-4">
                Earn 2× points on every order!
              </p>
              <Link
                href="/subscription"
                className="w-full bg-white text-secondary hover:bg-white/90 block font-semibold rounded-sm px-4 py-2"
              >
                Hazte Premium
              </Link>
            </Card>
          ) : (
            <Card className="p-6 bg-gradient-primary text-white border-0 shadow-glow text-center">
              <Crown className="w-12 h-12 mx-auto mb-3 text-white" />
              <h3 className="text-xl font-bold mb-2">✨ Ñamy Premium Member</h3>
              <p className="text-white/90 mb-4">
                ¡Estás ganando 2× puntos en cada pedido!
              </p>
              <div className="space-y-2 text-sm text-white/80">
                <p>✅ Multiplicador de puntos activo</p>
                <p>✅ Soporte al cliente prioritario</p>
                <p>✅ Acceso exclusivo a restaurantes</p>
              </div>
            </Card>
          )}

          {/* Settings & Support */}
          <Card className="p-5 bg-card border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Configuración y Soporte
            </h3>
            <div className="space-y-1">
              {[
                // { icon: Settings, label: "Settings", action: undefined },
                // { icon: UserIcon, label: "Edit Profile", action: undefined },
                // {
                //   icon: CreditCard,
                //   label: "Payment Methods",
                //   action: undefined,
                // },
                {
                  icon: HelpCircle,
                  label: "Ayuda & Preguntas",
                  action: () => router.push("/help"),
                },
                { icon: Phone, label: "Contactar Soporte", action: undefined },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
              <button
                onClick={() => {
                  void handleLogout();
                }}
                disabled={logoutMutation.isPending}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-destructive/10 transition-colors"
              >
                <div className="flex items-center gap-3 text-red-500">
                  <LogOut className="w-5 h-5" />
                  <span>
                    {logoutMutation.isPending
                      ? "Cerrando sesión..."
                      : "Cerrar Sesión"}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center py-6 pb-8">
            <p className="text-xs text-muted-foreground">
              Ñamy — Come inteligente, ahorra más 🍴💚
            </p>
          </div>
        </div>
      </BasicLayout>
    </ProtectedRoute>
  );
}
