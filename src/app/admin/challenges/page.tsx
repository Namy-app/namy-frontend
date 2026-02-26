"use client";

import {
  Trophy,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronUp,
  Star,
  ShoppingBag,
  Tag,
  Zap,
  Target,
  ImagePlus,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";

import {
  useChallenges,
  useCreateChallenge,
  useUpdateChallenge,
  useDeleteChallenge,
  useStores,
  useStoreDiscounts,
} from "@/domains/admin/hooks";
import {
  type Challenge,
  type CreateChallengeInput,
  EntityType,
} from "@/domains/admin/types";
import { useToast } from "@/hooks/use-toast";

// ── helpers ──────────────────────────────────────────────────────────────────

const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  [EntityType.STORES]: "Stores",
  [EntityType.DISCOUNTS]: "Discounts",
  [EntityType.REVIEWS]: "Reviews",
  [EntityType.LOGIN_STREAKS]: "Login Streaks",
  [EntityType.FIRST_VISIT_COUPON_REDEMPTION]: "First Visit",
  [EntityType.MURAL_POSTS]: "Mural Post",
  [EntityType.REFERRALS]: "Referrals",
};

const ENTITY_TYPE_ICONS: Record<
  EntityType,
  React.ComponentType<{ className?: string }>
> = {
  [EntityType.STORES]: ShoppingBag,
  [EntityType.DISCOUNTS]: Tag,
  [EntityType.REVIEWS]: Star,
  [EntityType.LOGIN_STREAKS]: Zap,
  [EntityType.FIRST_VISIT_COUPON_REDEMPTION]: ShoppingBag,
  [EntityType.MURAL_POSTS]: ImagePlus,
  [EntityType.REFERRALS]: Users,
};

const ENTITY_TYPE_COLORS: Record<EntityType, string> = {
  [EntityType.STORES]: "bg-blue-100 text-blue-700",
  [EntityType.DISCOUNTS]: "bg-green-100 text-green-700",
  [EntityType.REVIEWS]: "bg-yellow-100 text-yellow-700",
  [EntityType.LOGIN_STREAKS]: "bg-purple-100 text-purple-700",
  [EntityType.FIRST_VISIT_COUPON_REDEMPTION]: "bg-teal-100 text-teal-700",
  [EntityType.MURAL_POSTS]: "bg-pink-100 text-pink-700",
  [EntityType.REFERRALS]: "bg-indigo-100 text-indigo-700",
};

