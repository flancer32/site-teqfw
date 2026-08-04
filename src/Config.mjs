// @ts-check

/**
 * @namespace TeqFw_Site_Config
 * @description Provides immutable site metadata, page records, and source roots.
 */

export default class TeqFw_Site_Config {
  /**
   * @param {object} deps
   * @param {TeqFw_Site_Node_Fs} deps.fs
   * @param {TeqFw_Site_Node_Url} deps.nodeUrl
   */
  constructor({fs, nodeUrl}) {
    const {fileURLToPath} = nodeUrl;
    const metaPath = fileURLToPath(new URL("../meta/site.json", import.meta.url));
    const demoPagesMetaPath = fileURLToPath(new URL("../meta/demo-pages.json", import.meta.url));
    const templateRoot = fileURLToPath(new URL("../tmpl/", import.meta.url));
    const webRoot = fileURLToPath(new URL("../web/", import.meta.url));
    const metadata = normalizeMetadata(JSON.parse(fs.readFileSync(metaPath, "utf8")));

    /** @returns {*} */
    this.getBrand = () => metadata.brand;
    /** @returns {string} */
    this.getDemoPagesMetaPath = () => demoPagesMetaPath;
    /** @returns {*} */
    this.getFooter = () => metadata.footer;
    /** @returns {*} */
    this.getNavigation = () => metadata.navigation;
    /** @returns {Array<object>} */
    this.getPages = () => metadata.pages;
    /** @returns {*} */
    this.getSite = () => metadata.site;
    /** @returns {string} */
    this.getTemplateRoot = () => templateRoot;
    /** @returns {string} */
    this.getWebRoot = () => webRoot;
  }
}

/**
 * Validates and freezes site metadata.
 * @param {*} value
 * @returns {object}
 */
function normalizeMetadata(value) {
  assertRecord(value, "metadata");
  const site = normalizeFields(value.site, "site", ["description", "lang", "name", "strapline", "title", "url"]);
  const brand = normalizeFields(value.brand, "brand", ["ariaLabel", "desktopText", "homeHref", "logoAlt", "logoSrc", "mobileText"]);
  const footer = normalizeFooter(value.footer);
  const pages = normalizePages(value.pages);
  const navigation = normalizeNavigation(value.navigation, pages);
  return deepFreeze({brand, footer, navigation, pages, site: {...site, footer}});
}

/**
 * Normalizes footer metadata.
 * @param {*} value
 * @returns {object}
 */
function normalizeFooter(value) {
  const footer = normalizeFields(value, "footer", ["identity", "statement"]);
  assertRecord(value.author, "footer.author");
  footer.author = normalizeFields(value.author, "footer.author", ["label", "route"]);
  assertRoute(footer.author.route, "footer.author.route");
  return footer;
}

/**
 * Normalizes authored page records.
 * @param {*} value
 * @returns {Array<object>}
 */
function normalizePages(value) {
  if (!Array.isArray(value) || value.length === 0) throw new Error("site metadata pages must be a non-empty array");
  const routes = new Set();
  return value.map((page, index) => {
    const path = `pages[${index}]`;
    const record = normalizeFields(page, path, ["id", "intro", "isNavigable", "route", "summary", "template", "title"]);
    assertRecord(page.hero, `${path}.hero`);
    record.hero = normalizeFields(page.hero, `${path}.hero`, ["cta", "ctaHref", "kicker", "title"]);
    record.area = normalizeArea(page.area ?? deriveAreaFromRoute(record.route), `${path}.area`);
    record.isDemoGenerated = false;
    record.isSitemap = normalizeBoolean(page.isSitemap, `${path}.isSitemap`);
    if (typeof record.isNavigable !== "boolean") throw new Error(`${path}.isNavigable must be a boolean`);
    assertRoute(record.route, `${path}.route`);
    if (routes.has(record.route)) throw new Error(`${path}.route duplicates ${record.route}`);
    routes.add(record.route);
    if (Object.hasOwn(page.hero, "secondaryCta")) {
      assertString(page.hero.secondaryCta, `${path}.hero.secondaryCta`);
      record.hero.secondaryCta = page.hero.secondaryCta.trim();
    }
    if (Object.hasOwn(page.hero, "secondaryCtaHref")) {
      record.hero.secondaryCtaHref = page.hero.secondaryCtaHref.trim();
    }
    if (record.isNavigable) {
      assertString(page.navLabel, `${path}.navLabel`);
      record.navLabel = page.navLabel.trim();
    } else if (Object.hasOwn(page, "navLabel")) {
      throw new Error(`${path}.navLabel is only allowed for navigable pages`);
    }
    return record;
  });
}

