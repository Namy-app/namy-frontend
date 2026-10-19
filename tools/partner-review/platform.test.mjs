import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const root = resolve(import.meta.dirname, "../..");
function load(path, mocks = {}, globals = {}) {
  const filename = resolve(root, path);
  const output = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(
    `(function(require,module,exports){${output}\n})`,
    globals,
    { filename }
  )(
    (name) => (name in mocks ? mocks[name] : createRequire(filename)(name)),
    module,
    module.exports
  );
  return module.exports;
}
function platform(window, raw = "ios") {
  let calls = 0;
  const api = load(
    "src/lib/app-platform.ts",
    {
      "@capacitor/core": {
        Capacitor: {
          getPlatform: () => {
            calls++;
            return raw;
          },
          isNativePlatform: () => {
            calls++;
            return raw !== "web";
          },
        },
      },
    },
    window === undefined ? {} : { window }
  );
  return { api, calls: () => calls };
}

test("SSR reports web and never invokes Capacitor", () => {
  const { api, calls } = platform();
  assert.equal(api.getAppPlatform(), "web");
  assert.equal(api.isNativeApp(), false);
  assert.equal(calls(), 0);
});
for (const raw of ["ios", "android"]) {
  test(`iframe overrides a ${raw} bridge without calling it`, () => {
    const { api, calls } = platform({ self: {}, top: {} }, raw);
    assert.equal(api.getAppPlatform(), "web");
    assert.equal(api.isNativeApp(), false);
    assert.equal(calls(), 0);
  });
  test(`top-level ${raw} Namy keeps its native detection`, () => {
    const top = {};
    top.self = top;
    top.top = top;
    const { api } = platform(top, raw);
    assert.equal(api.getAppPlatform(), raw);
    assert.equal(api.isNativeApp(), true);
  });
}
test("inaccessible parent detection fails closed to web", () => {
  const window = { self: {} };
  Object.defineProperty(window, "top", {
    get() {
      throw new Error("blocked");
    },
  });
  const { api, calls } = platform(window);
  assert.equal(api.isInIframe(), true);
  assert.equal(api.getAppPlatform(), "web");
  assert.equal(api.isNativeApp(), false);
  assert.equal(calls(), 0);
});
test("embedded storage and store links use web APIs even with a native bridge", async () => {
  const { api } = platform({ self: {}, top: {} });
  const values = new Map();
  const localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  const fail = () => {
    throw new Error("native Preferences must not be called");
  };
  const { capacitorStorage } = load(
    "src/lib/capacitor-storage.ts",
    {
      "@/lib/app-platform": api,
      "@capacitor/preferences": {
        Preferences: { get: fail, set: fail, remove: fail },
      },
    },
    { localStorage }
  );
  await capacitorStorage.setItem("session", "web-session");
  assert.equal(await capacitorStorage.getItem("session"), "web-session");
  await capacitorStorage.removeItem("session");
  assert.equal(await capacitorStorage.getItem("session"), null);
  const nav = load(
    "src/lib/capacitor-navigate.ts",
    { "@/lib/app-platform": api },
    { window: {} }
  );
  const visited = [];
  nav.navigateTo("/stores/real-id?discountId=d", {
    push: (p) => visited.push(p),
  });
  nav.replaceTo("/stores/real-id", { replace: (p) => visited.push(p) });
  assert.deepEqual(visited, [
    "/stores/real-id?discountId=d",
    "/stores/real-id",
  ]);
  // No sessionStorage/location supplied: this must return before touching native cold-start state.
  nav.runCapacitorColdStartSync();
});
test("embedded maps select the web key rather than a native key", () => {
  const { api } = platform({ self: {}, top: {} });
  const { getGoogleMapsApiKey } = load("src/lib/google-maps-api-key.ts", {
    "@/lib/app-platform": api,
    "@/lib/env": {
      env: {
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_WEB: "web-key",
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_IOS: "ios-key",
      },
    },
  });
  assert.equal(getGoogleMapsApiKey(), "web-key");
});
test("application callsites cannot bypass the shared iframe guard", () => {
  function walk(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(resolve(dir, e.name)) : [resolve(dir, e.name)]
    );
  }
  for (const file of walk(resolve(root, "src"))) {
    if (!/\.tsx?$/.test(file) || file.endsWith("/app-platform.ts")) continue;
    assert.doesNotMatch(
      readFileSync(file, "utf8"),
      /Capacitor\.(isNativePlatform|getPlatform)\s*\(/,
      file
    );
  }
});
