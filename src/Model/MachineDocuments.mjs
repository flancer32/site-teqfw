// @ts-check

/**
 * @namespace TeqFw_Site_Model_MachineDocuments
 * @description Maps the curated public machine documents to authored sources.
 */

export default class TeqFw_Site_Model_MachineDocuments {
  /**
   * @param {object} deps
   * @param {TeqFw_Site_Config} deps.config
   * @param {TeqFw_Site_Node_Path} deps.path
   */
  constructor({config, path}) {
    const documents = new Map([
      ["/llms.txt", {contentType: "text/plain; charset=utf-8", path: path.join(config.getAgentRoot(), "llms.txt")}],
    ]);
    for (const page of config.getPages()) {
      if (page.markdownRoute) {
        documents.set(page.markdownRoute, {
          contentType: "text/markdown; charset=utf-8",
          path: path.join(config.getAgentRoot(), page.markdownRoute.slice(1)),
        });
      }
    }

    /**
     * Finds an authored machine document by public URL.
     * @param {string} url
     * @returns {*}
     */
    this.getByUrl = (url) => documents.get(normalizePath(url)) ?? null;
  }
}

/**
 * Converts a request URL to a normalized pathname.
 * @param {string} url
 * @returns {string}
 */
function normalizePath(url) {
  try {
    return new URL(url, "http://localhost").pathname.replace(/\/+$/u, "") || "/";
  } catch {
    return "/";
  }
}

export const __deps__ = Object.freeze({
  config: "TeqFw_Site_Config$",
  path: "node:path",
});
