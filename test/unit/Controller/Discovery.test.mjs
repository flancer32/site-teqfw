import assert from "node:assert/strict";
import test from "node:test";

import Discovery from "../../../src/Controller/Discovery.mjs";

test("Discovery derives HTTP Link headers from page metadata", async () => {
  const headers = [];
  const discovery = new Discovery({
    STAGE: {INIT: "init"},
    dtoInfoFactory: {create: (dto) => dto},
    siteMap: {getPages: () => [
      {route: "/", markdownRoute: "/index.md"},
      {route: "/ecosystem", markdownRoute: "/ecosystem.md"},
      {route: "/demo/pages/"},
    ]},
  });

  await discovery.handle({
    request: {url: "/ecosystem/?source=agent"},
    response: {headersSent: false, setHeader: (name, value) => headers.push([name, value])},
  });
  await discovery.handle({
    request: {url: "/agent-guide.md"},
    response: {headersSent: false, setHeader: (name, value) => headers.push([name, value])},
  });
  await discovery.handle({
    request: {url: "/demo/pages/"},
    response: {headersSent: false, setHeader: (name, value) => headers.push([name, value])},
  });

  assert.deepEqual(headers, [
    ["Link", "</ecosystem.md>; rel=\"alternate\"; type=\"text/markdown\", </llms.txt>; rel=\"describedby\""],
    ["Link", "</llms.txt>; rel=\"describedby\""],
  ]);
  assert.deepEqual(discovery.getRegistrationInfo(), {name: "TeqFw_Site_Controller_Discovery", stage: "init"});
});
