import assert from "node:assert/strict";
import events from "node:events";
import test from "node:test";

import App from "../../src/App.mjs";

test("App configures runtime, composes pipeline, starts once, and stops once", async () => {
  const calls = [];
  const app = new App({
    controller: {name: "controller"},
    envLoader: {load: async ({projectRoot}) => {
      calls.push(["load", projectRoot]);
      return {port: "0"};
    }},
    logHandler: {name: "log"},
    nodeEvents: events,
    pipeline: {addHandler: (handler) => calls.push(["handler", handler.name])},
    runtimeConfigFactory: {
      configure: (cfg) => calls.push(["configure", cfg]),
      freeze: () => calls.push(["freeze"]),
    },
    server: {
      getInstance: () => ({listening: true}),
      start: async () => calls.push(["start"]),
      stop: async () => calls.push(["stop"]),
    },
    staticFiles: {getSources: () => ["source"]},
    staticHandler: {name: "static", init: async ({sources}) => calls.push(["static", sources])},
  });

  await app.start({projectRoot: "/tmp/site"});
  await app.start({projectRoot: "/ignored"});
  await app.stop();
  await app.stop();

  assert.deepEqual(calls, [
    ["load", "/tmp/site"],
    ["configure", {port: "0"}],
    ["freeze"],
    ["static", ["source"]],
    ["handler", "log"],
    ["handler", "static"],
    ["handler", "controller"],
    ["start"],
    ["stop"],
  ]);
});
