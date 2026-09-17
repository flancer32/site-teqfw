import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import StaticFiles from "../../../src/Model/StaticFiles.mjs";

test("StaticFiles exposes the complete public web root", () => {
  const sources = new StaticFiles({config: {getWebRoot: () => "/repo/web/"}, path}).getSources();

  assert.equal(sources[0].prefix, "/assets");
  assert.equal(sources[1].root, "/repo/web/");
  assert.equal(sources[1].allow["."].includes("."), true);
  assert.equal(Object.isFrozen(sources), true);
});
