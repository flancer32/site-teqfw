import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import * as nodeUrl from "node:url";
import * as nunjucks from "nunjucks";

import Config from "../../../src/Config.mjs";
import DemoPages from "../../../src/Model/DemoPages.mjs";
import Navigation from "../../../src/Model/Navigation.mjs";
import Page from "../../../src/Model/Page.mjs";
import Renderer from "../../../src/Model/Renderer.mjs";
import SiteMap from "../../../src/Model/SiteMap.mjs";

function createRenderer() {
  const config = new Config({fs, nodeUrl});
  const demoPages = new DemoPages({config, fs, path});
  const siteMap = new SiteMap({config, demoPages, fs, path});
  return new Renderer({config, navigation: new Navigation({config, siteMap}), nunjucks, pages: new Page({demoPages, siteMap})});
}

test("Renderer exposes TeqFW-first homepage and primary navigation", async () => {
  const html = await createRenderer().render("/");
  assert.match(html, /Enterprise architecture\. Vanilla JavaScript\./);
  assert.match(html, /modular JavaScript platform/);
  assert.match(html, /@teqfw\/di<\/code> is the foundational composition plugin/);
  assert.match(html, /@teqfw\/log/);
  assert.match(html, /@teqfw\/cfg/);
  assert.match(html, /@teqfw\/cli/);
  assert.match(html, /@teqfw\/db/);
  assert.match(html, /@teqfw\/web/);
  assert.match(html, /href="\/showcase"/);
  assert.doesNotMatch(html, />Method<\/a>/);
  assert.doesNotMatch(html, />Proof<\/a>/);
  assert.doesNotMatch(html, />Demo<\/a>/);
  assert.doesNotMatch(html, /GitHub Flows/);
});

test("Renderer exposes factual Showcase composition roles", async () => {
  const html = await createRenderer().render("/showcase");
  for (const artifact of ["teq-tmpl", "teq-cms", "site_wg", "wiredgeese.com", "mindstream"]) assert.match(html, new RegExp(artifact));
  assert.match(html, /foundational plugin/);
  assert.match(html, /single human developer/);
  assert.doesNotMatch(html, /GitHub Flows/);
});
