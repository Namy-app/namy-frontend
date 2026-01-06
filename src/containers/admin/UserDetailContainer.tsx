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
} from "lucide-react";
import { useRouter } from "next/navigation";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useUserDetailsWithActivity } from "@/domains/admin/hooks";
import { UserRole } from "@/domains/admin/types";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

export const dynamic = "error";
export const dynamicParams = false;

interface PageProps {
  userId?: string;
}

export default function UserDetailContainer({ userId = "" }: PageProps) {
  const router = useRouter();

  const {
    data: userDetails,
    isLoading,
    error,
  } = useUserDetailsWithActivity(userId);

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

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading user details...</p>
            </div>
          ) : null}

          {error ? (
            <Card className="p-6 text-center">
              <p className="text-destructive">
                Error loading user details: {error.message}
              </p>
            </Card>
          ) : null}

          {userDetails ? (
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
                        {userDetails.displayName || "No name"}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            userDetails.role === UserRole.ADMIN ||
                            userDetails.role === UserRole.SUPER_ADMIN
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {userDetails.role}
                        </span>
                        {userDetails.verified ? (
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
                            userDetails.active
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              userDetails.active ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {userDetails.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{userDetails.email}</span>
                  </div>
                  {userDetails.phone ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{userDetails.phone}</span>
                    </div>
                  ) : null}
                  {userDetails.city || userDetails.country ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {userDetails.city}
                        {userDetails.country
                          ? `, ${userDetails.country}`
                          : null}
                      </span>
                    </div>
                  ) : null}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDate(userDetails.createdAt)}</span>
                  </div>
                  {userDetails.lastSeen ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>👁️</span>
                      <span>Last seen {formatDate(userDetails.lastSeen)}</span>
                    </div>
                  ) : null}
                  {userDetails.referralCode ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>🔗</span>
                      <span>Referral: {userDetails.referralCode}</span>
                    </div>
                  ) : null}
                </div>
              </Card>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Level</p>
                      <p className="text-3xl font-bold text-foreground">
                        {userDetails.level}
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
                        {userDetails.monthlyUsageCount}
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
                        {userDetails.totalCoupons}
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
                        {userDetails.totalRedemptions}
                      </p>
                    </div>
                    <Receipt className="w-8 h-8 text-services" />
                  </div>
                </Card>
              </div>

              {/* Coupons */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Coupons ({userDetails.coupons.length})
                </h3>
                {userDetails.coupons.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No coupons generated yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {userDetails.coupons.map((coupon) => (
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
                                  ? `${coupon.discount.value}%`
                                  : `$${coupon.discount.value}`}{" "}
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

              {/* Redemptions */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Redemptions ({userDetails.redemptions.length})
                </h3>
                {userDetails.redemptions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No redemptions yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {userDetails.redemptions.map((redemption) => (
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
