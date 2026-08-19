// @ts-check

/**
 * @namespace TeqFw_Site_Model_RouteMap
 * @description Resolves request URLs to fixed SSR page routes.
 */

export default class TeqFw_Site_Model_RouteMap {
  /**
   * @param {object} deps
   * @param {TeqFw_Site_Model_SiteMap} deps.siteMap
   */
  constructor({siteMap}) {
    const routes = new Map(siteMap.getPages().map((page) => [normalizePath(page.route), page.route]));
    const redirects = new Map([
      ["/access", "/contacts"],
      ["/proof", "/showcase"],
      ["/philosophy", "/ecosystem/philosophy"],
    ]);

    /**
     * Resolves a request URL to a documented route.
     * @param {string} url
     * @returns {string|null}
     */
    this.resolve = (url) => {
      const pathname = normalizePath(url);
      return routes.get(pathname) ?? null;
    };

    /**
     * Resolves a legacy URL to its permanent redirect target.
     * @param {string} url
     * @returns {string|null}
     */
    this.resolveRedirect = (url) => redirects.get(normalizePath(url)) ?? null;
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
  siteMap: "TeqFw_Site_Model_SiteMap$",
});
