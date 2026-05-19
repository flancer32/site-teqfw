import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {fileURLToPath} from "node:url";

test("sitemap includes ecosystem philosophy and excludes legacy philosophy route", () => {
  const sitemap = fs.readFileSync(fileURLToPath(new URL("../../../web/sitemap.xml", import.meta.url)), "utf8");

  assert.match(sitemap, /https:\/\/teqfw\.com\/ecosystem\/philosophy/);
  assert.doesNotMatch(sitemap, /https:\/\/teqfw\.com\/philosophy/);
});
