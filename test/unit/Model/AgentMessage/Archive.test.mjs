import assert from "node:assert/strict";
import test from "node:test";

import Archive from "../../../../src/Model/AgentMessage/Archive.mjs";

test("AgentMessage Archive creates a private unique JSON fallback record", async () => {
  const calls = [];
  const archive = new Archive({
    config: {getFallbackDirectory: () => "/runtime/var/msg"},
    crypto: {randomUUID: () => "record-id"},
    fs: {
      mkdir: async (...args) => calls.push(["mkdir", ...args]),
      writeFile: async (...args) => calls.push(["writeFile", ...args]),
    },
    path: {join: (...parts) => parts.join("/")},
  });

  await archive.save({agent: "codex", message: "Please review this change."});

  assert.deepEqual(calls[0], ["mkdir", "/runtime/var/msg", {mode: 0o700, recursive: true}]);
  assert.equal(calls[1][0], "writeFile");
  assert.match(calls[1][1], /^\/runtime\/var\/msg\/\d+-record-id\.json$/u);
  assert.deepEqual(JSON.parse(calls[1][2]), {
    agent: "codex",
    message: "Please review this change.",
    receivedAt: JSON.parse(calls[1][2]).receivedAt,
  });
  assert.match(JSON.parse(calls[1][2]).receivedAt, /^\d{4}-\d{2}-\d{2}T/u);
  assert.deepEqual(calls[1][3], {encoding: "utf8", flag: "wx", mode: 0o600});
});
