"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Store as StoreIcon,
  MapPin,
  Phone,
  Globe,
  Clock,
  DollarSign,
  Tag,
  Plus,
  Percent,
  Ticket,
  BookOpen,
  Image,
  AlertCircle,
  X,
  Loader2,
  Package,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  useStore,
  useStoreCatalogs,
  useStoreCoupons,
  useCreateCatalog,
  useUpdateCatalog,
  useCreateDiscount,
} from "@/domains/admin/hooks";
import {
  type Catalog,
  type Coupon,
  type Discount,
  type Store,
  DiscountType,
  PriceRange,
  UserRole,
} from "@/domains/admin/types";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";

type TabType = "info" | "catalogs" | "coupons";

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const storeId = params?.id as string;

  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [showCreateCatalog, setShowCreateCatalog] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Data fetching
  const { data: store, isLoading: storeLoading } = useStore(storeId);
  const { data: catalogs, isLoading: catalogsLoading } =
    useStoreCatalogs(storeId);
  const { data: couponsData, isLoading: couponsLoading } = useStoreCoupons(
    { storeId },
    { page: 1, first: 20 }
  );

  // Wait for client-side hydration
  useEffect(() => {
    // Using a microtask to avoid synchronous setState in effect
    void Promise.resolve().then(() => setIsHydrated(true));
  }, []);

  // Check if user is admin
  const isAdmin =
    user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    router.push("/auth");
    return null;
  }

  if (!isAdmin) {
    router.push("/");
    return null;
  }

  if (storeLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
          <p className="text-muted-foreground">Loading store details...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="bg-card rounded-lg shadow-card p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Store Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The store you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/admin/stores")}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to Stores
          </button>
        </div>
      </div>
    );
  }

  const priceSymbols = {
    [PriceRange.BUDGET]: "$",
    [PriceRange.MODERATE]: "$$",
    [PriceRange.EXPENSIVE]: "$$$",
    [PriceRange.LUXURY]: "$$$$",
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push("/admin/stores")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Stores
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <StoreIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {store.name}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      store.active
                        ? "bg-secondary/20 text-secondary-foreground"
                        : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {store.active ? "Active" : "Inactive"}
                  </span>
                  <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm font-medium capitalize">
                    {store.type}
                  </span>
                  {store.price ? (
                    <span className="text-muted-foreground text-sm">
                      {priceSymbols[store.price]}
                    </span>
                  ) : null}
                  <span className="text-primary text-sm">
                    ⭐ {store.averageRating}/5 ({store.reviewCounter} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "info"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Store Info
            </button>
            <button
              onClick={() => setActiveTab("catalogs")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "catalogs"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Catalogs ({catalogs?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("coupons")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "coupons"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Coupons ({couponsData?.data.length || 0})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Store Info Tab */}
        {activeTab === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="bg-card rounded-lg shadow p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                {store.description ? (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Description
                    </p>
                    <p className="text-foreground mt-1">{store.description}</p>
                  </div>
                ) : null}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Address
                    </p>
                    <p className="text-foreground">
                      {store.address}, {store.city}
                    </p>
                    {store.lat && store.lng ? (
                      <p className="text-sm text-muted-foreground mt-1">
                        Lat: {store.lat}, Lng: {store.lng}
                      </p>
                    ) : null}
                  </div>
                </div>
                {store.phoneNumber ? (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Phone
                      </p>
                      <p className="text-foreground">{store.phoneNumber}</p>
                    </div>
                  </div>
                ) : null}
                {store.url ? (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Website
                      </p>
                      <a
                        href={store.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {store.url}
                      </a>
                    </div>
                  </div>
                ) : null}
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Price Range
                    </p>
                    <p className="text-foreground capitalize">
                      {store.price} ({priceSymbols[store.price]})
                    </p>
                  </div>
                </div>
                {store.tags ? (
                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Tags
                      </p>
                      <p className="text-foreground">{store.tags}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Image Upload & Preview */}
            <StoreImageUpload
              storeId={storeId}
              storeName={store.name}
              currentImageUrl={store.imageUrl}
            />

            {/* Opening Hours */}
            {store.openDays ? (
              <div className="bg-card rounded-lg shadow p-6 lg:col-span-3">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  Opening Hours
                </h2>
                <div className="space-y-3">
                  {store.openDays.availableDays.map((day, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="font-medium text-foreground capitalize">
                        {day.day}
                      </span>
                      <span className="text-muted-foreground">
                        {day.closed
                          ? "Closed"
                          : `${day.startTime} - ${day.endTime}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Additional Information */}
            {/* {store.additionalInfo &&
            Object.keys(store.additionalInfo).length > 0 ? (
              <div className="bg-card rounded-lg shadow p-6 lg:col-span-3">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Additional Information
                </h2>
                <pre className="text-sm text-foreground bg-muted p-4 rounded overflow-auto">
                  {JSON.stringify(store.additionalInfo, null, 2)}
                </pre>
              </div>
            ) : null} */}

            {/* Metadata */}
            <div className="bg-card rounded-lg shadow p-6 lg:col-span-3">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Metadata
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Store ID
                  </p>
                  <p className="text-foreground text-sm font-mono">
                    {store.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Category ID
                  </p>
                  <p className="text-foreground text-sm font-mono">
                    {store.categoryId}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created At
                  </p>
                  <p className="text-foreground text-sm">
                    {new Date(store.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Updated At
                  </p>
                  <p className="text-foreground text-sm">
                    {new Date(store.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Catalogs Tab */}
        {activeTab === "catalogs" && (
          <CatalogsTab
            catalogs={catalogs || []}
            loading={catalogsLoading}
            onCreateCatalog={() => setShowCreateCatalog(true)}
          />
        )}

        {/* Coupons Tab */}
        {activeTab === "coupons" && (
          <CouponsTab
            coupons={couponsData?.data || []}
            loading={couponsLoading}
          />
        )}
      </div>

      {/* Modals */}
      {showCreateCatalog ? (
        <CreateCatalogModal
          storeId={storeId}
          onClose={() => setShowCreateCatalog(false)}
        />
      ) : null}
    </div>
  );
}

// Store Image Upload Component
function StoreImageUpload({
  storeId,
  storeName,
  currentImageUrl,
}: {
  storeId: string;
  storeName: string;
  currentImageUrl?: string | null;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Sync preview with current image URL when it changes (after refetch)
  useEffect(() => {
    if (currentImageUrl && !selectedFile) {
      setPreviewUrl(currentImageUrl);
    }
  }, [currentImageUrl, selectedFile]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, WebP)",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select an image smaller than 5MB",
      });
      return;
    }

    // Store the file for upload
    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setSelectedImage(file.name);
  };

  const handleUpload = async () => {
    if (!selectedFile || !previewUrl) {
      return;
    }

    if (!storeId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Store ID is missing. Please refresh the page.",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("storeId", storeId);

      // Get auth token
      const authStore = useAuthStore.getState();
      const token = authStore.accessToken;

      // Upload to backend (use base URL without /graphql)
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
      ).replace("/graphql", "");
      const response = await fetch(`${baseUrl}/upload/store-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      // If we got the full store object back, use it to update the cache
      if (data.store) {
        queryClient.setQueryData(["store", storeId], data.store);
      } else {
        // Fallback: Update just the imageUrl
        queryClient.setQueryData(
          ["store", storeId],
          (oldData: Store | undefined) => {
            if (oldData) {
              const updatedData = { ...oldData, imageUrl: data.url };
              return updatedData;
            }
            return oldData;
          }
        );
      }

      // Update the preview immediately
      setPreviewUrl(data.url);
      setSelectedFile(null);
      setSelectedImage(null);

      toast({
        title: "Image uploaded",
        description: `Successfully uploaded image for ${storeName}. Old image deleted from S3.`,
      });

      // Refetch to ensure fresh data from server (optional now since we have the updated store)
      await queryClient.refetchQueries({ queryKey: ["store", storeId] });
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setSelectedImage(null);
  };

  return (
    <div className="bg-card rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Store Image
      </h2>

      {/* Image Preview Area - 16:9 Aspect Ratio */}
      <div className="mb-4">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          {previewUrl ? (
            <div className="absolute inset-0 rounded-lg overflow-hidden bg-muted border-2 border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={storeName}
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-lg transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="absolute inset-0 rounded-lg border-2 border-dashed border-border bg-muted flex flex-col items-center justify-center text-center p-4">
              <Image
                className="w-12 h-12 text-muted-foreground mb-2"
                aria-label="Upload placeholder"
              />
              <p className="text-sm font-medium text-foreground mb-1">
                16:9 Aspect Ratio
              </p>
              <p className="text-xs text-muted-foreground">
                Recommended: 1920x1080px
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Controls */}
      <div className="space-y-3">
        <div>
          <label
            htmlFor="store-image-upload"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Image className="w-5 h-5" aria-label="Image icon" />
            {previewUrl ? "Change Image" : "Select Image"}
          </label>
          <input
            id="store-image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {Boolean(previewUrl) && (
          <button
            onClick={() => void handleUpload()}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Package className="w-5 h-5" />
                Upload Image
              </>
            )}
          </button>
        )}

        {Boolean(selectedImage) && (
          <p className="text-xs text-muted-foreground text-center">
            Selected: {selectedImage}
          </p>
        )}
      </div>

      {/* Image Guidelines */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-xs font-medium text-foreground mb-2">
          Image Guidelines:
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Aspect ratio: 16:9 (e.g., 1920x1080px)</li>
          <li>• Max file size: 5MB</li>
          <li>• Formats: PNG, JPG, JPEG, WebP</li>
          <li>• High quality images recommended</li>
        </ul>
      </div>
    </div>
  );
}

// Catalogs Tab Component
function CatalogsTab({
  catalogs,
  loading,
  onCreateCatalog,
}: {
  catalogs: Catalog[];
  loading: boolean;
  onCreateCatalog: () => void;
}) {
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(
    null
  );
  const [editingCatalog, setEditingCatalog] = useState<Catalog | null>(null);

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <p className="text-muted-foreground mt-2">Loading catalogs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Store Catalogs</h2>
        <button
          onClick={onCreateCatalog}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Catalog
        </button>
      </div>

      {catalogs.length === 0 ? (
        <div className="bg-card rounded-lg shadow p-8 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No catalogs found</p>
          <button
            onClick={onCreateCatalog}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            Create First Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogs.map((catalog) => {
            const backgroundImage =
              catalog.image1Url ||
              catalog.image2Url ||
              catalog.image3Url ||
              catalog.image4Url ||
              catalog.image5Url ||
              catalog.image6Url ||
              catalog.image7Url ||
              catalog.image8Url ||
              catalog.image9Url ||
              catalog.image10Url;
            return (
              <div
                key={catalog.id}
                className="relative rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group"
                onClick={() => setSelectedCatalogId(catalog.id)}
              >
                {/* Background Image with Overlay */}
                {backgroundImage ? (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${backgroundImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 group-hover:from-black/95 group-hover:via-black/80 group-hover:to-black/60 transition-all" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                )}

                {/* Content */}
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <BookOpen
                      className={`w-8 h-8 ${backgroundImage ? "text-white" : "text-primary"}`}
                    />
                    {catalog.id === selectedCatalogId && (
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded ${backgroundImage ? "bg-white/20 text-white" : "bg-primary/20 text-primary"}`}
                      >
                        Selected
                      </span>
                    )}
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${backgroundImage ? "text-white" : "text-foreground"}`}
                  >
                    {catalog.name}
                  </h3>
                  {catalog.description ? (
                    <p
                      className={`text-sm mb-2 line-clamp-2 ${backgroundImage ? "text-white/80" : "text-muted-foreground"}`}
                    >
                      {catalog.description}
                    </p>
                  ) : null}
                  <p
                    className={`text-xs ${backgroundImage ? "text-white/60" : "text-muted-foreground"}`}
                  >
                    ID: {catalog.id.slice(0, 8)}...
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Catalog Details */}
      {selectedCatalogId ? (
        <div className="bg-card rounded-lg shadow p-6">
          {(() => {
            const selectedCatalog = catalogs.find(
              (c) => c.id === selectedCatalogId
            );
            if (!selectedCatalog) {
              return null;
            }

            const catalogImages = [
              selectedCatalog.image1Url,
              selectedCatalog.image2Url,
              selectedCatalog.image3Url,
              selectedCatalog.image4Url,
              selectedCatalog.image5Url,
              selectedCatalog.image6Url,
              selectedCatalog.image7Url,
              selectedCatalog.image8Url,
              selectedCatalog.image9Url,
              selectedCatalog.image10Url,
            ].filter(Boolean);

            return (
              <>
                {/* Catalog Info */}
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {selectedCatalog.name}
                    </h3>
                    {selectedCatalog.description ? (
                      <p className="text-muted-foreground">
                        {selectedCatalog.description}
                      </p>
                    ) : null}
                  </div>
                  <button
                    onClick={() => setEditingCatalog(selectedCatalog)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    Edit Catalog
                  </button>
                </div>

                {/* Catalog Images */}
                {catalogImages.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-foreground mb-4">
                      Catalog Images
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {catalogImages.map((imageUrl, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-lg overflow-hidden bg-muted border border-border"
                        >
                          <img
                            src={imageUrl}
                            alt={`${selectedCatalog.name} image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      ) : null}

      {/* Edit Catalog Modal */}
      {editingCatalog ? (
        <EditCatalogModal
          catalog={editingCatalog}
          onClose={() => setEditingCatalog(null)}
        />
      ) : null}
    </div>
  );
}

// Discounts Tab Component - Unused, can be removed if not needed
export function DiscountsTab({
  discounts,
  loading,
  onCreateDiscount,
}: {
  discounts: Discount[];
  loading: boolean;
  onCreateDiscount: () => void;
}) {
  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <p className="text-muted-foreground mt-2">Loading discounts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Store Discounts</h2>
        <button
          onClick={onCreateDiscount}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Discount
        </button>
      </div>

      {discounts.length === 0 ? (
        <div className="bg-card rounded-lg shadow p-8 text-center">
          <Percent className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No discounts found</p>
          <button
            onClick={onCreateDiscount}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            Create First Discount
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {discounts.map((discount) => (
            <div
              key={discount.id}
              className="bg-card rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-secondary/100 rounded-lg flex items-center justify-center">
                    <Percent className="w-6 h-6 text-secondary-foreground600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {discount.title}
                    </h3>
                    {discount.description ? (
                      <p className="text-muted-foreground text-sm mt-1">
                        {discount.description}
                      </p>
                    ) : null}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    discount.active
                      ? "bg-secondary/100 text-secondary-foreground800"
                      : "bg-destructive/20 text-destructive800"
                  }`}
                >
                  {discount.active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Type
                  </p>
                  <p className="text-foreground capitalize">
                    {discount.type.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Value
                  </p>
                  <p className="text-foreground">
                    {discount.type === DiscountType.PERCENTAGE
                      ? `${discount.value}%`
                      : `$${discount.value}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Used
                  </p>
                  <p className="text-foreground">
                    {discount.usedCount}
                    {discount.maxUses ? ` / ${discount.maxUses}` : ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Period
                  </p>
                  <p className="text-foreground text-sm">
                    {new Date(discount.startDate).toLocaleDateString()} -{" "}
                    {new Date(discount.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {(discount.excludedDaysOfWeek.length > 0 ||
                discount.excludedHours.length > 0) && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Restrictions
                  </p>
                  {discount.excludedDaysOfWeek.length > 0 && (
                    <p className="text-sm text-foreground">
                      Excluded Days:{" "}
                      {discount.excludedDaysOfWeek
                        .map(
                          (d: number) =>
                            [
                              "Sunday",
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                            ][d]
                        )
                        .join(", ")}
                    </p>
                  )}
                  {discount.excludedHours.length > 0 && (
                    <p className="text-sm text-foreground">
                      Excluded Hours: {discount.excludedHours.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Coupons Tab Component
function CouponsTab({
  coupons,
  loading,
}: {
  coupons: Coupon[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <p className="text-muted-foreground mt-2">Loading coupons...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">
          Generated Coupons
        </h2>
        <p className="text-muted-foreground">
          Total: {coupons.length} coupon{coupons.length !== 1 ? "s" : ""}
        </p>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-card rounded-lg shadow p-8 text-center">
          <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No coupons generated yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Coupons are generated when users claim discounts
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Used At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-muted">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-medium text-foreground">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-muted-foreground font-mono">
                        {coupon.userId.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          coupon.used
                            ? "bg-muted text-foreground"
                            : "bg-secondary/100 text-secondary-foreground800"
                        }`}
                      >
                        {coupon.used ? "Used" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(coupon.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(coupon.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {coupon.usedAt
                        ? new Date(coupon.usedAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Create Catalog Modal
function CreateCatalogModal({
  storeId,
  onClose,
}: {
  storeId: string;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const createCatalog = useCreateCatalog();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<{
    file1?: File;
    file2?: File;
    file3?: File;
    file4?: File;
    file5?: File;
    file6?: File;
    file7?: File;
    file8?: File;
    file9?: File;
    file10?: File;
  }>({});
  const [imagePreviews, setImagePreviews] = useState<{
    preview1?: string;
    preview2?: string;
    preview3?: string;
    preview4?: string;
    preview5?: string;
    preview6?: string;
    preview7?: string;
    preview8?: string;
    preview9?: string;
    preview10?: string;
  }>({});

  const handleImageSelect = (
    slot: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, WebP)",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select an image smaller than 5MB",
      });
      return;
    }

    // Store file and create preview
    setSelectedFiles((prev: typeof selectedFiles) => ({
      ...prev,
      [`file${slot}`]: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev: typeof imagePreviews) => ({
        ...prev,
        [`preview${slot}`]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (slot: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10) => {
    setSelectedFiles((prev: typeof selectedFiles) => ({
      ...prev,
      [`file${slot}`]: undefined,
    }));
    setImagePreviews((prev: typeof imagePreviews) => ({
      ...prev,
      [`preview${slot}`]: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // First, upload images to S3 if any
      const imageUrls: {
        image1Url?: string;
        image2Url?: string;
        image3Url?: string;
        image4Url?: string;
        image5Url?: string;
        image6Url?: string;
        image7Url?: string;
        image8Url?: string;
        image9Url?: string;
        image10Url?: string;
      } = {};

      const filesToUpload = [
        selectedFiles.file1,
        selectedFiles.file2,
        selectedFiles.file3,
        selectedFiles.file4,
        selectedFiles.file5,
        selectedFiles.file6,
        selectedFiles.file7,
        selectedFiles.file8,
        selectedFiles.file9,
        selectedFiles.file10,
      ].filter(Boolean) as File[];

      if (filesToUpload.length > 0) {
        const formData = new FormData();
        filesToUpload.forEach((file) => {
          formData.append("files", file);
        });

        const authStore = useAuthStore.getState();
        const token = authStore.accessToken;

        const baseUrl = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
        ).replace("/graphql", "");

        const uploadResponse = await fetch(`${baseUrl}/upload/catalog-images`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Image upload failed");
        }

        const { urls } = await uploadResponse.json();

        // Map URLs to the correct slots
        let urlIndex = 0;
        if (selectedFiles.file1) {
          imageUrls.image1Url = urls[urlIndex++];
        }
        if (selectedFiles.file2) {
          imageUrls.image2Url = urls[urlIndex++];
        }
        if (selectedFiles.file3) {
          imageUrls.image3Url = urls[urlIndex++];
        }
        if (selectedFiles.file4) {
          imageUrls.image4Url = urls[urlIndex++];
        }
        if (selectedFiles.file5) {
          imageUrls.image5Url = urls[urlIndex++];
        }
        if (selectedFiles.file6) {
          imageUrls.image6Url = urls[urlIndex++];
        }
        if (selectedFiles.file7) {
          imageUrls.image7Url = urls[urlIndex++];
        }
        if (selectedFiles.file8) {
          imageUrls.image8Url = urls[urlIndex++];
        }
        if (selectedFiles.file9) {
          imageUrls.image9Url = urls[urlIndex++];
        }
        if (selectedFiles.file10) {
          imageUrls.image10Url = urls[urlIndex++];
        }
      }

      // Create catalog with image URLs
      await createCatalog.mutateAsync({
        storeId,
        name,
        description: description || undefined,
        ...imageUrls,
      });

      toast({
        title: "Catalog created",
        description:
          "The catalog has been created successfully with images uploaded to S3.",
      });
      onClose();
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create catalog. Please try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card rounded-lg shadow-card max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Create New Catalog
              </h3>
              <p className="text-sm text-muted-foreground">
                Add up to 10 images for your catalog
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={(e) => void handleSubmit(e)} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Catalog Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              placeholder="e.g., Menu Items, Products, Services"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-background text-foreground"
              rows={3}
              placeholder="Describe your catalog..."
            />
          </div>

          {/* Images Grid */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Images (Up to 10)
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((slot) => {
                const slotKey = slot as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
                const preview = imagePreviews[`preview${slotKey}`];
                return (
                  <div key={slot} className="space-y-2">
                    <div className="relative aspect-square bg-muted rounded-lg border-2 border-dashed border-border overflow-hidden">
                      {preview ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt={`Preview ${slot}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(slotKey)}
                            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-muted/80 transition-colors">
                          <Plus className="w-6 h-6 text-muted-foreground mb-1" />
                          <span className="text-[10px] text-muted-foreground">
                            {slot}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageSelect(slotKey, e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Max 5MB per image • PNG, JPG, WebP • Images uploaded to AWS S3
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={createCatalog.isPending}
              className="flex-1 px-4 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createCatalog.isPending}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {createCatalog.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating & Uploading...
                </>
              ) : (
                "Create Catalog"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Catalog Modal
function EditCatalogModal({
  catalog,
  onClose,
}: {
  catalog: Catalog;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const updateCatalog = useUpdateCatalog();
  const [name, setName] = useState(catalog.name);
  const [description, setDescription] = useState(catalog.description || "");
  const [selectedFiles, setSelectedFiles] = useState<{
    file1?: File;
    file2?: File;
    file3?: File;
    file4?: File;
    file5?: File;
    file6?: File;
    file7?: File;
    file8?: File;
    file9?: File;
    file10?: File;
  }>({});
  const [imagePreviews, setImagePreviews] = useState<{
    preview1?: string;
    preview2?: string;
    preview3?: string;
    preview4?: string;
    preview5?: string;
    preview6?: string;
    preview7?: string;
    preview8?: string;
    preview9?: string;
    preview10?: string;
  }>({
    preview1: catalog.image1Url,
    preview2: catalog.image2Url,
    preview3: catalog.image3Url,
    preview4: catalog.image4Url,
    preview5: catalog.image5Url,
    preview6: catalog.image6Url,
    preview7: catalog.image7Url,
    preview8: catalog.image8Url,
    preview9: catalog.image9Url,
    preview10: catalog.image10Url,
  });

  const handleImageSelect = (
    slot: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, WebP)",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select an image smaller than 5MB",
      });
      return;
    }

    // Store file and create preview
    setSelectedFiles((prev: typeof selectedFiles) => ({
      ...prev,
      [`file${slot}`]: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev: typeof imagePreviews) => ({
        ...prev,
        [`preview${slot}`]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (slot: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10) => {
    setSelectedFiles((prev: typeof selectedFiles) => ({
      ...prev,
      [`file${slot}`]: undefined,
    }));
    setImagePreviews((prev: typeof imagePreviews) => ({
      ...prev,
      [`preview${slot}`]: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Upload new images to S3 if any
      const imageUrls: {
        image1Url?: string;
        image2Url?: string;
        image3Url?: string;
        image4Url?: string;
        image5Url?: string;
        image6Url?: string;
        image7Url?: string;
        image8Url?: string;
        image9Url?: string;
        image10Url?: string;
      } = {
        image1Url: catalog.image1Url,
        image2Url: catalog.image2Url,
        image3Url: catalog.image3Url,
        image4Url: catalog.image4Url,
        image5Url: catalog.image5Url,
        image6Url: catalog.image6Url,
        image7Url: catalog.image7Url,
        image8Url: catalog.image8Url,
        image9Url: catalog.image9Url,
        image10Url: catalog.image10Url,
      };

      const filesToUpload = [
        selectedFiles.file1,
        selectedFiles.file2,
        selectedFiles.file3,
        selectedFiles.file4,
        selectedFiles.file5,
        selectedFiles.file6,
        selectedFiles.file7,
        selectedFiles.file8,
        selectedFiles.file9,
        selectedFiles.file10,
      ].filter(Boolean) as File[];

      if (filesToUpload.length > 0) {
        const formData = new FormData();
        filesToUpload.forEach((file) => {
          formData.append("files", file);
        });

        const authStore = useAuthStore.getState();
        const token = authStore.accessToken;

        const baseUrl = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
        ).replace("/graphql", "");

        const uploadResponse = await fetch(`${baseUrl}/upload/catalog-images`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Image upload failed");
        }

        const { urls } = await uploadResponse.json();

        // Map URLs to the correct slots (only update slots with new files)
        let urlIndex = 0;
        if (selectedFiles.file1) {
          imageUrls.image1Url = urls[urlIndex++];
        }
        if (selectedFiles.file2) {
          imageUrls.image2Url = urls[urlIndex++];
        }
        if (selectedFiles.file3) {
          imageUrls.image3Url = urls[urlIndex++];
        }
        if (selectedFiles.file4) {
          imageUrls.image4Url = urls[urlIndex++];
        }
        if (selectedFiles.file5) {
          imageUrls.image5Url = urls[urlIndex++];
        }
        if (selectedFiles.file6) {
          imageUrls.image6Url = urls[urlIndex++];
        }
        if (selectedFiles.file7) {
          imageUrls.image7Url = urls[urlIndex++];
        }
        if (selectedFiles.file8) {
          imageUrls.image8Url = urls[urlIndex++];
        }
        if (selectedFiles.file9) {
          imageUrls.image9Url = urls[urlIndex++];
        }
        if (selectedFiles.file10) {
          imageUrls.image10Url = urls[urlIndex++];
        }
      }

      // Handle removed images (set to undefined if preview was removed but no new file)
      Object.keys(imagePreviews).forEach((key) => {
        const slot = key.replace("preview", "") as
          | "1"
          | "2"
          | "3"
          | "4"
          | "5"
          | "6"
          | "7"
          | "8"
          | "9"
          | "10";
        const imageKey = `image${slot}Url` as keyof typeof imageUrls;
        const previewKey = key as keyof typeof imagePreviews;

        if (
          !imagePreviews[previewKey] &&
          !selectedFiles[`file${slot}` as keyof typeof selectedFiles]
        ) {
          imageUrls[imageKey] = undefined;
        }
      });

      // Update catalog
      await updateCatalog.mutateAsync({
        id: catalog.id,
        name,
        description: description || undefined,
        ...imageUrls,
      });

      toast({
        title: "Catalog updated",
        description: "The catalog has been updated successfully.",
      });
      onClose();
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update catalog. Please try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card rounded-lg shadow-card max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Edit Catalog
              </h3>
              <p className="text-sm text-muted-foreground">
                Update catalog details and images
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={(e) => void handleSubmit(e)} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Catalog Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              placeholder="e.g., Menu Items, Products, Services"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-background text-foreground"
              rows={3}
              placeholder="Describe your catalog..."
            />
          </div>

          {/* Images Grid */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Images (Up to 10)
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((slot) => {
                const slotKey = slot as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
                const preview = imagePreviews[`preview${slotKey}`];
                return (
                  <div key={slot} className="space-y-2">
                    <div className="relative aspect-square bg-muted rounded-lg border-2 border-dashed border-border overflow-hidden">
                      {preview ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt={`Preview ${slot}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(slotKey)}
                            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-muted/80 transition-colors">
                          <Plus className="w-6 h-6 text-muted-foreground mb-1" />
                          <span className="text-[10px] text-muted-foreground">
                            {slot}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageSelect(slotKey, e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Max 5MB per image • PNG, JPG, WebP • Click X to remove, + to add
              new
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={updateCatalog.isPending}
              className="flex-1 px-4 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateCatalog.isPending}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {updateCatalog.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Catalog"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Create Discount Modal - Unused, can be removed
export function CreateDiscountModal({
  storeId,
  onClose,
}: {
  storeId: string;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const createDiscount = useCreateDiscount();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: DiscountType.PERCENTAGE,
    value: "",
    code: "",
    startDate: "",
    endDate: "",
    active: true,
    maxUses: "",
    minPurchaseAmount: "",
    maxDiscountAmount: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDiscount.mutateAsync({
        storeId,
        title: formData.title,
        description: formData.description || undefined,
        type: formData.type,
        value: parseFloat(formData.value),
        code: formData.code || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        active: formData.active,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
        minPurchaseAmount: formData.minPurchaseAmount
          ? parseFloat(formData.minPurchaseAmount)
          : undefined,
        maxDiscountAmount: formData.maxDiscountAmount
          ? parseFloat(formData.maxDiscountAmount)
          : undefined,
      });
      toast({
        title: "Discount created",
        description: "The discount has been created successfully.",
      });
      onClose();
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create discount.",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-card max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Percent className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Create New Discount
              </h3>
              <p className="text-sm text-muted-foreground">
                Set up a new discount or promotional offer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={createDiscount.isPending}
            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Summer Sale, Black Friday Deal"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Describe the discount offer..."
                  />
                </div>
              </div>
            </div>

            {/* Discount Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Discount Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Type <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as DiscountType,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value={DiscountType.PERCENTAGE}>
                      Percentage (%)
                    </option>
                    <option value={DiscountType.FIXED_AMOUNT}>
                      Fixed Amount ($)
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Value <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={
                      formData.type === DiscountType.PERCENTAGE
                        ? "e.g., 20"
                        : "e.g., 10.00"
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Discount Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., SAVE20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max Uses
                  </label>
                  <input
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) =>
                      setFormData({ ...formData, maxUses: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
            </div>

            {/* Validity Period */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Validity Period
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Start Date <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    End Date <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Min Purchase Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minPurchaseAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minPurchaseAmount: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 50.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max Discount Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.maxDiscountAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxDiscountAmount: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 100.00"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 p-4 bg-gradient-hero rounded-lg border border-border">
              <input
                type="checkbox"
                id="discount-active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label
                htmlFor="discount-active"
                className="text-sm font-medium text-foreground"
              >
                Discount is active and available to users
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-border shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={createDiscount.isPending}
              className="flex-1 px-4 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createDiscount.isPending}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {createDiscount.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Discount"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