function formatDate(dateStr?: string) {
  if (!dateStr) {
    return "Never";
  }
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function isExpired(expiresAt?: string) {
  if (!expiresAt) {
    return false;
  }
  return new Date(expiresAt) < new Date();
}

// ── ChallengeFormModal ────────────────────────────────────────────────────────

interface ChallengeFormModalProps {
  challenge?: Challenge;
  onClose: () => void;
  onSubmit: (data: CreateChallengeInput) => void;
  isLoading: boolean;
}

function ChallengeFormModal({
  challenge,
  onClose,
  onSubmit,
  isLoading,
}: ChallengeFormModalProps) {
  const isEdit = !!challenge;

  const [name, setName] = useState(challenge?.name ?? "");
  const [entityType, setEntityType] = useState<EntityType>(
    (challenge?.entityType as EntityType) ?? EntityType.STORES
  );
  const [entityId, setEntityId] = useState(challenge?.entityId ?? "");
  const [entitySearch, setEntitySearch] = useState("");
  const [debouncedEntitySearch, setDebouncedEntitySearch] = useState("");
  const [entityDropdownOpen, setEntityDropdownOpen] = useState(false);
  // For DISCOUNTS: user first picks a store, then picks a discount from it
  const [discountStoreId, setDiscountStoreId] = useState("");
  const [discountStoreSearch, setDiscountStoreSearch] = useState("");
  const [debouncedDiscountStoreSearch, setDebouncedDiscountStoreSearch] =
    useState("");
  const [discountStoreDropdownOpen, setDiscountStoreDropdownOpen] =
    useState(false);
  const [discountDropdownOpen, setDiscountDropdownOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedEntitySearch(entitySearch), 350);
    return () => clearTimeout(t);
  }, [entitySearch]);

  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedDiscountStoreSearch(discountStoreSearch),
      350
    );
    return () => clearTimeout(t);
  }, [discountStoreSearch]);

  const showStorePicker =
    entityType === EntityType.STORES || entityType === EntityType.REVIEWS;
  const showDiscountPicker = entityType === EntityType.DISCOUNTS;

  const { data: storesData } = useStores(
    { includeAll: true, search: debouncedEntitySearch || undefined },
    { first: 50, page: 1 }
  );
  const stores = storesData?.data ?? [];

  // Store list for the discount store-picker step
  const { data: discountStoresData } = useStores(
    { includeAll: true, search: debouncedDiscountStoreSearch || undefined },
    { first: 50, page: 1 }
  );
  const discountStores = discountStoresData?.data ?? [];

  const { data: discountsData } = useStoreDiscounts(
    discountStoreId
      ? { storeId: discountStoreId, active: true }
      : { active: true },
    { first: 50, page: 1 },
    { enabled: showDiscountPicker }
  );
  const discounts = discountsData?.data ?? [];
  const [count, setCount] = useState(String(challenge?.count ?? 1));
  const [points, setPoints] = useState(String(challenge?.points ?? 10));
  const [expiresAt, setExpiresAt] = useState(
    challenge?.expiresAt
      ? new Date(challenge.expiresAt).toISOString().slice(0, 16)
      : ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      entityType,
      entityId: entityId.trim() || undefined,
      count: parseInt(count, 10),
      points: parseInt(points, 10),
      expiresAt: expiresAt || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900">
            {isEdit ? "Edit Challenge" : "New Challenge"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Challenge name</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. First 5 Redemptions"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          {/* Entity Type */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Type</p>
            <select
              value={entityType}
              onChange={(e) => {
                setEntityType(e.target.value as EntityType);
                setEntityId("");
              }}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              {Object.values(EntityType).map((et) => (
                <option key={et} value={et}>
                  {ENTITY_TYPE_LABELS[et]}
                </option>
              ))}
            </select>
            {entityType === EntityType.LOGIN_STREAKS && (
              <p className="mt-1 text-xs text-gray-400">
                Tracks consecutive daily logins.
              </p>
            )}
          </div>

          {/* Store picker — for STORES and REVIEWS */}
          {!!showStorePicker && (
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Store{" "}
                <span className="text-gray-400 font-normal text-xs">
                  (optional — blank = all stores)
                </span>
              </p>
              <input
                type="text"
                value={entitySearch}
                onChange={(e) => setEntitySearch(e.target.value)}
                onFocus={() => setEntityDropdownOpen(true)}
                onBlur={() =>
                  setTimeout(() => setEntityDropdownOpen(false), 150)
                }
                placeholder={
                  entityId
                    ? (stores.find((s) => s.id === entityId)?.name ??
                      "Store selected")
                    : "Search stores..."
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              {!!entityDropdownOpen && (
                <div className="mt-1.5 max-h-36 overflow-y-auto rounded-xl border border-gray-200 divide-y divide-gray-100 shadow-sm">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setEntityId("");
                      setEntitySearch("");
                      setEntityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      entityId === ""
                        ? "bg-rose-50 text-rose-600 font-semibold"
                        : "hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    All stores (global)
                  </button>
                  {stores.map((store) => (
                    <button
                      key={store.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setEntityId(store.id);
                        setEntitySearch("");
                        setEntityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        entityId === store.id
                          ? "bg-rose-50 text-rose-600 font-semibold"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {store.name}
                      {!!store.city && (
                        <span className="text-gray-400 ml-1.5 text-xs">
                          {store.city}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
              {!!entityId && (
                <p className="mt-1 text-xs text-gray-400 truncate">
                  {stores.find((s) => s.id === entityId)?.name}
                </p>
              )}
            </div>
          )}

          {/* Discount picker — for DISCOUNTS: pick store first, then discount */}
          {!!showDiscountPicker && (
            <div className="space-y-2">
              {/* Step 1: filter by store */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Filter by store{" "}
                  <span className="text-gray-400 font-normal text-xs">
                    (optional)
                  </span>
                </p>
                <input
                  type="text"
                  value={discountStoreSearch}
                  onChange={(e) => setDiscountStoreSearch(e.target.value)}
                  onFocus={() => setDiscountStoreDropdownOpen(true)}
                  onBlur={() =>
                    setTimeout(() => setDiscountStoreDropdownOpen(false), 150)
                  }
                  placeholder={
                    discountStoreId
                      ? (discountStores.find((s) => s.id === discountStoreId)
                          ?.name ?? "Store selected")
                      : "Search stores..."
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                {!!discountStoreDropdownOpen && (
                  <div className="mt-1.5 max-h-32 overflow-y-auto rounded-xl border border-gray-200 divide-y divide-gray-100 shadow-sm">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setDiscountStoreId("");
                        setDiscountStoreSearch("");
                        setEntityId("");
                        setDiscountStoreDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        discountStoreId === ""
                          ? "bg-rose-50 text-rose-600 font-semibold"
                          : "hover:bg-gray-50 text-gray-500"
                      }`}
                    >
                      All stores
                    </button>
                    {discountStores.map((store) => (
                      <button
                        key={store.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setDiscountStoreId(store.id);
                          setDiscountStoreSearch("");
                          setEntityId("");
                          setDiscountStoreDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          discountStoreId === store.id
                            ? "bg-rose-50 text-rose-600 font-semibold"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {store.name}
                        {!!store.city && (
                          <span className="text-gray-400 ml-1.5 text-xs">
                            {store.city}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2: pick the discount */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Discount{" "}
                  <span className="text-gray-400 font-normal text-xs">
                    (optional — blank = all discounts)
                  </span>
                </p>
                <div
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-300"
                  tabIndex={0}
                  onFocus={() => setDiscountDropdownOpen(true)}
                  onBlur={() =>
                    setTimeout(() => setDiscountDropdownOpen(false), 150)
                  }
                >
                  <span
                    className={entityId ? "text-gray-700" : "text-gray-400"}
                  >
                    {entityId
                      ? (discounts.find((d) => d.id === entityId)?.code ??
                        "Discount selected")
                      : "Select a discount..."}
                  </span>
                </div>
                {!!discountDropdownOpen && (
                  <div className="mt-1.5 max-h-36 overflow-y-auto rounded-xl border border-gray-200 divide-y divide-gray-100 shadow-sm">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setEntityId("");
                        setDiscountDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        entityId === ""
                          ? "bg-rose-50 text-rose-600 font-semibold"
                          : "hover:bg-gray-50 text-gray-500"
                      }`}
                    >
                      All discounts (global)
                    </button>
                    {discounts.map((discount) => (
                      <button
                        key={discount.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setEntityId(discount.id);
                          setDiscountDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          entityId === discount.id
                            ? "bg-rose-50 text-rose-600 font-semibold"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span className="font-medium">{discount.code}</span>
                        {!!discount.storeId && (
                          <span className="text-gray-400 ml-1.5 text-xs">
                            {
                              discountStores.find(
                                (s) => s.id === discount.storeId
                              )?.name
                            }
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Count & Points */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Required count</p>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                min={1}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Points reward</p>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                min={1}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
          </div>

          {/* Expires At */}
          <div>
            <p className="text-sm text-gray-500 mb-1">
              Expires at{" "}
              <span className="text-gray-400 text-xs font-normal">
                (optional)
              </span>
            </p>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              isLoading ||
              !name.trim() ||
              parseInt(count) < 1 ||
              parseInt(points) < 1
            }
            className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold rounded-xl py-3 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {isLoading
              ? "Saving..."
              : isEdit
                ? "Save Changes"
                : "Create Challenge"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── DeleteConfirmModal ────────────────────────────────────────────────────────

interface DeleteConfirmModalProps {
  challenge: Challenge;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

function DeleteConfirmModal({
  challenge,
  onClose,
  onConfirm,
  isLoading,
}: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900">Delete Challenge</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-bold text-gray-800">{challenge.name}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-rose-400 hover:bg-rose-500 text-white font-bold rounded-xl py-3 text-sm transition-colors disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ChallengeCard ─────────────────────────────────────────────────────────────

interface ChallengeCardProps {
  challenge: Challenge;
  onEdit: (c: Challenge) => void;
  onDelete: (c: Challenge) => void;
  onToggleActive: (c: Challenge) => void;
  isTogglingId: string | null;
}

function ChallengeCard({
  challenge,
  onEdit,
  onDelete,
  onToggleActive,
  isTogglingId,
}: ChallengeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const EntityIcon =
    ENTITY_TYPE_ICONS[challenge.entityType as EntityType] ?? Target;
  const entityColor =
    ENTITY_TYPE_COLORS[challenge.entityType as EntityType] ??
    "bg-gray-100 text-gray-700";
  const expired = isExpired(challenge.expiresAt);
  const toggling = isTogglingId === challenge.id;

  return (
    <div
      className={`bg-card rounded-xl shadow overflow-hidden transition-all ${!challenge.isActive || expired ? "opacity-70" : ""}`}
    >
      {/* Color bar */}
      <div className="h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500" />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="shrink-0 p-2.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg text-white shadow">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-foreground text-base leading-tight truncate">
                {challenge.name}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${entityColor}`}
                >
                  <EntityIcon className="w-3 h-3" />
                  {ENTITY_TYPE_LABELS[challenge.entityType as EntityType] ??
                    challenge.entityType}
                </span>
                {!challenge.isActive && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                    Inactive
                  </span>
                )}
                {expired ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                    Expired
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleActive(challenge)}
              disabled={toggling}
              title={challenge.isActive ? "Deactivate" : "Activate"}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            >
              {challenge.isActive ? (
                <ToggleRight className="w-5 h-5 text-green-500" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={() => onEdit(challenge)}
              title="Edit"
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <Pencil className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => onDelete(challenge)}
              title="Delete"
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Required Count</p>
            <p className="text-xl font-bold text-foreground">
              {challenge.count}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Points Reward</p>
            <p className="text-xl font-bold text-yellow-500">
              {challenge.points} pts
            </p>
          </div>
        </div>

        {/* Expand / collapse details */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="flex items-center">
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </span>
          <span>{expanded ? "Hide details" : "Show details"}</span>
        </button>

        {expanded ? (
          <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Entity ID</span>
              <span className="text-foreground font-mono truncate max-w-40">
                {challenge.entityId ?? "Global"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Expires</span>
              <span
                className={`font-medium ${expired ? "text-red-500" : "text-foreground"}`}
              >
                {formatDate(challenge.expiresAt)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Created</span>
              <span className="text-foreground">
                {formatDate(challenge.createdAt)}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminChallengesPage() {
  const { toast } = useToast();

  const [filterActive, setFilterActive] = useState<boolean | undefined>(
    undefined
  );
  const [filterEntityType, setFilterEntityType] = useState<
    EntityType | undefined
  >(undefined);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [challengeToEdit, setChallengeToEdit] = useState<Challenge | null>(
    null
  );
  const [challengeToDelete, setChallengeToDelete] = useState<Challenge | null>(
    null
  );
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const {
    data: challenges,
    isLoading,
    isError,
  } = useChallenges({
    isActive: filterActive,
    entityType: filterEntityType,
  });

  const createChallenge = useCreateChallenge();
  const updateChallenge = useUpdateChallenge();
  const deleteChallenge = useDeleteChallenge();

  // Stats
  const total = challenges?.length ?? 0;
  const active = challenges?.filter((c) => c.isActive).length ?? 0;
  const expired = challenges?.filter((c) => isExpired(c.expiresAt)).length ?? 0;
  const totalPoints = challenges?.reduce((sum, c) => sum + c.points, 0) ?? 0;

  const handleCreate = async (input: CreateChallengeInput) => {
    try {
      await createChallenge.mutateAsync(input);
      toast({
        title: "Challenge Created",
        description: `"${input.name}" is now live.`,
      });
      setShowCreateModal(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to create challenge.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (input: CreateChallengeInput) => {
    if (!challengeToEdit) {
      return;
    }
    try {
      await updateChallenge.mutateAsync({ id: challengeToEdit.id, input });
      toast({
        title: "Challenge Updated",
        description: `"${input.name}" has been updated.`,
      });
      setChallengeToEdit(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to update challenge.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!challengeToDelete) {
      return;
    }
    try {
      await deleteChallenge.mutateAsync(challengeToDelete.id);
      toast({
        title: "Challenge Deleted",
        description: `"${challengeToDelete.name}" was removed.`,
      });
      setChallengeToDelete(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete challenge.",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (challenge: Challenge) => {
    setTogglingId(challenge.id);
    try {
      await updateChallenge.mutateAsync({
        id: challenge.id,
        input: { isActive: !challenge.isActive },
      });
      toast({
        title: challenge.isActive
          ? "Challenge Deactivated"
          : "Challenge Activated",
        description: `"${challenge.name}" is now ${challenge.isActive ? "inactive" : "active"}.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to toggle challenge.",
        variant: "destructive",
      });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Challenges
          </h1>
          <p className="text-muted-foreground">
            Create and manage gamification challenges for users
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold rounded-lg shadow hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Challenge
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Challenges",
            value: String(total),
            color: "text-foreground",
          },
          { label: "Active", value: String(active), color: "text-green-600" },
          { label: "Expired", value: String(expired), color: "text-red-500" },
          {
            label: "Total Points Pool",
            value: `${totalPoints} pts`,
            color: "text-yellow-500",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-lg shadow p-5">
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-sm font-medium text-muted-foreground">
          Filter:
        </span>

        {/* Active filter */}
        <div className="flex rounded-lg overflow-hidden border border-border text-sm">
          {[
            { label: "All", value: undefined },
            { label: "Active", value: true },
            { label: "Inactive", value: false },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => setFilterActive(opt.value)}
              className={`px-3 py-1.5 font-medium transition-colors ${
                filterActive === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Entity type filter */}
        <select
          value={filterEntityType ?? ""}
          onChange={(e) =>
            setFilterEntityType(
              e.target.value ? (e.target.value as EntityType) : undefined
            )
          }
          className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">All Types</option>
          {Object.values(EntityType).map((et) => (
            <option key={et} value={et}>
              {ENTITY_TYPE_LABELS[et]}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl shadow h-48 animate-pulse"
            />
          ))}
        </div>
      ) : null}

      {!!isError && (
        <div className="text-center py-16 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Failed to load challenges</p>
          <p className="text-sm mt-1">Check your connection and try again.</p>
        </div>
      )}

      {!isLoading && !isError && challenges?.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No challenges found</p>
          <p className="text-sm mt-1">
            Create your first challenge to get started.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold rounded-lg shadow hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Challenge
          </button>
        </div>
      )}

      {!isLoading && !isError && !!challenges?.length && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onEdit={setChallengeToEdit}
              onDelete={setChallengeToDelete}
              onToggleActive={(c) => void handleToggleActive(c)}
              isTogglingId={togglingId}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {!!showCreateModal && (
        <ChallengeFormModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(input) => void handleCreate(input)}
          isLoading={createChallenge.isPending}
        />
      )}

      {/* Edit Modal */}
      {!!challengeToEdit && (
        <ChallengeFormModal
          challenge={challengeToEdit}
          onClose={() => setChallengeToEdit(null)}
          onSubmit={(input) => void handleEdit(input)}
          isLoading={updateChallenge.isPending}
        />
      )}

      {/* Delete Confirm */}
      {!!challengeToDelete && (
        <DeleteConfirmModal
          challenge={challengeToDelete}
          onClose={() => setChallengeToDelete(null)}
          onConfirm={() => void handleDelete()}
          isLoading={deleteChallenge.isPending}
        />
      )}
    </div>
  );
}
