import assert from "node:assert/strict";
import test from "node:test";

import Navigation from "../../../src/Model/Navigation.mjs";

test("Navigation derives labels and current state from page records", () => {
  const nav = new Navigation({
    config: {getNavigation: () => ({primary: ["/method", "/ecosystem", "/proof", "/demo/pages/", "/contacts"]})},
    siteMap: {getPages: () => [
      {area: "home", isNavigable: false, route: "/"},
      {area: "contacts", isNavigable: true, navLabel: "Contacts", route: "/contacts"},
      {area: "demo", isNavigable: true, navLabel: "Demo", route: "/demo/pages/"},
      {area: "ecosystem", isNavigable: true, navLabel: "Ecosystem", route: "/ecosystem"},
      {area: "method", isNavigable: true, navLabel: "Method", route: "/method"},
      {area: "proof", isNavigable: true, navLabel: "Proof", route: "/proof"},
    ],
    getByRoute: (route) => ({
      "/": {area: "home", isNavigable: false, route: "/"},
      "/contacts": {area: "contacts", isNavigable: true, navLabel: "Contacts", route: "/contacts"},
      "/demo/pages/": {area: "demo", isNavigable: true, navLabel: "Demo", route: "/demo/pages/"},
      "/demo/pages/sample/": {area: "demo", isNavigable: false, route: "/demo/pages/sample/"},
      "/ecosystem": {area: "ecosystem", isNavigable: true, navLabel: "Ecosystem", route: "/ecosystem"},
      "/method": {area: "method", isNavigable: true, navLabel: "Method", route: "/method"},
      "/proof": {area: "proof", isNavigable: true, navLabel: "Proof", route: "/proof"},
    })[route]},
  });

  assert.deepEqual(nav.getItems("/demo/pages/sample/"), [
    {href: "/method", isCurrent: false, label: "Method"},
    {href: "/ecosystem", isCurrent: false, label: "Ecosystem"},
    {href: "/proof", isCurrent: false, label: "Proof"},
    {href: "/demo/pages/", isCurrent: true, label: "Demo"},
    {href: "/contacts", isCurrent: false, label: "Contacts"},
  ]);
  assert.equal(nav.getItems("/demo/pages/sample/").some((item) => item.href === "/" || item.label === "Overview" || item.label === "Home"), false);
});
