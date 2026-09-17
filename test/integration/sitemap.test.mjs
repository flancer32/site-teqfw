import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("sitemap exposes strategic TeqFW routes and excludes legacy surfaces", () => {
  const sitemap = fs.readFileSync(new URL("../../web/sitemap.xml", import.meta.url), "utf8");
  assert.match(sitemap, /https:\/\/teqfw\.com\/showcase/);
  assert.match(sitemap, /https:\/\/teqfw\.com\/ecosystem\/philosophy/);
  assert.doesNotMatch(sitemap, /https:\/\/teqfw\.com\/(?:proof|demo\/pages\/|philosophy)/);
});

test("robots permits ordinary public crawling", () => {
  const robots = fs.readFileSync(new URL("../../web/robots.txt", import.meta.url), "utf8");
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \/\s/);
  assert.doesNotMatch(robots, /Disallow:/);
});
