import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import process from "node:process";
import test from "node:test";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const teq = path.join(root, "node_modules", "@teqfw", "cli", "bin", "teq.mjs");

test("teqfw CLI discovers the site host and web command", () => {
  const output = execFileSync(process.execPath, [teq, "help"], {cwd: root, encoding: "utf8"});

  assert.match(output, /web:start\s+Start the web server\./);
});
