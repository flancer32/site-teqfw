import assert from "node:assert/strict";
import test from "node:test";

import Machine from "../../../src/Controller/Machine.mjs";

test("Machine controller serves mapped documents and supports HEAD", async () => {
  const sent = [];
  const controller = new Machine({
    STAGE: {PROCESS: "process"},
    documents: {getByUrl: (url) => url.startsWith("/index.md") ? {contentType: "text/markdown; charset=utf-8", path: "/repo/ai/index.md"} : null},
    dtoInfoFactory: {create: (info) => info},
    fs: {promises: {readFile: async () => "# TeqFW\n"}},
  });
  const response = {
    end: (body) => sent.push(body),
    writeHead: (status, headers) => sent.push({headers, status}),
  };
  const context = {completed: false, request: {method: "GET", url: "/index.md"}, response};

  await controller.handle(context);
  assert.equal(context.completed, true);
  assert.deepEqual(sent, [
    {headers: {"cache-control": "public, max-age=300", "content-type": "text/markdown; charset=utf-8"}, status: 200},
    "# TeqFW\n",
  ]);

  sent.length = 0;
  const head = {completed: false, request: {method: "HEAD", url: "/index.md"}, response};
  await controller.handle(head);
  assert.equal(head.completed, true);
  assert.equal(sent[1], "");
});

test("Machine controller ignores unmapped requests", async () => {
  let completed = false;
  const controller = new Machine({
    STAGE: {PROCESS: "process"},
    documents: {getByUrl: () => null},
    dtoInfoFactory: {create: (info) => info},
    fs: {promises: {readFile: async () => "unexpected"}},
  });

  await controller.handle({
    get completed() { return completed; },
    set completed(value) { completed = value; },
    request: {method: "GET", url: "/missing.md"},
    response: {},
  });
  assert.equal(completed, false);
});
