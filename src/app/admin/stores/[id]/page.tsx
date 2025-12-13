"use client";

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
import { useState } from "react";

import {
  useStore,
  useStoreCatalogs,
  useStoreCoupons,
  useCreateCatalog,
  useCreateCatalogItem,
  useCreateDiscount,
  useCatalogItems,
} from "@/domains/admin/hooks";
import {
  type Catalog,
  type Coupon,
  type Discount,
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
  const [isHydrated] = useState(true);

  // Data fetching
  const { data: store, isLoading: storeLoading } = useStore(storeId);
  const { data: catalogs, isLoading: catalogsLoading } =
    useStoreCatalogs(storeId);
  const { data: couponsData, isLoading: couponsLoading } = useStoreCoupons(
    { storeId },
    { page: 1, first: 20 }
  );

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-card rounded-lg shadow p-6">
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

            {/* Opening Hours */}
            {store.openDays ? (
              <div className="bg-card rounded-lg shadow p-6">
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
            {store.additionalInfo &&
            Object.keys(store.additionalInfo).length > 0 ? (
              <div className="bg-card rounded-lg shadow p-6 lg:col-span-2">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Additional Information
                </h2>
                <pre className="text-sm text-foreground bg-muted p-4 rounded overflow-auto">
                  {JSON.stringify(store.additionalInfo, null, 2)}
                </pre>
              </div>
            ) : null}

            {/* Metadata */}
            <div className="bg-card rounded-lg shadow p-6 lg:col-span-2">
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
  const [showCreateItem, setShowCreateItem] = useState(false);

  const { data: catalogItems } = useCatalogItems(selectedCatalogId || "");

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
          {catalogs.map((catalog) => (
            <div
              key={catalog.id}
              className="bg-card rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedCatalogId(catalog.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {catalog.id === selectedCatalogId ? "Selected" : ""}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {catalog.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Catalog ID: {catalog.id.slice(0, 8)}...
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Catalog Items */}
      {selectedCatalogId ? (
        <div className="bg-card rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-foreground">
              Catalog Items
            </h3>
            <button
              onClick={() => setShowCreateItem(true)}
              className="flex items-center gap-2 px-3 py-2 bg-secondary/600 text-white rounded-lg hover:bg-secondary/700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {catalogItems && catalogItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {catalogItems.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Image
                      className="w-5 h-5 text-muted-foreground mt-1"
                      aria-label="Image icon"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">
                        {item.name}
                      </h4>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline break-all"
                      >
                        {item.url}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No items in this catalog yet
            </p>
          )}
        </div>
      ) : null}

      {showCreateItem && selectedCatalogId ? (
        <CreateCatalogItemModal
          catalogId={selectedCatalogId}
          onClose={() => setShowCreateItem(false)}
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCatalog.mutateAsync({ storeId, name });
      toast({
        title: "Catalog created",
        description: "The catalog has been created successfully.",
      });
      onClose();
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create catalog.",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-card max-w-md w-full">
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
                Organize your products or services
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
        <form onSubmit={(e) => void handleSubmit(e)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Catalog Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Menu Items, Products, Services"
              required
            />
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
                  Creating...
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

// Create Catalog Item Modal
function CreateCatalogItemModal({
  catalogId,
  onClose,
}: {
  catalogId: string;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const createCatalogItem = useCreateCatalogItem();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCatalogItem.mutateAsync({ catalogId, name, url });
      toast({
        title: "Item added",
        description: "The catalog item has been added successfully.",
      });
      onClose();
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add catalog item.",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-card max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/20 rounded-lg">
              <Plus className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Add Catalog Item
              </h3>
              <p className="text-sm text-muted-foreground">
                Add a new item to your catalog
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
        <form onSubmit={(e) => void handleSubmit(e)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Item Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Burger, Pizza, T-Shirt"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Image URL <span className="text-destructive">*</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={createCatalogItem.isPending}
              className="flex-1 px-4 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createCatalogItem.isPending}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {createCatalogItem.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Item"
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
