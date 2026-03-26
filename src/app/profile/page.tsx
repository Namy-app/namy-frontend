"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Wallet,
  Zap,
  HelpCircle,
  LogOut,
  ChevronRight,
  Crown,
  Copy,
  CheckCircle,
  MessageCircle,
  Camera,
  X,
  Ticket,
  Bell,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  useMyActiveChallenges,
  useLoginStreak,
} from "@/domains/gamification/hooks";
import { useWallet, useWalletBalance } from "@/domains/payment/hooks";
import { useLogout, useCurrentUser } from "@/domains/user/hooks";
import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { useToast } from "@/hooks/use-toast";
import { BasicLayout } from "@/layouts/BasicLayout";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  UPDATE_ME_MUTATION,
  REQUEST_AVATAR_UPLOAD_MUTATION,
  COUPONS_QUERY,
} from "@/lib/graphql-queries";
import { getInitials, getUserLevelTitle } from "@/lib/user.lib";
import { extractErrorMessage } from "@/lib/utils";
import CrispProvider from "@/providers/CrispProvider";
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
        const result = await graphqlRequest<{
          requestAvatarUpload: { uploadUrl: string; publicUrl: string };
        }>(REQUEST_AVATAR_UPLOAD_MUTATION, { fileName: selectedFile.name });
        const { uploadUrl, publicUrl } = result.requestAvatarUpload;
        await fetch(uploadUrl, {
          method: "PUT",
          body: selectedFile,
          headers: { "Content-Type": selectedFile.type },
        });
        await onSave(publicUrl);
      } else {
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

// ── Sub-components (declared outside ProfilePage to avoid recreating on render) ──

type AvatarBlockProps = {
  size?: "sm" | "lg";
  avatarUrl?: string | null;
  displayName?: string | null;
  onOpenModal: () => void;
};

function AvatarBlock({
  size = "sm",
  avatarUrl,
  displayName,
  onOpenModal,
}: AvatarBlockProps) {
  const dim = size === "lg" ? "w-24 h-24" : "w-16 h-16";
  const textSize = size === "lg" ? "text-5xl" : "text-3xl";
  const initialsSize = size === "lg" ? "text-2xl" : "text-xl";
  return (
    <div className="relative inline-block">
      <button
        onClick={onOpenModal}
        className={`relative ${dim} rounded-full bg-orange-100 flex items-center justify-center overflow-hidden ring-2 ring-orange-200 group`}
      >
        {avatarUrl ? (
          avatarUrl.startsWith("data:") || avatarUrl.startsWith("http") ? (
            <Image
              src={avatarUrl}
              alt="avatar"
              width={size === "lg" ? 96 : 64}
              height={size === "lg" ? 96 : 64}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <span className={textSize}>{avatarUrl}</span>
          )
        ) : (
          <span className={`${initialsSize} font-black text-orange-500`}>
            {getInitials(displayName ?? undefined)}
          </span>
        )}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-4 h-4 text-white" />
        </div>
      </button>
      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow">
        <Camera className="w-2.5 h-2.5 text-white" />
      </div>
    </div>
  );
}

type LevelCardProps = {
  level: number;
  monthlyUsageCount: number;
  discountPercentage: number;
  levelProgress: number;
  getTotalForLevel: (level: number | undefined) => number;
};

function LevelCard({
  level,
  monthlyUsageCount,
  discountPercentage,
  levelProgress,
  getTotalForLevel,
}: LevelCardProps) {
  return (
    <Link href="/level">
      <div className="border-2 border-yellow-400 rounded-2xl p-4 bg-white">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-lg font-black text-foreground">
              Nivel {level}: {getUserLevelTitle(level)}
            </h3>
            <p className="text-xs text-muted-foreground">
              Usa {getTotalForLevel(level)} descuentos al mes para subir de
              nivel
            </p>
          </div>
          <span className="text-lg font-black text-orange-500">
            {discountPercentage}%
          </span>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs font-bold text-muted-foreground">
            {level}
          </span>
          <div className="relative flex-1 h-5 bg-yellow-100 rounded-full overflow-hidden flex items-center px-1">
            <div
              className="h-3 bg-yellow-400 rounded-full transition-all"
              style={{ width: `${Math.min(levelProgress, 100)}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-yellow-700 pointer-events-none">
              ⭐ {monthlyUsageCount}/{getTotalForLevel(level)} usos
            </span>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {level + 1}
          </span>
        </div>
      </div>
    </Link>
  );
}

type QuickStatsProps = {
  walletLoading: boolean;
  walletBalance: number;
  couponCount: number;
  onOpenCrisp: () => void;
};

function QuickStats({
  walletLoading,
  walletBalance,
  couponCount,
  onOpenCrisp,
}: QuickStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Link
        href="/wallet"
        className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-green-600" />
        </div>
        {walletLoading ? (
          <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <p className="text-sm font-black text-foreground">
            ${(walletBalance / 100).toFixed(2)}
          </p>
        )}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          Billetera
        </p>
      </Link>
      <button
        onClick={onOpenCrisp}
        className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-sm font-black text-foreground">24/7</p>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          Ayuda
        </p>
      </button>
      <Link
        href="/my-coupons"
        className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
          <Ticket className="w-5 h-5 text-pink-600" />
        </div>
        <p className="text-sm font-black text-foreground">{couponCount}</p>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          Mis Cupones
        </p>
      </Link>
    </div>
  );
}

type MisionesCardProps = {
  misionesOpen: boolean;
  onToggleMisiones: () => void;
  newMissionsCount: number;
  loginStreak: number;
  streakProgress: number;
  streakTarget: number;
  streakPoints: number;
};

function MisionesCard({
  misionesOpen,
  onToggleMisiones,
  newMissionsCount,
  loginStreak,
  streakProgress,
  streakTarget,
  streakPoints,
}: MisionesCardProps) {
  return (
    <div>
      <h2 className="text-lg font-black text-foreground mb-3">
        Misiones y Logros
      </h2>
      <div className="bg-white rounded-2xl border border-border shadow-sm divide-y divide-border">
        <button
          onClick={onToggleMisiones}
          className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted/30 transition-colors rounded-t-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <span className="text-lg">📋</span>
            </div>
            <span className="font-semibold text-foreground">
              Misiones diarias
            </span>
          </div>
          <div className="flex items-center gap-2">
            {newMissionsCount > 0 ? (
              <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">
                ¡{newMissionsCount} Nuevas!
              </span>
            ) : null}
            <ChevronRight
              className={`w-4 h-4 text-muted-foreground transition-transform ${misionesOpen ? "rotate-90" : ""}`}
            />
          </div>
        </button>

        {misionesOpen ? (
          <div className="px-4 py-4 bg-orange-50/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-bold text-foreground">
                  Racha de inicio de sesión
                </span>
              </div>
              <span className="text-xs font-bold text-orange-500">
                {loginStreak} días
              </span>
            </div>
            <div className="relative h-4 bg-orange-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-400 rounded-full transition-all"
                style={{
                  width: `${Math.min((streakProgress / streakTarget) * 100, 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">
                {streakProgress}/{streakTarget} días consecutivos
              </span>
              <span className="text-[10px] font-bold text-orange-500">
                +{streakPoints} pts
              </span>
            </div>
            <Link
              href="/league/puntos"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-orange-500 hover:underline"
            >
              Ver todas las misiones <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        ) : null}

        <Link
          href="/league"
          className="flex items-center justify-between px-4 py-4 hover:bg-muted/30 transition-colors rounded-b-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
              <span className="text-lg">🏆</span>
            </div>
            <span className="font-semibold text-foreground">
              Premios ganados
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}

type PremiumBannerProps = {
  isPremium: boolean;
  discountPercentage: number;
};

function PremiumBanner({ isPremium, discountPercentage }: PremiumBannerProps) {
  if (!isPremium) {
    return (
      <Link
        href="/subscription"
        className="flex items-center justify-between bg-black rounded-2xl px-5 py-4 shadow-lg"
      >
        <Image
          width={68}
          height={68}
          src="/premiumbadge.png"
          alt="restairant Image"
        />
        <div className="flex items-center gap-3">
          <p className="font-black text-white text-sm">
            Más Descuentos, Sin Anuncios
          </p>
        </div>
        <span className="bg-purple-500 text-white text-xs font-black px-3 py-1.5 rounded-full whitespace-nowrap">
          Hazte Premium
        </span>
      </Link>
    );
  }
  return (
    <div className="flex items-center justify-between bg-gradient-primary rounded-2xl px-5 py-4 shadow-lg">
      <div className="flex items-center gap-3">
        <Crown className="w-8 h-8 text-white" />
        <div>
          <p className="font-black text-white text-sm">
            Miembro Premium Activo
          </p>
          <p className="text-white/80 text-xs">
            Descuento {discountPercentage}% activo
          </p>
        </div>
      </div>
      <Zap className="w-6 h-6 text-white/80" />
    </div>
  );
}

type AccountMenuProps = {
  logoutPending: boolean;
  onLogout: () => void;
  onOpenCrisp: () => void;
};

function AccountMenu({
  logoutPending,
  onLogout,
  onOpenCrisp,
}: AccountMenuProps) {
  return (
    <div>
      <h2 className="text-lg font-black text-foreground mb-3">Mi Cuenta</h2>
      <div className="bg-white rounded-2xl border border-border shadow-sm divide-y divide-border">
        <Link
          href="/help"
          className="flex items-center justify-between px-4 py-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-gray-500" />
            </div>
            <span className="font-semibold text-foreground">
              Ayuda & Preguntas
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Link>
        <button
          onClick={onOpenCrisp}
          className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
              <Bell className="w-4 h-4 text-gray-500" />
            </div>
            <span className="font-semibold text-foreground">
              Notificaciones
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          onClick={onLogout}
          disabled={logoutPending}
          className="w-full flex items-center justify-between px-4 py-4 hover:bg-red-50 transition-colors rounded-b-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
              <LogOut className="w-4 h-4 text-red-500" />
            </div>
            <span className="font-semibold text-red-500">
              {logoutPending ? "Cerrando sesión..." : "Cerrar sesión"}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage(): React.JSX.Element | null {
  const router = useRouter();
  const { toast } = useToast();
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: myLevel } = useMyLevel();
  const { data: currentUser } = useCurrentUser();
  const logoutMutation = useLogout();
  const [copiedCode, setCopiedCode] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [misionesOpen, setMisionesOpen] = useState(false);

  const handleSaveAvatar = async (avatarUrl: string): Promise<void> => {
    try {
      await graphqlRequest(UPDATE_ME_MUTATION, { input: { avatarUrl } });
      updateUser({ avatarUrl });
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast({ title: "Avatar actualizado" });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: err instanceof Error ? err.message : "Intenta de nuevo.",
      });
    }
  };

  useEffect(() => {
    if (currentUser) {
      updateUser(currentUser);
    }
  }, [currentUser, updateUser]);

  const { data: wallet } = useWallet({ userId: user?.id });
  const { data: walletBalance, isLoading: walletLoading } = useWalletBalance(
    wallet?.id || ""
  );
  const discountPercentage =
    (user?.isPremium ? 15 : myLevel?.discountPercentage) ?? 10;

  const { data: loginStreak = 0 } = useLoginStreak();
  const { data: activeChallenges = [] } = useMyActiveChallenges();
  const { data: couponsData } = useQuery({
    queryKey: ["coupons", "unused"],
    queryFn: () =>
      graphqlRequest<{ myCoupons: { id: string }[] }>(COUPONS_QUERY, {
        filters: { used: false },
      }).then((r) => r.myCoupons),
    enabled: !!user,
  });
  const couponCount = couponsData?.length ?? 0;
  const newMissionsCount = activeChallenges.length;

  if (!user) {
    return null;
  }

  const getTotalForLevel = (level: number | undefined): number => {
    if (level === 3 || level === 2) {
      return 10;
    }
    return 5;
  };

  const handleCopyReferralCode = async () => {
    if (user.referralCode) {
      const copyText = `¡Usa mi código de referido "${user.referralCode}" y gana $99mxn en tu billetera!`;
      await navigator.clipboard.writeText(copyText);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      toast({
        title: "¡Código copiado!",
        description: "Código de referido copiado al portapapeles",
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
      toast({
        variant: "destructive",
        title: "Error al cerrar sesión",
        description: extractErrorMessage(error) || "No se pudo cerrar sesión",
      });
    }
  };

  const handleOpenCrisp = (): void => {
    if (typeof window !== "undefined" && window.$crisp) {
      window.$crisp.push(["do", "chat:show"]);
      window.$crisp.push(["do", "chat:open"]);
    }
  };

  const levelProgress =
    ((myLevel?.monthlyUsageCount ?? 0) / getTotalForLevel(myLevel?.level)) *
    100;

  const streakChallenge = activeChallenges.find(
    (c) =>
      c.challenge?.entityType === "LOGIN_STREAKS" ||
      c.challenge?.entityType === "login_streaks"
  );
  const streakTarget = streakChallenge?.challenge?.count ?? 1;
  const streakProgress = streakChallenge?.count ?? 0;

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <ProtectedRoute>
      <BasicLayout>
        {/* ── Mobile & Tablet (< lg) ── single column */}
        <div className="lg:hidden pb-10 max-w-xl mx-auto w-full">
          {/* Header */}
          <div className="px-5 pt-16 pb-4">
            <h1 className="text-2xl font-black text-foreground">Perfil</h1>
          </div>

          {/* Avatar + Name + Streak */}
          <div className="px-5 flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <AvatarBlock
                size="sm"
                avatarUrl={user.avatarUrl}
                displayName={user.displayName}
                onOpenModal={() => setShowAvatarModal(true)}
              />
              <div>
                <h2 className="text-lg font-black text-foreground leading-tight">
                  {user.displayName || user.email?.split("@")[0]}
                </h2>
                {user.isPremium ? (
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-orange-500">
                    <Crown className="w-3 h-3" /> Premium
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    @{user.email?.split("@")[0]}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-1.5">
              <span className="text-lg">🔥</span>
              <div className="text-right">
                <p className="text-base font-black text-orange-500 leading-none">
                  {loginStreak}
                </p>
                <p className="text-[10px] text-orange-400 leading-none">
                  Racha diaria
                </p>
              </div>
            </div>
          </div>

          {showAvatarModal ? (
            <AvatarPickerModal
              currentAvatarUrl={user.avatarUrl}
              displayName={user.displayName}
              onClose={() => setShowAvatarModal(false)}
              onSave={handleSaveAvatar}
            />
          ) : null}

          <div className="px-5 mb-5">
            <LevelCard
              level={myLevel?.level ?? 1}
              monthlyUsageCount={myLevel?.monthlyUsageCount ?? 0}
              discountPercentage={discountPercentage}
              levelProgress={levelProgress}
              getTotalForLevel={getTotalForLevel}
            />
          </div>
          <div className="px-5 mb-5">
            <QuickStats
              walletLoading={walletLoading}
              walletBalance={walletBalance?.balance || 0}
              couponCount={couponCount}
              onOpenCrisp={handleOpenCrisp}
            />
          </div>

          {user.referralCode ? (
            <div className="px-5 mb-5">
              <button
                onClick={() => void handleCopyReferralCode()}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Código referido:
                  </span>
                  <span className="font-mono font-black text-foreground">
                    {user.referralCode}
                  </span>
                </div>
                {copiedCode ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-primary" />
                )}
              </button>
              <p className="text-[10px] text-muted-foreground text-center mt-1">
                🎁 Gana 1 mes Premium gratis cuando alguien use tu código
              </p>
            </div>
          ) : null}

          <div className="px-5 mb-5">
            <MisionesCard
              misionesOpen={misionesOpen}
              onToggleMisiones={() => setMisionesOpen((o) => !o)}
              newMissionsCount={newMissionsCount}
              loginStreak={loginStreak}
              streakProgress={streakProgress}
              streakTarget={streakTarget}
              streakPoints={streakChallenge?.challenge?.points ?? 5}
            />
          </div>
          <div className="px-5 mb-5">
            <PremiumBanner
              isPremium={user.isPremium ?? false}
              discountPercentage={discountPercentage}
            />
          </div>
          <div className="px-5 mb-5">
            <AccountMenu
              logoutPending={logoutMutation.isPending}
              onLogout={() => void handleLogout()}
              onOpenCrisp={handleOpenCrisp}
            />
          </div>

          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground">
              Ñamy — Come inteligente, ahorra más 🍴💚
            </p>
          </div>
        </div>

        {/* ── Desktop (≥ lg) ── two-column layout ── */}
        <div className="hidden lg:block pb-16 max-w-5xl mx-auto w-full px-8 pt-20">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-foreground">Perfil</h1>
          </div>

          <div className="grid grid-cols-[320px_1fr] gap-8 items-start">
            {/* ── Left sidebar ── */}
            <div className="space-y-5 sticky top-24">
              {/* Profile card */}
              <div className="bg-white rounded-3xl border border-border shadow-sm p-6 flex flex-col items-center gap-3 text-center">
                <AvatarBlock
                  size="lg"
                  avatarUrl={user.avatarUrl}
                  displayName={user.displayName}
                  onOpenModal={() => setShowAvatarModal(true)}
                />
                <div>
                  <h2 className="text-xl font-black text-foreground leading-tight">
                    {user.displayName || user.email?.split("@")[0]}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    @{user.email?.split("@")[0]}
                  </p>
                  {user.isPremium ? (
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 mt-1">
                      <Crown className="w-3 h-3" /> Miembro Premium
                    </div>
                  ) : null}
                </div>

                {/* Streak pill */}
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2">
                  <span className="text-xl">🔥</span>
                  <div>
                    <p className="text-lg font-black text-orange-500 leading-none">
                      {loginStreak}
                    </p>
                    <p className="text-[10px] text-orange-400 leading-none">
                      Racha diaria
                    </p>
                  </div>
                </div>

                {/* Referral code */}
                {user.referralCode ? (
                  <div className="w-full">
                    <button
                      onClick={() => void handleCopyReferralCode()}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Código:</span>
                        <span className="font-mono font-black text-foreground">
                          {user.referralCode}
                        </span>
                      </div>
                      {copiedCode ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-primary" />
                      )}
                    </button>
                    <p className="text-[10px] text-muted-foreground text-center mt-1">
                      🎁 Gana 1 mes Premium gratis con tu código
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Quick stats */}
              <QuickStats
                walletLoading={walletLoading}
                walletBalance={walletBalance?.balance || 0}
                couponCount={couponCount}
                onOpenCrisp={handleOpenCrisp}
              />

              <div className="text-center py-2">
                <p className="text-xs text-muted-foreground">
                  Ñamy — Come inteligente, ahorra más 🍴💚
                </p>
              </div>
            </div>

            {/* ── Right main content ── */}
            <div className="space-y-5">
              <LevelCard
                level={myLevel?.level ?? 1}
                monthlyUsageCount={myLevel?.monthlyUsageCount ?? 0}
                discountPercentage={discountPercentage}
                levelProgress={levelProgress}
                getTotalForLevel={getTotalForLevel}
              />
              <MisionesCard
                misionesOpen={misionesOpen}
                onToggleMisiones={() => setMisionesOpen((o) => !o)}
                newMissionsCount={newMissionsCount}
                loginStreak={loginStreak}
                streakProgress={streakProgress}
                streakTarget={streakTarget}
                streakPoints={streakChallenge?.challenge?.points ?? 5}
              />
              <PremiumBanner
                isPremium={user.isPremium ?? false}
                discountPercentage={discountPercentage}
              />
            </div>
          </div>

          {/* ── Mi Cuenta — full width below both columns ── */}
          <div className="mt-8">
            <AccountMenu
              logoutPending={logoutMutation.isPending}
              onLogout={() => void handleLogout()}
              onOpenCrisp={handleOpenCrisp}
            />
          </div>
        </div>

        {showAvatarModal ? (
          <AvatarPickerModal
            currentAvatarUrl={user.avatarUrl}
            displayName={user.displayName}
            onClose={() => setShowAvatarModal(false)}
            onSave={handleSaveAvatar}
          />
        ) : null}

        {/* ────────────────────────────────────────────────────────────────
            NOTE: The mobile/tablet AvatarPickerModal is rendered inside
            the lg:hidden block above. This second instance handles desktop.
        ──────────────────────────────────────────────────────────────── */}

        <CrispProvider />
      </BasicLayout>
    </ProtectedRoute>
  );
}
