// @ts-check

/**
 * @namespace TeqFw_Site_Controller_Discovery
 * @description Adds machine-readable discovery links before static or SSR delivery.
 */

export default class TeqFw_Site_Controller_Discovery {
  /**
   * @param {object} deps
   * @param {TeqFw_Web_Back_Enum_Stage} deps.STAGE
   * @param {TeqFw_Web_Back_Dto_Info__Factory} deps.dtoInfoFactory
   * @param {TeqFw_Site_Model_SiteMap} deps.siteMap
   */
  constructor({STAGE, dtoInfoFactory, siteMap}) {
    const markdownByPageRoute = new Map(
      siteMap.getPages()
        .filter((page) => page.markdownRoute)
        .map((page) => [normalizePath(page.route), page.markdownRoute]),
    );
    const info = dtoInfoFactory.create({
      name: this.constructor.name,
      stage: STAGE.INIT,
    });

    /**
     * Adds Link metadata without completing the request, so normal static or SSR delivery owns the response.
     * @param {TeqFw_Web_Back_Dto_RequestContext} context
     * @returns {Promise<void>}
     */
    this.handle = async (context) => {
      const pathname = normalizePath(context.request.url ?? "/");
      const markdownRoute = markdownByPageRoute.get(pathname);
      const links = markdownRoute
        ? [`<${markdownRoute}>; rel="alternate"; type="text/markdown"`, "</llms.txt>; rel=\"describedby\""]
        : pathname.endsWith(".md") ? ["</llms.txt>; rel=\"describedby\""] : [];
      if (links.length > 0 && !context.response.headersSent) {
        context.response.setHeader("Link", links.join(", "));
      }
    };

    /**
     * Returns the handler registration metadata.
     * @returns {TeqFw_Web_Back_Dto_Info}
     */
    this.getRegistrationInfo = () => info;
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
  STAGE: "TeqFw_Web_Back_Enum_Stage$",
  dtoInfoFactory: "TeqFw_Web_Back_Dto_Info__Factory$",
  siteMap: "TeqFw_Site_Model_SiteMap$",
});
