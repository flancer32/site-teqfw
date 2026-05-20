import assert from "node:assert/strict";
import fs from "node:fs/promises";
import fsNode from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import DemoPages from "../../../src/Model/DemoPages.mjs";

test("DemoPages loads validated generated demo metadata and template pairs", async () => {
  const root = await createFixtureRoot({
    pages: [{
      area: "demo",
      demo: true,
      description: "Validated generated demo page.",
      generated: true,
      isNavigable: false,
      isSitemap: false,
      route: "/demo/pages/example-page/",
      slug: "example-page",
      template: "page/demo/pages/example-page/index.html",
      title: "Example page",
      trajectory: {issueUrl: "https://github.com/example/repo/issues/1"},
    }],
    template: '{% extends "layout/content.html" %}\n{% block content %}\n<section class="section"><p>Body</p></section>\n{% endblock %}\n',
  });

  try {
    const model = new DemoPages({config: createConfig(root), fs: fsNode, path});
    const pages = model.getPages();

    assert.equal(pages.length, 1);
    assert.equal(pages[0].route, "/demo/pages/example-page/");
    assert.equal(pages[0].hero.ctaHref, "/demo/pages/");
    assert.equal(pages[0].isDemoGenerated, true);
    assert.equal(pages[0].trajectoryLinks[0].label, "Source issue");
    assert.equal(pages[0].trajectoryLinks.at(-1).href, "/demo/pages/example-page/");
  } finally {
    await fs.rm(root, {recursive: true, force: true});
  }
});

test("DemoPages rejects invalid generated metadata", async () => {
  const root = await createFixtureRoot({
    pages: [{
      area: "demo",
      demo: true,
      description: "Broken metadata.",
      generated: true,
      isNavigable: false,
      isSitemap: false,
      route: "/demo/pages/wrong/",
      slug: "example-page",
      template: "page/demo/pages/example-page/index.html",
      title: "Broken page",
    }],
    template: '{% extends "layout/content.html" %}\n{% block content %}\n<section class="section"><p>Body</p></section>\n{% endblock %}\n',
  });

  try {
    assert.throws(
      () => new DemoPages({config: createConfig(root), fs: fsNode, path}),
      /must equal \/demo\/pages\/example-page\//,
    );
  } finally {
    await fs.rm(root, {recursive: true, force: true});
  }
});

test("DemoPages rejects unsafe generated template content", async () => {
  const root = await createFixtureRoot({
    pages: [{
      area: "demo",
      demo: true,
      description: "Unsafe template.",
      generated: true,
      isNavigable: false,
      isSitemap: false,
      route: "/demo/pages/example-page/",
      slug: "example-page",
      template: "page/demo/pages/example-page/index.html",
      title: "Unsafe page",
    }],
    template: '{% extends "layout/content.html" %}\n{% block content %}\n<script>alert(1)</script>\n{% endblock %}\n',
  });

  try {
    assert.throws(
      () => new DemoPages({config: createConfig(root), fs: fsNode, path}),
      /must not contain JavaScript/,
    );
  } finally {
    await fs.rm(root, {recursive: true, force: true});
  }
});

function createConfig(root) {
  return {
    getDemoPagesMetaPath: () => path.join(root, "meta", "demo-pages.json"),
    getTemplateRoot: () => path.join(root, "tmpl"),
  };
}

async function createFixtureRoot({pages, template}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "site-demo-pages-"));
  await fs.mkdir(path.join(root, "meta"), {recursive: true});
  await fs.mkdir(path.join(root, "tmpl", "page", "demo", "pages", "example-page"), {recursive: true});
  await fs.writeFile(path.join(root, "meta", "demo-pages.json"), JSON.stringify({pages}, null, 2));
  await fs.writeFile(path.join(root, "tmpl", "page", "demo", "pages", "example-page", "index.html"), template);
  return root;
}
