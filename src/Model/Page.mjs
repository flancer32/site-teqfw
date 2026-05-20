// @ts-check

/**
 * @namespace TeqFw_Site_Model_Page
 * @description Provides fixed route page lookup through the site map.
 */

export default class TeqFw_Site_Model_Page {
  constructor({demoPages, siteMap}) {
    this.getByRoute = (route) => siteMap.getByRoute(route);
    this.getGeneratedDemoPages = () => demoPages.getPages();
  }
}

export const __deps__ = Object.freeze({
  demoPages: "TeqFw_Site_Model_DemoPages$",
  siteMap: "TeqFw_Site_Model_SiteMap$",
});
