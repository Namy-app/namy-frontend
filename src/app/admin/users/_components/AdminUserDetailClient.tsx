"use client";

import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Award,
  Ticket,
  Receipt,
  User as UserIcon,
  UserPlus,
  Loader2,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useCallback } from "react";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  useAdminUserProfileSummary,
  useAdminUserCoupons,
  useAdminUserRedemptions,
  useAdminUserReferrals,
  useAdminUserDetailDataSource,
} from "@/domains/admin/hooks";
import {
  UserRole,
  type UserDetailsActivityFilters,
  type ActivityDateRange,
} from "@/domains/admin/types";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { useAuthStore } from "@/store/useAuthStore";

const emptyDraft = {
  couponFrom: "",
  couponTo: "",
  redemptionFrom: "",
  redemptionTo: "",
  referralFrom: "",
  referralTo: "",
};

function dateRangeFromInputs(
  from: string,
  to: string
): ActivityDateRange | undefined {
  const f = from.trim();
  const t = to.trim();
  if (!f && !t) {
    return undefined;
  }
  return {
    ...(f ? { from: new Date(`${f}T00:00:00.000Z`).toISOString() } : {}),
    ...(t ? { to: new Date(`${t}T23:59:59.999Z`).toISOString() } : {}),
  };
}

type SectionDateRangeFiltersProps = Readonly<{
  fromValue: string;
  toValue: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
  disabled?: boolean;
  /** Native tooltip when controls are disabled */
  disabledTitle?: string;
}>;

function SectionDateRangeFilters({
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  onApply,
  onClear,
  disabled = false,
  disabledTitle,
}: SectionDateRangeFiltersProps) {
  return (
    <div
      className={`flex shrink-0 flex-wrap items-center justify-end gap-2 ${disabled ? "pointer-events-none opacity-50" : ""}`}
      title={disabled ? disabledTitle : undefined}
    >
      <input
        type="date"
        aria-label="Filter from date"
        disabled={disabled}
        className="h-9 w-42 shrink-0 rounded-md border border-input bg-background px-2 text-sm text-foreground"
        value={fromValue}
        onChange={(e) => onFromChange(e.target.value)}
      />
      <input
        type="date"
        aria-label="Filter to date"
        disabled={disabled}
        className="h-9 w-42 shrink-0 rounded-md border border-input bg-background px-2 text-sm text-foreground"
        value={toValue}
        onChange={(e) => onToChange(e.target.value)}
      />
      <Button type="button" size="sm" disabled={disabled} onClick={onApply}>
        Apply
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={onClear}
      >
        Clear
      </Button>
    </div>
  );
}

