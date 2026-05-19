// @ts-check

/**
 * @namespace TeqFw_Site_Env_Loader
 * @description Loads TeqFW web runtime configuration from environment sources.
 */

export default class TeqFw_Site_Env_Loader {
  constructor({fs, path}) {
    const fsPromises = fs.promises;

    this.load = async ({projectRoot}) => {
      mergeMissing(await readEnv(path.join(projectRoot, ".env"), fsPromises));
      const result = {};
      const port = process.env.TEQFW_WEB_SERVER_PORT ?? process.env.PORT;
      const type = process.env.TEQFW_WEB_SERVER_TYPE;
      const ca = process.env.TEQFW_WEB_SERVER_TLS_CA;
      const cert = process.env.TEQFW_WEB_SERVER_TLS_CERT;
      const key = process.env.TEQFW_WEB_SERVER_TLS_KEY;
      if (port !== undefined) result.port = port;
      if (type !== undefined) result.type = type;
      if (ca !== undefined || cert !== undefined || key !== undefined) {
        result.tls = {};
        if (ca !== undefined) result.tls.ca = ca;
        if (cert !== undefined) result.tls.cert = cert;
        if (key !== undefined) result.tls.key = key;
      }
      return result;
    };
  }
}

async function readEnv(file, fsPromises) {
  try {
    return parseEnv(await fsPromises.readFile(file, "utf8"));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return {};
    throw error;
  }
}

function parseEnv(content) {
  const result = {};
  for (const raw of content.split(/\r?\n/u)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index < 1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    result[key] = stripQuotes(value);
  }
  return result;
}

function stripQuotes(value) {
  if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function mergeMissing(entries) {
  for (const [key, value] of Object.entries(entries)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

export const __deps__ = Object.freeze({
  fs: "node:fs",
  path: "node:path",
});
