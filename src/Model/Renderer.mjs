// @ts-check

/**
 * @namespace TeqFw_Site_Model_Renderer
 * @description Renders fixed SSR pages with Nunjucks templates.
 */

export default class TeqFw_Site_Model_Renderer {
  /**
   * @param {object} deps
   * @param {TeqFw_Site_Config} deps.config
   * @param {TeqFw_Site_Model_Navigation} deps.navigation
   * @param {TeqFw_Site_Model_Page} deps.pages
   * @param {TeqFw_Site_Nunjucks} deps.nunjucks
   */
  constructor({config, navigation, pages, nunjucks}) {
    let env = null;

    /**
     * Renders a documented page route with the shared Nunjucks environment.
     * @param {string} route
     * @returns {Promise<string>}
     */
    this.render = async (route) => {
      if (!env) {
        env = new nunjucks.Environment(
          new nunjucks.FileSystemLoader(config.getTemplateRoot(), {noCache: true}),
          {autoescape: true, lstripBlocks: true, trimBlocks: true},
        );
      }
      const page = pages.getByRoute(route);
      if (!page) throw new Error(`Unknown SSR route: ${route}`);
      return env.render(page.template, {
        brand: config.getBrand(),
        demoPages: pages.getGeneratedDemoPages(),
        footer: config.getFooter(),
        navigation: navigation.getItems(route),
        page,
        site: config.getSite(),
      });
    };
  }
}

export const __deps__ = Object.freeze({
  config: "TeqFw_Site_Config$",
  navigation: "TeqFw_Site_Model_Navigation$",
  nunjucks: "npm:nunjucks",
  pages: "TeqFw_Site_Model_Page$",
});
