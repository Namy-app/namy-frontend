"use client";

import {
  ArrowLeft,
  Store as StoreIcon,
  Plus,
  Percent,
  Ticket,
  AlertCircle,
  X,
  Loader2,
  Package,
  Copy,
  Check,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  useStore,
  useStoreCatalogs,
  useStoreCoupons,
  useCreateCatalog,
  useStoreDiscounts,
  useUpdateStore,
} from "@/domains/admin/hooks";
import {
  type Coupon,
  type Discount,
  DiscountType,
  PriceRange,
  UserRole,
} from "@/domains/admin/types";
import { CatalogsTab } from "@/domains/store/components/CatalogsTab";
import { StoreInfo } from "@/domains/store/components/StoreInfo";
import { toast, useToast } from "@/hooks/use-toast";
import { extractErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

type TabType = "info" | "catalogs" | "coupons";

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const storeId = params?.id as string;

  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [showCreateCatalog, setShowCreateCatalog] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [generatingPin, setGeneratingPin] = useState(false);
  const [generatedPin, setGeneratedPin] = useState<string | null>(null);
  // const [genericDiscount, setGenericDiscount] = useState<Discount | null>(null);

  // Data fetching
  const updateStore = useUpdateStore();
  const { data: store, isLoading: storeLoading } = useStore(storeId);
  const { data: catalogs, isLoading: catalogsLoading } =
    useStoreCatalogs(storeId);
  const { data: discountsData, isLoading: discountsLoading } =
    useStoreDiscounts({ storeId }, { page: 1, first: 1 });
  const { data: couponsData, isLoading: couponsLoading } = useStoreCoupons(
    { storeId },
    { page: 1, first: 20 }
  );
  const discount = discountsData?.data[0] ?? null;

  // Wait for client-side hydration
  useEffect(() => {
    // Mark as hydrated after Zustand rehydrates from localStorage
    // Use a small delay to ensure Zustand has fully rehydrated
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle authentication redirect after hydration
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated || !user) {
      router.push("/auth");
    }
  }, [isHydrated, isAuthenticated, user, router]);

  // Check if user is admin
  const isAdmin =
    user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

  // Show loading while hydrating or checking auth
  if (!isHydrated || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    router.push("/");
    return null;
  }

  const handleOnGeneratePin = async () => {
    try {
      if (!store) {
        return;
      }

      setGeneratingPin(true);
      const result = await updateStore.mutateAsync({
        id: store.id,
        input: {
          name: store.name,
          description: store.description,
          categoryId: store.categoryId,
          subCategory: store.subCategory,
          type: store.type,
          city: store.city,
          address: store.address,
          phoneNumber: store.phoneNumber,
          price: store.price,
          active: store.active,
          url: store.url,
          tags: store.tags,
          lat: store.lat,
          lng: store.lng,
          regeneratePin: true,
        },
      });

      // Show the generated PIN
      if (result.newPin) {
        setGeneratedPin(result.newPin);
      }

      toast({
        title: "PIN Generated",
        description: "New PIN generated successfully.",
        variant: "default",
      });
    } catch (err) {
      const message = extractErrorMessage(err);
      console.error("Error generating PIN:", message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setGeneratingPin(false);
    }
  };

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
            Volver a Tiendas
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
                    {store.active ? "Activo" : "Inactivo"}
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
                    ⭐ {store.averageRating}/5 ({store.reviewCounter} reseñas)
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
              Información
            </button>
            <button
              onClick={() => setActiveTab("catalogs")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "catalogs"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Catálogos
            </button>
            <button
              onClick={() => setActiveTab("coupons")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "coupons"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Cupones ({couponsData?.data.length || 0})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Store Info Tab */}
        {activeTab === "info" && (
          <div className="space-y-8">
            <StoreInfo
              discount={discount}
              discountIsLoading={discountsLoading}
              store={store}
              onGeneratePin={() => void handleOnGeneratePin()}
              generatingPin={generatingPin}
            />
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

      {/* Generated PIN Modal */}
      {generatedPin ? (
        <GeneratedPinModal
          pin={generatedPin}
          storeName={store?.name || ""}
          onClose={() => setGeneratedPin(null)}
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
        <p className="text-muted-foreground mt-2">Cargando cupones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">
          Cupones Generados
        </h2>
        <p className="text-muted-foreground">
          Total: {coupons.length} cupón{coupons.length !== 1 ? "es" : ""}
        </p>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-card rounded-lg shadow p-8 text-center">
          <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aún no hay cupones generados</p>
          <p className="text-sm text-muted-foreground mt-2">
            Los cupones se generan cuando los usuarios reclaman descuentos
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    ID Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Creado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Expira
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Usado El
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
                        {coupon.used ? "Usado" : "Activo"}
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
        description:
          extractErrorMessage(_error) ??
          "Failed to create catalog. Please try again.",
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

// Generated PIN Modal Component
function GeneratedPinModal({
  pin,
  storeName,
  onClose,
}: {
  pin: string;
  storeName: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyPin = async () => {
    await navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "PIN Copiado!",
      description: "PIN de tienda copiado al portapapeles",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">¡PIN Generado!</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-secondary/10 border-2 border-secondary rounded-lg p-6 mb-6">
          <p className="text-sm text-secondary-foreground mb-4 font-medium">
            ⚠️ IMPORTANTE: Guarde este PIN inmediatamente! Puede verlo más tarde
            haciendo clic en &quot;Mostrar&quot; en los detalles de la tienda.
          </p>
          <div className="bg-card rounded-lg p-4 border-2 border-secondary">
            <p className="text-xs text-muted-foreground mb-2">
              PIN de {storeName}:
            </p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-mono font-bold text-foreground">
                {pin}
              </p>
              <button
                onClick={() => void handleCopyPin()}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Copiar PIN"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-secondary-foreground" />
                ) : (
                  <Copy className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
