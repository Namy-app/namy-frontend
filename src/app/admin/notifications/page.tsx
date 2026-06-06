"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Bell,
  Check,
  ImagePlus,
  Loader2,
  Search,
  Send,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { toast } from "@/hooks/use-toast";
import { graphqlClient } from "@/lib/graphql-client";
import { cn } from "@/lib/utils";

function deferToast(...args: Parameters<typeof toast>): void {
  window.setTimeout(() => toast(...args), 0);
}

function SwapIcon({
  active,
  activeIcon: ActiveIcon,
  idleIcon: IdleIcon,
  className = "w-4 h-4",
}: {
  active: boolean;
  activeIcon: LucideIcon;
  idleIcon: LucideIcon;
  className?: string;
}): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        className
      )}
      aria-hidden
    >
      <ActiveIcon
        className={cn(className, "animate-spin", !active && "hidden")}
      />
      <IdleIcon className={cn(className, active && "hidden")} />
    </span>
  );
}

const SEND_PROMO_NOTIFICATION = `
  mutation SendPromoNotification($input: SendPromoInput!) {
    sendPromoNotification(input: $input)
  }
`;

const GET_STORES_FOR_PICKER = `
  query GetStoresForPicker($pagination: PaginationInput!) {
    stores(pagination: $pagination) {
      data { id name }
    }
  }
`;

const GET_USERS_FOR_PICKER = `
  query GetUsersForPicker($page: Int, $first: Int, $search: String) {
    users(page: $page, first: $first, search: $search) {
      data { id email displayName }
    }
  }
`;

interface Store {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  displayName?: string | null;
}

interface SendPromoInput {
  title: string;
  body: string;
  imageUrl?: string;
  deepLink?: string;
  startsAt?: string;
  expiresAt?: string;
  storeId?: string;
  storeIds?: string[];
  userIds?: string[];
}

