import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import StaticFiles from "../../../src/Model/StaticFiles.mjs";

test("StaticFiles exposes only public assets and service files", () => {
  const sources = new StaticFiles({config: {getWebRoot: () => "/repo/web/"}, path}).getSources();

  assert.equal(sources[0].prefix, "/assets");
  assert.equal(sources[1].allow["."].includes("robots.txt"), true);
  assert.equal(sources[1].allow["."].includes(".env"), false);
  assert.equal(Object.isFrozen(sources), true);
});
