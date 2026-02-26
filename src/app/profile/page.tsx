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
  // Phone,
  LogOut,
  ChevronRight,
  Crown,
  Percent,
  Copy,
  CheckCircle,
  MessageCircle,
  Camera,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useWallet, useWalletBalance } from "@/domains/payment/hooks";
import { useStores } from "@/domains/store/hooks";
import { useLogout, useCurrentUser } from "@/domains/user/hooks";
import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { useToast } from "@/hooks/use-toast";
import { BasicLayout } from "@/layouts/BasicLayout";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  UPDATE_ME_MUTATION,
  REQUEST_AVATAR_UPLOAD_MUTATION,
} from "@/lib/graphql-queries";
import { getInitials, getUserLevelTitle } from "@/lib/user.lib";
import { extractErrorMessage } from "@/lib/utils";
import CrispProvider from "@/providers/CrispProvider";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { useAuthStore } from "@/store/useAuthStore";

const EMOJI_AVATARS = [
  "🐶",
  "🐱",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🦁",
  "🐯",
  "🦋",
  "🐙",
  "🦄",
  "🐸",
  "🐧",
  "🦉",
  "🐺",
  "🦊",
  "🐷",
  "🐮",
  "🐵",
  "🦖",
];

type AvatarModalProps = {
  currentAvatarUrl?: string | null;
  displayName?: string | null;
  onClose: () => void;
  onSave: (avatarUrl: string) => Promise<void>;
};

function AvatarPickerModal({
  currentAvatarUrl,
  displayName,
  onClose,
  onSave,
}: AvatarModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    currentAvatarUrl ?? null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setSelectedFile(file);
    // Only for local preview — not stored as base64
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleEmoji = (emoji: string) => {
    setSelectedFile(null);
    setPreview(emoji);
  };

  const handleSave = async () => {
    if (!preview) {
      return;
    }
    setSaving(true);
    try {
      if (selectedFile) {
        // Get presigned URL from backend
        const result = await graphqlRequest<{
          requestAvatarUpload: { uploadUrl: string; publicUrl: string };
        }>(REQUEST_AVATAR_UPLOAD_MUTATION, { fileName: selectedFile.name });
        const { uploadUrl, publicUrl } = result.requestAvatarUpload;
        // Upload directly to S3
        await fetch(uploadUrl, {
          method: "PUT",
          body: selectedFile,
          headers: { "Content-Type": selectedFile.type },
        });
        await onSave(publicUrl);
      } else {
        // Emoji avatar — save as-is
        await onSave(preview);
      }
    } finally {
      setSaving(false);
      onClose();
    }
  };

  const isEmoji =
    preview && !preview.startsWith("data:") && !preview.startsWith("http");

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl mb-4 sm:mb-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-black text-gray-900">
            Editar foto de perfil
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview */}
        <div className="flex justify-center mb-5">
          <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden shadow-md ring-4 ring-orange-200">
            {preview ? (
              isEmoji ? (
                <span className="text-5xl">{preview}</span>
              ) : (
                <Image
                  src={preview}
                  alt="preview"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              )
            ) : (
              <span className="text-3xl font-black text-orange-500">
                {getInitials(displayName ?? "")}
              </span>
            )}
          </div>
        </div>

        {/* Upload button */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-orange-300 rounded-2xl py-3 text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors mb-4"
        >
          <Camera className="w-4 h-4" />
          Subir foto
        </button>

        {/* Emoji grid */}
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          O elige un avatar
        </p>
        <div className="grid grid-cols-10 gap-1 mb-5">
          {EMOJI_AVATARS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmoji(emoji)}
              className={`text-xl rounded-lg p-1 transition-transform active:scale-90 ${preview === emoji ? "bg-orange-100 ring-2 ring-orange-400" : "hover:bg-gray-100"}`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => void handleSave()}
            disabled={!preview || saving}
            className="flex-1 py-3 rounded-2xl bg-orange-500 text-white text-sm font-bold disabled:opacity-50 hover:bg-orange-600 transition-colors"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ProfilePage(): React.JSX.Element | null {
  const router = useRouter();
  const { toast } = useToast();
  const { user, updateUser } = useAuthStore();
  const { data: myLevel } = useMyLevel();
  const { data: currentUser } = useCurrentUser();
  const logoutMutation = useLogout();
  const [expandPoints, setExpandPoints] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleSaveAvatar = async (avatarUrl: string): Promise<void> => {
    try {
      await graphqlRequest(UPDATE_ME_MUTATION, { input: { avatarUrl } });
      updateUser({ avatarUrl });
      toast({ title: "Avatar actualizado" });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: err instanceof Error ? err.message : "Intenta de nuevo.",
      });
    }
  };

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
      const copyText = `¡Usa mi código de referido "${user.referralCode}" y gana $99mxn en tu billetera!`;
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

  const handleOpenCrisp = (): void => {
    if (typeof window !== "undefined" && window.$crisp) {
      window.$crisp.push(["do", "chat:show"]);
      window.$crisp.push(["do", "chat:open"]);
    }
  };

  return (
    <ProtectedRoute>
      <BasicLayout>
        {/* Hero Section */}
        <div className="bg-linear-to-b from-gradient-primary to-transparent p-6 pb-8 pt-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Avatar — tap to edit */}
            <button
              onClick={() => setShowAvatarModal(true)}
              className="relative w-24 h-24 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center shadow-glow ring-4 ring-orange-200 overflow-hidden group"
            >
              {user.avatarUrl ? (
                user.avatarUrl.startsWith("data:") ||
                user.avatarUrl.startsWith("http") ? (
                  <Image
                    src={user.avatarUrl}
                    alt="avatar"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-5xl">{user.avatarUrl}</span>
                )
              ) : (
                <span className="text-3xl font-black text-orange-500">
                  {getInitials(user.displayName)}
                </span>
              )}
              {/* Edit overlay */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </button>

            {showAvatarModal ? (
              <AvatarPickerModal
                currentAvatarUrl={user.avatarUrl}
                displayName={user.displayName}
                onClose={() => setShowAvatarModal(false)}
                onSave={handleSaveAvatar}
              />
            ) : null}
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
                    ${((walletBalance?.balance || 0) / 100).toFixed(2)}{" "}
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
            <Link href="/level">
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
                <p className="text-white/80 text-xs mt-2">
                  350 XP to next level
                </p>
              </div>
            </Link>
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
                        {store.type === "RESTAURANT" ? "Restaurant" : "Store"} •{" "}
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
                // { icon: Phone, label: "Contactar Soporte", action: undefined },
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
                onClick={handleOpenCrisp}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">Abrir Chat de Soporte</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
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
        <CrispProvider />
      </BasicLayout>
    </ProtectedRoute>
  );
}
