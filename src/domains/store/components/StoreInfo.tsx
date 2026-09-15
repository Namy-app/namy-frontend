import {
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Tag,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PRICE_SYMBOLS } from "@/data/constants";
import {
  useCreateRestaurantOwner,
  useOwnerStores,
  useResendStorePinEmail,
  useToggleStoreBilling,
  useUpdateStore,
} from "@/domains/admin/hooks";
import {
  BillingStatus,
  type Discount,
  type Store,
} from "@/domains/admin/types";
import { useToast } from "@/hooks/use-toast";
import { convertTo12Hour } from "@/lib/date-time-utils";
import { extractErrorMessage } from "@/lib/utils";

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

const BILLING_STATUS_BADGE: Record<
  BillingStatus,
  { label: string; className: string }
> = {
  [BillingStatus.ACTIVE]: {
    label: "Activo",
    className: "bg-green-500/20 text-green-700",
  },
  [BillingStatus.PAYMENT_FAILED]: {
    label: "Pago fallido",
    className: "bg-orange-500/20 text-orange-700",
  },
  [BillingStatus.GRACE_PERIOD]: {
    label: "Periodo de gracia",
    className: "bg-yellow-500/20 text-yellow-800",
  },
  [BillingStatus.HIDDEN]: {
    label: "Oculto",
    className: "bg-destructive/20 text-destructive",
  },
};

interface Props {
  store: Store;
  discounts?: Discount[];
  discountIsLoading?: boolean;
  generatingPin?: boolean;
  onGeneratePin: () => void;
}