export default function UserDetailsPage() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const params = useParams();
  const userId = params?.id as string;

  const [draftFilters, setDraftFilters] = useState(emptyDraft);
  const [appliedActivityFilters, setAppliedActivityFilters] = useState<
    UserDetailsActivityFilters | undefined
  >(undefined);

  const profileQuery = useAdminUserProfileSummary(
    userId,
    appliedActivityFilters
  );
  const profileReady =
    profileQuery.isSuccess && profileQuery.data !== undefined;
  const listQueryEnabled = profileReady;

  const couponsQuery = useAdminUserCoupons(userId, appliedActivityFilters, {
    enabled: listQueryEnabled,
  });
  const redemptionsQuery = useAdminUserRedemptions(
    userId,
    appliedActivityFilters,
    { enabled: listQueryEnabled }
  );
  const referralsQuery = useAdminUserReferrals(userId, appliedActivityFilters, {
    enabled: listQueryEnabled,
  });

  const profile = profileQuery.data;
  const couponsResponse = couponsQuery.data;
  const redemptionsResponse = redemptionsQuery.data;
  const referralsResponse = referralsQuery.data;

  const coupons = couponsResponse?.data ?? [];
  const couponsListTotal = couponsResponse?.paginationInfo.total ?? 0;
  const redemptions = redemptionsResponse?.data ?? [];
  const redemptionsListTotal = redemptionsResponse?.paginationInfo.total ?? 0;
  const referrals = referralsResponse?.data ?? [];
  const referralsListTotal = referralsResponse?.paginationInfo.total ?? 0;

  const detailDataSource = useAdminUserDetailDataSource(
    profileQuery,
    userId,
    appliedActivityFilters
  );

  const showFullPageProfileLoading = profileQuery.isLoading;
  const profileError = profileQuery.error;

  const couponsListLoading = profileReady && couponsQuery.isLoading;
  const referralsListLoading = profileReady && referralsQuery.isLoading;
  const redemptionsListLoading = profileReady && redemptionsQuery.isLoading;

  const applyCouponFilters = useCallback(() => {
    setAppliedActivityFilters((prev) => {
      const coupons = dateRangeFromInputs(
        draftFilters.couponFrom,
        draftFilters.couponTo
      );
      const next: UserDetailsActivityFilters = {};
      if (prev?.redemptions) {
        next.redemptions = prev.redemptions;
      }
      if (prev?.referrals) {
        next.referrals = prev.referrals;
      }
      if (coupons) {
        next.coupons = coupons;
      }
      if (!next.coupons && !next.redemptions && !next.referrals) {
        return undefined;
      }
      return next;
    });
  }, [draftFilters.couponFrom, draftFilters.couponTo]);

  const clearCouponFilters = useCallback(() => {
    setDraftFilters((d) => ({ ...d, couponFrom: "", couponTo: "" }));
    setAppliedActivityFilters((prev) => {
      if (!prev?.coupons) {
        return prev;
      }
      const { coupons: _omit, ...rest } = prev;
      if (!rest.redemptions && !rest.referrals) {
        return undefined;
      }
      return rest;
    });
  }, []);

  const applyRedemptionFilters = useCallback(() => {
    setAppliedActivityFilters((prev) => {
      const redemptions = dateRangeFromInputs(
        draftFilters.redemptionFrom,
        draftFilters.redemptionTo
      );
      const next: UserDetailsActivityFilters = {};
      if (prev?.coupons) {
        next.coupons = prev.coupons;
      }
      if (prev?.referrals) {
        next.referrals = prev.referrals;
      }
      if (redemptions) {
        next.redemptions = redemptions;
      }
      if (!next.coupons && !next.redemptions && !next.referrals) {
        return undefined;
      }
      return next;
    });
  }, [draftFilters.redemptionFrom, draftFilters.redemptionTo]);

  const clearRedemptionFilters = useCallback(() => {
    setDraftFilters((d) => ({ ...d, redemptionFrom: "", redemptionTo: "" }));
    setAppliedActivityFilters((prev) => {
      if (!prev?.redemptions) {
        return prev;
      }
      const { redemptions: _omit, ...rest } = prev;
      if (!rest.coupons && !rest.referrals) {
        return undefined;
      }
      return rest;
    });
  }, []);

  const applyReferralFilters = useCallback(() => {
    setAppliedActivityFilters((prev) => {
      const referrals = dateRangeFromInputs(
        draftFilters.referralFrom,
        draftFilters.referralTo
      );
      const next: UserDetailsActivityFilters = {};
      if (prev?.coupons) {
        next.coupons = prev.coupons;
      }
      if (prev?.redemptions) {
        next.redemptions = prev.redemptions;
      }
      if (referrals) {
        next.referrals = referrals;
      }
      if (!next.coupons && !next.redemptions && !next.referrals) {
        return undefined;
      }
      return next;
    });
  }, [draftFilters.referralFrom, draftFilters.referralTo]);

  const clearReferralFilters = useCallback(() => {
    setDraftFilters((d) => ({ ...d, referralFrom: "", referralTo: "" }));
    setAppliedActivityFilters((prev) => {
      if (!prev?.referrals) {
        return prev;
      }
      const { referrals: _omit, ...rest } = prev;
      if (!rest.coupons && !rest.redemptions) {
        return undefined;
      }
      return rest;
    });
  }, []);

  const isAdmin =
    currentUser?.role === UserRole.ADMIN ||
    currentUser?.role === UserRole.SUPER_ADMIN;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (cents?: number) => {
    if (!cents) {
      return "N/A";
    }
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (!isAdmin) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Access Denied
            </h1>
            <p className="text-muted-foreground">
              You do not have permission to access this page.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={() => router.push("/admin/users")}
              variant="ghost"
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
            <h1 className="text-3xl font-bold text-foreground">User Details</h1>
          </div>

          {showFullPageProfileLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading user profile…</p>
            </div>
          ) : null}

          {profileError ? (
            <Card className="p-6 text-center">
              <p className="text-destructive">
                Error loading user profile: {profileError.message}
              </p>
            </Card>
          ) : null}

          {profile ? (
            <div className="space-y-6">
              {/* User Info Card */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {profile.displayName || "No name"}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            profile.role === UserRole.ADMIN ||
                            profile.role === UserRole.SUPER_ADMIN
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {profile.role}
                        </span>
                        {profile.verified ? (
                          <span className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600 text-sm">
                            <XCircle className="w-4 h-4" />
                            Not Verified
                          </span>
                        )}
                        <span
                          className={`flex items-center gap-1 text-sm ${
                            profile.active ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              profile.active ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {profile.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.phone ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                  ) : null}
                  {profile.city || profile.country ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {profile.city}
                        {profile.country ? `, ${profile.country}` : null}
                      </span>
                    </div>
                  ) : null}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDate(profile.createdAt)}</span>
                  </div>
                  {profile.lastSeen ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>👁️</span>
                      <span>Last seen {formatDate(profile.lastSeen)}</span>
                    </div>
                  ) : null}
                  {profile.referralCode ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>🔗</span>
                      <span>Referral: {profile.referralCode}</span>
                    </div>
                  ) : null}
                </div>
              </Card>

              {/* Statistics */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Level</p>
                      <p className="text-3xl font-bold text-foreground">
                        {profile.level}
                      </p>
                    </div>
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        This Month
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {profile.monthlyUsageCount}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-secondary" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Coupons
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {profile.totalCoupons}
                      </p>
                    </div>
                    <Ticket className="w-8 h-8 text-accent" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Redemptions
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {profile.totalRedemptions}
                      </p>
                    </div>
                    <Receipt className="w-8 h-8 text-services" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Referrals made
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {profile.totalReferrals}
                      </p>
                    </div>
                    <UserPlus className="w-8 h-8 text-indigo-500" />
                  </div>
                </Card>
              </div>

              <p className="text-sm text-muted-foreground">
                {detailDataSource === "legacy-compat"
                  ? "Older API: coupon and redemption filters run in the browser on loaded lists. Referral filters are disabled until the API supports referral data. Summary cards are lifetime totals."
                  : "Summary cards are lifetime totals. Date filters in each section below run on the server; lists show up to 100 rows per request."}
              </p>

              {/* Coupons */}
              <Card className="p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="flex min-w-0 items-center gap-2 text-xl font-semibold text-foreground">
                    <Ticket className="h-5 w-5 shrink-0" />
                    <span className="truncate">
                      Coupons
                      {couponsResponse ? ` (${couponsListTotal})` : null}
                    </span>
                  </h3>
                  <SectionDateRangeFilters
                    fromValue={draftFilters.couponFrom}
                    toValue={draftFilters.couponTo}
                    onFromChange={(v) =>
                      setDraftFilters((d) => ({ ...d, couponFrom: v }))
                    }
                    onToChange={(v) =>
                      setDraftFilters((d) => ({ ...d, couponTo: v }))
                    }
                    onApply={applyCouponFilters}
                    onClear={clearCouponFilters}
                  />
                </div>
                {appliedActivityFilters?.coupons &&
                couponsListTotal < profile.totalCoupons ? (
                  <p className="mb-2 text-sm text-muted-foreground">
                    {profile.totalCoupons} coupon(s) lifetime — list filtered by
                    date range
                  </p>
                ) : null}
                {couponsQuery.data?.paginationInfo.hasNextPage ? (
                  <p className="mb-2 text-sm text-muted-foreground">
                    Showing the first{" "}
                    {couponsQuery.data.paginationInfo.pageSize} of{" "}
                    {couponsListTotal} matching coupon(s).
                  </p>
                ) : null}
                {couponsQuery.error ? (
                  <p className="mb-2 text-sm text-destructive">
                    Error loading coupons: {couponsQuery.error.message}
                  </p>
                ) : null}
                {couponsListLoading ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p>Loading coupons…</p>
                  </div>
                ) : coupons.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {appliedActivityFilters?.coupons
                      ? "No coupons in the selected date range."
                      : "No coupons generated yet"}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {coupons.map((coupon) => (
                      <div
                        key={coupon.id}
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                                {coupon.code}
                              </code>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  coupon.used
                                    ? "bg-gray-100 text-gray-800"
                                    : new Date(coupon.expiresAt) < new Date()
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                }`}
                              >
                                {coupon.used
                                  ? "Used"
                                  : new Date(coupon.expiresAt) < new Date()
                                    ? "Expired"
                                    : "Active"}
                              </span>
                            </div>
                            {coupon.store ? (
                              <p className="text-sm font-medium text-foreground mb-1">
                                {coupon.store.name}
                              </p>
                            ) : null}
                            {coupon.discount ? (
                              <p className="text-sm text-muted-foreground mb-2">
                                {coupon.discount.title} -{" "}
                                {coupon.discount.type === "percentage"
                                  ? `${coupon.value}%`
                                  : `$${coupon.value}`}{" "}
                                off
                              </p>
                            ) : null}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                Created: {formatDate(coupon.createdAt)}
                              </span>
                              <span>
                                Expires: {formatDate(coupon.expiresAt)}
                              </span>
                              {coupon.usedAt ? (
                                <span>Used: {formatDate(coupon.usedAt)}</span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Referrals (this user as referrer) */}
              <Card className="p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="flex min-w-0 items-center gap-2 text-xl font-semibold text-foreground">
                    <UserPlus className="h-5 w-5 shrink-0" />
                    <span className="truncate">
                      Referrals
                      {referralsResponse ? ` (${referralsListTotal})` : null}
                    </span>
                  </h3>
                  <SectionDateRangeFilters
                    fromValue={draftFilters.referralFrom}
                    toValue={draftFilters.referralTo}
                    onFromChange={(v) =>
                      setDraftFilters((d) => ({ ...d, referralFrom: v }))
                    }
                    onToChange={(v) =>
                      setDraftFilters((d) => ({ ...d, referralTo: v }))
                    }
                    onApply={applyReferralFilters}
                    onClear={clearReferralFilters}
                    disabled={detailDataSource === "legacy-compat"}
                    disabledTitle="Referral filters are unavailable on this API version."
                  />
                </div>
                {appliedActivityFilters?.referrals &&
                referralsListTotal < profile.totalReferrals ? (
                  <p className="mb-2 text-sm text-muted-foreground">
                    {profile.totalReferrals} referral(s) lifetime — list
                    filtered by date range
                  </p>
                ) : null}
                {referralsQuery.data?.paginationInfo.hasNextPage ? (
                  <p className="mb-2 text-sm text-muted-foreground">
                    Showing the first{" "}
                    {referralsQuery.data.paginationInfo.pageSize} of{" "}
                    {referralsListTotal} matching referral(s).
                  </p>
                ) : null}
                {referralsQuery.error ? (
                  <p className="mb-2 text-sm text-destructive">
                    Error loading referrals: {referralsQuery.error.message}
                  </p>
                ) : null}
                {referralsListLoading ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p>Loading referrals…</p>
                  </div>
                ) : referrals.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {appliedActivityFilters?.referrals
                      ? "No referrals in the selected date range."
                      : "No referrals yet"}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {referrals.map((referral) => (
                      <div
                        key={referral.id}
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {referral.recipientDisplayName ||
                                referral.recipientEmail ||
                                referral.recipientUserId}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Recipient ID:{" "}
                              <button
                                type="button"
                                className="font-mono text-primary underline-offset-2 hover:underline"
                                onClick={() =>
                                  router.push(
                                    `/admin/users/${referral.recipientUserId}`
                                  )
                                }
                              >
                                {referral.recipientUserId}
                              </button>
                            </p>
                            {referral.recipientEmail ? (
                              <p className="text-xs text-muted-foreground">
                                {referral.recipientEmail}
                              </p>
                            ) : null}
                            {referral.referralCode ? (
                              <p className="text-xs text-muted-foreground mt-1">
                                Code used:{" "}
                                <code className="rounded bg-muted px-1 py-0.5 font-mono">
                                  {referral.referralCode}
                                </code>
                              </p>
                            ) : null}
                          </div>
                          <p className="text-xs text-muted-foreground shrink-0">
                            {formatDate(referral.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Redemptions */}
              <Card className="p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="flex min-w-0 items-center gap-2 text-xl font-semibold text-foreground">
                    <Receipt className="h-5 w-5 shrink-0" />
                    <span className="truncate">
                      Redemptions
                      {redemptionsResponse
                        ? ` (${redemptionsListTotal})`
                        : null}
                    </span>
                  </h3>
                  <SectionDateRangeFilters
                    fromValue={draftFilters.redemptionFrom}
                    toValue={draftFilters.redemptionTo}
                    onFromChange={(v) =>
                      setDraftFilters((d) => ({ ...d, redemptionFrom: v }))
                    }
                    onToChange={(v) =>
                      setDraftFilters((d) => ({ ...d, redemptionTo: v }))
                    }
                    onApply={applyRedemptionFilters}
                    onClear={clearRedemptionFilters}
                  />
                </div>
                {appliedActivityFilters?.redemptions &&
                redemptionsListTotal < profile.totalRedemptions ? (
                  <p className="mb-2 text-sm text-muted-foreground">
                    {profile.totalRedemptions} redemption(s) lifetime — list
                    filtered by date range
                  </p>
                ) : null}
                {redemptionsQuery.data?.paginationInfo.hasNextPage ? (
                  <p className="mb-2 text-sm text-muted-foreground">
                    Showing the first{" "}
                    {redemptionsQuery.data.paginationInfo.pageSize} of{" "}
                    {redemptionsListTotal} matching redemption(s).
                  </p>
                ) : null}
                {redemptionsQuery.error ? (
                  <p className="mb-2 text-sm text-destructive">
                    Error loading redemptions: {redemptionsQuery.error.message}
                  </p>
                ) : null}
                {redemptionsListLoading ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p>Loading redemptions…</p>
                  </div>
                ) : redemptions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {appliedActivityFilters?.redemptions
                      ? "No redemptions in the selected date range."
                      : "No redemptions yet"}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {redemptions.map((redemption) => (
                      <div
                        key={redemption.id}
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            {redemption.coupon?.store ? (
                              <p className="text-sm font-medium text-foreground mb-1">
                                {redemption.coupon.store.name}
                                {redemption.coupon.store.city
                                  ? ` - ${redemption.coupon.store.city}`
                                  : null}
                              </p>
                            ) : null}
                            {redemption.coupon?.discount ? (
                              <p className="text-sm text-muted-foreground mb-2">
                                {redemption.coupon.discount.title}
                              </p>
                            ) : null}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                              <div>
                                <span className="font-medium">Bill Total:</span>{" "}
                                {formatCurrency(redemption.billTotalCents)}
                              </div>
                              <div>
                                <span className="font-medium">Discount:</span>{" "}
                                {formatCurrency(redemption.discountCents)}
                              </div>
                              <div>
                                <span className="font-medium">Points:</span>{" "}
                                {redemption.pointsEarned || 0}
                              </div>
                              <div>
                                <span className="font-medium">Redeemed:</span>{" "}
                                {formatDate(redemption.redeemedAt)}
                              </div>
                            </div>
                            {redemption.comment ? (
                              <p className="text-xs text-muted-foreground mt-2">
                                Note: {redemption.comment}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  );
}
