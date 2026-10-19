"use client";

import { App } from "@capacitor/app";
import { useEffect, useState } from "react";

import { isNativeApp, getAppPlatform } from "@/lib/app-platform";

import packageJson from "../../package.json";

function webVersionLine(): string {
  return `Web · v${packageJson.version}`;
}

async function resolveNativeVersionLine(): Promise<string> {
  try {
    const info = await App.getInfo();
    const platform = getAppPlatform() === "ios" ? "iOS" : "Android";
    const buildSuffix = info.build ? ` (${info.build})` : "";
    return `${platform} · v${info.version}${buildSuffix}`;
  } catch {
    return getAppPlatform() === "ios" ? "iOS" : "Android";
  }
}

export function AppVersionLabel() {
  const [line, setLine] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const next = isNativeApp()
        ? await resolveNativeVersionLine()
        : webVersionLine();
      if (!cancelled) {
        setLine(next);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!line) {
    return null;
  }

  return (
    <p className="text-[10px] text-center text-muted-foreground/50 mt-2">
      {line}
    </p>
  );
}
