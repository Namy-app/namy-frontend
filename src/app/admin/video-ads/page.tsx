"use client";

import { Upload, Video, Trash2, Edit, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { UserRole } from "@/domains/admin/types";
import {
  useGetAllVideoAds,
  useRequestVideoUpload,
  useCreateVideoAd,
  useUpdateVideoAd,
  useDeleteVideoAd,
} from "@/domains/video-ads/hooks";
import type { VideoAd, CreateVideoAdInput } from "@/domains/video-ads/types";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";

export default function VideoAdsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingAd, setEditingAd] = useState<VideoAd | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Video file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: 1,
  });

  // Hooks
  const { data: ads, isLoading } = useGetAllVideoAds();
  const requestUploadMutation = useRequestVideoUpload();
  const createMutation = useCreateVideoAd();
  const updateMutation = useUpdateVideoAd();
  const deleteMutation = useDeleteVideoAd();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auth check
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    if (!user) {
      router.replace("/auth");
      return;
    }

    if (user.role !== UserRole.SUPER_ADMIN) {
      router.replace("/admin");
    }
  }, [user, isMounted, router]);

  if (!isMounted || !user || user.role !== UserRole.SUPER_ADMIN) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Error",
        description: "Please select a valid video file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "File size must be less than 20MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setVideoPreview(url);

    // Get video duration
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      setVideoDuration(Math.floor(video.duration));
      URL.revokeObjectURL(video.src);
    };
    video.src = url;
  };

  const handleUploadAndCreate = async () => {
    if (!selectedFile || !formData.title || videoDuration === 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields and select a video",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Step 1: Request presigned URL
      const uploadData = await requestUploadMutation.mutateAsync({
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type,
      });

      setUploadProgress(20);

      // Step 2: Upload file directly to S3
      const uploadResponse = await fetch(uploadData.uploadUrl, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload video to S3");
      }

      setUploadProgress(70);

      // Step 3: Create video ad record
      const videoAdInput: CreateVideoAdInput = {
        videoKey: uploadData.videoKey,
        title: formData.title,
        description: formData.description || undefined,
        duration: videoDuration,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type,
        priority: formData.priority,
      };

      await createMutation.mutateAsync(videoAdInput);

      setUploadProgress(100);

      toast({
        title: "Success",
        description: "Video ad created successfully",
      });

      // Reset form
      setShowUploadForm(false);
      setSelectedFile(null);
      setVideoPreview(null);
      setFormData({ title: "", description: "", priority: 1 });
      setVideoDuration(0);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUpdate = async () => {
    if (!editingAd) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: editingAd.id,
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority,
      });

      toast({
        title: "Success",
        description: "Video ad updated successfully",
      });

      setEditingAd(null);
      setFormData({ title: "", description: "", priority: 1 });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update video ad",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video ad?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Success",
        description: "Video ad deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete video ad",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (ad: VideoAd) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description || "",
      priority: ad.priority,
    });
    setShowUploadForm(true);
  };

  const handleToggleActive = async (ad: VideoAd) => {
    try {
      await updateMutation.mutateAsync({
        id: ad.id,
        active: !ad.active,
      });

      toast({
        title: "Success",
        description: `Video ad ${ad.active ? "deactivated" : "activated"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update video ad",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return bytes + " B";
    }
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    }
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Video Ads Management
            </h1>
            <p className="text-muted-foreground">
              Upload and manage video advertisements for the platform
            </p>
          </div>
          <button
            onClick={() => router.push("/admin")}
            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Upload/Edit Form */}
        {showUploadForm ? (
          <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {editingAd ? "Edit Video Ad" : "Upload New Video Ad"}
              </h2>
              <button
                onClick={() => {
                  setShowUploadForm(false);
                  setEditingAd(null);
                  setSelectedFile(null);
                  setVideoPreview(null);
                  setFormData({ title: "", description: "", priority: 1 });
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Video Upload (only for new ads) */}
              {!editingAd && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Video File *
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    {videoPreview ? (
                      <div className="space-y-4">
                        <video
                          src={videoPreview}
                          controls
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <p className="text-sm text-muted-foreground">
                          {selectedFile?.name} (
                          {formatFileSize(selectedFile?.size || 0)})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Duration: {formatDuration(videoDuration)}
                        </p>
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setVideoPreview(null);
                            setVideoDuration(0);
                          }}
                          className="text-sm text-destructive hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm text-foreground mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          MP4, WebM, or MOV (max 100MB)
                        </p>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter video ad title"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter video ad description (optional)"
                  rows={3}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Priority
                </label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: parseInt(e.target.value) || 1,
                    })
                  }
                  min={1}
                  max={10}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Higher priority ads are shown more frequently (1-10)
                </p>
              </div>

              {/* Upload Progress */}
              {isUploading ? (
                <div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              ) : null}

              {/* Submit Button */}
              <button
                onClick={() =>
                  void (editingAd ? handleUpdate() : handleUploadAndCreate())
                }
                disabled={isUploading || (!editingAd && !selectedFile)}
                className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading
                  ? "Uploading..."
                  : editingAd
                    ? "Update Video Ad"
                    : "Upload & Create Video Ad"}
              </button>
            </div>
          </div>
        ) : null}

        {/* Upload Button */}
        {!showUploadForm && (
          <button
            onClick={() => setShowUploadForm(true)}
            className="mb-6 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload New Video Ad
          </button>
        )}

        {/* Video Ads List */}
        <div className="bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Video Ads ({ads?.length || 0})
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : ads && ads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Video Preview */}
                  <div className="relative bg-black aspect-video">
                    <video
                      src={ad.videoUrl}
                      className="w-full h-full object-contain"
                      controls
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          ad.active
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {ad.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Ad Info */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-foreground text-lg line-clamp-1">
                      {ad.title}
                    </h3>
                    {ad.description ? (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {ad.description}
                      </p>
                    ) : null}

                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>
                        <p className="font-semibold">Duration</p>
                        <p>{formatDuration(ad.duration)}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Size</p>
                        <p>{formatFileSize(ad.fileSize)}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Views</p>
                        <p>{ad.watchCount}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Priority</p>
                        <p>{ad.priority}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => void handleToggleActive(ad)}
                        className="flex-1 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        {ad.active ? (
                          <>
                            <X className="w-4 h-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Activate
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(ad)}
                        className="px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => void handleDelete(ad.id)}
                        className="px-3 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Video className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                No video ads yet. Upload your first video ad to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
