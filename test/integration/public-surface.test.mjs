import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const webRoot = new URL("../../web/", import.meta.url);
const markdownRoutes = [
  "contacts.md",
  "agent-guide.md",
  "ecosystem.md",
  "ecosystem/philosophy.md",
  "index.md",
  "method.md",
  "showcase.md",
];

test("public machine documents are static files in the web root", () => {
  const llms = fs.readFileSync(new URL("llms.txt", webRoot), "utf8");

  assert.match(llms, /^# TeqFW/m);
  assert.ok(llms.indexOf("## Start here") > llms.indexOf("TeqFW composes"));
  assert.match(llms, /https:\/\/teqfw\.com\/ecosystem\.md/);
  assert.match(llms, /https:\/\/teqfw\.com\/showcase\.md/);
  assert.match(llms, /https:\/\/teqfw\.com\/agent-guide\.md/);
  assert.match(llms, /https:\/\/raw\.githubusercontent\.com\/teqfw\/di\/main\/skills\/teqfw-di\/SKILL\.md/);
  assert.doesNotMatch(llms, /demo\/pages/);
  assert.equal(fs.existsSync(new URL("index.html", webRoot)), false);

  const sections = llms.split(/^## /m).slice(1);
  assert.ok(sections.length >= 4);
  for (const section of sections) {
    const body = section.replace(/^[^\n]*\n+/u, "");
    for (const line of body.trim().split("\n")) {
      assert.match(line, /^- \[[^\]]+\]\([^\s)]+\) — .+$/);
    }
  }

  for (const route of markdownRoutes) {
    assert.ok(fs.statSync(new URL(route, webRoot)).isFile(), route);
  }
});

test("platform agent guide routes architecture work to direct package skills", () => {
  const guide = fs.readFileSync(new URL("agent-guide.md", webRoot), "utf8");

  assert.match(guide, /^# TeqFW platform agent guide/m);
  assert.match(guide, /Host application/);
  assert.match(guide, /Working product/);
  for (const pkg of ["di", "log", "cfg", "cli", "db", "web"]) {
    assert.match(guide, new RegExp(`https://raw\\.githubusercontent\\.com/teqfw/${pkg}/main/skills/teqfw-${pkg}/SKILL\\.md`));
  }
});
