"use client";

import {
  Check,
  ImagePlus,
  Loader2,
  Search,
  Send,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { graphqlClient } from "@/lib/graphql-client";

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
  storeImages?: Record<string, string | undefined>;
}

interface PickerItem {
  id: string;
  label: string;
  sublabel?: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
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
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <span
              key={item.id}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${chipColor}`}
            >
              <span className="max-w-40 truncate">{item.label}</span>
              <button
                onClick={() => onRemove(item.id)}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-destructive underline"
          >
            Limpiar
          </button>
        </div>
      )}

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

interface NotificationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function NotificationFormModal({
  isOpen,
  onClose,
  onSuccess,
}: NotificationFormModalProps) {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState<number | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadingStoreId, setUploadingStoreId] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const storeImageInputRef = useRef<HTMLInputElement>(null);

  const [allStores, setAllStores] = useState<Store[]>([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [selectedStores, setSelectedStores] = useState<Store[]>([]);
  const [storeSearchQuery, setStoreSearchQuery] = useState("");

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
  const [storeImages, setStoreImages] = useState<Record<string, string>>({});
  const [scheduleEnabled, setScheduleEnabled] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

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
  }, [isOpen, toast]);

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
      toast({
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
      toast({ title: "Imagen subida", description: "URL lista para usar." });
    } catch {
      toast({
        title: "Error al subir",
        description: "No se pudo subir la imagen.",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
      e.target.value = "";
    }
  };

  const handleStoreImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    storeId: string
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Imagen demasiado grande",
        description: "Máximo 5 MB.",
        variant: "destructive",
      });
      return;
    }
    setUploadingStoreId(storeId);
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
      setStoreImages((prev) => ({ ...prev, [storeId]: json.url }));
      toast({
        title: "Imagen subida",
        description: `Imagen para restaurante agregada.`,
      });
    } catch {
      toast({
        title: "Error al subir",
        description: "No se pudo subir la imagen.",
        variant: "destructive",
      });
    } finally {
      setUploadingStoreId(null);
      e.target.value = "";
    }
  };

  const derivedDeepLink = buildDeepLink(selectedStores);

  const handleSend = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast({
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
      if (storeImages[selectedStores[0].id]) {
        input.imageUrl = storeImages[selectedStores[0].id];
      }
    } else if (selectedStores.length > 1) {
      input.storeIds = selectedStores.map((s) => s.id);
      const hasPerStoreImages = selectedStores.some((s) => storeImages[s.id]);
      if (hasPerStoreImages) {
        const perStoreImages: Record<string, string | undefined> = {};
        selectedStores.forEach((store) => {
          if (storeImages[store.id]) {
            perStoreImages[store.id] = storeImages[store.id];
          }
        });
        input.storeImages = perStoreImages;
      }
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
      toast({
        title:
          scheduleEnabled && form.startsAt
            ? "Notificación programada"
            : "Notificación enviada",
        description:
          scheduleEnabled && form.startsAt
            ? `Se enviará a ${count} usuario${count !== 1 ? "s" : ""} el ${new Date(form.startsAt).toLocaleString()}.`
            : `Se envió a ${count} usuario${count !== 1 ? "s" : ""}.`,
      });

      // Reset form after success
      setTimeout(() => {
        setForm({
          title: "",
          body: "",
          imageUrl: "",
          startsAt: "",
          expiresAt: "",
        });
        setSelectedStores([]);
        setSelectedUsers([]);
        setStoreImages({});
        setScheduleEnabled(false);
        setSentCount(null);
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (err) {
      toast({
        title: "Error al enviar",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            Crear Notificación
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Content Section */}
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Contenido
            </h3>
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
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-foreground shrink-0"
                  >
                    {imageUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ImagePlus className="w-4 h-4" />
                    )}
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
                  <div className="relative mt-2 h-20 w-32 overflow-hidden rounded-lg border border-border">
                    <Image
                      src={form.imageUrl}
                      alt="preview"
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {/* Store Picker */}
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Restaurantes
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Selecciona uno o varios. El deep link se genera automáticamente.
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

            {selectedStores.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Imágenes por restaurante (opcional)
                </h4>
                <div className="space-y-3">
                  {selectedStores.map((store) => (
                    <div
                      key={store.id}
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {store.name}
                        </p>
                        {storeImages[store.id] ? (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Imagen agregada
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => storeImageInputRef.current?.click()}
                        disabled={uploadingStoreId === store.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium text-foreground shrink-0"
                      >
                        {uploadingStoreId === store.id ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Subiendo…
                          </>
                        ) : storeImages[store.id] ? (
                          <>
                            <ImagePlus className="w-3 h-3" />
                            Cambiar
                          </>
                        ) : (
                          <>
                            <ImagePlus className="w-3 h-3" />
                            Subir
                          </>
                        )}
                      </button>
                      <input
                        ref={storeImageInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          void handleStoreImageUpload(e, store.id);
                        }}
                      />
                      {storeImages[store.id] ? (
                        <button
                          type="button"
                          onClick={() => {
                            setStoreImages((prev) => {
                              const updated = { ...prev };
                              delete updated[store.id];
                              return updated;
                            });
                          }}
                          className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors text-destructive shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* User Picker */}
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Destinatarios
              </span>
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Busca y selecciona usuarios. Dejar vacío para enviar a todos.
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
          </section>

          {/* Success Banner */}
          {sentCount !== null && (
            <div className="flex items-center gap-3 bg-secondary/10 border border-secondary/20 rounded-lg p-4">
              <Send className="w-5 h-5 text-secondary-foreground shrink-0" />
              <p className="text-sm text-secondary-foreground">
                Enviado correctamente a{" "}
                <strong>
                  {sentCount} usuario{sentCount !== 1 ? "s" : ""}
                </strong>
                .
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={() => void handleSend()}
            disabled={isSending || !form.title.trim() || !form.body.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Enviar
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
