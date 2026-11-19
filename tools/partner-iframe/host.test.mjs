import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
function host() {
  const listeners = {};
  const elements = Object.fromEntries(
    ["launch", "namy", "status", "code", "redirect", "base", "lang"].map(
      (id) => [
        id,
        {
          value: "",
          addEventListener: (name, fn) => {
            listeners[name] = fn;
          },
          focus() {
            this.focused = true;
          },
        },
      ]
    )
  );
  elements.namy.contentWindow = {};
  elements.base.value = "http://localhost:3000";
  elements.lang.value = "en";
  elements.redirect.value = "/explore";
  const context = {
    URL,
    document: { getElementById: (id) => elements[id] },
    window: {
      addEventListener: (name, fn) => {
        listeners[name] = fn;
      },
    },
  };
  vm.runInNewContext(script, context);
  return {
    elements,
    submit() {
      listeners.submit({ preventDefault() {} });
    },
    message(
      data,
      source = elements.namy.contentWindow,
      origin = "http://localhost:3000"
    ) {
      listeners.message({ data, source, origin });
    },
  };
}

test("launch delegates location and sends a code only to the configured Namy origin", () => {
  const h = host();
  h.elements.code.value = "synthetic-test-code";
  h.submit();
  const url = new URL(h.elements.namy.src);
  assert.equal(url.origin, "http://localhost:3000");
  assert.equal(url.pathname, "/partner");
  assert.equal(url.searchParams.get("code"), "synthetic-test-code");
  assert.equal(url.searchParams.get("lang"), "en");
  assert.equal(url.searchParams.get("redirect"), "/explore");
  assert.equal(h.elements.code.value, "");
  assert.match(html, /allow="geolocation"/);
});

test("only the embedded Namy frame can request reauthentication", () => {
  const h = host();
  h.elements.code.value = "first";
  h.submit();
  const oldStatus = h.elements.status.textContent;
  h.message(
    { type: "namy:reauth", redirect: "/wallet" },
    {},
    "http://localhost:3000"
  );
  h.message(
    { type: "namy:reauth", redirect: "/wallet" },
    h.elements.namy.contentWindow,
    "https://untrusted.example"
  );
  assert.equal(h.elements.status.textContent, oldStatus);
  h.message({ type: "namy:reauth", redirect: "/my-coupons" });
  assert.equal(h.elements.code.focused, true);
  h.elements.code.value = "new";
  h.submit();
  const url = new URL(h.elements.namy.src);
  assert.equal(url.searchParams.get("code"), "new");
  assert.equal(url.searchParams.get("redirect"), "/my-coupons");
});

test("external redirects from a frame message fall back to explore", () => {
  const h = host();
  h.elements.code.value = "first";
  h.submit();
  h.message({ type: "namy:reauth", redirect: "//untrusted.example" });
  h.elements.code.value = "new";
  h.submit();
  assert.equal(
    new URL(h.elements.namy.src).searchParams.get("redirect"),
    "/explore"
  );
});
