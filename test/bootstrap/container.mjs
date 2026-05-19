import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

import Container from "@teqfw/di";
import NamespaceRegistry from "@teqfw/di/src/Config/NamespaceRegistry.mjs";

export default async function createContainer() {
  const root = fileURLToPath(new URL("../../", import.meta.url));
  const container = new Container();
  const registry = new NamespaceRegistry({appRoot: root, fs, path});
  const entries = await registry.build();
  for (const entry of entries) {
    container.addNamespaceRoot(entry.prefix, entry.dirAbs, entry.ext);
  }
  return container;
}
