#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";

import Container from "@teqfw/di";
import NamespaceRegistry from "@teqfw/di/src/Config/NamespaceRegistry.mjs";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, "..");
const cliArgs = process.argv.slice(2);

const container = new Container();
const registry = new NamespaceRegistry({appRoot: projectRoot, fs, path});
const namespaces = await registry.build();

for (const entry of namespaces) {
  container.addNamespaceRoot(entry.prefix, entry.dirAbs, entry.ext);
}

let exitCode = 1;
try {
  const app = await container.get("TeqFw_Site_App$");
  exitCode = await app.run({cliArgs, projectRoot});
} catch (error) {
  console.error(error);
}

process.exit(typeof exitCode === "number" ? exitCode : 1);
