import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import fs from "node:fs/promises";
import http from "node:http";
import net from "node:net";
import test from "node:test";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const fallbackDirectory = path.join(root, "var", "msg");
const teq = path.join(root, "node_modules", "@teqfw", "cli", "bin", "teq.mjs");

/** @returns {Promise<number>} */
function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Unable to allocate a test port"));
        return;
      }
      server.close((error) => error ? reject(error) : resolve(address.port));
    });
  });
}

/**
 * @param {number} port
 * @param {Record<string, string>} headers
 * @returns {Promise<{body: string, headers: http.IncomingHttpHeaders, status: number}>}
 */
function request(port, headers) {
  return new Promise((resolve, reject) => {
    const req = http.request({headers, host: "127.0.0.1", method: "GET", path: "/agent/message", port}, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => resolve({body, headers: res.headers, status: res.statusCode ?? 0}));
    });
    req.once("error", reject);
    req.end();
  });
}

/** @param {number} milliseconds @returns {Promise<void>} */
function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * @param {number} port
 * @param {ReturnType<typeof spawn>} child
 * @param {() => string} output
 * @returns {Promise<void>}
 */
async function waitForServer(port, child, output) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Test site process exited with code ${child.exitCode}: ${output()}`);
    try {
      const response = await request(port, {});
      if (response.status === 400) return;
    } catch {
      // The process is still starting.
    }
    await delay(50);
  }
  throw new Error(`Test site process did not start: ${output()}`);
}

/** @param {ReturnType<typeof spawn>} child @returns {Promise<void>} */
async function stop(child) {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    delay(5_000),
  ]);
  if (child.exitCode === null) child.kill("SIGKILL");
}

test("agent message is accepted by the real site and stored locally without SMTP", async () => {
  const port = await freePort();
  const directoryExisted = await fs.stat(fallbackDirectory).then(() => true, () => false);
  const before = directoryExisted ? new Set(await fs.readdir(fallbackDirectory)) : new Set();
  const child = spawn(process.execPath, [teq, "web:start"], {
    cwd: root,
    env: {
      ...process.env,
      TEQFW_SITE__AGENT_MAIL_TO: "",
      TEQFW_SITE__AGENT_SMTP_FROM: "",
      TEQFW_SITE__AGENT_SMTP_HOST: "",
      TEQFW_SITE__AGENT_SMTP_PASSWORD: "",
      TEQFW_SITE__AGENT_SMTP_USER: "",
      TEQFW_WEB__HOST: "127.0.0.1",
      TEQFW_WEB__PORT: String(port),
      TEQFW_WEB__TYPE: "http",
    },
  });
  let output = "";
  child.stdout.on("data", (chunk) => { output += String(chunk); });
  child.stderr.on("data", (chunk) => { output += String(chunk); });
  /** @type {string[]} */
  let created = [];

  try {
    await waitForServer(port, child, () => output);
    const accepted = await request(port, {"X-Agent-Id": "integration-agent", "X-Agent-Message": "Please review this change."});
    const rejected = await request(port, {"X-Agent-Id": "integration-agent"});
    const after = await fs.readdir(fallbackDirectory);
    created = after.filter((name) => !before.has(name));

    assert.equal(accepted.status, 202);
    assert.equal(accepted.body, "Accepted");
    assert.equal(accepted.headers["cache-control"], "no-store");
    assert.equal(rejected.status, 400);
    assert.equal(created.length, 1);
    const record = JSON.parse(await fs.readFile(path.join(fallbackDirectory, created[0]), "utf8"));
    assert.deepEqual({...record, receivedAt: undefined}, {
      agent: "integration-agent",
      message: "Please review this change.",
      receivedAt: undefined,
    });
    assert.match(record.receivedAt, /^\d{4}-\d{2}-\d{2}T/u);
  } finally {
    await stop(child);
    await Promise.all(created.map((name) => fs.unlink(path.join(fallbackDirectory, name))));
    if (!directoryExisted) await fs.rmdir(fallbackDirectory).catch(() => undefined);
  }
});
