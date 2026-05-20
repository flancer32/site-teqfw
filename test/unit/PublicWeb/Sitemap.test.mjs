import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {fileURLToPath} from "node:url";

test("sitemap includes demo index and ecosystem philosophy while excluding generated demo and legacy philosophy routes", () => {
  const sitemap = fs.readFileSync(fileURLToPath(new URL("../../../web/sitemap.xml", import.meta.url)), "utf8");

  assert.match(sitemap, /https:\/\/teqfw\.com\/demo\/pages\//);
  assert.match(sitemap, /https:\/\/teqfw\.com\/ecosystem\/philosophy/);
  assert.doesNotMatch(sitemap, /https:\/\/teqfw\.com\/demo\/pages\/[a-z0-9-]+\//);
  assert.doesNotMatch(sitemap, /https:\/\/teqfw\.com\/philosophy/);
});
