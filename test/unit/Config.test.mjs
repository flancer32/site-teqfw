import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import * as nodeUrl from "node:url";

import Config from "../../src/Config.mjs";

test("Config exposes immutable TeqFW-first site metadata", () => {
  const config = new Config({fs, nodeUrl});
  const pages = config.getPages();

  assert.equal(config.getSite().strapline, "Enterprise architecture. Vanilla JavaScript.");
  assert.equal(config.getBrand().desktopText, "Tequila Framework");
  assert.equal(config.getFooter().identity, "Tequila Framework");
  assert.deepEqual(config.getNavigation().primary, ["/ecosystem", "/ecosystem/philosophy", "/showcase", "/contacts"]);
  assert.deepEqual(pages.map((page) => page.route), ["/", "/ecosystem", "/ecosystem/philosophy", "/showcase", "/method", "/demo/pages/", "/contacts"]);
  assert.equal(pages.find((page) => page.route === "/showcase")?.template, "page/showcase.html");
  assert.equal(pages.find((page) => page.route === "/method")?.isNavigable, false);
  assert.equal(pages.find((page) => page.route === "/demo/pages/")?.isSitemap, false);
  assert.ok(pages[0].summary.includes("modular JavaScript platform"));
  assert.throws(() => pages.push({}));
});

test("Config validates required metadata fields", () => {
  const fakeFs = {readFileSync: () => JSON.stringify({brand: {}, navigation: {primary: []}, pages: [], site: {}})};
  assert.throws(() => new Config({fs: fakeFs, nodeUrl}), /site\.description must be a string/);
});
