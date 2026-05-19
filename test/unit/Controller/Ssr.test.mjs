import assert from "node:assert/strict";
import test from "node:test";

import Controller from "../../../src/Controller/Ssr.mjs";

test("SSR controller renders known routes and ignores unknown routes", async () => {
  const sent = [];
  let completed = 0;
  const controller = new Controller({
    STAGE: {PROCESS: "process"},
    dtoInfoFactory: {create: (dto) => dto},
    redirectResponder: {send: (payload) => sent.push(payload)},
    renderer: {render: async (route) => `<html>${route}</html>`},
    responder: {send: (payload) => sent.push(payload)},
    routes: {
      resolve: (url) => (url === "/method" ? "/method" : null),
      resolveRedirect: () => null,
    },
  });

  await controller.handle({complete: () => completed += 1, request: {method: "GET", url: "/method"}, response: {}});
  await controller.handle({complete: () => completed += 1, request: {method: "GET", url: "/missing"}, response: {}});

  assert.equal(completed, 1);
  assert.equal(sent[0].html, "<html>/method</html>");
  assert.equal(controller.getRegistrationInfo().after[0], "Fl32_Web_Back_Handler_Static");
});

test("SSR controller sends permanent redirects before page resolution", async () => {
  const sent = [];
  let completed = 0;
  const controller = new Controller({
    STAGE: {PROCESS: "process"},
    dtoInfoFactory: {create: (dto) => dto},
    redirectResponder: {send: (payload) => sent.push(payload)},
    renderer: {render: async () => {
      throw new Error("redirect route must not render");
    }},
    responder: {send: (payload) => sent.push(payload)},
    routes: {
      resolve: () => null,
      resolveRedirect: (url) => (url === "/philosophy" ? "/ecosystem/philosophy" : null),
    },
  });

  await controller.handle({complete: () => completed += 1, request: {method: "GET", url: "/philosophy"}, response: {}});

  assert.equal(completed, 1);
  assert.equal(sent[0].location, "/ecosystem/philosophy");
  assert.equal(sent[0].statusCode, 301);
});
