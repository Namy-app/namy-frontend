import {
  Clock,
  DollarSign,
  Globe,
  Loader2,
  MapPin,
  Phone,
  Tag,
} from "lucide-react";
import { useState } from "react";

import { PRICE_SYMBOLS } from "@/data/constants";
import { type Discount, type Store } from "@/domains/admin/types";

import { DiscountSection } from "./DiscountSection";
import { StoreImageUpload } from "./StoreImageUpload";

// Mapping for Spanish day labels
const DAY_LABELS: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

// Utility function to convert 24-hour time to 12-hour AM/PM format
function convertTo12Hour(time24: string): string {
  const parts = time24.split(":");
  const hours = parseInt(parts[0] || "0", 10);
  const minutes = parseInt(parts[1] || "0", 10);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

interface Props {
  store: Store;
  discount?: Discount | null;
  discountIsLoading?: boolean;
  generatingPin?: boolean;
  onGeneratePin: () => void;
}

export const StoreInfo = ({
  discount,
  discountIsLoading,
  generatingPin,
  store,
  onGeneratePin,
}: Props) => {
  const [showPin, setShowPin] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Basic Information */}
      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Información Básica
        </h2>
        <div className="space-y-4">
          {store.description ? (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Descripción
              </p>
              <p className="text-foreground mt-1">{store.description}</p>
            </div>
          ) : null}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Dirección
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
                  Teléfono
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
                  Sitio Web
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
                Rango de Precio
              </p>
              <p className="text-foreground capitalize">
                {store.price} ({PRICE_SYMBOLS[store.price]})
              </p>
            </div>
          </div>
          {store.tags ? (
            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Etiquetas
                </p>
                <p className="text-foreground">{store.tags}</p>
              </div>
            </div>
          ) : null}
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                PIN de Tienda
              </p>
              {store.pin ? (
                <p className="text-foreground">
                  {showPin ? store.pin : "••••"}
                  <button
                    onClick={() => setShowPin((prev: boolean) => !prev)}
                    className="ml-3 text-sm text-primary hover:underline"
                  >
                    {showPin ? "Ocultar" : "Mostrar"}
                  </button>
                </p>
              ) : (
                <p className="text-foreground">
                  {generatingPin ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin ml-2" />
                  ) : (
                    <>
                      --{" "}
                      <button
                        onClick={() => onGeneratePin()}
                        className="text-sm text-primary hover:underline"
                      >
                        Generar PIN
                      </button>
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload & Preview */}
      <StoreImageUpload
        storeId={store.id}
        storeName={store.name}
        imageUrl={store.imageUrl}
        image1Url={store.image1Url}
        image2Url={store.image2Url}
        image3Url={store.image3Url}
      />

      {/* Opening Hours */}
      {store.openDays &&
      store.openDays.availableDays &&
      store.openDays.availableDays.length > 0 ? (
        <div className="bg-card rounded-lg shadow p-6 lg:col-span-3">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Horario de Apertura
          </h2>
          <div className="space-y-3">
            {store.openDays.availableDays.map((day, index) => {
              const dayLabel = DAY_LABELS[day.day.toLowerCase()] || day.day;
              return (
                <div key={index} className="flex justify-between">
                  <span className="font-medium text-foreground">
                    {dayLabel}
                  </span>
                  <span className="text-muted-foreground">
                    {day.closed
                      ? "Cerrado"
                      : `${convertTo12Hour(day.startTime)} - ${convertTo12Hour(day.endTime)}`}
                  </span>
                </div>
              );
            })}
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

      <DiscountSection
        className="lg:col-span-3"
        discount={discount}
        loading={discountIsLoading}
        storeId={store.id}
      />

      {/* Metadata */}
      <div className="bg-card rounded-lg shadow p-6 lg:col-span-3">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Metadatos
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              ID de Tienda
            </p>
            <p className="text-foreground text-sm font-mono">{store.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              ID de Categoría
            </p>
            <p className="text-foreground text-sm font-mono">
              {store.categoryId}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Creado el
            </p>
            <p className="text-foreground text-sm">
              {new Date(store.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Actualizado el
            </p>
            <p className="text-foreground text-sm">
              {new Date(store.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
