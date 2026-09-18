import assert from "node:assert/strict";
import test from "node:test";

import AgentMessage from "../../../src/Model/AgentMessage.mjs";

test("AgentMessage archives when SMTP is not configured", async () => {
  const calls = [];
  const messages = new AgentMessage({
    archive: {save: async (record) => calls.push(["archive", record])},
    config: {getMail: () => undefined},
    logger: {forSource: () => ({info: (message) => calls.push(["log", message])})},
    mailer: {send: async () => assert.fail("mailer must not run")},
  });

  await messages.accept({agent: "codex", message: "Please review this change."});

  assert.deepEqual(calls, [
    ["archive", {agent: "codex", message: "Please review this change."}],
    ["log", "Agent message stored locally"],
  ]);
});

test("AgentMessage falls back when SMTP delivery fails", async () => {
  const calls = [];
  const mail = {host: "mail.example.test"};
  const messages = new AgentMessage({
    archive: {save: async (record) => calls.push(["archive", record])},
    config: {getMail: () => mail},
    logger: {forSource: () => ({info: (message) => calls.push(["log", message])})},
    mailer: {send: async (record) => {
      calls.push(["mail", record]);
      throw new Error("unavailable");
    }},
  });

  await messages.accept({agent: "codex", message: "Please review this change."});

  assert.deepEqual(calls, [
    ["mail", {agent: "codex", mail, message: "Please review this change."}],
    ["archive", {agent: "codex", message: "Please review this change."}],
    ["log", "Agent message stored locally"],
  ]);
});

test("AgentMessage logs email delivery without message content", async () => {
  const calls = [];
  const messages = new AgentMessage({
    archive: {save: async () => assert.fail("archive must not run")},
    config: {getMail: () => ({host: "mail.example.test"})},
    logger: {forSource: () => ({info: (message) => calls.push(message)})},
    mailer: {send: async () => undefined},
  });

  await messages.accept({agent: "codex", message: "Please review this change."});

  assert.deepEqual(calls, ["Agent message delivered by email"]);
});
