"use client";

import { formatDistanceToNow } from "date-fns";
import { Star, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

import { useAdminReviews, useAdminDeleteReview } from "@/domains/admin/hooks";
import { type AdminReview } from "@/domains/admin/types";
import { useToast } from "@/hooks/use-toast";

// ─── Star Rating ─────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-gray-500 font-medium">{rating}/5</span>
    </div>
  );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────

function ConfirmDeleteModal({
  review,
  onConfirm,
  onClose,
  isLoading,
}: {
  review: AdminReview;
  onConfirm: () => void;
  onClose: () => void;
  isLoading: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Delete Review</h3>
            <p className="text-sm text-gray-500">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 mb-5 text-sm text-gray-700">
          <p className="font-medium mb-1">&quot;{review.title}&quot;</p>
          {review.description ? (
            <p className="text-gray-500 line-clamp-2">{review.description}</p>
          ) : null}
          <p className="mt-2 text-xs text-gray-400">Store: {review.storeId}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {isLoading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({
  review,
  onDelete,
}: {
  review: AdminReview;
  onDelete: (review: AdminReview) => void;
}) {
  const timeAgo = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{review.title}</p>
          <StarRating rating={review.rating} />
        </div>
        <button
          onClick={() => onDelete(review)}
          className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Delete review"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {review.description ? (
        <p className="text-sm text-gray-600 line-clamp-3">
          {review.description}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 border-t border-gray-50 text-xs text-gray-400">
        <span>User: {review.userId}</span>
        <span>Store: {review.storeId}</span>
        <span className="ml-auto">{timeAgo}</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

export default function ReviewsModerationPage() {
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [reviewToDelete, setReviewToDelete] = useState<AdminReview | null>(
    null
  );

  const { data, isLoading, isError } = useAdminReviews({
    page,
    pageSize: PAGE_SIZE,
  });

  const deleteMutation = useAdminDeleteReview();

  const handleConfirmDelete = () => {
    if (!reviewToDelete) {
      return;
    }

    deleteMutation.mutate(
      { id: reviewToDelete.id },
      {
        onSuccess: () => {
          toast({
            title: "Review deleted",
            description: "The review has been removed.",
          });
          setReviewToDelete(null);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Could not delete the review. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const pagination = data?.paginationInfo;
  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
        <p className="text-muted-foreground mt-1">
          Remove malicious or inappropriate user reviews.
        </p>
      </div>

      {!isLoading && !isError && (
        <p className="text-sm text-muted-foreground mb-4">
          {total} review{total !== 1 ? "s" : ""}
        </p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="h-40 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-muted-foreground">
          Failed to load reviews. Please refresh and try again.
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No reviews found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onDelete={setReviewToDelete}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {reviewToDelete && typeof window !== "undefined"
        ? createPortal(
            <ConfirmDeleteModal
              review={reviewToDelete}
              onConfirm={handleConfirmDelete}
              onClose={() => setReviewToDelete(null)}
              isLoading={deleteMutation.isPending}
            />,
            document.body
          )
        : null}
    </div>
  );
}
