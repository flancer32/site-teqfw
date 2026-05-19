// @ts-check

/**
 * @namespace TeqFw_Site_Model_Renderer
 * @description Renders fixed SSR pages with Nunjucks templates.
 */

export default class TeqFw_Site_Model_Renderer {
  constructor({config, navigation, pages}) {
    let env = null;

    this.render = async (route) => {
      if (!env) {
        const nunjucks = await import("nunjucks");
        env = new nunjucks.Environment(
          new nunjucks.FileSystemLoader(config.getTemplateRoot(), {noCache: true}),
          {autoescape: true, lstripBlocks: true, trimBlocks: true},
        );
      }
      const page = pages.getByRoute(route);
      if (!page) throw new Error(`Unknown SSR route: ${route}`);
      return env.render(page.template, {
        brand: config.getBrand(),
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
  pages: "TeqFw_Site_Model_Page$",
});
