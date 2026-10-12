"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import { PartnerExpired } from "@/components/partner/PartnerExpired";
import type { User } from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import { EXCHANGE_PARTNER_CODE_MUTATION } from "@/lib/graphql-queries";
import { useAuthStore } from "@/store/useAuthStore";
import {
  usePartnerStore,
  type PartnerConfig,
  type PartnerLang,
} from "@/store/usePartnerStore";

interface ExchangePartnerCodePayload {
  accessToken: string;
  user: User;
  partner: PartnerConfig;
}

interface ExchangePartnerCodeResponse {
  exchangePartnerCode: ExchangePartnerCodePayload;
}

const DEFAULT_REDIRECT = "/explore";

/**
 * Shared across StrictMode remounts. A ref resets when React remounts the
 * page in development, which would exchange a one-time code twice.
 */
let pendingPartnerExchange: {
  code: string;
  lang: PartnerLang;
  redirect: string;
  promise: Promise<ExchangePartnerCodePayload>;
} | null = null;

function sanitizeRedirect(value: string | null): string {
  if (!value) {
    return DEFAULT_REDIRECT;
  }
  const redirect = value.trim();
  if (!redirect.startsWith("/")) {
    return DEFAULT_REDIRECT;
  }
  if (/[\\\s\x00-\x1f]/.test(redirect)) {
    return DEFAULT_REDIRECT;
  }
  if (redirect.startsWith("//") || redirect.includes("://")) {
    return DEFAULT_REDIRECT;
  }
  if (redirect.startsWith("/partner") || redirect.startsWith("/auth")) {
    return DEFAULT_REDIRECT;
  }
  return redirect;
}

function parseLang(value: string | null): PartnerLang {
  return value === "es" ? "es" : "en";
}

function readParentOrigin(): string | null {
  if (!document.referrer) {
    return null;
  }
  try {
    return new URL(document.referrer).origin;
  } catch {
    return null;
  }
}

function PartnerEntryPending(): React.JSX.Element {
  const logoUrl = usePartnerStore(
    (state) => state.partner?.branding.logoUrl ?? null
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6">
      {logoUrl ? (
        // Partner logos are arbitrary remote URLs, not images.remotePatterns hosts.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt=""
          className="h-16 max-w-[12rem] object-contain"
        />
      ) : null}
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-800"
        role="status"
      />
    </div>
  );
}

function PartnerEntryContent(): React.JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const exchangeStartedRef = useRef<string | null>(null);
  const [exchangeFailed, setExchangeFailed] = useState(false);

  const codeFromUrl = searchParams?.get("code")?.trim() ?? "";
  const langFromUrl = parseLang(searchParams?.get("lang") ?? null);
  const redirectFromUrl = sanitizeRedirect(
    searchParams?.get("redirect") ?? null
  );
  const entry =
    pendingPartnerExchange != null &&
    (codeFromUrl.length === 0 || pendingPartnerExchange.code === codeFromUrl)
      ? pendingPartnerExchange
      : {
          code: codeFromUrl,
          lang: langFromUrl,
          redirect: redirectFromUrl,
        };
  const missingCode = entry.code.length === 0;

  useEffect(() => {
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname
    );

    if (missingCode) {
      return;
    }

    if (exchangeStartedRef.current !== entry.code) {
      exchangeStartedRef.current = entry.code;
      if (
        !pendingPartnerExchange ||
        pendingPartnerExchange.code !== entry.code
      ) {
        pendingPartnerExchange = {
          code: entry.code,
          lang: entry.lang,
          redirect: entry.redirect,
          promise: graphqlRequest<ExchangePartnerCodeResponse>(
            EXCHANGE_PARTNER_CODE_MUTATION,
            { code: entry.code }
          ).then((result) => result.exchangePartnerCode),
        };
      }
    }

    const pending = pendingPartnerExchange;
    if (!pending) {
      return;
    }

    let active = true;
    void pending.promise
      .then((payload) => {
        if (!active) {
          return;
        }
        useAuthStore
          .getState()
          .setAuth(payload.user, payload.accessToken, false, {
            partner: true,
          });
        usePartnerStore
          .getState()
          .setPartner(payload.partner, pending.lang, readParentOrigin());
        router.replace(pending.redirect);
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setExchangeFailed(true);
      });

    return () => {
      active = false;
    };
  }, [entry.code, entry.lang, entry.redirect, missingCode, router]);

  if (missingCode || exchangeFailed) {
    return <PartnerExpired />;
  }

  return <PartnerEntryPending />;
}

export default function PartnerEntryPage(): React.JSX.Element {
  return (
    <Suspense fallback={<PartnerEntryPending />}>
      <PartnerEntryContent />
    </Suspense>
  );
}
