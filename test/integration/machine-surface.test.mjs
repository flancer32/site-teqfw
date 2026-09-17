import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import * as nodeUrl from "node:url";

import Config from "../../src/Config.mjs";
import Machine from "../../src/Controller/Machine.mjs";
import MachineDocuments from "../../src/Model/MachineDocuments.mjs";

test("machine document handler exposes only the curated public documents", async () => {
  const config = new Config({fs, nodeUrl});
  const documents = new MachineDocuments({config, path});
  const controller = new Machine({
    STAGE: {PROCESS: "process"},
    documents,
    dtoInfoFactory: {create: (info) => info},
    fs,
  });
  const sent = [];
  const response = {
    end: (body) => sent.push(body),
    writeHead: (status, headers) => sent.push({headers, status}),
  };

  const context = {completed: false, request: {method: "GET", url: "/llms.txt"}, response};
  await controller.handle(context);
  assert.equal(context.completed, true);
  assert.equal(sent[0].headers["content-type"], "text/plain; charset=utf-8");
  assert.match(sent[1], /^# TeqFW/m);
  for (const route of config.getPages().filter((page) => page.isSitemap).map((page) => page.markdownRoute)) {
    assert.match(sent[1], new RegExp(`https://teqfw\\.com/${route.slice(1).replaceAll("/", "\\/")}`));
  }
  for (const platformPackage of config.getPlatform()) {
    assert.match(sent[1], new RegExp(platformPackage.repository.replaceAll(".", "\\.")));
    assert.match(sent[1], new RegExp(platformPackage.skill.replaceAll(".", "\\.")));
  }
  assert.match(sent[1], /not an AI-agent framework/);
  assert.match(sent[1], /ADSM is related methodology/);
  assert.match(sent[1], /GitHub Flows is historical/);
  assert.doesNotMatch(sent[1], /demo\/pages/);

  sent.length = 0;
  const markdown = {completed: false, request: {method: "GET", url: "/ecosystem.md"}, response};
  await controller.handle(markdown);
  assert.equal(markdown.completed, true);
  assert.equal(sent[0].headers["content-type"], "text/markdown; charset=utf-8");
  assert.match(sent[1], /^# TeqFW ecosystem/m);

  sent.length = 0;
  const privatePath = {completed: false, request: {method: "GET", url: "/ctx/AGENTS.md"}, response};
  await controller.handle(privatePath);
  assert.equal(privatePath.completed, false);
  assert.deepEqual(sent, []);
});
