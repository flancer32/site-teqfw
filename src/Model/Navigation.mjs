// @ts-check

/**
 * @namespace TeqFw_Site_Model_Navigation
 * @description Builds primary navigation from authored page records.
 */

export default class TeqFw_Site_Model_Navigation {
  constructor({config, siteMap}) {
    this.getItems = (currentRoute) => Object.freeze(config.getNavigation().primary
      .map((route) => siteMap.getByRoute(route))
      .filter((page) => page?.isNavigable)
      .map((page) => Object.freeze({
        href: page.route,
        isCurrent: page.route === currentRoute,
        label: page.navLabel,
      })));
  }
}

export const __deps__ = Object.freeze({
  config: "TeqFw_Site_Config$",
  siteMap: "TeqFw_Site_Model_SiteMap$",
});
