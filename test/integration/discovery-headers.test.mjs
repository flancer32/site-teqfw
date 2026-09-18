import assert from "node:assert/strict";
import http from "node:http";
import {once} from "node:events";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import * as nodeUrl from "node:url";

import Config from "../../src/Config.mjs";
import Discovery from "../../src/Controller/Discovery.mjs";
import DemoPages from "../../src/Model/DemoPages.mjs";
import SiteMap from "../../src/Model/SiteMap.mjs";

test("HTTP discovery headers match HTML and Markdown canonical resources", async (t) => {
  const config = new Config({fs, nodeUrl});
  const demoPages = new DemoPages({config, fs, path});
  const discovery = new Discovery({
    STAGE: {INIT: "init"},
    dtoInfoFactory: {create: (dto) => dto},
    siteMap: new SiteMap({config, demoPages, fs, path}),
  });
  const server = http.createServer(async (request, response) => {
    await discovery.handle({request, response});
    response.writeHead(200, {"content-type": "text/plain; charset=utf-8"});
    response.end("ok");
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = /** @type {import("node:net").AddressInfo} */ (server.address());
  t.after(() => server.close());

  const html = await request(address.port, "/ecosystem");
  const markdown = await request(address.port, "/agent-guide.md");

  assert.equal(html.link, '</ecosystem.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"');
  assert.equal(markdown.link, '</llms.txt>; rel="describedby"');
});

/**
 * @param {number} port
 * @param {string} pathname
 * @returns {Promise<http.IncomingHttpHeaders>}
 */
function request(port, pathname) {
  return new Promise((resolve, reject) => {
    const request = http.get({host: "127.0.0.1", path: pathname, port}, (response) => {
      response.resume();
      response.on("end", () => resolve(response.headers));
    });
    request.on("error", reject);
  });
}
