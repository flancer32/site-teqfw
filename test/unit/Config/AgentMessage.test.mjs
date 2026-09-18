import assert from "node:assert/strict";
import test from "node:test";

import Config from "../../../src/Config/AgentMessage.mjs";

function configure(raw) {
  return new Config({
    nodeUrl: {fileURLToPath: (url) => url.pathname},
    reader: {get: () => raw},
  });
}

test("AgentMessage config uses fallback when SMTP is not configured", () => {
  const config = configure({AGENT_MAIL_TO: "owner@example.test"});

  assert.equal(config.getMail(), undefined);
  assert.match(config.getFallbackDirectory(), /\/var\/msg\/$/u);
  assert.equal(Object.isFrozen(config), true);
});

test("AgentMessage config parses complete site-owned SMTP settings", () => {
  const config = configure({
    AGENT_MAIL_TO: " owner@example.test ",
    AGENT_SMTP_FROM: " sender@example.test ",
    AGENT_SMTP_HOST: " mail.example.test ",
    AGENT_SMTP_MODE: "starttls",
    AGENT_SMTP_PASSWORD: "secret",
    AGENT_SMTP_PORT: "587",
    AGENT_SMTP_USER: "mailer",
  });

  assert.deepEqual(config.getMail(), {
    from: "sender@example.test",
    host: "mail.example.test",
    password: "secret",
    port: 587,
    recipient: "owner@example.test",
    transport: "starttls",
    user: "mailer",
  });
  assert.equal(Object.isFrozen(config.getMail()), true);
});

test("AgentMessage config rejects incomplete SMTP settings", () => {
  assert.throws(() => configure({AGENT_SMTP_HOST: "mail.example.test"}), /AGENT_MAIL_TO/u);
  assert.throws(() => configure({
    AGENT_MAIL_TO: "owner@example.test",
    AGENT_SMTP_FROM: "sender@example.test",
    AGENT_SMTP_HOST: "mail.example.test",
    AGENT_SMTP_USER: "mailer",
  }), /credentials/u);
});
