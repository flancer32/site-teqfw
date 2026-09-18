// @ts-check

/**
 * @namespace TeqFw_Site_Controller_AgentMessage
 * @description Handles the bounded header-based GET command for agent-to-owner messages.
 */

const PATHNAME = "/agent/message";
const AGENT_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u;
const ASCII_MESSAGE = /^[\x20-\x7e]{1,4096}$/u;

/**
 * @param {unknown} value
 * @returns {string|undefined}
 */
function header(value) {
  return typeof value === "string" ? value : undefined;
}

/**
 * @param {string} requestUrl
 * @returns {URL|undefined}
 */
function parseUrl(requestUrl) {
  try {
    return new URL(requestUrl, "http://localhost");
  } catch {
    return undefined;
  }
}

export default class TeqFw_Site_Controller_AgentMessage {
  /**
   * @param {object} deps
   * @param {TeqFw_Web_Back_Enum_Stage} deps.STAGE
   * @param {TeqFw_Web_Back_Dto_Info__Factory} deps.dtoInfoFactory
   * @param {TeqFw_Site_Model_AgentMessage} deps.messages
   */
  constructor({STAGE, dtoInfoFactory, messages}) {
    const info = dtoInfoFactory.create({
      after: ["TeqFw_Web_Back_Handler_Static"],
      before: ["TeqFw_Site_Controller_Ssr"],
      name: this.constructor.name,
      stage: STAGE.PROCESS,
    });

    /**
     * @param {TeqFw_Web_Back_Dto_RequestContext} context
     * @param {number} status
     * @param {string} body
     * @param {Record<string, string>} [headers]
     * @returns {void}
     */
    const respond = (context, status, body, headers = {}) => {
      context.response.writeHead(status, {
        "cache-control": "no-store",
        "content-type": "text/plain; charset=utf-8",
        ...headers,
      });
      context.response.end(body);
      context.completed = true;
    };

    /**
     * @param {TeqFw_Web_Back_Dto_RequestContext} context
     * @returns {Promise<void>}
     */
    this.handle = async (context) => {
      const url = parseUrl(context.request.url ?? "");
      if (!url || url.pathname !== PATHNAME) return;
      if (context.request.method !== "GET") {
        respond(context, 405, "Method Not Allowed", {allow: "GET"});
        return;
      }
      if (url.search) {
        respond(context, 400, "Message headers are required");
        return;
      }
      const headers = /** @type {Record<string, unknown>} */ (context.request).headers ?? {};
      const agent = header(headers["x-agent-id"]);
      const message = header(headers["x-agent-message"]);
      if (!agent || !AGENT_ID.test(agent) || !message || !ASCII_MESSAGE.test(message)) {
        respond(context, 400, "Invalid agent message");
        return;
      }
      await messages.accept({agent, message});
      respond(context, 202, "Accepted");
    };

    /** @returns {TeqFw_Web_Back_Dto_Info} */
    this.getRegistrationInfo = () => info;
  }
}

export const __deps__ = Object.freeze({
  default: Object.freeze({
    STAGE: "TeqFw_Web_Back_Enum_Stage$",
    dtoInfoFactory: "TeqFw_Web_Back_Dto_Info__Factory$",
    messages: "TeqFw_Site_Model_AgentMessage$",
  }),
});
