import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const webRoot = new URL("../../web/", import.meta.url);
const markdownRoutes = [
  "contacts.md",
  "ecosystem.md",
  "ecosystem/philosophy.md",
  "index.md",
  "method.md",
  "showcase.md",
];

test("public machine documents are static files in the web root", () => {
  const llms = fs.readFileSync(new URL("llms.txt", webRoot), "utf8");

  assert.match(llms, /^# TeqFW/m);
  assert.match(llms, /https:\/\/teqfw\.com\/ecosystem\.md/);
  assert.match(llms, /https:\/\/teqfw\.com\/showcase\.md/);
  assert.doesNotMatch(llms, /demo\/pages/);
  assert.equal(fs.existsSync(new URL("index.html", webRoot)), false);

  for (const route of markdownRoutes) {
    assert.ok(fs.statSync(new URL(route, webRoot)).isFile(), route);
  }
});
