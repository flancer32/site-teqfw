// @ts-check

/**
 * @namespace TeqFw_Site_Model_StaticFiles
 * @description Declares public static sources for the TeqFW static handler.
 */

export default class TeqFw_Site_Model_StaticFiles {
  constructor({config, path}) {
    const webRoot = config.getWebRoot();

    this.getSources = () => Object.freeze([
      Object.freeze({
        allow: Object.freeze({".": Object.freeze(["."])}),
        prefix: "/assets",
        root: path.join(webRoot, "assets"),
      }),
      Object.freeze({
        allow: Object.freeze({".": Object.freeze(["favicon.ico", "index.html", "robots.txt", "sitemap.xml"])}),
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
