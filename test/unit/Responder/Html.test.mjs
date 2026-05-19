import assert from "node:assert/strict";
import test from "node:test";

import Html from "../../../src/Responder/Html.mjs";

test("HTML responder writes UTF-8 HTML headers and suppresses HEAD body", () => {
  const events = [];
  new Html({}).send({
    html: "<p>Hello</p>",
    method: "HEAD",
    res: {
      end: (body) => events.push(["end", body]),
      writeHead: (code, headers) => events.push(["head", code, headers["content-type"], headers["cache-control"]]),
    },
    statusCode: 200,
  });

  assert.deepEqual(events, [
    ["head", 200, "text/html; charset=utf-8", "no-store"],
    ["end", ""],
  ]);
});
