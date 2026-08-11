// @ts-check

/**
 * @namespace TeqFw_Site_Controller_Ssr
 * @description Handles fixed SSR routes after public static files.
 */

export default class TeqFw_Site_Controller_Ssr {
  /**
   * @param {object} deps
   * @param {TeqFw_Web_Back_Enum_Stage} deps.STAGE
   * @param {TeqFw_Web_Back_Dto_Info__Factory} deps.dtoInfoFactory
   * @param {TeqFw_Site_Responder_Redirect} deps.redirectResponder
   * @param {TeqFw_Site_Model_Renderer} deps.renderer
   * @param {TeqFw_Site_Responder_Html} deps.responder
   * @param {TeqFw_Site_Model_RouteMap} deps.routes
   */
  constructor({STAGE, dtoInfoFactory, redirectResponder, renderer, responder, routes}) {
    const info = dtoInfoFactory.create({
      after: ["TeqFw_Web_Back_Handler_Static"],
      name: this.constructor.name,
      stage: STAGE.PROCESS,
    });

    /**
     * Handles one request in the PROCESS stage.
     * @param {TeqFw_Web_Back_Dto_RequestContext} context
     * @returns {Promise<void>}
     */
    this.handle = async (context) => {
      const redirect = routes.resolveRedirect(context.request.url ?? "/");
      if (redirect) {
        redirectResponder.send({
          location: redirect,
          method: context.request.method ?? "GET",
          res: context.response,
          statusCode: 301,
        });
        context.completed = true;
        return;
      }
      const route = routes.resolve(context.request.url ?? "/");
      if (!route) return;
      responder.send({
        html: await renderer.render(route),
        method: context.request.method ?? "GET",
        res: context.response,
        statusCode: 200,
      });
      context.completed = true;
    };

    /**
     * Returns the handler registration metadata.
     * @returns {TeqFw_Web_Back_Dto_Info}
     */
    this.getRegistrationInfo = () => info;
  }
}

export const __deps__ = Object.freeze({
  STAGE: "TeqFw_Web_Back_Enum_Stage$",
  dtoInfoFactory: "TeqFw_Web_Back_Dto_Info__Factory$",
  redirectResponder: "TeqFw_Site_Responder_Redirect$",
  renderer: "TeqFw_Site_Model_Renderer$",
  responder: "TeqFw_Site_Responder_Html$",
  routes: "TeqFw_Site_Model_RouteMap$",
});
