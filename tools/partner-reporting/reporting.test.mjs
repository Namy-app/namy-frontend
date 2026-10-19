import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const root = resolve(import.meta.dirname, "../..");
function load(file) {
  const filename = resolve(root, file),
    module = { exports: {} };
  const output = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  vm.runInThisContext(`(function(require,module,exports){${output}\n})`, {
    filename,
  })(createRequire(filename), module, module.exports);
  return module.exports;
}
const { buildRedemptionFilters, redemptionSourceLabel } = load(
  "src/domains/admin/partnerReporting.ts"
);
const { buildPartnerJourneyEvent } = load(
  "src/lib/analytics/partner-journey.ts"
);

test("source filters distinguish normal Namy, any partner and one partner", () => {
  assert.deepEqual(buildRedemptionFilters("", "", "all"), {
    used: true,
    includeExpired: true,
  });
  assert.equal(buildRedemptionFilters("", "", "namy").partnerOnly, false);
  assert.equal(buildRedemptionFilters("", "", "partners").partnerOnly, true);
  assert.equal(
    buildRedemptionFilters("", "", "partner-id").partnerId,
    "partner-id"
  );
});

test("dates and source reach the backend together, independent of pagination", () => {
  assert.deepEqual(
    buildRedemptionFilters("2026-10-01", "2026-10-15", "partner-id"),
    {
      used: true,
      includeExpired: true,
      partnerId: "partner-id",
      usedAtFrom: "2026-10-01T00:00:00",
      usedAtTo: "2026-10-15T23:59:59.999",
    }
  );
});

test("source labels use coupon attribution and never guess Namy for missing data", () => {
  assert.equal(redemptionSourceLabel({ partnerId: null }), "Namy");
  assert.equal(
    redemptionSourceLabel({
      partnerId: "p",
      partner: { name: "USA Transfers", active: false },
    }),
    "USA Transfers"
  );
  assert.equal(redemptionSourceLabel({ partnerId: "p" }), "Origen desconocido");
  assert.equal(redemptionSourceLabel({}), "Origen desconocido");
});

test("normal sessions emit no partner journey events", () => {
  assert.equal(
    buildPartnerJourneyEvent("coupon_generated", { partner: null, lang: "es" }),
    null
  );
});

test("all partner journey events contain only allowlisted non-secret fields", () => {
  for (const action of [
    "session_started",
    "reauth_requested",
    "coupon_generated",
    "coupon_qr_viewed",
  ]) {
    const event = buildPartnerJourneyEvent(
      action,
      { partner: { slug: "usa-transfers" }, lang: "en", accessToken: "secret" },
      {
        coupon_id: "c",
        store_id: "s",
        discount_id: "d",
        code: "secret",
        email: "private",
        staffPin: "1234",
      }
    );
    assert.equal(event.name, `partner_${action}`);
    assert.deepEqual(event.properties, {
      partner_slug: "usa-transfers",
      lang: "en",
      coupon_id: "c",
      store_id: "s",
      discount_id: "d",
    });
  }
});
