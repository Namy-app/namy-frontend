"use client";

import {
  Check,
  X,
  Search,
  Clock,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";

import {
  useMuralModerationQueue,
  useModerateMuralPost,
} from "@/domains/admin/hooks";
import { MuralPostStatus, type AdminMuralPost } from "@/domains/admin/types";
import { useToast } from "@/hooks/use-toast";

// ─── Status badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: MuralPostStatus }) {
  const map = {
    [MuralPostStatus.PENDING]: "bg-amber-100 text-amber-700 border-amber-200",
    [MuralPostStatus.APPROVED]: "bg-green-100 text-green-700 border-green-200",
    [MuralPostStatus.REJECTED]: "bg-red-100 text-red-700 border-red-200",
  };
  const labels = {
    [MuralPostStatus.PENDING]: "Pending",
    [MuralPostStatus.APPROVED]: "Approved",
    [MuralPostStatus.REJECTED]: "Rejected",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[status]}`}
    >
      {labels[status]}
    </span>
  );
}

// ─── Rejection modal ────────────────────────────────────────────────────────

function RejectModal({
  post,
  onConfirm,
  onCancel,
  isPending,
}: {
  post: AdminMuralPost;
  onConfirm: (note: string) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [note, setNote] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-1">Reject post</h3>
        <p className="text-sm text-gray-500 mb-4">
          Optionally add a note to explain why this post was rejected. The user
          will see this message.
        </p>

        {/* Post thumbnail */}
        <div className="relative h-32 w-full rounded-xl overflow-hidden bg-gray-100 mb-4">
          <Image
            src={post.imageUrl}
            alt="Post"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Rejection reason (optional, max 500 chars)"
          maxLength={500}
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-300 mb-4"
        />

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 text-gray-700 font-semibold rounded-xl py-2.5 text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(note.trim())}
            disabled={isPending}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl py-2.5 text-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            {isPending ? "Rejecting…" : "Reject post"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Image lightbox ─────────────────────────────────────────────────────────

function ImageLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <div
        className="relative max-w-3xl max-h-[90vh] w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt="Enlarged mural post"
          fill
          className="object-contain"
          unoptimized
        />
      </div>
    </div>
  );
}

// ─── Post card ──────────────────────────────────────────────────────────────

function PostCard({
  post,
  onApprove,
  onReject,
  isProcessing,
}: {
  post: AdminMuralPost;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const initials = (post.user?.displayName ?? post.userId)
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {lightboxOpen && !imgError && typeof window !== "undefined"
        ? createPortal(
            <ImageLightbox
              src={post.imageUrl}
              onClose={() => setLightboxOpen(false)}
            />,
            document.body
          )
        : null}
      {/* Image */}
      <div
        className="relative h-50 bg-gray-100 cursor-zoom-in group"
        onClick={() => !imgError && setLightboxOpen(true)}
      >
        {!imgError ? (
          <>
            <Image
              src={post.imageUrl}
              alt="Mural post"
              fill
              className="object-cover"
              unoptimized
              onError={() => setImgError(true)}
            />
            {/* Zoom hint on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <ImageIcon className="w-12 h-12" />
          </div>
        )}
        {/* Status badge overlay */}
        <div
          className="absolute top-2 right-2"
          onClick={(e) => e.stopPropagation()}
        >
          <StatusBadge status={post.status} />
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-500 shrink-0">
            {post.user?.avatarUrl && !post.user.avatarUrl.startsWith("http") ? (
              <span>{post.user.avatarUrl}</span>
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {post.user?.displayName ?? "Unknown user"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {post.user?.email ?? post.userId}
            </p>
          </div>
        </div>

        {/* Store */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="font-semibold truncate">
            🏪 {post.store?.name ?? post.storeId}
          </span>
          {post.store?.city ? (
            <span className="text-gray-400">· {post.store.city}</span>
          ) : null}
        </div>

        {/* Date */}
        <p className="text-xs text-gray-400">
          <Clock className="inline w-3 h-3 mr-1 -mt-0.5" />
          {new Date(post.createdAt).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {/* Rejection note (if any) */}
        {post.rejectionNote ? (
          <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
            Note: {post.rejectionNote}
          </p>
        ) : null}

        {/* Actions — only for pending */}
        {post.status === MuralPostStatus.PENDING && (
          <div className="flex gap-2 mt-auto pt-2">
            <button
              onClick={onApprove}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl py-2 disabled:opacity-50 transition-colors"
            >
              <Check className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={onReject}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-sm font-semibold rounded-xl py-2 disabled:opacity-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

export default function MuralModerationPage() {
  const { toast } = useToast();

  const [statusFilter, setStatusFilter] = useState<MuralPostStatus>(
    MuralPostStatus.PENDING
  );
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [rejectTarget, setRejectTarget] = useState<AdminMuralPost | null>(null);

  const { data, isLoading } = useMuralModerationQueue({
    status: statusFilter,
    page,
    pageSize: PAGE_SIZE,
  });

  const moderateMutation = useModerateMuralPost();

  const posts = data?.posts ?? [];
  const total = data?.total ?? 0;
  const hasMore = data?.hasMore ?? false;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Client-side search filter (by user name, email, store name)
  const filtered = search
    ? posts.filter((p) => {
        const q = search.toLowerCase();
        return (
          p.user?.displayName?.toLowerCase().includes(q) ||
          p.user?.email?.toLowerCase().includes(q) ||
          p.store?.name?.toLowerCase().includes(q) ||
          p.store?.city?.toLowerCase().includes(q)
        );
      })
    : posts;

  function handleApprove(post: AdminMuralPost) {
    moderateMutation.mutate(
      { id: post.id, input: { status: MuralPostStatus.APPROVED } },
      {
        onSuccess: () =>
          toast({
            title: "Post approved",
            description: "Mural post is now live.",
          }),
        onError: () =>
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not approve post.",
          }),
      }
    );
  }

  function handleRejectConfirm(note: string) {
    if (!rejectTarget) {
      return;
    }
    moderateMutation.mutate(
      {
        id: rejectTarget.id,
        input: {
          status: MuralPostStatus.REJECTED,
          ...(note ? { rejectionNote: note } : {}),
        },
      },
      {
        onSuccess: () => {
          setRejectTarget(null);
          toast({ title: "Post rejected" });
        },
        onError: () =>
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not reject post.",
          }),
      }
    );
  }

  const STATUS_TABS: {
    label: string;
    value: MuralPostStatus;
    color: string;
  }[] = [
    {
      label: "Pending",
      value: MuralPostStatus.PENDING,
      color: "text-amber-600",
    },
    {
      label: "Approved",
      value: MuralPostStatus.APPROVED,
      color: "text-green-600",
    },
    {
      label: "Rejected",
      value: MuralPostStatus.REJECTED,
      color: "text-red-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Mural Moderation</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve or reject user-submitted mural posts.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
              setSearch("");
              setSearchInput("");
            }}
            className={`bg-white rounded-2xl border p-4 text-left transition-all hover:shadow-md ${
              statusFilter === tab.value
                ? "border-primary shadow-md"
                : "border-gray-100"
            }`}
          >
            <p className="text-sm text-muted-foreground font-medium">
              {tab.label}
            </p>
            <p className={`text-2xl font-bold mt-1 ${tab.color}`}>
              {statusFilter === tab.value ? total : "—"}
            </p>
          </button>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch(searchInput.trim());
                setPage(1);
              }
            }}
            placeholder="Search by user, email or store… (Enter to apply)"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {searchInput ? (
            <button
              onClick={() => {
                setSearchInput("");
                setSearch("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 shrink-0">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
                setSearch("");
                setSearchInput("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                statusFilter === tab.value
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-semibold">
            {search
              ? "No posts match your search."
              : `No ${statusFilter} posts.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onApprove={() => handleApprove(post)}
              onReject={() => setRejectTarget(post)}
              isProcessing={
                moderateMutation.isPending
                  ? moderateMutation.variables?.id === post.id
                  : false
              }
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!search && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Reject modal */}
      {rejectTarget ? (
        <RejectModal
          post={rejectTarget}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectTarget(null)}
          isPending={moderateMutation.isPending}
        />
      ) : null}
    </div>
  );
}
