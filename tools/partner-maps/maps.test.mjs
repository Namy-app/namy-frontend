import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { resolveMapCenter, isMapCoordinate } from "../../src/lib/map-center.ts";
const root = resolve(import.meta.dirname, "../..");
function load(path, mocks) {
  const filename = resolve(root, path);
  const output = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(
    `(function(require,module,exports){${output}\n})`,
    {},
    { filename }
  )(
    (name) => (name in mocks ? mocks[name] : createRequire(filename)(name)),
    module,
    module.exports
  );
  return module.exports;
}
test("denied GPS falls back to stores; no stores still yields a map centre", () => {
  assert.deepEqual(
    resolveMapCenter(undefined, null, [
      { lat: 20, lng: -86 },
      { lat: 22, lng: -88 },
    ]),
    { lat: 21, lng: -87 }
  );
  const fallback = resolveMapCenter(undefined, null, []);
  assert.ok(isMapCoordinate(fallback));
  assert.deepEqual(
    resolveMapCenter(undefined, null, [{ lat: NaN, lng: 1 }]),
    fallback
  );
});
test("zero coordinates are valid; explicit centre and GPS take precedence", () => {
  assert.deepEqual(resolveMapCenter(undefined, null, [{ lat: 0, lng: 0 }]), {
    lat: 0,
    lng: 0,
  });
  assert.deepEqual(
    resolveMapCenter(undefined, { latitude: 23, longitude: -90 }, []),
    { lat: 23, lng: -90 }
  );
  assert.deepEqual(
    resolveMapCenter(
      { lat: 24, lng: -91 },
      { latitude: 23, longitude: -90 },
      []
    ),
    { lat: 24, lng: -91 }
  );
});
for (const mode of ["missing", "loading", "failed", "ready"]) {
  test(`one root Maps loader keeps non-map UI usable when ${mode}`, () => {
    let calls = 0,
      observed;
    const error = mode === "failed" ? new Error("network failure") : undefined;
    const api = load("src/components/GoogleMapsProvider.tsx", {
      "@react-google-maps/api": {
        useJsApiLoader: (options) => {
          calls++;
          assert.equal(options.id, "namy-google-maps");
          assert.deepEqual(Array.from(options.libraries), ["places"]);
          return { isLoaded: mode === "ready", loadError: error };
        },
      },
      "@/lib/google-maps-api-key": {
        getGoogleMapsApiKey: () => (mode === "missing" ? "" : "test-web-key"),
      },
      "@/lib/google-maps-diagnostics": {
        MAPS_AUTH_FAILURE_EVENT: "auth-failed",
        recordLoadScriptError() {},
      },
    });
    function Consumer() {
      observed = api.useGoogleMapsStatus();
      return React.createElement("p", null, "Explore and coupons still work");
    }
    const html = renderToStaticMarkup(
      React.createElement(
        api.GoogleMapsProvider,
        null,
        React.createElement(Consumer)
      )
    );
    assert.match(html, /Explore and coupons still work/);
    assert.equal(calls, mode === "missing" ? 0 : 1);
    assert.equal(observed.apiKeyMissing, mode === "missing");
    assert.equal(observed.isLoaded, mode === "ready");
    assert.equal(observed.loadError, error);
  });
}
test("store map renders without waiting for or fabricating user location", async () => {
  let capturedCenter;
  const Overlay = ({ children }) => React.createElement("div", null, children);
  Overlay.OVERLAY_MOUSE_TARGET = "overlayMouseTarget";
  const api = load("src/components/store-map.tsx", {
    "@react-google-maps/api": {
      GoogleMap: (props) => {
        capturedCenter = props.center;
        return React.createElement(
          "section",
          { "data-map": true },
          props.children
        );
      },
      OverlayView: Overlay,
    },
    "next/dynamic": (init) => init,
    "next/image": () => null,
    "@/components/GoogleMapsProvider": {
      useGoogleMapsStatus: () => ({
        isLoaded: true,
        apiKeyMissing: false,
        authRejected: false,
      }),
    },
    "@/lib/map-center": { resolveMapCenter, isMapCoordinate },
    "@/components/GoogleMapsDiagnosticsError": {
      GoogleMapsDiagnosticsError: () =>
        React.createElement("p", null, "Map failed"),
    },
    "@/components/MapLoadingView": {
      MapLoadingView: ({ message }) => React.createElement("p", null, message),
    },
    "@/components/StoreNavLink": {
      StoreNavLink: ({ children }) => React.createElement("a", null, children),
    },
    "@/lib/utils": { getUserLocationSafe: async () => null },
  });
  const { default: StoreMap } = await api.default();
  const html = renderToStaticMarkup(
    React.createElement(StoreMap, {
      stores: [{ id: "s", name: "Restaurant", lat: 21, lng: -87 }],
    })
  );
  assert.match(html, /data-map="true"/);
  assert.match(html, /Restaurant/);
  assert.doesNotMatch(html, /Getting your location|animate-ping/);
  assert.deepEqual(capturedCenter, { lat: 21, lng: -87 });
});

test("address input works while Maps is unavailable, without mounting Places", () => {
  const { AddressAutocomplete } = load(
    "src/components/AddressAutocomplete.tsx",
    {
      "@/components/GoogleMapsProvider": {
        useGoogleMapsStatus: () => ({ isLoaded: false }),
      },
      "@react-google-maps/api": {
        Autocomplete() {
          throw new Error("Places must wait for the shared loader");
        },
      },
    }
  );
  const html = renderToStaticMarkup(
    React.createElement(AddressAutocomplete, {
      value: "Manual address",
      onChange() {},
    })
  );
  assert.match(html, /<input/);
  assert.match(html, /Manual address/);
});
