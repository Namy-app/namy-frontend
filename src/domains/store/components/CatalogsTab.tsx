import { BookOpen, Package, Plus } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

import type { Catalog } from "@/domains/admin";

import { EditCatalogModal } from "./EditCatalogModal";

// Catalogs Tab Component
export const CatalogsTab = ({
  catalogs,
  loading,
  onCreateCatalog,
}: {
  catalogs: Catalog[];
  loading: boolean;
  onCreateCatalog: () => void;
}) => {
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(
    null
  );
  const [editingCatalog, setEditingCatalog] = useState<Catalog | null>(null);
  const [selectedCatalogImage, setSelectedCatalogImage] = useState<
    string | null
  >(null);
  console.log("catalogs => ", catalogs);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedCatalogImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedCatalogImage]);

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <p className="text-muted-foreground mt-2">Cargando catálogos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Catálogos de la Tienda</h2>
        {catalogs.length === 0 ? (
          <button
            onClick={onCreateCatalog}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Crear Primer Catálogo
          </button>
        ) : null}
      </div>

      {catalogs.length === 0 ? (
        <div className="bg-card rounded-lg shadow p-8 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No se encontraron catálogos</p>
          <button
            onClick={onCreateCatalog}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            Crear Primer Catálogo
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
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/70 to-black/50 group-hover:from-black/95 group-hover:via-black/80 group-hover:to-black/60 transition-all" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5" />
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
                        Seleccionado
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
                    Editar Catálogo
                  </button>
                </div>

                {/* Catalog Images */}
                {catalogImages.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-foreground mb-4">
                      Imágenes del Catálogo
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {catalogImages.map((imageUrl, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-lg overflow-hidden bg-muted border border-border cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedCatalogImage(imageUrl ?? "")}
                        >
                          <Image
                            src={imageUrl ?? ""}
                            alt={`${selectedCatalog.name} image ${index + 1}`}
                            className="w-full h-full object-cover"
                            height={100}
                            width={100}
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

      {/* Full-Size Image Modal */}
      {selectedCatalogImage ? (
        <div
          className="fixed inset-0 z-50 bg-black/80 overflow-y-auto"
          onClick={() => setSelectedCatalogImage(null)}
        >
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="relative max-w-5xl w-full">
              <button
                onClick={() => setSelectedCatalogImage(null)}
                className="sticky top-4 left-full ml-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="relative w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedCatalogImage}
                  alt="Catalog image"
                  className="w-full h-auto"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
