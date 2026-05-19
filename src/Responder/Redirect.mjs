// @ts-check

/**
 * @namespace TeqFw_Site_Responder_Redirect
 * @description Writes HTTP redirect responses for legacy routes.
 */

export default class TeqFw_Site_Responder_Redirect {
  constructor({}) {
    this.send = ({location, method, res, statusCode}) => {
      res.writeHead(statusCode, {
        "cache-control": "no-store",
        "location": location,
      });
      res.end(method === "HEAD" ? "" : `Redirecting to ${location}`);
    };
  }
}
