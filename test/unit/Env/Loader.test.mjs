import assert from "node:assert/strict";
import fs from "node:fs/promises";
import fsNode from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import Loader from "../../../src/Env/Loader.mjs";

test("Env loader reads .env runtime values and preserves process values", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "site-env-"));
  const oldPort = process.env.TEQFW_WEB_SERVER_PORT;
  try {
    await fs.writeFile(path.join(root, ".env"), [
      "TEQFW_WEB_SERVER_PORT=3400",
      "TEQFW_WEB_SERVER_TYPE=http",
      "TEQFW_WEB_SERVER_TLS_CA='/tmp/ca.pem'",
      "TEQFW_WEB_SERVER_TLS_CERT=\"/tmp/cert.pem\"",
      "TEQFW_WEB_SERVER_TLS_KEY=/tmp/key.pem",
    ].join("\n"));
    process.env.TEQFW_WEB_SERVER_PORT = "3500";
    delete process.env.TEQFW_WEB_SERVER_TYPE;
    delete process.env.TEQFW_WEB_SERVER_TLS_CA;
    delete process.env.TEQFW_WEB_SERVER_TLS_CERT;
    delete process.env.TEQFW_WEB_SERVER_TLS_KEY;

    const cfg = await new Loader({fs: fsNode, path}).load({projectRoot: root});

    assert.deepEqual(cfg, {
      port: "3500",
      tls: {ca: "/tmp/ca.pem", cert: "/tmp/cert.pem", key: "/tmp/key.pem"},
      type: "http",
    });
  } finally {
    if (oldPort === undefined) delete process.env.TEQFW_WEB_SERVER_PORT;
    else process.env.TEQFW_WEB_SERVER_PORT = oldPort;
    delete process.env.TEQFW_WEB_SERVER_TYPE;
    delete process.env.TEQFW_WEB_SERVER_TLS_CA;
    delete process.env.TEQFW_WEB_SERVER_TLS_CERT;
    delete process.env.TEQFW_WEB_SERVER_TLS_KEY;
    await fs.rm(root, {recursive: true, force: true});
  }
});
