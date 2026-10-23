import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { buildPartnerTheme } from "../../src/lib/partner-theme.ts";

const partner = (
  slug = "usa-transfers",
  colors = { primary: "#1D4ED8", secondary: "#FFFFFF" }
) => ({ slug, branding: { colors } });

test("approved USA Transfers colours override old placeholder config", () => {
  const tokens = buildPartnerTheme(partner());
  assert.equal(tokens["--partner-primary"], "#03378D");
  assert.equal(tokens["--partner-secondary"], "#FF4E18");
  assert.equal(tokens["--partner-primary-tint"], "#EDF1F7");
  assert.equal(tokens["--partner-secondary-tint"], "#FFEFEA");
  assert.equal(tokens["--background"], "0 0% 100%");
  assert.equal(tokens["--primary"], tokens["--ring"]);
});
test("normal Namy receives no overrides; other partners keep their config", () => {
  assert.deepEqual(buildPartnerTheme(null), {});
  const tokens = buildPartnerTheme(
    partner("another-partner", { primary: "#123", secondary: "#abcdef" })
  );
  assert.equal(tokens["--partner-primary"], "#123");
  assert.equal(tokens["--partner-secondary"], "#abcdef");
  assert.equal(tokens["--foreground"], undefined);
});
test("invalid generic config colours are not injected into CSS", () => {
  assert.deepEqual(
    buildPartnerTheme(
      partner("another-partner", {
        primary: "url(bad)",
        secondary: "not-a-colour",
      })
    ),
    {}
  );
});
test("primary and secondary foreground choices are readable", () => {
  function luminance(hex) {
    const channels = hex.match(/[a-f\d]{2}/gi).map((s) => {
      const x = parseInt(s, 16) / 255;
      return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  }
  const tokens = buildPartnerTheme(partner());
  assert.equal(tokens["--primary-foreground"], "0 0% 100%");
  assert.equal(tokens["--partner-secondary-foreground"], "#000000");
  assert.ok(1.05 / (luminance(tokens["--partner-primary"]) + 0.05) >= 4.5);
  assert.ok((luminance(tokens["--partner-secondary"]) + 0.05) / 0.05 >= 4.5);
});
test("leaving partner mode restores every previous inline token", () => {
  const filename = resolve(
    import.meta.dirname,
    "../../src/components/partner/PartnerTheme.tsx"
  );
  const output = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const saved = new Map([
    ["--primary", "8 92% 70%"],
    ["--partner-secondary", "prior"],
  ]);
  const values = new Map(saved);
  let cleanup;
  const module = { exports: {} };
  const mocks = {
    react: {
      useEffect: (effect) => {
        cleanup = effect();
      },
    },
    "@/lib/partner-theme": { buildPartnerTheme },
    "@/store/usePartnerStore": { usePartnerConfig: () => partner() },
  };
  vm.runInNewContext(`(function(require,module,exports){${output}\n})`, {
    document: {
      documentElement: {
        style: {
          getPropertyValue: (key) => values.get(key) ?? "",
          setProperty: (key, value) => values.set(key, value),
          removeProperty: (key) => values.delete(key),
        },
      },
    },
  })((name) => mocks[name], module, module.exports);
  module.exports.PartnerTheme();
  assert.equal(values.get("--partner-primary"), "#03378D");
  cleanup();
  assert.deepEqual(values, saved);
});
