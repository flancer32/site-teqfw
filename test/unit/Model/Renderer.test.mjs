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
  assert.match(html, /<link rel="alternate" type="text\/markdown" href="\/index\.md">/);
  assert.match(html, /<link rel="describedby" href="\/llms\.txt">/);
  assert.doesNotMatch(html, />Method<\/a>/);
  assert.doesNotMatch(html, />Proof<\/a>/);
  assert.doesNotMatch(html, />Demo<\/a>/);
});

test("Renderer exposes factual Showcase composition roles", async () => {
  const html = await createRenderer().render("/showcase");
  for (const artifact of ["teq-tmpl", "teq-cms", "site_wg", "wiredgeese.com", "mindstream"]) assert.match(html, new RegExp(artifact));
  assert.match(html, /href="https:\/\/mindstream\.app\.wiredgeese\.com\/"/);
  assert.match(html, /foundational plugin/);
  assert.match(html, /single human developer/);
});

test("Renderer presents the complete TeqFW philosophy and plugin skills", async () => {
  const philosophy = await createRenderer().render("/ecosystem/philosophy");
  assert.match(philosophy, /Web architecture for an era of LLM agents/);
  assert.match(philosophy, /1\. Unified development language/);
  assert.match(philosophy, /8\. Explicit machine interfaces/);
  assert.match(philosophy, /skills\/&lt;name&gt;\/SKILL\.md/);
  assert.match(philosophy, /https:\/\/raw\.githubusercontent\.com\/teqfw\/di\/main\/skills\/teqfw-di\/SKILL\.md/);
  assert.match(philosophy, /https:\/\/raw\.githubusercontent\.com\/teqfw\/web\/main\/skills\/teqfw-web\/SKILL\.md/);

  const ecosystem = await createRenderer().render("/ecosystem");
  assert.match(ecosystem, /Every plugin explains how agents use it/);
  for (const repository of ["di", "log", "cfg", "cli", "db", "web"]) assert.match(ecosystem, new RegExp(`href="https://github\\.com/teqfw/${repository}"`));
  assert.match(ecosystem, /https:\/\/raw\.githubusercontent\.com\/teqfw\/cli\/main\/skills\/teqfw-cli\/SKILL\.md/);
  assert.match(ecosystem, /<link rel="alternate" type="text\/markdown" href="\/ecosystem\.md">/);
});

test("Renderer advertises Markdown alternates for every sitemap page", async () => {
  const renderer = createRenderer();
  for (const [route, markdownRoute] of [["/", "/index.md"], ["/ecosystem", "/ecosystem.md"], ["/ecosystem/philosophy", "/ecosystem/philosophy.md"], ["/showcase", "/showcase.md"], ["/method", "/method.md"], ["/contacts", "/contacts.md"]]) {
    const html = await renderer.render(route);
    assert.match(html, new RegExp(`<link rel="alternate" type="text/markdown" href="${markdownRoute.replaceAll("/", "\\/")}">`));
    assert.match(html, /<link rel="describedby" href="\/llms\.txt">/);
  }
});
