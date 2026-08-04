// @ts-check

/**
 * @namespace TeqFw_Site_Model_SiteMap
 * @description Binds configured page records to existing page templates.
 */

export default class TeqFw_Site_Model_SiteMap {
  /**
   * @param {object} deps
   * @param {TeqFw_Site_Config} deps.config
   * @param {TeqFw_Site_Model_DemoPages} deps.demoPages
   * @param {TeqFw_Site_Node_Fs} deps.fs
   * @param {TeqFw_Site_Node_Path} deps.path
   */
  constructor({config, demoPages, fs, path}) {
    const templateRoot = path.join(config.getTemplateRoot(), "page");
    const templates = discoverTemplates(templateRoot, fs, path);
    const pages = deepFreeze([
      ...config.getPages().filter((page) => templates.has(page.template)),
      ...demoPages.getPages(),
    ]);
    const byRoute = new Map(pages.map((page) => [page.route, page]));

    /**
     * Finds a page by route.
     * @param {string} route
     * @returns {*}
     */
    this.getByRoute = (route) => byRoute.get(route) ?? null;
    /**
     * Returns all discovered page records.
     * @returns {Array<object>}
     */
    this.getPages = () => pages;
  }
}

/**
 * Discovers page templates below a template root.
 * @param {string} root
 * @param {TeqFw_Site_Node_Fs} fs
 * @param {TeqFw_Site_Node_Path} path
 * @returns {Set<string>}
 */
function discoverTemplates(root, fs, path) {
  const result = new Set();
  visitTemplates(root, "");
  return result;

  /**
   * Recursively visits a template directory.
   * @param {string} dir
   * @param {string} prefix
   * @returns {void}
   */
  function visitTemplates(dir, prefix) {
    for (const item of fs.readdirSync(dir, {withFileTypes: true})) {
      const relative = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.isDirectory()) {
        visitTemplates(path.join(dir, item.name), relative);
      } else if (item.isFile() && item.name.endsWith(".html")) {
        result.add(`page/${relative}`);
      }
    }
  }
}

/**
 * Recursively freezes a value.
 * @param {*} value
 * @returns {*}
 */
function deepFreeze(value) {
  if (Array.isArray(value)) {
    for (const item of value) deepFreeze(item);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) deepFreeze(item);
  }
  return Object.freeze(value);
}

export const __deps__ = Object.freeze({
  config: "TeqFw_Site_Config$",
  demoPages: "TeqFw_Site_Model_DemoPages$",
  fs: "node:fs",
  path: "node:path",
});
