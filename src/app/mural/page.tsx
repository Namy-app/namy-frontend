"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Heart,
  MessageCircle,
  Award,
  ArrowLeft,
  Search,
  ImageIcon,
  Loader2,
  AlertCircle,
  Trash2,
  Send,
  X,
  Plus,
  Camera,
  ChevronDown,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import {
  useMuralFeed,
  useMyMuralPosts,
  useLikeMuralPost,
  useUnlikeMuralPost,
  useDeleteMuralPost,
  useMuralPostComments,
  useCreateMuralComment,
  useDeleteMuralComment,
  useCreateMuralPost,
} from "@/domains/mural/hooks";
import { BasicLayout } from "@/layouts/BasicLayout";
import type { MuralPost, MuralComment, Store } from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import { GET_ALL_STORES_QUERY } from "@/lib/graphql-queries";
import { useAuthStore } from "@/store/useAuthStore";

const BADGE_LABELS: Record<string, string> = {
  TOP_POSTER: "🏆 Top Poster",
  MAS_LIKES: "❤️ Más Likes",
};

// ==================== Comments Modal ====================

function CommentsModal({
  post,
  onClose,
}: {
  post: MuralPost;
  onClose: () => void;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const [commentText, setCommentText] = useState("");

  const { data, isLoading } = useMuralPostComments(post.id);
  const createComment = useCreateMuralComment();
  const deleteComment = useDeleteMuralComment();

  const handleSubmit = () => {
    const content = commentText.trim();
    if (!content || !isAuthenticated) {
      return;
    }
    createComment.mutate(
      { postId: post.id, content },
      { onSuccess: () => setCommentText("") }
    );
  };

  return (
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-semibold text-sm">
            {post.store?.name ?? "Post"} – Comments
          </span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {!!isLoading && (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {!isLoading && !data?.comments.length && (
            <p className="text-center text-sm text-muted-foreground py-6">
              No comments yet. Be the first!
            </p>
          )}
          {data?.comments.map((comment: MuralComment) => (
            <div key={comment.id} className="flex gap-3 group">
              <img
                src={
                  comment.user?.avatarUrl ??
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userId}`
                }
                alt={comment.user?.displayName ?? "User"}
                className="w-8 h-8 rounded-full shrink-0 object-cover"
              />
              <div className="flex-1 bg-muted/50 rounded-xl px-3 py-2">
                <p className="text-xs font-semibold text-foreground">
                  {comment.user?.displayName ?? "User"}
                </p>
                <p className="text-sm text-foreground/90 mt-0.5">
                  {comment.content}
                </p>
              </div>
              {user?.id === comment.userId && (
                <button
                  onClick={() =>
                    deleteComment.mutate({ id: comment.id, postId: post.id })
                  }
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500"
                  aria-label="Delete comment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        {isAuthenticated ? (
          <div className="px-4 py-3 border-t border-border flex gap-2 items-center">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Write a comment…"
              maxLength={1000}
              className="flex-1 bg-muted/50 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleSubmit}
              disabled={!commentText.trim() || createComment.isPending}
              className="p-2 bg-primary text-primary-foreground rounded-full disabled:opacity-50 transition-opacity"
              aria-label="Send"
            >
              {createComment.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        ) : (
          <div className="px-4 py-3 border-t border-border text-center text-sm text-muted-foreground">
            <Link href="/auth" className="text-primary underline">
              Log in
            </Link>{" "}
            to leave a comment.
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== Post Card ====================

function PostCard({ post }: { post: MuralPost }) {
  const { user, isAuthenticated } = useAuthStore();
  const [liked, setLiked] = useState(post.isLikedByMe ?? false);
  const [localLikes, setLocalLikes] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);

  const likeMutation = useLikeMuralPost();
  const unlikeMutation = useUnlikeMuralPost();
  const deleteMutation = useDeleteMuralPost();

  // Prevent any action while a like/unlike request is in flight
  const isMutating = likeMutation.isPending || unlikeMutation.isPending;

  const handleLike = () => {
    if (!isAuthenticated || isMutating) {
      return;
    }
    if (liked) {
      setLiked(false);
      setLocalLikes((p) => Math.max(0, p - 1));
      unlikeMutation.mutate(post.id, {
        onError: () => {
          setLiked(true);
          setLocalLikes((p) => p + 1);
        },
      });
    } else {
      setLiked(true);
      setLocalLikes((p) => p + 1);
      likeMutation.mutate(post.id, {
        onError: () => {
          setLiked(false);
          setLocalLikes((p) => Math.max(0, p - 1));
        },
      });
    }
  };

  const isOwner = user?.id === post.userId;

  return (
    <>
      <div className="break-inside-avoid mb-4">
        <div className="bg-card rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          {/* Image — natural aspect ratio for Pinterest-style height variety */}
          <div className="relative cursor-pointer">
            <img
              src={post.imageUrl}
              alt={post.store?.name ?? "Mural post"}
              className="w-full h-auto block"
            />

            {/* Poster */}
            <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <img
                className="w-6 h-6 rounded-full object-cover"
                src={
                  post.user?.avatarUrl ??
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}`
                }
                alt={post.user?.displayName ?? "User"}
              />
              <span className="text-white text-sm font-medium">
                {post.user?.displayName ?? "User"}
              </span>
            </div>

            {/* Badge */}
            {!!post.badge && (
              <div className="absolute top-2 right-2">
                {post.badge === "mas_likes" ? (
                  <span
                    className="text-sm font-semibold text-white"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}
                  >
                    {BADGE_LABELS[post.badge]}
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground">
                    {BADGE_LABELS[post.badge] ?? post.badge}
                  </span>
                )}
              </div>
            )}

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="text-white font-semibold text-sm">
                {post.store?.name ?? "Restaurant"}
              </p>
              {!!post.store?.address && (
                <p className="text-white/80 text-xs">{post.store.address}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 group disabled:opacity-50"
                aria-label="Like"
                disabled={!isAuthenticated || isMutating}
              >
                {isMutating ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      liked
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground group-hover:text-red-500"
                    }`}
                  />
                )}
                <span className="text-sm text-muted-foreground">
                  {localLikes}
                </span>
              </button>
              <button
                onClick={() => setShowComments(true)}
                className="flex items-center gap-1 group"
                aria-label="Comments"
              >
                <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm text-muted-foreground">
                  {post.commentsCount ?? 0}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Award className="w-4 h-4 text-primary" />
                <span>+{post.points} pts</span>
              </div>
              {!!isOwner && (
                <button
                  onClick={() => deleteMutation.mutate(post.id)}
                  disabled={deleteMutation.isPending}
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                  aria-label="Delete post"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {!!showComments && (
        <CommentsModal post={post} onClose={() => setShowComments(false)} />
      )}
    </>
  );
}

// ==================== Create Post Modal ====================

function CreatePostModal({ onClose }: { onClose: () => void }) {
  const { accessToken } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [storeSearch, setStoreSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const createPost = useCreateMuralPost();

  const { data: storesData } = useQuery({
    queryKey: ["stores-search", storeSearch],
    queryFn: async () => {
      const res = await graphqlRequest<{ stores: { data: Store[] } }>(
        GET_ALL_STORES_QUERY,
        {
          filters: storeSearch.length > 0 ? { search: storeSearch } : undefined,
          pagination: { page: 1, first: 10 },
        }
      );
      return res.stores.data;
    },
    staleTime: 30 * 1000,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("Only JPG, PNG, and WebP images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5MB.");
      return;
    }

    setUploadError(null);
    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/graphql"
      ).replace("/graphql", "");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${baseUrl}/upload/mural-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }
      const json = (await res.json()) as { url: string };
      setImageUrl(json.url);
    } catch {
      setUploadError("Failed to upload image. Please try again.");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!imageUrl || !selectedStore) {
      return;
    }
    createPost.mutate(
      { storeId: selectedStore.id, imageUrl },
      { onSuccess: onClose }
    );
  };

  const canSubmit =
    !!imageUrl && !!selectedStore && !isUploading && !createPost.isPending;

  return (
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <span className="font-semibold">New Mural Post</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Image picker */}
          <div>
            <label className="block text-sm font-medium mb-2">Photo</label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-border bg-muted/40 hover:border-primary hover:bg-muted/70 transition-colors overflow-hidden"
              style={{ minHeight: 180 }}
            >
              {preview ? (
                <div className="relative w-full" style={{ minHeight: 180 }}>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full object-cover rounded-xl"
                    style={{ maxHeight: 280 }}
                  />
                  {!!isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                  {!!imageUrl && !isUploading && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Uploaded
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
                  <Camera className="w-8 h-8" />
                  <span className="text-sm">Tap to choose a photo</span>
                  <span className="text-xs">JPG, PNG, WebP · max 5MB</span>
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                void handleFileChange(e);
              }}
            />
            {!!uploadError && (
              <p className="text-xs text-red-500 mt-1">{uploadError}</p>
            )}
          </div>

          {/* Store search */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2">
              Restaurant / Store
            </label>
            {selectedStore ? (
              <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-3 py-2.5">
                {!!selectedStore.imageUrl && (
                  <img
                    src={selectedStore.imageUrl}
                    alt={selectedStore.name}
                    className="w-8 h-8 rounded-lg object-cover shrink-0"
                  />
                )}
                <span className="text-sm font-medium flex-1">
                  {selectedStore.name}
                </span>
                <button
                  onClick={() => {
                    setSelectedStore(null);
                    setStoreSearch("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Clear store"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={storeSearch}
                  onChange={(e) => {
                    setStoreSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  placeholder="Search restaurant or store…"
                  className="w-full bg-muted/50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary pr-8"
                />
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />

                {!!showDropdown && !!storesData && storesData.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                    {storesData.map((store) => (
                      <button
                        key={store.id}
                        type="button"
                        onClick={() => {
                          setSelectedStore(store);
                          setStoreSearch("");
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent text-left transition-colors"
                      >
                        {!!store.imageUrl && (
                          <img
                            src={store.imageUrl}
                            alt={store.name}
                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium">{store.name}</p>
                          {!!store.address && (
                            <p className="text-xs text-muted-foreground">
                              {store.address}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border shrink-0">
          {!!createPost.isError && (
            <p className="text-xs text-red-500 mb-2">
              {createPost.error?.message}
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
          >
            {createPost.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Posting…
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Share to Mural
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== My Posts Modal ====================

const STATUS_PILL: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Awaiting approval",
    className: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/15 text-red-600 border-red-500/30",
  },
};

function MyPostsModal({ onClose }: { onClose: () => void }) {
  const { data, isLoading } = useMyMuralPosts(1, true, 100);
  const posts = data?.posts ?? [];

  return (
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <span className="font-semibold">My Pending Posts</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {!!isLoading && (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && posts.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
              <Clock className="w-8 h-8" />
              <p className="text-sm">No pending or rejected posts.</p>
            </div>
          )}

          {posts.map((post) => {
            const pill = STATUS_PILL[post.status];
            return (
              <div
                key={post.id}
                className="flex gap-3 items-start bg-muted/40 rounded-xl p-3"
              >
                <img
                  src={post.imageUrl}
                  alt={post.store?.name ?? "Post"}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {post.store?.name ?? "Store"}
                  </p>
                  {!!post.store?.address && (
                    <p className="text-xs text-muted-foreground truncate">
                      {post.store.address}
                    </p>
                  )}
                  {!!pill && (
                    <span
                      className={`mt-1.5 inline-flex text-xs font-medium px-2 py-0.5 rounded-full border ${pill.className}`}
                    >
                      {pill.label}
                    </span>
                  )}
                  {post.status === "rejected" && !!post.rejectionNote && (
                    <p className="mt-1 text-xs text-muted-foreground italic">
                      &ldquo;{post.rejectionNote}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==================== Page ====================

export default function CityMuralPage() {
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { isAuthenticated } = useAuthStore();

  // Debounce the search input by 400ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Public feed — all approved posts, optionally filtered by search
  const { data, isLoading, isError, error } = useMuralFeed({
    page,
    pageSize: 20,
    search: debouncedSearch || undefined,
  });

  // Pending count for badge on the clock icon
  const { data: myData } = useMyMuralPosts(1, isAuthenticated, 100);
  const pendingCount =
    myData?.posts.filter((p) => p.status === "pending").length ?? 0;

  return (
    <BasicLayout>
      {/* Header */}
      <header className="sticky top-14 z-40 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3 mt-14">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <Link
            href="/"
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">City Mural 🏙️</h1>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setShowSearch((v) => !v);
                if (showSearch) {
                  setSearchInput("");
                  setPage(1);
                }
              }}
              className={`p-2 hover:bg-accent rounded-full transition-colors ${showSearch ? "text-primary" : ""}`}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            {!!isAuthenticated && (
              <>
                <button
                  onClick={() => setShowMyPosts(true)}
                  className="relative p-2 hover:bg-accent rounded-full transition-colors"
                  aria-label="My pending posts"
                >
                  <Clock className="w-5 h-5" />
                  {pendingCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setShowCreate(true)}
                  className="p-2 hover:bg-accent rounded-full transition-colors text-primary"
                  aria-label="Create post"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search bar */}
        {!!showSearch && (
          <div className="max-w-5xl mx-auto mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                autoFocus
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by store or user…"
                className="w-full bg-muted/60 rounded-xl pl-9 pr-9 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
              {!!searchInput && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {!!isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!!isError && (
          <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-sm">
              {error?.message ?? "Failed to load mural feed."}
            </p>
          </div>
        )}

        {!isLoading && !isError && !data?.posts.length && (
          <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
            <ImageIcon className="w-10 h-10" />
            <p className="text-sm">No posts yet. Be the first to share!</p>
          </div>
        )}

        {!!data?.posts && data.posts.length > 0 && (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {data.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {!!(data.hasMore || page > 1) && (
              <div className="flex justify-center gap-4 mt-6">
                {page > 1 && (
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 rounded-lg bg-card border border-border text-sm hover:bg-accent transition-colors"
                  >
                    Previous
                  </button>
                )}
                {!!data.hasMore && (
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
                  >
                    Load more
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {!!showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}
      {!!showMyPosts && <MyPostsModal onClose={() => setShowMyPosts(false)} />}
    </BasicLayout>
  );
}
