// @ts-check

/**
 * @namespace TeqFw_Site_Controller_Ssr
 * @description Handles fixed SSR routes after public static files.
 */

export default class TeqFw_Site_Controller_Ssr {
  constructor({STAGE, dtoInfoFactory, redirectResponder, renderer, responder, routes}) {
    const info = dtoInfoFactory.create({
      after: ["Fl32_Web_Back_Handler_Static"],
      name: this.constructor.name,
      stage: STAGE.PROCESS,
    });

    this.handle = async (context) => {
      const redirect = routes.resolveRedirect(context.request.url ?? "/");
      if (redirect) {
        redirectResponder.send({
          location: redirect,
          method: context.request.method ?? "GET",
          res: context.response,
          statusCode: 301,
        });
        context.complete();
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
      context.complete();
    };

    this.getRegistrationInfo = () => info;
  }
}

export const __deps__ = Object.freeze({
  STAGE: "Fl32_Web_Back_Enum_Stage$",
  dtoInfoFactory: "Fl32_Web_Back_Dto_Info__Factory$",
  redirectResponder: "TeqFw_Site_Responder_Redirect$",
  renderer: "TeqFw_Site_Model_Renderer$",
  responder: "TeqFw_Site_Responder_Html$",
  routes: "TeqFw_Site_Model_RouteMap$",
});
