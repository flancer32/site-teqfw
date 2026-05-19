import assert from "node:assert/strict";
import test from "node:test";

import RouteMap from "../../../src/Model/RouteMap.mjs";

test("RouteMap resolves fixed routes and strips query and trailing slash", () => {
  const routes = new RouteMap({siteMap: {getPages: () => [{route: "/"}, {route: "/method"}]}});

  assert.equal(routes.resolve("/"), "/");
  assert.equal(routes.resolve("/method?ref=hero"), "/method");
  assert.equal(routes.resolve("/method/"), "/method");
  assert.equal(routes.resolve("/missing"), null);
});

test("RouteMap resolves legacy philosophy redirect without exposing a duplicate page", () => {
  const routes = new RouteMap({siteMap: {getPages: () => [{route: "/"}, {route: "/ecosystem/philosophy"}]}});

  assert.equal(routes.resolve("/ecosystem/philosophy"), "/ecosystem/philosophy");
  assert.equal(routes.resolve("/philosophy"), null);
  assert.equal(routes.resolveRedirect("/philosophy"), "/ecosystem/philosophy");
  assert.equal(routes.resolveRedirect("/philosophy?from=index"), "/ecosystem/philosophy");
  assert.equal(routes.resolveRedirect("/ecosystem/philosophy"), null);
});

test("RouteMap redirects legacy access route to contacts", () => {
  const routes = new RouteMap({siteMap: {getPages: () => [{route: "/"}, {route: "/contacts"}]}});

  assert.equal(routes.resolve("/access"), null);
  assert.equal(routes.resolveRedirect("/access"), "/contacts");
  assert.equal(routes.resolveRedirect("/access?from=old-nav"), "/contacts");
});
