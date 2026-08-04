// @ts-check

/**
 * @namespace TeqFw_Site_Responder_Html
 * @description Writes UTF-8 HTML responses for server-rendered pages.
 */

export default class TeqFw_Site_Responder_Html {
  /**
   * The responder has no dependencies.
   * @param {object} deps
   */
  constructor({}) {
    /**
     * Sends an HTML response.
   * @param {object} deps
   * @param {string} deps.html
   * @param {string} deps.method
   * @param {*} deps.res
   * @param {number} deps.statusCode
     * @returns {void}
     */
    this.send = (deps) => {
      const {html, method, res, statusCode} = deps;
      res.writeHead(statusCode, {
        "cache-control": "no-store",
        "content-type": "text/html; charset=utf-8",
      });
      res.end(method === "HEAD" ? "" : html);
    };
  }
}
