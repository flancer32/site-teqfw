import assert from "node:assert/strict";
import test from "node:test";

import Redirect from "../../../src/Responder/Redirect.mjs";

test("Redirect responder writes permanent redirect headers", () => {
  let headers = null;
  let status = null;
  let body = null;
  const responder = new Redirect({});

  responder.send({
    location: "/ecosystem/philosophy",
    method: "GET",
    res: {
      end: (value) => body = value,
      writeHead: (code, value) => {
        status = code;
        headers = value;
      },
    },
    statusCode: 301,
  });

  assert.equal(status, 301);
  assert.equal(headers.location, "/ecosystem/philosophy");
  assert.equal(headers["cache-control"], "no-store");
  assert.equal(body, "Redirecting to /ecosystem/philosophy");
});
