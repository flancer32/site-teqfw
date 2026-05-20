// @ts-check

/**
 * @namespace TeqFw_Site_Config
 * @description Provides immutable site metadata, page records, and source roots.
 */

export default class TeqFw_Site_Config {
  /**
   * @param {object} deps
   * @param {typeof import("node:fs")} deps.fs
   * @param {typeof import("node:url")} deps.nodeUrl
   */
  constructor({fs, nodeUrl}) {
    const {fileURLToPath} = nodeUrl;
    const metaPath = fileURLToPath(new URL("../meta/site.json", import.meta.url));
    const demoPagesMetaPath = fileURLToPath(new URL("../meta/demo-pages.json", import.meta.url));
    const templateRoot = fileURLToPath(new URL("../tmpl/", import.meta.url));
    const webRoot = fileURLToPath(new URL("../web/", import.meta.url));
    const metadata = normalizeMetadata(JSON.parse(fs.readFileSync(metaPath, "utf8")));

    this.getBrand = () => metadata.brand;
    this.getDemoPagesMetaPath = () => demoPagesMetaPath;
    this.getFooter = () => metadata.footer;
    this.getNavigation = () => metadata.navigation;
    this.getPages = () => metadata.pages;
    this.getSite = () => metadata.site;
    this.getTemplateRoot = () => templateRoot;
    this.getWebRoot = () => webRoot;
  }
}

function normalizeMetadata(value) {
  assertRecord(value, "metadata");
  const site = normalizeFields(value.site, "site", ["description", "lang", "name", "strapline", "title", "url"]);
  const brand = normalizeFields(value.brand, "brand", ["ariaLabel", "desktopText", "homeHref", "logoAlt", "logoSrc", "mobileText"]);
  const footer = normalizeFooter(value.footer);
  const pages = normalizePages(value.pages);
  const navigation = normalizeNavigation(value.navigation, pages);
  return deepFreeze({brand, footer, navigation, pages, site: {...site, footer}});
}

function normalizeFooter(value) {
  const footer = normalizeFields(value, "footer", ["identity", "statement"]);
  assertRecord(value.author, "footer.author");
  footer.author = normalizeFields(value.author, "footer.author", ["label", "route"]);
  assertRoute(footer.author.route, "footer.author.route");
  return footer;
}

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

function deriveAreaFromRoute(route) {
  if (route === "/") return "home";
  if (route.startsWith("/demo/pages")) return "demo";
  const segments = route.split("/").filter(Boolean);
  return segments[0] ?? "home";
}

function normalizeArea(value, path) {
  assertString(value, path);
  return value.trim();
}

function normalizeBoolean(value, path) {
  if (typeof value !== "boolean") throw new Error(`${path} must be a boolean`);
  return value;
}

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

function assertRecord(value, path) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${path} must be an object`);
}

function assertRoute(value, path) {
  assertString(value, path);
  if (!value.startsWith("/")) throw new Error(`${path} must be an absolute route`);
}

function assertString(value, path) {
  assertStringValue(value, path);
  if (value.trim() === "") throw new Error(`${path} must be a non-empty string`);
}

function assertStringValue(value, path) {
  if (typeof value !== "string") throw new Error(`${path} must be a string`);
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
  fs: "node:fs",
  nodeUrl: "node:url",
});
