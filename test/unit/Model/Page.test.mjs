import assert from "node:assert/strict";
import test from "node:test";

import Page from "../../../src/Model/Page.mjs";

test("Page delegates fixed route lookup to sitemap", () => {
  const page = new Page({
    demoPages: {getPages: () => [{route: "/demo/pages/sample/"}]},
    siteMap: {getByRoute: (route) => route === "/" ? {id: "home"} : null},
  });

  assert.equal(page.getByRoute("/")?.id, "home");
  assert.equal(page.getByRoute("/missing"), null);
  assert.deepEqual(page.getGeneratedDemoPages(), [{route: "/demo/pages/sample/"}]);
});