/**
 * Validates primary navigation against page records.
 * @param {*} value
 * @param {Array<object>} pages
 * @returns {object}
 */
function normalizeNavigation(value, pages) {
  assertRecord(value, "navigation");
  if (!Array.isArray(value.primary) || value.primary.length === 0) {
    throw new Error("navigation.primary must be a non-empty array");
  }
  const pagesByRoute = new Map(pages.map((page) => [page.route, page]));
  const primary = value.primary.map((route, index) => {
    assertRoute(route, `navigation.primary[${index}]`);
    const page = pagesByRoute.get(route);
    if (!page) throw new Error(`navigation.primary[${index}] references unknown route ${route}`);
    if (!page.isNavigable) throw new Error(`navigation.primary[${index}] references non-navigable route ${route}`);
    return route;
  });
  if (new Set(primary).size !== primary.length) throw new Error("navigation.primary must not contain duplicate routes");
  return {primary};
}

/**
 * Derives a default content area from a route.
 * @param {string} route
 * @returns {string}
 */
function deriveAreaFromRoute(route) {
  if (route === "/") return "home";
  if (route.startsWith("/demo/pages")) return "demo";
  const segments = route.split("/").filter(Boolean);
  return segments[0] ?? "home";
}

/**
 * Normalizes a page area.
 * @param {*} value
 * @param {string} path
 * @returns {string}
 */
function normalizeArea(value, path) {
  assertString(value, path);
  return value.trim();
}

/**
 * Validates a boolean metadata field.
 * @param {*} value
 * @param {string} path
 * @returns {boolean}
 */
function normalizeBoolean(value, path) {
  if (typeof value !== "boolean") throw new Error(`${path} must be a boolean`);
  return value;
}

/**
 * Selects and normalizes declared metadata fields.
 * @param {*} value
 * @param {string} path
 * @param {Array<string>} fields
 * @returns {object}
 */
function normalizeFields(value, path, fields) {
  assertRecord(value, path);
  const result = {};
  for (const field of fields) {
    const current = value[field];
    if (field === "isNavigable") {
      if (typeof current === "undefined") throw new Error(`${path}.${field} is required`);
      result[field] = current;
    } else if (`${path}.${field}` === "brand.logoAlt") {
      assertStringValue(current, `${path}.${field}`);
      result[field] = current;
    } else {
      assertString(current, `${path}.${field}`);
      result[field] = current.trim();
    }
  }
  return result;
}

/**
 * Requires an object record.
 * @param {*} value
 * @param {string} path
 * @returns {void}
 */
function assertRecord(value, path) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${path} must be an object`);
}

/**
 * Requires an absolute route.
 * @param {*} value
 * @param {string} path
 * @returns {void}
 */
function assertRoute(value, path) {
  assertString(value, path);
  if (!value.startsWith("/")) throw new Error(`${path} must be an absolute route`);
}

/**
 * Requires a non-empty string.
 * @param {*} value
 * @param {string} path
 * @returns {void}
 */
function assertString(value, path) {
  assertStringValue(value, path);
  if (value.trim() === "") throw new Error(`${path} must be a non-empty string`);
}

/**
 * Requires a string value.
 * @param {*} value
 * @param {string} path
 * @returns {void}
 */
function assertStringValue(value, path) {
  if (typeof value !== "string") throw new Error(`${path} must be a string`);
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
  fs: "node:fs",
  nodeUrl: "node:url",
});