export const StoreInfo = ({
  discounts = [],
  discountIsLoading,
  generatingPin,
  store,
  onGeneratePin,
}: Props) => {
  const { toast } = useToast();
  const resendPinEmail = useResendStorePinEmail();
  const toggleStoreBilling = useToggleStoreBilling();
  const createRestaurantOwner = useCreateRestaurantOwner();
  const updateStore = useUpdateStore();
  const { data: ownerStores } = useOwnerStores(store.owner?.id);
  const linkedStores = (ownerStores ?? []).filter(
    (linkedStore) => linkedStore.id !== store.id
  );

  const [ownerEmail, setOwnerEmail] = useState("");
  const [portalError, setPortalError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editDescription, setEditDescription] = useState(
    store.description ?? ""
  );
  const [editImageUrl, setEditImageUrl] = useState(store.imageUrl ?? "");
  const [editImage1Url, setEditImage1Url] = useState(store.image1Url ?? "");
  const [editImage2Url, setEditImage2Url] = useState(store.image2Url ?? "");
  const [editImage3Url, setEditImage3Url] = useState(store.image3Url ?? "");

  const billingEnabled = Boolean(store.billingEnabled);
  const accumulatedBalance =
    store.billing?.accumulatedBalance ?? store.accumulatedBalance ?? 0;
  const billingBadge = store.billingStatus
    ? BILLING_STATUS_BADGE[store.billingStatus]
    : null;

  const openEditForm = () => {
    setEditDescription(store.description ?? "");
    setEditImageUrl(store.imageUrl ?? "");
    setEditImage1Url(store.image1Url ?? "");
    setEditImage2Url(store.image2Url ?? "");
    setEditImage3Url(store.image3Url ?? "");
    setShowEditForm(true);
  };

  const handleToggleBilling = async () => {
    try {
      await toggleStoreBilling.mutateAsync({
        storeId: store.id,
        enabled: !billingEnabled,
      });
      toast({
        title: "Billing actualizado",
        description: !billingEnabled
          ? "Billing activado para esta tienda."
          : "Billing pausado para esta tienda.",
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description:
          extractErrorMessage(error) || "No se pudo actualizar el billing.",
        variant: "destructive",
      });
    }
  };

  const handleCreatePortalOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    setPortalError(null);
    const email = ownerEmail.trim();
    if (!email || !email.includes("@")) {
      setPortalError("Ingresa un email válido");
      return;
    }

    try {
      await createRestaurantOwner.mutateAsync({
        storeId: store.id,
        email,
      });
      toast({
        title: "Cuenta creada",
        description: `Cuenta creada. Email de bienvenida enviado a ${email}`,
      });
      setOwnerEmail("");
    } catch (error: unknown) {
      const message =
        extractErrorMessage(error) || "No se pudo crear la cuenta de portal.";
      setPortalError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleSaveStoreFields = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStore.mutateAsync({
        id: store.id,
        input: {
          description: editDescription.trim(),
          imageUrl: editImageUrl.trim(),
          image1Url: editImage1Url.trim(),
          image2Url: editImage2Url.trim(),
          image3Url: editImage3Url.trim(),
        },
      });
      toast({
        title: "Tienda actualizada",
        description: "Los cambios se guardaron correctamente.",
      });
      setShowEditForm(false);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description:
          extractErrorMessage(error) ||
          "No se pudo actualizar la tienda. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleResendPin = () => {
    if (!store.email) {
      toast({
        title: "Error",
        description: "Esta tienda no tiene un email configurado",
        variant: "destructive",
      });
      return;
    }

    resendPinEmail.mutate(
      {
        id: store.id,
        email: store.email,
      },
      {
        onSuccess: () => {
          toast({
            title: "Email enviado",
            description: `Se ha enviado el PIN a ${store.email}`,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo enviar el email. Intenta de nuevo.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="bg-card rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Información Básica
            </h2>
            <button
              type="button"
              onClick={openEditForm}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Editar
            </button>
          </div>
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
            {store.email ? (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-foreground">{store.email}</p>
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
                  PIN de Tienda (4 dígitos)
                </p>
                <p className="text-foreground">
                  {store.plainPin ?? "••••"}
                  {store.plainPin ? (
                    <>
                      <span className="mx-2 text-muted-foreground">|</span>
                      <button
                        onClick={handleResendPin}
                        disabled={resendPinEmail.isPending || !store.email}
                        className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
                        title={
                          !store.email
                            ? "No hay email configurado"
                            : "Reenviar PIN por email"
                        }
                      >
                        {resendPinEmail.isPending ? (
                          <Loader2 className="w-4 h-4 text-primary animate-spin inline" />
                        ) : (
                          "Reenviar"
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="mx-2 text-muted-foreground">|</span>
                      <button
                        onClick={() => onGeneratePin()}
                        disabled={generatingPin}
                        className="text-sm text-primary hover:underline disabled:opacity-50"
                      >
                        {generatingPin ? (
                          <Loader2 className="w-4 h-4 text-primary animate-spin inline" />
                        ) : (
                          "Regenerar"
                        )}
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Billing */}
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            Billing
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="billing-enabled"
                className="text-sm font-medium text-foreground"
              >
                {billingEnabled ? "Billing activado" : "Billing pausado"}
              </label>
              <button
                id="billing-enabled"
                type="button"
                role="switch"
                aria-checked={billingEnabled}
                disabled={toggleStoreBilling.isPending}
                onClick={() => void handleToggleBilling()}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  billingEnabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    billingEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {billingBadge ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Estado
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${billingBadge.className}`}
                >
                  {billingBadge.label}
                </span>
              </div>
            ) : null}
            <p className="text-foreground">
              Balance de esta ubicación: ${accumulatedBalance} MXN
            </p>
            {store.ownerBilling ? (
              <>
                <p className="text-foreground">
                  Balance combinado del propietario: $
                  {store.ownerBilling.accumulatedBalance} MXN
                </p>
                <p className="text-sm text-muted-foreground">
                  {store.ownerBilling.billingEnabledStoreCount} de{" "}
                  {store.ownerBilling.totalStoreCount} ubicaciones con billing
                  activado
                </p>
              </>
            ) : null}
          </div>
        </div>

        {/* Portal Access */}
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-muted-foreground" />
            Portal Access
          </h2>
          {store.owner?.email ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-foreground">
                  Propietario: {store.owner.email}
                </p>
              </div>
              {linkedStores.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Este propietario también tiene acceso a:
                  </p>
                  <ul className="space-y-1">
                    {linkedStores.map((linkedStore) => (
                      <li key={linkedStore.id}>
                        <Link
                          href={`/admin/stores/${linkedStore.id}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {linkedStore.name}
                          {linkedStore.city ? ` · ${linkedStore.city}` : ""}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <form
              onSubmit={(e) => void handleCreatePortalOwner(e)}
              className="space-y-3"
            >
              <div>
                <label
                  htmlFor="portal-owner-email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email del propietario
                </label>
                <input
                  id="portal-owner-email"
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => {
                    setOwnerEmail(e.target.value);
                    setPortalError(null);
                  }}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="owner@example.com"
                  disabled={createRestaurantOwner.isPending}
                />
              </div>
              {portalError ? (
                <p className="text-sm text-destructive">{portalError}</p>
              ) : null}
              <button
                type="submit"
                disabled={createRestaurantOwner.isPending}
                className="w-full px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {createRestaurantOwner.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear cuenta de portal"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Image Upload & Preview */}
        <div className="lg:col-span-3">
          <StoreImageUpload
            storeId={store.id}
            storeName={store.name}
            imageUrl={store.imageUrl}
            image1Url={store.image1Url}
            image2Url={store.image2Url}
            image3Url={store.image3Url}
          />
        </div>

        {/* Opening Hours */}
        {store.openDays &&
        store.openDays.availableDays &&
        store.openDays.availableDays.length > 0 ? (
          <div className="bg-card rounded-lg shadow p-6 lg:col-span-3">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Horario de Apertura
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-y-4">
              {store.openDays.availableDays.map((day, index) => {
                const dayLabel = DAY_LABELS[day.day.toLowerCase()] || day.day;
                return (
                  <div key={index} className="flex flex-col">
                    <span className="font-medium text-foreground block">
                      {dayLabel}
                    </span>
                    <span className="text-muted-foreground">
                      {day.closed
                        ? "Cerrado"
                        : `(${convertTo12Hour(day.startTime)} - ${convertTo12Hour(day.endTime)})`}
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
          discounts={discounts}
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
                Categoría
              </p>
              <p className="text-foreground text-sm">
                {store.categoryIds?.length ? "—" : "N/A"}
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

      {showEditForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h2 className="text-2xl font-bold text-foreground">
                Editar tienda
              </h2>
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                disabled={updateStore.isPending}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => void handleSaveStoreFields(e)}
              className="flex flex-col flex-1 min-h-0"
            >
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Descripción de la tienda..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Imagen principal (URL)
                  </label>
                  <input
                    type="url"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Imagen 1 (URL)
                  </label>
                  <input
                    type="url"
                    value={editImage1Url}
                    onChange={(e) => setEditImage1Url(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Imagen 2 (URL)
                  </label>
                  <input
                    type="url"
                    value={editImage2Url}
                    onChange={(e) => setEditImage2Url(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Imagen 3 (URL)
                  </label>
                  <input
                    type="url"
                    value={editImage3Url}
                    onChange={(e) => setEditImage3Url(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex gap-3 p-6 border-t border-border shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  disabled={updateStore.isPending}
                  className="flex-1 px-4 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updateStore.isPending}
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updateStore.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
};
