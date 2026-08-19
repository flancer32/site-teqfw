import assert from "node:assert/strict";
import test from "node:test";

import Navigation from "../../../src/Model/Navigation.mjs";

test("Navigation uses only strategic TeqFW destinations", () => {
  const pages = new Map([
    ["/ecosystem", {area: "ecosystem", isNavigable: true, navLabel: "Ecosystem", route: "/ecosystem"}],
    ["/ecosystem/philosophy", {area: "philosophy", isNavigable: true, navLabel: "Philosophy", route: "/ecosystem/philosophy"}],
    ["/showcase", {area: "showcase", isNavigable: true, navLabel: "Showcase", route: "/showcase"}],
    ["/contacts", {area: "contacts", isNavigable: true, navLabel: "Contacts", route: "/contacts"}],
  ]);
  const navigation = new Navigation({config: {getNavigation: () => ({primary: [...pages.keys()]})}, siteMap: {getByRoute: (route) => pages.get(route) ?? null}});
  assert.deepEqual(navigation.getItems("/showcase"), [
    {href: "/ecosystem", isCurrent: false, label: "Ecosystem"},
    {href: "/ecosystem/philosophy", isCurrent: false, label: "Philosophy"},
    {href: "/showcase", isCurrent: true, label: "Showcase"},
    {href: "/contacts", isCurrent: false, label: "Contacts"},
  ]);
});
