import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import MachineDocuments from "../../../src/Model/MachineDocuments.mjs";

test("MachineDocuments maps llms.txt and metadata-owned Markdown routes", () => {
  const documents = new MachineDocuments({
    config: {
      getAgentRoot: () => "/repo/ai",
      getPages: () => [
        {markdownRoute: "/index.md"},
        {markdownRoute: "/ecosystem/philosophy.md"},
        {route: "/legacy"},
      ],
    },
    path,
  });

  assert.deepEqual(documents.getByUrl("/llms.txt?source=agent"), {
    contentType: "text/plain; charset=utf-8",
    path: path.join("/repo/ai", "llms.txt"),
  });
  assert.deepEqual(documents.getByUrl("/ecosystem/philosophy.md/"), {
    contentType: "text/markdown; charset=utf-8",
    path: path.join("/repo/ai", "ecosystem/philosophy.md"),
  });
  assert.equal(documents.getByUrl("/ctx/AGENTS.md"), null);
});
