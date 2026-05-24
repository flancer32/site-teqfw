import assert from "node:assert/strict";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {fileURLToPath} from "node:url";

import DemoPages from "../../src/Model/DemoPages.mjs";
import Navigation from "../../src/Model/Navigation.mjs";
import Page from "../../src/Model/Page.mjs";
import Renderer from "../../src/Model/Renderer.mjs";
import RouteMap from "../../src/Model/RouteMap.mjs";
import SiteMap from "../../src/Model/SiteMap.mjs";

test("valid generated demo pages resolve through the normal SSR composition and feed the index listing", async () => {
  const root = await createFixtureRoot({
    pages: [{
      area: "demo",
      demo: true,
      description: "A bounded generated page published through the Demo Pages workflow.",
      generated: true,
      isNavigable: false,
      isSitemap: false,
      route: "/demo/pages/hello-world/",
      slug: "hello-world",
      template: "page/demo/pages/hello-world/index.html",
      title: "Hello world",
      trajectory: {
        deploymentUrl: "https://github.com/example/repo/actions/runs/4",
        issueUrl: "https://github.com/example/repo/issues/1",
        pullRequestUrl: "https://github.com/example/repo/pull/2",
        validationUrl: "https://github.com/example/repo/actions/runs/3",
      },
    }],
    template: '{% extends "layout/content.html" %}\n{% block content %}\n<section class="section"><h2>Generated body</h2><p>Validated content only.</p></section>\n{% endblock %}\n',
  });

  try {
    const config = createConfig(root);
    const demoPages = new DemoPages({config, fs, path});
    const siteMap = new SiteMap({config, demoPages, fs, path});
    const pages = new Page({demoPages, siteMap});
    const navigation = new Navigation({config, siteMap});
    const renderer = new Renderer({config, navigation, pages});
    const routes = new RouteMap({siteMap});

    assert.equal(routes.resolve("/demo/pages/"), "/demo/pages/");
    assert.equal(routes.resolve("/demo/pages/hello-world/"), "/demo/pages/hello-world/");
    assert.equal(routes.resolve("/demo/pages/../../etc/passwd/"), null);

    const indexHtml = await renderer.render("/demo/pages/");
    assert.match(indexHtml, /No public processed-signal artifacts are listed yet|Hello world/);
    assert.match(indexHtml, /Hello world/);
    assert.match(indexHtml, /metadata-driven/);
    assert.match(indexHtml, /href="\/demo\/pages\/hello-world\/"/);
    assert.match(indexHtml, /Source issue/);
    assert.match(indexHtml, /Pull request/);
    assert.match(indexHtml, /Validation result/);
    assert.match(indexHtml, /Deployment action/);

    const generatedHtml = await renderer.render("/demo/pages/hello-world/");
    assert.match(generatedHtml, /Generated body/);
    assert.match(generatedHtml, /bounded artifact of a processed development signal/);
    assert.match(generatedHtml, /Back to Demo Pages index/);
    assert.match(generatedHtml, /not official TeqFW, ADSM, or Alex Gusev editorial content/);

    const navItems = navigation.getItems("/demo/pages/hello-world/");
    assert.equal(navItems.some((item) => item.label === "Demo" && item.isCurrent), true);
    assert.equal(navItems.some((item) => item.href === "/demo/pages/hello-world/"), false);
  } finally {
    await fsPromises.rm(root, {recursive: true, force: true});
  }
});

test("Demo Pages index renders its empty state when no generated pages exist", async () => {
  const root = await createFixtureRoot({
    pages: [],
    template: '{% extends "layout/content.html" %}\n{% block content %}\n<section class="section"><p>Generated body</p></section>\n{% endblock %}\n',
  });

  try {
    const config = createConfig(root);
    const demoPages = new DemoPages({config, fs, path});
    const siteMap = new SiteMap({config, demoPages, fs, path});
    const pages = new Page({demoPages, siteMap});
    const navigation = new Navigation({config, siteMap});
    const renderer = new Renderer({config, navigation, pages});

    const indexHtml = await renderer.render("/demo/pages/");
    assert.match(indexHtml, /No public processed-signal artifacts are listed yet\./);
    assert.match(indexHtml, /The strongest public proof begins only when a constrained issue completes the visible trajectory to a published page artifact\./);
    assert.doesNotMatch(indexHtml, /Processed signal artifact/);
    assert.doesNotMatch(indexHtml, /href="\/demo\/pages\/[a-z0-9-]+\/"/);
  } finally {
    await fsPromises.rm(root, {recursive: true, force: true});
  }
});

test("invalid generated demo metadata and template content fail during composed loading", async () => {
  const badMetaRoot = await createFixtureRoot({
    pages: [{
      area: "demo",
      demo: true,
      description: "Broken route metadata.",
      generated: true,
      isNavigable: false,
      isSitemap: false,
      route: "/demo/pages/not-the-slug/",
      slug: "hello-world",
      template: "page/demo/pages/hello-world/index.html",
      title: "Broken metadata",
    }],
    template: '{% extends "layout/content.html" %}\n{% block content %}\n<section class="section"><p>Valid body</p></section>\n{% endblock %}\n',
  });
  const badTemplateRoot = await createFixtureRoot({
    pages: [{
      area: "demo",
      demo: true,
      description: "Broken template.",
      generated: true,
      isNavigable: false,
      isSitemap: false,
      route: "/demo/pages/hello-world/",
      slug: "hello-world",
      template: "page/demo/pages/hello-world/index.html",
      title: "Broken template",
    }],
    template: '{% extends "layout/content.html" %}\n{% block content %}\n{% include "partials/site-nav.html" %}\n{% endblock %}\n',
  });

  try {
    assert.throws(
      () => new DemoPages({config: createConfig(badMetaRoot), fs, path}),
      /must equal \/demo\/pages\/hello-world\//,
    );
    assert.throws(
      () => new DemoPages({config: createConfig(badTemplateRoot), fs, path}),
      /must not contain unsupported Nunjucks directives/,
    );
  } finally {
    await fsPromises.rm(badMetaRoot, {recursive: true, force: true});
    await fsPromises.rm(badTemplateRoot, {recursive: true, force: true});
  }
});

function createConfig(root) {
  const siteMetadata = JSON.parse(fs.readFileSync(path.join(fileURLToPath(new URL("../../", import.meta.url)), "meta", "site.json"), "utf8"));
  return {
    getBrand: () => siteMetadata.brand,
    getDemoPagesMetaPath: () => path.join(root, "meta", "demo-pages.json"),
    getFooter: () => siteMetadata.footer,
    getNavigation: () => siteMetadata.navigation,
    getPages: () => siteMetadata.pages,
    getSite: () => ({...siteMetadata.site, footer: siteMetadata.footer}),
    getTemplateRoot: () => path.join(root, "tmpl"),
  };
}

async function createFixtureRoot({pages, template}) {
  const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
  const root = await fsPromises.mkdtemp(path.join(os.tmpdir(), "site-demo-pages-integration-"));
  await fsPromises.cp(path.join(repoRoot, "tmpl"), path.join(root, "tmpl"), {recursive: true});
  await fsPromises.mkdir(path.join(root, "meta"), {recursive: true});
  await fsPromises.mkdir(path.join(root, "tmpl", "page", "demo", "pages", "hello-world"), {recursive: true});
  await fsPromises.writeFile(path.join(root, "meta", "demo-pages.json"), JSON.stringify({pages}, null, 2));
  await fsPromises.writeFile(path.join(root, "tmpl", "page", "demo", "pages", "hello-world", "index.html"), template);
  return root;
}
