import assert from "node:assert/strict";
import test from "node:test";

import Controller from "../../../src/Controller/AgentMessage.mjs";

function context({headers = {}, method = "GET", url = "/agent/message"} = {}) {
  const response = {body: undefined, headers: undefined, status: undefined};
  let completed = false;
  return {
    context: {
      get completed() { return completed; },
      set completed(value) { completed = value; },
      request: {headers, method, url},
      response: {
        end: (body) => { response.body = body; },
        writeHead: (status, headers) => { response.status = status; response.headers = headers; },
      },
    },
    response,
  };
}

test("AgentMessage controller accepts a valid header-based GET message", async () => {
  const calls = [];
  const controller = new Controller({
    STAGE: {PROCESS: "process"},
    dtoInfoFactory: {create: (dto) => dto},
    messages: {accept: async (record) => calls.push(record)},
  });
  const request = context({headers: {"x-agent-id": "codex-1", "x-agent-message": "Please review this change."}});

  await controller.handle(request.context);

  assert.deepEqual(calls, [{agent: "codex-1", message: "Please review this change."}]);
  assert.equal(request.response.status, 202);
  assert.equal(request.response.body, "Accepted");
  assert.equal(request.response.headers["cache-control"], "no-store");
  assert.deepEqual(controller.getRegistrationInfo().after, ["TeqFw_Web_Back_Handler_Static"]);
});

test("AgentMessage controller rejects non-ASCII input and non-GET methods", async () => {
  const controller = new Controller({
    STAGE: {PROCESS: "process"},
    dtoInfoFactory: {create: (dto) => dto},
    messages: {accept: async () => assert.fail("message must not be accepted")},
  });
  const invalid = context({headers: {"x-agent-id": "codex", "x-agent-message": "Привет"}});
  const wrongMethod = context({method: "POST"});

  await controller.handle(invalid.context);
  await controller.handle(wrongMethod.context);

  assert.equal(invalid.response.status, 400);
  assert.equal(wrongMethod.response.status, 405);
  assert.equal(wrongMethod.response.headers.allow, "GET");
});

test("AgentMessage controller ignores routes outside its bounded command", async () => {
  const controller = new Controller({
    STAGE: {PROCESS: "process"},
    dtoInfoFactory: {create: (dto) => dto},
    messages: {accept: async () => assert.fail("message must not be accepted")},
  });
  const request = context({url: "/contacts"});

  await controller.handle(request.context);

  assert.equal(request.response.status, undefined);
});
