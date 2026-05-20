// @ts-check

/**
 * @namespace TeqFw_Site_Model_SiteMap
 * @description Binds configured page records to existing page templates.
 */

export default class TeqFw_Site_Model_SiteMap {
  constructor({config, demoPages, fs, path}) {
    const templateRoot = path.join(config.getTemplateRoot(), "page");
    const templates = discoverTemplates(templateRoot, fs, path);
    const pages = deepFreeze([
      ...config.getPages().filter((page) => templates.has(page.template)),
      ...demoPages.getPages(),
    ]);
    const byRoute = new Map(pages.map((page) => [page.route, page]));

    this.getByRoute = (route) => byRoute.get(route) ?? null;
    this.getPages = () => pages;
  }
}

function discoverTemplates(root, fs, path) {
  const result = new Set();
  visitTemplates(root, "");
  return result;

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
