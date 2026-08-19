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
  assert.match(html, /<a href="https:\/\/github\.com\/teqfw\/di"><code>@teqfw\/di<\/code><\/a> is the foundational composition plugin/);
  assert.match(html, /@teqfw\/log/);
  assert.match(html, /@teqfw\/cfg/);
  assert.match(html, /@teqfw\/cli/);
  assert.match(html, /@teqfw\/db/);
  assert.match(html, /@teqfw\/web/);
  for (const repository of ["di", "log", "cfg", "cli", "db", "web"]) assert.match(html, new RegExp(`href="https://github\\.com/teqfw/${repository}"`));
  assert.match(html, /href="\/showcase"/);
  assert.doesNotMatch(html, />Method<\/a>/);
  assert.doesNotMatch(html, />Proof<\/a>/);
  assert.doesNotMatch(html, />Demo<\/a>/);
  assert.doesNotMatch(html, /GitHub Flows/);
});

test("Renderer exposes factual Showcase composition roles", async () => {
  const html = await createRenderer().render("/showcase");
  for (const artifact of ["teq-tmpl", "teq-cms", "site_wg", "wiredgeese.com", "mindstream"]) assert.match(html, new RegExp(artifact));
  assert.match(html, /href="https:\/\/mindstream\.app\.wiredgeese\.com\/"/);
  assert.match(html, /foundational plugin/);
  assert.match(html, /single human developer/);
  assert.doesNotMatch(html, /GitHub Flows/);
});

test("Renderer presents the complete TeqFW philosophy and plugin skills", async () => {
  const philosophy = await createRenderer().render("/ecosystem/philosophy");
  assert.match(philosophy, /Web architecture for an era of LLM agents/);
  assert.match(philosophy, /1\. Unified development language/);
  assert.match(philosophy, /8\. Explicit machine interfaces/);
  assert.match(philosophy, /skills\/&lt;name&gt;\/SKILL\.md/);
  assert.match(philosophy, /https:\/\/github\.com\/teqfw\/di\/tree\/main\/skills\/teqfw-di/);
  assert.match(philosophy, /https:\/\/github\.com\/teqfw\/web\/tree\/main\/skills\/teqfw-web/);

  const ecosystem = await createRenderer().render("/ecosystem");
  assert.match(ecosystem, /Every plugin explains how agents use it/);
  for (const repository of ["di", "log", "cfg", "cli", "db", "web"]) assert.match(ecosystem, new RegExp(`href="https://github\\.com/teqfw/${repository}"`));
  assert.match(ecosystem, /https:\/\/github\.com\/teqfw\/cli\/tree\/main\/skills\/teqfw-cli/);
});
