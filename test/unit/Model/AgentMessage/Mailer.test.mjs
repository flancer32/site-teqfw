import assert from "node:assert/strict";
import {EventEmitter} from "node:events";
import test from "node:test";

import Mailer from "../../../../src/Model/AgentMessage/Mailer.mjs";

class FakeSocket extends EventEmitter {
  constructor(onWrite) {
    super();
    this.destroyed = false;
    this.onWrite = onWrite;
    this.writes = [];
  }

  destroy() {
    this.destroyed = true;
  }

  write(value) {
    this.writes.push(value);
    this.onWrite(value, this);
  }
}

function connected(socket, event) {
  queueMicrotask(() => {
    socket.emit(event);
    setImmediate(() => socket.emit("data", "220 mail.example.test ready\r\n"));
  });
  return socket;
}

test("AgentMessage Mailer sends a plain SMTP message to the configured recipient", async () => {
  const socket = new FakeSocket((value, target) => {
    if (value === "EHLO teqfw.com\r\n") target.emit("data", "250 mail.example.test\r\n");
    else if (value.startsWith("MAIL FROM:") || value.startsWith("RCPT TO:")) target.emit("data", "250 accepted\r\n");
    else if (value === "DATA\r\n") target.emit("data", "354 continue\r\n");
    else if (value.endsWith("\r\n.\r\n")) target.emit("data", "250 queued\r\n");
    else if (value === "QUIT\r\n") target.emit("data", "221 goodbye\r\n");
  });
  const mailer = new Mailer({
    net: {createConnection: () => connected(socket, "connect")},
    tls: {connect: () => assert.fail("TLS must not be used for plain SMTP")},
  });

  await mailer.send({
    agent: "codex",
    mail: {from: "sender@example.test", host: "mail.example.test", port: 25, recipient: "owner@example.test", transport: "plain"},
    message: "Please review this change.",
  });

  assert.deepEqual(socket.writes.slice(0, 3), [
    "EHLO teqfw.com\r\n",
    "MAIL FROM:<sender@example.test>\r\n",
    "RCPT TO:<owner@example.test>\r\n",
  ]);
  assert.match(socket.writes.find((value) => value.includes("Subject:")) ?? "", /TeqFW agent message/u);
  assert.equal(socket.destroyed, true);
});
