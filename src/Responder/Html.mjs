// @ts-check

/**
 * @namespace TeqFw_Site_Responder_Html
 * @description Writes UTF-8 HTML responses for server-rendered pages.
 */

export default class TeqFw_Site_Responder_Html {
  constructor({}) {
    this.send = ({html, method, res, statusCode}) => {
      res.writeHead(statusCode, {
        "cache-control": "no-store",
        "content-type": "text/html; charset=utf-8",
      });
      res.end(method === "HEAD" ? "" : html);
    };
  }
}
