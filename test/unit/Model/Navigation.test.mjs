import assert from "node:assert/strict";
import test from "node:test";

import Navigation from "../../../src/Model/Navigation.mjs";

test("Navigation derives labels and current state from page records", () => {
  const nav = new Navigation({
    config: {getNavigation: () => ({primary: ["/method", "/ecosystem", "/proof", "/contacts"]})},
    siteMap: {getPages: () => [
      {isNavigable: false, route: "/"},
      {isNavigable: true, navLabel: "Contacts", route: "/contacts"},
      {isNavigable: true, navLabel: "Method", route: "/method"},
      {isNavigable: true, navLabel: "Ecosystem", route: "/ecosystem"},
      {isNavigable: true, navLabel: "Proof", route: "/proof"},
    ],
    getByRoute: (route) => ({
      "/": {isNavigable: false, route: "/"},
      "/contacts": {isNavigable: true, navLabel: "Contacts", route: "/contacts"},
      "/ecosystem": {isNavigable: true, navLabel: "Ecosystem", route: "/ecosystem"},
      "/method": {isNavigable: true, navLabel: "Method", route: "/method"},
      "/proof": {isNavigable: true, navLabel: "Proof", route: "/proof"},
    })[route]},
  });

  assert.deepEqual(nav.getItems("/proof"), [
    {href: "/method", isCurrent: false, label: "Method"},
    {href: "/ecosystem", isCurrent: false, label: "Ecosystem"},
    {href: "/proof", isCurrent: true, label: "Proof"},
    {href: "/contacts", isCurrent: false, label: "Contacts"},
  ]);
  assert.equal(nav.getItems("/proof").some((item) => item.href === "/" || item.label === "Overview" || item.label === "Home"), false);
});
