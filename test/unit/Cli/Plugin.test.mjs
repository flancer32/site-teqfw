import assert from "node:assert/strict";
import test from "node:test";

import Plugin from "../../../src/Cli/Plugin.mjs";

test("Cli Plugin composes the pipeline through the CLI lifecycle", async () => {
  const calls = [];
  const plugin = Plugin({
    controller: {name: "controller"},
    logHandler: {name: "log"},
    logger: {forSource: (source) => ({info: (message) => calls.push(["log", source, message])})},
    pipeline: {addHandler: (handler) => calls.push(["handler", handler.name])},
    staticFiles: {getSources: () => ["source"]},
    staticHandler: {name: "static", init: async ({sources}) => calls.push(["static", sources])},
  });

  await plugin.onStartup();
  await plugin.onStartup();
  await plugin.onShutdown();
  await plugin.onShutdown();

  assert.deepEqual(calls, [
    ["static", ["source"]],
    ["handler", "log"],
    ["handler", "static"],
    ["handler", "controller"],
    ["log", "TeqFw_Site_Cli_Plugin", "SSR site handlers initialized"],
  ]);
});
