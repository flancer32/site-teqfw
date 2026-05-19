import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import * as nodeUrl from "node:url";

import Config from "../../../src/Config.mjs";
import SiteMap from "../../../src/Model/SiteMap.mjs";

test("SiteMap binds configured pages to existing templates", () => {
  const siteMap = new SiteMap({config: new Config({fs, nodeUrl}), fs, path});

  assert.deepEqual(siteMap.getPages().map((page) => page.route), ["/", "/method", "/ecosystem", "/ecosystem/philosophy", "/proof", "/contacts"]);
  assert.equal(siteMap.getByRoute("/contacts")?.template, "page/contacts.html");
  assert.equal(siteMap.getByRoute("/ecosystem/philosophy")?.template, "page/ecosystem/philosophy.html");
  assert.equal(siteMap.getByRoute("/ecosystem/philosophy")?.isNavigable, false);
  assert.equal(siteMap.getByRoute("/philosophy"), null);
  assert.equal(siteMap.getByRoute("/missing"), null);
});
