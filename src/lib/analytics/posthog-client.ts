import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import type { PostHog } from "posthog-js";

import { env } from "@/lib/env";

import packageJson from "../../../package.json";

import type {
  AnalyticsEventMap,
  AnalyticsEventName,
  AnalyticsPlatform,
  IdentifyTraits,
} from "./types";

type PostHogClient = PostHog;

const DEFAULT_POSTHOG_HOST = "https://us.i.posthog.com";
const APP_OPENED_SESSION_KEY = "namy_analytics_app_opened";

let client: PostHogClient | null = null;
let initStarted = false;
let initPromise: Promise<PostHogClient | null> | null = null;
const lastDistinctKeys = new Map<string, string>();

export function getAnalyticsPlatform(): AnalyticsPlatform {
  if (typeof window === "undefined") {
    return "web";
  }
  try {
    const platform = Capacitor.getPlatform();
    if (platform === "ios" || platform === "android") {
      return platform;
    }
  } catch {
    // Capacitor unavailable during SSR or tests
  }
  return "web";
}

async function resolveAppMeta(): Promise<{
  app_version: string;
  app_build?: string;
}> {
  if (typeof window === "undefined") {
    return { app_version: packageJson.version };
  }
  try {
    if (Capacitor.isNativePlatform()) {
      const info = await App.getInfo();
      return {
        app_version: info.version,
        app_build: info.build || undefined,
      };
    }
  } catch {
    // fall through to web version
  }
  return { app_version: packageJson.version };
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function isAnalyticsReady(): boolean {
  return client !== null;
}

export async function initPosthog(): Promise<PostHogClient | null> {
  if (!isBrowser()) {
    return null;
  }
  if (client) {
    return client;
  }
  if (initPromise) {
    return initPromise;
  }
  if (initStarted) {
    return client;
  }
  initStarted = true;

  initPromise = (async () => {
    const key = env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) {
      return null;
    }

    try {
      const { default: posthog } = await import("posthog-js");
      const host = env.NEXT_PUBLIC_POSTHOG_HOST || DEFAULT_POSTHOG_HOST;
      const platform = getAnalyticsPlatform();
      const appMeta = await resolveAppMeta();

      posthog.init(key, {
        api_host: host,
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        disable_session_recording: true,
        disable_surveys: true,
        advanced_disable_feature_flags: true,
        persistence: "localStorage",
        person_profiles: "identified_only",
        loaded: (loadedClient) => {
          loadedClient.register({
            platform,
            app_version: appMeta.app_version,
            ...(appMeta.app_build ? { app_build: appMeta.app_build } : {}),
          });
        },
      });

      client = posthog;
      return client;
    } catch {
      client = null;
      return null;
    }
  })();

  return initPromise;
}

function withClient(action: (instance: PostHogClient) => void): void {
  if (!client) {
    return;
  }
  try {
    action(client);
  } catch {
    // Analytics must never break the app
  }
}

export function captureEvent<K extends AnalyticsEventName>(
  event: K,
  properties?: AnalyticsEventMap[K],
  options?: { sendInstantly?: boolean }
): void {
  withClient((instance) => {
    instance.capture(
      event,
      properties,
      options?.sendInstantly ? { send_instantly: true } : undefined
    );
  });
}

export function captureEventDistinct<K extends AnalyticsEventName>(
  event: K,
  distinctKey: string,
  properties?: AnalyticsEventMap[K]
): void {
  if (!distinctKey) {
    return;
  }
  if (lastDistinctKeys.get(event) === distinctKey) {
    return;
  }
  lastDistinctKeys.set(event, distinctKey);
  captureEvent(event, properties);
}

export function identifyUser(userId: string, traits: IdentifyTraits): void {
  if (!userId) {
    return;
  }
  withClient((instance) => {
    instance.identify(userId, traits);
  });
}

export function resetUser(): void {
  lastDistinctKeys.clear();
  withClient((instance) => {
    instance.reset();
  });
}

export function hasTrackedAppOpenedThisSession(): boolean {
  if (!isBrowser()) {
    return true;
  }
  return sessionStorage.getItem(APP_OPENED_SESSION_KEY) === "1";
}

export function markAppOpenedThisSession(): void {
  if (!isBrowser()) {
    return;
  }
  sessionStorage.setItem(APP_OPENED_SESSION_KEY, "1");
}
