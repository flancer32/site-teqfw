// @ts-check

/**
 * @namespace TeqFw_Site_Responder_Redirect
 * @description Writes HTTP redirect responses for legacy routes.
 */

export default class TeqFw_Site_Responder_Redirect {
  /**
   * The responder has no dependencies.
   * @param {object} deps
   */
  constructor({}) {
    /**
     * Sends a redirect response.
   * @param {object} deps
   * @param {string} deps.location
   * @param {string} deps.method
   * @param {*} deps.res
   * @param {number} deps.statusCode
     * @returns {void}
     */
    this.send = (deps) => {
      const {location, method, res, statusCode} = deps;
      res.writeHead(statusCode, {
        "cache-control": "no-store",
        "location": location,
      });
      res.end(method === "HEAD" ? "" : `Redirecting to ${location}`);
    };
  }
}
