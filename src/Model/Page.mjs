// @ts-check

/**
 * @namespace TeqFw_Site_Model_Page
 * @description Provides fixed route page lookup through the site map.
 */

export default class TeqFw_Site_Model_Page {
  constructor({siteMap}) {
    this.getByRoute = (route) => siteMap.getByRoute(route);
  }
}

export const __deps__ = Object.freeze({
  siteMap: "TeqFw_Site_Model_SiteMap$",
});
