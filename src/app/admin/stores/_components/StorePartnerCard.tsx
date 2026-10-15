"use client";

import { useState } from "react";

import {
  useAdminPartners,
  useSetStoreExclusivePartner,
  useSetStoreHiddenForPartner,
  useStorePartnerSettings,
} from "@/domains/admin/hooks";
import type { AdminPartner } from "@/domains/admin/types";
import { useToast } from "@/hooks/use-toast";
import { extractErrorMessage } from "@/lib/utils";

function partnerLabel(partners: AdminPartner[], partnerId: string): string {
  return (
    partners.find((partner) => partner.id === partnerId)?.name ?? "Partner"
  );
}

export function StorePartnerCard({
  storeId,
}: {
  storeId: string;
}): React.JSX.Element {
  const { toast } = useToast();
  const partnersQuery = useAdminPartners();
  const settingsQuery = useStorePartnerSettings(storeId);
  const setExclusive = useSetStoreExclusivePartner();
  const setHidden = useSetStoreHiddenForPartner();
  const [confirmPartnerId, setConfirmPartnerId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const partners = partnersQuery.data ?? [];
  const activePartners = partners.filter((partner) => partner.active);
  const exclusivePartnerId = settingsQuery.data?.exclusivePartnerId ?? null;
  const hiddenIds = settingsQuery.data?.hiddenForPartnerIds ?? [];
  const saving = setExclusive.isPending || setHidden.isPending;
  const loading = partnersQuery.isLoading || settingsQuery.isLoading;
  const loadError = partnersQuery.error ?? settingsQuery.error;

  const exclusiveChoices = activePartners.some(
    (partner) => partner.id === exclusivePartnerId
  )
    ? activePartners
    : exclusivePartnerId
      ? [
          ...activePartners,
          {
            id: exclusivePartnerId,
            slug: "",
            name: partnerLabel(partners, exclusivePartnerId),
            active: false,
          },
        ]
      : activePartners;

  const saveExclusive = async (partnerId: string | null): Promise<void> => {
    setActionError(null);
    try {
      await setExclusive.mutateAsync({ storeId, partnerId });
      const name = partnerId ? partnerLabel(partners, partnerId) : null;
      toast({
        title: "Partners updated",
        description: name
          ? `Only ${name} users will see this business.`
          : "Ñamy users will see this business.",
      });
    } catch (error) {
      const message =
        extractErrorMessage(error) ?? "Could not update partner access.";
      setActionError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setConfirmPartnerId(null);
      setConfirmClear(false);
    }
  };

  const saveHidden = async (
    partnerId: string,
    hidden: boolean
  ): Promise<void> => {
    setActionError(null);
    try {
      await setHidden.mutateAsync({ storeId, partnerId, hidden });
      toast({
        title: "Partners updated",
        description: hidden
          ? `Hidden from ${partnerLabel(partners, partnerId)}.`
          : `Visible to ${partnerLabel(partners, partnerId)}.`,
      });
    } catch (error) {
      const message =
        extractErrorMessage(error) ?? "Could not update partner visibility.";
      setActionError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    }
  };

  const confirmedName = confirmPartnerId
    ? partnerLabel(partners, confirmPartnerId)
    : "";

  return (
    <div className="bg-card rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-foreground mb-1">Partners</h2>
      <p className="text-sm text-muted-foreground mb-5">
        Control which partner apps can see this business.
      </p>

      {loading ? (
        <div className="flex items-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          <span className="ml-3 text-muted-foreground">
            Loading partners...
          </span>
        </div>
      ) : null}

      {!loading && loadError ? (
        <p className="text-sm text-destructive">
          {extractErrorMessage(loadError) ?? "Could not load partner settings."}
        </p>
      ) : null}

      {!loading && !loadError ? (
        <div className="space-y-6">
          <div>
            <label
              htmlFor="exclusive-partner"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Exclusive to
            </label>
            <select
              id="exclusive-partner"
              value={exclusivePartnerId ?? ""}
              disabled={saving}
              onChange={(event) => {
                const next = event.target.value;
                if (next === (exclusivePartnerId ?? "")) {
                  return;
                }
                if (!next) {
                  setConfirmClear(true);
                  return;
                }
                setConfirmPartnerId(next);
              }}
              className="w-full max-w-md px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
            >
              <option value="">None (all users)</option>
              {exclusiveChoices.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-3">
              Hide from
            </p>
            {activePartners.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No active partners.
              </p>
            ) : (
              <ul className="space-y-3">
                {activePartners.map((partner) => {
                  const isExclusive = partner.id === exclusivePartnerId;
                  const hidden = hiddenIds.includes(partner.id);
                  return (
                    <li
                      key={partner.id}
                      className="flex items-center justify-between gap-4 max-w-md"
                    >
                      <span className="text-sm text-foreground">
                        {partner.name}
                      </span>
                      <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={hidden}
                          disabled={saving || isExclusive}
                          onChange={(event) => {
                            void saveHidden(partner.id, event.target.checked);
                          }}
                          className="h-4 w-4 rounded border-border text-primary disabled:opacity-50"
                        />
                        {isExclusive
                          ? "Exclusive"
                          : hidden
                            ? "Hidden"
                            : "Visible"}
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {actionError ? (
            <p className="text-sm text-destructive">{actionError}</p>
          ) : null}
        </div>
      ) : null}

      {confirmPartnerId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-foreground mb-3">
              Exclusive to {confirmedName}
            </h3>
            <p className="text-muted-foreground mb-6">
              Only {confirmedName} users will see this business. Ñamy users
              won&apos;t.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmPartnerId(null)}
                disabled={setExclusive.isPending}
                className="flex-1 px-4 py-2 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveExclusive(confirmPartnerId)}
                disabled={setExclusive.isPending}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
              >
                {setExclusive.isPending ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmClear ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-foreground mb-3">
              Visible to everyone
            </h3>
            <p className="text-muted-foreground mb-6">
              Ñamy users will see this business.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                disabled={setExclusive.isPending}
                className="flex-1 px-4 py-2 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveExclusive(null)}
                disabled={setExclusive.isPending}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
              >
                {setExclusive.isPending ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
