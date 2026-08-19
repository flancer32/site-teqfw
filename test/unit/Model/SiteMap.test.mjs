import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import * as nodeUrl from "node:url";

import Config from "../../../src/Config.mjs";
import DemoPages from "../../../src/Model/DemoPages.mjs";
import SiteMap from "../../../src/Model/SiteMap.mjs";

test("SiteMap binds strategic TeqFW pages and retained legacy routes", () => {
  const config = new Config({fs, nodeUrl});
  const demoPages = new DemoPages({config, fs, path});
  const siteMap = new SiteMap({config, demoPages, fs, path});
  assert.deepEqual(siteMap.getPages().filter((page) => !page.isDemoGenerated).map((page) => page.route), ["/", "/ecosystem", "/ecosystem/philosophy", "/showcase", "/method", "/demo/pages/", "/contacts"]);
  assert.equal(siteMap.getByRoute("/showcase")?.title, "Showcase");
  assert.equal(siteMap.getByRoute("/proof"), null);
});
