import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve, join } from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = resolve(import.meta.dirname, "../..");
let session = { partner: null, lang: "en" };
const store = (select) => select(session);
store.getState = () => session;
const modules = new Map();
function load(path) {
  const absolute = resolve(root, path);
  if (modules.has(absolute)) return modules.get(absolute).exports;
  const module = { exports: {} };
  modules.set(absolute, module);
  const nativeRequire = createRequire(absolute);
  const request = (name) => {
    if (name === "@/store/usePartnerStore") return { usePartnerStore: store };
    if (name.startsWith("@/") || name.startsWith(".")) {
      const base = name.startsWith("@/")
        ? resolve(root, "src", name.slice(2))
        : resolve(dirname(absolute), name);
      if (base.endsWith(".json")) return JSON.parse(readFileSync(base, "utf8"));
      const target = [
        base,
        base + ".ts",
        base + ".tsx",
        join(base, "index.ts"),
      ].find((p) => existsSync(p) && !p.endsWith("/i18n"));
      if (target) return load(target);
    }
    return nativeRequire(name);
  };
  const source = readFileSync(absolute, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  vm.runInThisContext(`(function(require,module,exports){${output}\n})`, {
    filename: absolute,
  })(request, module, module.exports);
  return module.exports;
}
const { getI18n } = load("src/lib/i18n/core.ts");
const { useAppTranslation } = load("src/lib/i18n/useAppTranslation.ts");
function Copy() {
  const { t, locale } = useAppTranslation();
  return React.createElement(
    "p",
    { lang: locale },
    t("ui.restaurants"),
    " / ",
    t("ui.coupon", { count: 2 })
  );
}

test("English and Spanish sessions use separate initialized instances", () => {
  const en = getI18n("en"),
    es = getI18n("es");
  assert.notEqual(en, es);
  assert.equal(en.t("ui.view_qr"), "View QR");
  assert.equal(es.t("ui.view_qr"), "Ver QR");
  assert.equal(getI18n("en"), en);
  assert.equal(es.language, "es");
});

test("partner screens follow lang across successive renders", () => {
  session = { partner: { slug: "usa-transfers" }, lang: "en" };
  assert.match(
    renderToStaticMarkup(React.createElement(Copy)),
    /Restaurants \/ Coupons/
  );
  session = { partner: { slug: "usa-transfers" }, lang: "es" };
  assert.match(
    renderToStaticMarkup(React.createElement(Copy)),
    /Restaurantes \/ Cupones/
  );
});

test("normal Namy ignores remembered partner language and retains original copy", () => {
  session = { partner: null, lang: "en" };
  assert.match(renderToStaticMarkup(React.createElement(Copy)), /lang="es-MX"/);
  assert.equal(
    getI18n("es").t("ui.loading_restaurant_details", { ns: "normal" }),
    "Loading restaurant details..."
  );
});

test("interpolation and coupon plural forms work in both languages", () => {
  for (const [lang, singular, plural] of [
    ["en", "Coupon", "Coupons"],
    ["es", "Cupón", "Cupones"],
  ]) {
    const t = getI18n(lang).getFixedT(lang);
    assert.equal(t("ui.coupon", { count: 1 }), singular);
    assert.equal(t("ui.coupon", { count: 2 }), plural);
    assert.match(t("ui.redeem_code", { code: "TEST-42" }), /TEST-42/);
  }
});

test("every static UI key used in source exists in every dictionary", () => {
  const resources = ["en", "es", "normal"].map(
    (lang) =>
      JSON.parse(
        readFileSync(join(root, "src/lib/i18n/locales", lang + ".json"), "utf8")
      ).ui
  );
  const walk = (path) =>
    readdirSync(path, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory()
        ? walk(join(path, e.name))
        : /\.tsx?$/.test(e.name)
          ? [join(path, e.name)]
          : []
    );
  for (const path of walk(join(root, "src"))) {
    for (const match of readFileSync(path, "utf8").matchAll(
      /t\("ui\.([a-z0-9_]+)"/g
    )) {
      for (const resource of resources) {
        const key = match[1];
        assert.ok(
          key in resource ||
            (key + "_one" in resource && key + "_other" in resource),
          `${path}: missing ${key}`
        );
      }
    }
  }
  assert.deepEqual(
    Object.keys(resources[0]).sort(),
    Object.keys(resources[1]).sort()
  );
});

test("schedule badges translate without changing default Spanish output", () => {
  const { formatDiscountScheduleBadge } = load(
    "src/domains/store/utils/discountPromoDisplay.ts"
  );
  const everyDay = { excludedDaysOfWeek: [] };
  assert.equal(formatDiscountScheduleBadge(everyDay), "Todos los días");
  assert.equal(formatDiscountScheduleBadge(everyDay, "en"), "Every day");
  const fridayOnly = {
    availableDaysAndTimes: { availableDays: [{ dayIndex: 4 }] },
  };
  assert.equal(formatDiscountScheduleBadge(fridayOnly, "en"), "Only Friday");
  assert.equal(formatDiscountScheduleBadge(fridayOnly), "Solo viernes");
});
