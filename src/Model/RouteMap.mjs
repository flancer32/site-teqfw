// @ts-check

/**
 * @namespace TeqFw_Site_Model_RouteMap
 * @description Resolves request URLs to fixed SSR page routes.
 */

export default class TeqFw_Site_Model_RouteMap {
  constructor({siteMap}) {
    const routes = new Set(siteMap.getPages().map((page) => page.route));
    const redirects = new Map([
      ["/access", "/contacts"],
      ["/philosophy", "/ecosystem/philosophy"],
    ]);

    this.resolve = (url) => {
      const pathname = normalizePath(url);
      return routes.has(pathname) ? pathname : null;
    };

    this.resolveRedirect = (url) => redirects.get(normalizePath(url)) ?? null;
  }
}

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
