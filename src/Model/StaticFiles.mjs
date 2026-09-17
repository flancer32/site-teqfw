// @ts-check

/**
 * @namespace TeqFw_Site_Model_StaticFiles
 * @description Declares the public web root for the TeqFW static handler.
 */

export default class TeqFw_Site_Model_StaticFiles {
  /**
   * @param {object} deps
   * @param {TeqFw_Site_Config} deps.config
   * @param {TeqFw_Site_Node_Path} deps.path
   */
  constructor({config, path}) {
    const webRoot = config.getWebRoot();

    /**
     * Returns public static source definitions.
     * @returns {Array<object>}
     */
    this.getSources = () => Object.freeze([
      Object.freeze({
        allow: Object.freeze({".": Object.freeze(["."])}),
        prefix: "/assets",
        root: path.join(webRoot, "assets"),
      }),
      Object.freeze({
        allow: Object.freeze({".": Object.freeze(["."])}),
        prefix: "/",
        root: webRoot,
      }),
    ]);
  }
}

export const __deps__ = Object.freeze({
  config: "TeqFw_Site_Config$",
  path: "node:path",
});