function buildDeepLink(selected: Store[]): string {
  if (selected.length === 0) {
    return "";
  }
  if (selected.length === 1 && selected[0]) {
    return `/stores/${selected[0].id}`;
  }
  return `/restaurants?ids=${selected.map((s) => s.id).join(",")}`;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Reusable searchable picker ──────────────────────────────────────────────

interface PickerItem {
  id: string;
  label: string;
  sublabel?: string;
}

interface SearchablePickerProps {
  selected: PickerItem[];
  items: PickerItem[];
  loading: boolean;
  placeholder: string;
  searchPlaceholder: string;
  noResults: string;
  chipColor?: string;
  onSearch: (q: string) => void;
  onToggle: (item: PickerItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

function SearchablePicker({
  selected,
  items,
  loading,
  placeholder,
  searchPlaceholder,
  noResults,
  chipColor = "bg-primary/10 text-primary",
  onSearch,
  onToggle,
  onRemove,
  onClear,
}: SearchablePickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleQuery = (v: string) => {
    setQuery(v);
    onSearch(v);
  };

  return (
    <div className="space-y-2">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${chipColor}`}
            >
              <span className="max-w-40 truncate">{item.label}</span>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="hover:opacity-70 transition-opacity"
                aria-label={`Quitar ${item.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-destructive underline"
          >
            Limpiar
          </button>
        </div>
      )}

      {/* Trigger + dropdown */}
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-sm hover:bg-muted transition-colors"
        >
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">
            {loading
              ? "Cargando..."
              : selected.length === 0
                ? placeholder
                : `${selected.length} seleccionado${selected.length !== 1 ? "s" : ""}`}
          </span>
        </button>

        {open ? (
          <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-lg shadow-xl overflow-hidden">
            <div className="p-2 border-b border-border">
              <input
                autoFocus
                value={query}
                onChange={(e) => handleQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <ul className="max-h-56 overflow-y-auto">
              {loading ? (
                <li className="flex items-center justify-center py-4 gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Buscando...
                </li>
              ) : items.length === 0 ? (
                <li className="px-3 py-4 text-sm text-muted-foreground text-center">
                  {noResults}
                </li>
              ) : (
                items.map((item) => {
                  const isSelected = !!selected.find((s) => s.id === item.id);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => onToggle(item)}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <span className="flex flex-col items-start text-left">
                          <span>{item.label}</span>
                          {item.sublabel ? (
                            <span className="text-xs text-muted-foreground">
                              {item.sublabel}
                            </span>
                          ) : null}
                        </span>
                        {isSelected ? (
                          <Check className="w-4 h-4 text-primary shrink-0 ml-2" />
                        ) : null}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState<number | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Store picker
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [selectedStores, setSelectedStores] = useState<Store[]>([]);
  const [storeSearchQuery, setStoreSearchQuery] = useState("");

  // User picker
  const [userResults, setUserResults] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const debouncedUserSearch = useDebounce(userSearchQuery, 350);

  const [form, setForm] = useState({
    title: "",
    body: "",
    imageUrl: "",
    startsAt: "",
    expiresAt: "",
  });
  const [scheduleEnabled, setScheduleEnabled] = useState(false);

  // Load all stores once
  useEffect(() => {
    graphqlClient
      .request<{ stores: { data: Store[] } }>(GET_STORES_FOR_PICKER, {
        pagination: { page: 1, first: 200 },
      })
      .then((res) => setAllStores(res.stores.data))
      .catch(() =>
        toast({
          title: "Error",
          description: "No se pudieron cargar los restaurantes.",
          variant: "destructive",
        })
      )
      .finally(() => setStoresLoading(false));
  }, [toast]);

  // Search users on debounced query
  useEffect(() => {
    if (!debouncedUserSearch.trim()) {
      setUserResults([]);
      return;
    }
    setUsersLoading(true);
    graphqlClient
      .request<{ users: { data: User[] } }>(GET_USERS_FOR_PICKER, {
        page: 1,
        first: 20,
        search: debouncedUserSearch.trim(),
      })
      .then((res) => setUserResults(res.users.data))
      .catch(() => setUserResults([]))
      .finally(() => setUsersLoading(false));
  }, [debouncedUserSearch]);

  // Store picker helpers
  const filteredStores = useMemo(() => {
    const q = storeSearchQuery.toLowerCase();
    return allStores.filter((s) => s.name.toLowerCase().includes(q));
  }, [allStores, storeSearchQuery]);

  const storeItems: PickerItem[] = filteredStores.map((s) => ({
    id: s.id,
    label: s.name,
  }));
  const selectedStoreItems: PickerItem[] = selectedStores.map((s) => ({
    id: s.id,
    label: s.name,
  }));

  const toggleStore = (item: PickerItem) => {
    setSelectedStores((prev) => {
      const exists = prev.find((s) => s.id === item.id);
      if (exists) {
        return prev.filter((s) => s.id !== item.id);
      }
      return [...prev, { id: item.id, name: item.label }];
    });
    setSentCount(null);
  };

  // User picker helpers
  const userItems: PickerItem[] = userResults
    .filter((u) => !selectedUsers.find((s) => s.id === u.id))
    .map((u) => ({
      id: u.id,
      label: u.displayName ?? u.email,
      sublabel: u.displayName ? u.email : undefined,
    }));
  const selectedUserItems: PickerItem[] = selectedUsers.map((u) => ({
    id: u.id,
    label: u.displayName ?? u.email,
    sublabel: u.displayName ? u.email : undefined,
  }));

  const toggleUser = (item: PickerItem) => {
    const found = userResults.find((u) => u.id === item.id);
    if (!found) {
      return;
    }
    setSelectedUsers((prev) => {
      const exists = prev.find((u) => u.id === item.id);
      if (exists) {
        return prev.filter((u) => u.id !== item.id);
      }
      return [...prev, found];
    });
    setSentCount(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSentCount(null);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      deferToast({
        title: "Imagen demasiado grande",
        description: "Máximo 5 MB.",
        variant: "destructive",
      });
      return;
    }
    setImageUploading(true);
    try {
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/graphql"
      ).replace("/graphql", "");
      const { useAuthStore } = await import("@/store/useAuthStore");
      const accessToken = useAuthStore.getState().accessToken;
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
      setForm((prev) => ({ ...prev, imageUrl: json.url }));
      deferToast({
        title: "Imagen subida",
        description: "URL lista para usar.",
      });
    } catch {
      deferToast({
        title: "Error al subir",
        description: "No se pudo subir la imagen.",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
      window.setTimeout(() => {
        e.target.value = "";
      }, 0);
    }
  };

  const derivedDeepLink = buildDeepLink(selectedStores);

  const handleSend = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      deferToast({
        title: "Campos requeridos",
        description: "El título y el mensaje son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    const input: SendPromoInput = {
      title: form.title.trim(),
      body: form.body.trim(),
    };

    if (form.imageUrl.trim()) {
      input.imageUrl = form.imageUrl.trim();
    }
    if (derivedDeepLink) {
      input.deepLink = derivedDeepLink;
    }
    if (scheduleEnabled && form.startsAt.trim()) {
      input.startsAt = new Date(form.startsAt).toISOString();
    }
    if (form.expiresAt.trim()) {
      input.expiresAt = new Date(form.expiresAt).toISOString();
    }

    if (selectedStores.length === 1 && selectedStores[0]) {
      input.storeId = selectedStores[0].id;
    } else if (selectedStores.length > 1) {
      input.storeIds = selectedStores.map((s) => s.id);
    }

    if (selectedUsers.length > 0) {
      input.userIds = selectedUsers.map((u) => u.id);
    }

    setIsSending(true);
    try {
      const result = await graphqlClient.request<{
        sendPromoNotification: number;
      }>(SEND_PROMO_NOTIFICATION, { input });
      const count = result.sendPromoNotification;
      setSentCount(count);
      deferToast({
        title:
          scheduleEnabled && form.startsAt
            ? "Notificación programada"
            : "Notificación enviada",
        description:
          scheduleEnabled && form.startsAt
            ? `Se enviará a ${count} usuario${count !== 1 ? "s" : ""} el ${new Date(form.startsAt).toLocaleString()}.`
            : `Se envió a ${count} usuario${count !== 1 ? "s" : ""}.`,
      });
    } catch (err) {
      deferToast({
        title: "Error al enviar",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notificaciones</h1>
          <p className="text-muted-foreground">
            Envía notificaciones promocionales a los usuarios
          </p>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-card p-6 space-y-6">
        {/* ── Content ── */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Contenido
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Título <span className="text-destructive">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej: ¡Oferta especial este fin de semana!"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Mensaje <span className="text-destructive">*</span>
              </label>
              <textarea
                name="body"
                value={form.body}
                onChange={handleChange}
                rows={3}
                placeholder="Ej: Consigue un 20% de descuento en todos los restaurantes participantes."
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Imagen (opcional)
              </label>
              <div className="flex gap-2">
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://... o sube una imagen"
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={imageUploading}
                  title="Subir imagen"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-foreground shrink-0"
                >
                  <SwapIcon
                    active={imageUploading}
                    activeIcon={Loader2}
                    idleIcon={ImagePlus}
                    className="w-4 h-4"
                  />
                  {imageUploading ? "Subiendo…" : "Subir"}
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    void handleImageUpload(e);
                  }}
                />
              </div>
              {form.imageUrl ? (
                <div className="mt-2 h-20 w-32 overflow-hidden rounded-lg border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.imageUrl}
                    alt="Vista previa"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-foreground">
                  Fecha de inicio{" "}
                  <span className="text-muted-foreground font-normal">
                    (opcional)
                  </span>
                </label>
                {scheduleEnabled ? (
                  <button
                    type="button"
                    onClick={() => {
                      setScheduleEnabled(false);
                      setForm((p) => ({ ...p, startsAt: "" }));
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    Enviar ahora
                  </button>
                ) : null}
              </div>
              {!scheduleEnabled ? (
                <button
                  type="button"
                  onClick={() => setScheduleEnabled(true)}
                  className="w-full px-3 py-2 rounded-lg border border-dashed border-border bg-background text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors text-left"
                >
                  + Programar para más tarde
                </button>
              ) : (
                <input
                  type="datetime-local"
                  name="startsAt"
                  value={form.startsAt}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                {scheduleEnabled && form.startsAt
                  ? `Se enviará el ${new Date(form.startsAt).toLocaleString()}`
                  : "Dejar vacío para enviar inmediatamente."}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Fecha de expiración
              </label>
              <input
                type="datetime-local"
                name="expiresAt"
                value={form.expiresAt}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </section>

        {/* ── Store Picker ── */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Restaurantes
          </h2>
          <p className="text-xs text-muted-foreground mb-3">
            Selecciona uno o varios. El deep link y los IDs se generan
            automáticamente.
          </p>

          <SearchablePicker
            selected={selectedStoreItems}
            items={storeItems}
            loading={storesLoading}
            placeholder="Buscar y seleccionar restaurantes..."
            searchPlaceholder="Buscar restaurante..."
            noResults="Sin resultados"
            chipColor="bg-primary/10 text-primary"
            onSearch={setStoreSearchQuery}
            onToggle={toggleStore}
            onRemove={(id) =>
              setSelectedStores((p) => p.filter((s) => s.id !== id))
            }
            onClear={() => setSelectedStores([])}
          />

          {derivedDeepLink ? (
            <div className="mt-3 px-3 py-2 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-0.5">
                Deep link generado
              </p>
              <p className="text-sm font-mono text-foreground break-all">
                {derivedDeepLink}
              </p>
            </div>
          ) : null}
        </section>

        {/* ── User Picker ── */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Destinatarios
            </span>
          </h2>
          <p className="text-xs text-muted-foreground mb-3">
            Busca y selecciona usuarios específicos. Dejar vacío para enviar a
            todos los activos.
          </p>

          <SearchablePicker
            selected={selectedUserItems}
            items={userItems}
            loading={usersLoading}
            placeholder="Buscar usuario por nombre o email..."
            searchPlaceholder="Escribe para buscar..."
            noResults={
              userSearchQuery.trim()
                ? "Sin resultados"
                : "Escribe para buscar usuarios"
            }
            chipColor="bg-secondary/20 text-secondary-foreground"
            onSearch={setUserSearchQuery}
            onToggle={toggleUser}
            onRemove={(id) =>
              setSelectedUsers((p) => p.filter((u) => u.id !== id))
            }
            onClear={() => setSelectedUsers([])}
          />

          {selectedUsers.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2 italic">
              Sin selección → se enviará a todos los usuarios activos.
            </p>
          )}
        </section>

        {/* ── Success banner ── */}
        {sentCount !== null && (
          <div className="flex items-center gap-3 bg-secondary/10 border border-secondary/20 rounded-lg p-4">
            <Bell className="w-5 h-5 text-secondary-foreground shrink-0" />
            <p className="text-sm text-secondary-foreground">
              Enviado correctamente a{" "}
              <strong>
                {sentCount} usuario{sentCount !== 1 ? "s" : ""}
              </strong>
              .
            </p>
          </div>
        )}

        {/* ── Send button ── */}
        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={isSending || !form.title.trim() || !form.body.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SwapIcon
            active={isSending}
            activeIcon={Loader2}
            idleIcon={Send}
            className="w-5 h-5"
          />
          {isSending
            ? "Enviando..."
            : scheduleEnabled && form.startsAt
              ? "Programar notificación"
              : "Enviar notificación"}
        </button>
      </div>
    </div>
  );
}
