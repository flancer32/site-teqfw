import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import * as nodeUrl from "node:url";

import Config from "../../src/Config.mjs";

test("Config loads meta/site.json and exposes immutable metadata records", () => {
  const config = new Config({fs, nodeUrl});
  const pages = config.getPages();

  assert.equal(config.getSite().strapline, "Code is cheap. Show me the spec.");
  assert.equal(config.getBrand().desktopText, "Tequila Framework & ADSM");
  assert.equal(config.getBrand().mobileText, "TeqFW / ADSM");
  assert.equal(config.getFooter().identity, "Tequila Framework & ADSM");
  assert.equal(config.getFooter().statement, "public proof product for controlled agent-driven JavaScript evolution");
  assert.deepEqual(config.getFooter().author, {label: "Alex Gusev", route: "/contacts"});
  assert.equal(config.getSite().footer.identity, "Tequila Framework & ADSM");
  assert.deepEqual(pages.map((page) => page.route), ["/", "/method", "/ecosystem", "/ecosystem/philosophy", "/proof", "/contacts"]);
  assert.deepEqual(config.getNavigation().primary, ["/method", "/ecosystem", "/proof", "/contacts"]);
  assert.equal(pages[0].template, "page/index.html");
  assert.equal(pages[0].isNavigable, false);
  assert.equal(Object.hasOwn(pages[0], "navLabel"), false);
  assert.equal(pages[0].hero.ctaHref, "http://fly.wiredgeese.com/flancer/leanpub/adsm-en/");
  assert.equal(pages[0].hero.cta, "Get the ADSM book");
  assert.equal(pages[3].route, "/ecosystem/philosophy");
  assert.equal(pages[3].isNavigable, false);
  assert.equal(pages[3].hero.ctaHref, "https://raw.githubusercontent.com/teqfw/di/refs/heads/main/PHILOSOPHY.md");
  assert.equal(pages[3].hero.cta, "Open GitHub source");
  assert.equal(pages[3].hero.title, "TeqFW is a philosophy for JavaScript web applications built and evolved with LLM agents.");
  assert.equal(Object.hasOwn(pages[3], "navLabel"), false);
  assert.ok(config.getTemplateRoot().endsWith("/tmpl/"));
  assert.ok(config.getWebRoot().endsWith("/web/"));
  assert.throws(() => pages.push({}));
  assert.throws(() => {
    pages[1].hero.title = "Mutated";
  });
});

test("Config validates required metadata fields", () => {
  const fakeFs = {
    readFileSync: () => JSON.stringify({
      brand: {},
      navigation: {primary: []},
      pages: [],
      site: {},
    }),
  };

  assert.throws(
    () => new Config({fs: fakeFs, nodeUrl}),
    /site\.description must be a string/,
  );
});
