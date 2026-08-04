import assert from "node:assert/strict";
import test from "node:test";

import App from "../../src/App.mjs";

test("App loads configuration and composes the pipeline through the CLI lifecycle", async () => {
  const calls = [];
  const app = new App({
    cfgLoader: {load: async (sources) => calls.push(["load", sources.length])},
    controller: {name: "controller"},
    dotenv: {create: (options) => { calls.push(["dotenv", options.id]); return "dotenv-source"; }},
    fs: {access: async () => { throw Object.assign(new Error("missing"), {code: "ENOENT"}); }},
    logHandler: {name: "log"},
    logger: {forSource: (source) => ({info: (message) => calls.push(["log", source, message])})},
    path: {join: (...parts) => parts.join("/")},
    pipeline: {addHandler: (handler) => calls.push(["handler", handler.name])},
    process: {cwd: () => "/tmp/site", env: {}},
    processEnv: {create: (env, id) => { calls.push(["process-env", id, env]); return "process-source"; }},
    staticFiles: {getSources: () => ["source"]},
    staticHandler: {name: "static", init: async ({sources}) => calls.push(["static", sources])},
  });

  await app.onStartup();
  await app.onStartup();
  await app.onShutdown();
  await app.onShutdown();

  assert.deepEqual(calls, [
    ["process-env", "process-env", {}],
    ["load", 1],
    ["static", ["source"]],
    ["handler", "log"],
    ["handler", "static"],
    ["handler", "controller"],
    ["log", "TeqFw_Site_App", "SSR site handlers initialized"],
  ]);
});
