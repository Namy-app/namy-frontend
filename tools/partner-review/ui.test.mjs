import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const root = resolve(import.meta.dirname, "../..");
function load(path, mocks = {}, globals = {}) {
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
    globals,
    { filename }
  )(
    (name) => (name in mocks ? mocks[name] : createRequire(filename)(name)),
    module,
    module.exports
  );
  return module.exports;
}
const t = (key) =>
  ({
    "ui.explore": "Explore",
    "ui.my_coupons_partner": "My coupons",
    "ui.partner_navigation": "Partner navigation",
  })[key] ?? key;
function mocks(partner, path = "/explore", hydrated = true) {
  return {
    "next/navigation": {
      useRouter: () => ({ push() {} }),
      usePathname: () => path,
    },
    "@/store/useAuthStore": { useAuthStore: () => ({ isAuthenticated: true }) },
    "@/store/usePartnerStore": {
      useIsPartnerMode: () => partner,
      usePartnerHydrated: () => hydrated,
    },
    "@/lib/i18n/useAppTranslation": { useAppTranslation: () => ({ t }) },
  };
}
for (const path of ["/explore", "/stores/real-id", "/my-coupons"]) {
  test(`partner tabs expose only Explore and My coupons at ${path}`, () => {
    const { BottomNavigation } = load(
      "src/components/BottomNavigation.tsx",
      mocks(true, path)
    );
    const html = renderToStaticMarkup(React.createElement(BottomNavigation));
    assert.equal((html.match(/<button/g) ?? []).length, 2);
    assert.match(html, /aria-label="Explore"/);
    assert.match(html, /aria-label="My coupons"/);
    const active = path === "/my-coupons" ? "My coupons" : "Explore";
    assert.match(
      html,
      new RegExp(`aria-label="${active}" aria-current="page"`)
    );
    assert.match(html, /safe-area-inset-bottom/);
    assert.doesNotMatch(html, /Perfil|Mural|Liga/);
  });
}
test("normal authenticated Namy retains all five tabs", () => {
  const { BottomNavigation } = load(
    "src/components/BottomNavigation.tsx",
    mocks(false)
  );
  const html = renderToStaticMarkup(React.createElement(BottomNavigation));
  assert.equal((html.match(/<button/g) ?? []).length, 5);
  for (const label of ["Explorar", "Mural", "Liga", "Cupones", "Perfil"])
    assert.match(html, new RegExp(label));
});
test("tabs wait for persisted partner context instead of flashing normal tabs", () => {
  const { BottomNavigation } = load(
    "src/components/BottomNavigation.tsx",
    mocks(false, "/explore", false)
  );
  assert.equal(renderToStaticMarkup(React.createElement(BottomNavigation)), "");
});
for (const partner of [true, false]) {
  test(`shared layout ${partner ? "omits" : "retains"} top header in ${partner ? "partner" : "normal"} mode`, () => {
    const { BasicLayout } = load("src/layouts/BasicLayout.tsx", {
      ...mocks(partner),
      "@/app/explore/components/ExploreHeader": {
        ExploreHeader: () => React.createElement("header", null, "Top menu"),
      },
      "@/components/BottomNavigation": {
        BottomNavigation: () => React.createElement("nav", null, "Tabs"),
      },
    });
    const html = renderToStaticMarkup(
      React.createElement(BasicLayout, null, "Content")
    );
    assert.equal(html.includes("<header"), !partner);
    assert.match(html, /pb-28/);
    assert.match(html, /Content/);
  });
}
for (const [partner, path, hydrated] of [
  [true, "/my-coupons", true],
  [false, "/partner", true],
  [false, "/my-coupons", false],
]) {
  test(`Crisp never installs its script with partner=${partner}, path=${path}, hydrated=${hydrated}`, () => {
    let domTouched = false;
    const { default: CrispProvider } = load(
      "src/providers/CrispProvider.tsx",
      {
        ...mocks(partner, path, hydrated),
        react: { useEffect: (fn) => fn() },
      },
      {
        window: {},
        document: new Proxy(
          {},
          {
            get() {
              domTouched = true;
              throw new Error("Crisp must not touch the DOM");
            },
          }
        ),
        process: { env: { NEXT_PUBLIC_CRISP_WEBSITE_ID: "test-site" } },
      }
    );
    assert.equal(CrispProvider(), null);
    assert.equal(domTouched, false);
  });
}

test("partner profile deep links redirect to My coupons and are not remembered", () => {
  const redirects = [],
    remembered = [];
  const { PartnerRouteGuard } = load(
    "src/components/partner/PartnerRouteGuard.tsx",
    {
      react: { useEffect: (fn) => fn() },
      "next/navigation": {
        usePathname: () => "/profile",
        useRouter: () => ({ replace: (p) => redirects.push(p) }),
      },
      "@/store/usePartnerStore": {
        useIsPartnerMode: () => true,
        usePartnerConfig: () => ({ features: {} }),
        usePartnerStore: {
          getState: () => ({ setLastPath: (p) => remembered.push(p) }),
        },
      },
    }
  );
  PartnerRouteGuard();
  assert.deepEqual(redirects, ["/my-coupons"]);
  assert.deepEqual(remembered, []);
});
test("review queries can be disabled for partners while normal queries remain enabled", () => {
  let options;
  const { useStoreReviews } = load(
    "src/domains/store/hooks/query/useStoreReviews.ts",
    {
      "@tanstack/react-query": {
        useQuery: (opts) => {
          options = opts;
          return {};
        },
      },
      "@/lib/graphql-client": {
        graphqlRequest() {
          throw new Error("query must not be run by this hook test");
        },
      },
      "@/lib/graphql-queries": { GET_STORE_REVIEWS_QUERY: "reviews" },
    }
  );
  useStoreReviews("store", { first: 3 }, { enabled: false });
  assert.equal(options.enabled, false);
  useStoreReviews("store", { first: 3 });
  assert.equal(options.enabled, true);
});
