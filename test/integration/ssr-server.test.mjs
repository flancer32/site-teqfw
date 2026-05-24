import assert from "node:assert/strict";
import test from "node:test";

import Config from "../../src/Config.mjs";
import DemoPages from "../../src/Model/DemoPages.mjs";
import Navigation from "../../src/Model/Navigation.mjs";
import Page from "../../src/Model/Page.mjs";
import Renderer from "../../src/Model/Renderer.mjs";
import RouteMap from "../../src/Model/RouteMap.mjs";
import SiteMap from "../../src/Model/SiteMap.mjs";

test("SSR composition modules remain loadable", () => {
  assert.equal(typeof Config, "function");
  assert.equal(typeof DemoPages, "function");
  assert.equal(typeof Navigation, "function");
  assert.equal(typeof Page, "function");
  assert.equal(typeof Renderer, "function");
  assert.equal(typeof RouteMap, "function");
  assert.equal(typeof SiteMap, "function");
});
