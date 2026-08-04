// @ts-check

/**
 * @namespace TeqFw_Site_Model_Page
 * @description Provides fixed route page lookup through the site map.
 */

export default class TeqFw_Site_Model_Page {
  /**
   * @param {object} deps
   * @param {TeqFw_Site_Model_DemoPages} deps.demoPages
   * @param {TeqFw_Site_Model_SiteMap} deps.siteMap
   */
  constructor({demoPages, siteMap}) {
    /**
     * Finds an authored page by route.
     * @param {string} route
     * @returns {*}
     */
    this.getByRoute = (route) => siteMap.getByRoute(route);
    /**
     * Returns generated demo pages.
     * @returns {Array<object>}
     */
    this.getGeneratedDemoPages = () => demoPages.getPages();
  }
}

export const __deps__ = Object.freeze({
  demoPages: "TeqFw_Site_Model_DemoPages$",
  siteMap: "TeqFw_Site_Model_SiteMap$",
});
