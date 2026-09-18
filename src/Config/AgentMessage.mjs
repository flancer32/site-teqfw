// @ts-check

/**
 * @namespace TeqFw_Site_Config_AgentMessage
 * @description Parses immutable server-only delivery settings for the agent message channel.
 */

const NAMESPACE = "TEQFW_SITE";

/**
 * @param {unknown} value
 * @returns {string}
 */
function optionalString(value) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * @param {unknown} value
 * @param {string} name
 * @returns {number}
 */
function positiveInteger(value, name) {
  const result = typeof value === "number" ? value : Number(value);
  if (!Number.isSafeInteger(result) || result <= 0) throw new TypeError(`${NAMESPACE}__${name} must be a positive integer`);
  return result;
}

/**
 * @param {unknown} value
 * @returns {"implicit-tls"|"plain"|"starttls"}
 */
function transport(value) {
  const selected = optionalString(value).toLowerCase() || "implicit-tls";
  if (selected === "implicit-tls" || selected === "plain" || selected === "starttls") return selected;
  throw new TypeError(`${NAMESPACE}__AGENT_SMTP_MODE must be implicit-tls, plain, or starttls`);
}

export default class TeqFw_Site_Config_AgentMessage {
  /**
   * @param {object} deps
   * @param {TeqFw_Site_Node_Url} deps.nodeUrl
   * @param {TeqFw_Cfg_Reader} deps.reader
   */
  constructor({nodeUrl, reader}) {
    const raw = reader.get(NAMESPACE);
    const recipient = optionalString(raw.AGENT_MAIL_TO);
    const host = optionalString(raw.AGENT_SMTP_HOST);
    const from = optionalString(raw.AGENT_SMTP_FROM);
    const user = optionalString(raw.AGENT_SMTP_USER);
    const password = optionalString(raw.AGENT_SMTP_PASSWORD);
    const smtpIsRequested = Boolean(host || from || user || password);
    if (smtpIsRequested && (!recipient || !host || !from)) {
      throw new TypeError(`${NAMESPACE} agent SMTP configuration requires AGENT_MAIL_TO, AGENT_SMTP_HOST, and AGENT_SMTP_FROM`);
    }
    if (smtpIsRequested && Boolean(user) !== Boolean(password)) {
      throw new TypeError(`${NAMESPACE} agent SMTP credentials require both AGENT_SMTP_USER and AGENT_SMTP_PASSWORD`);
    }
    const mail = smtpIsRequested
      ? Object.freeze({
        from,
        host,
        password: password || undefined,
        port: positiveInteger(raw.AGENT_SMTP_PORT ?? 465, "AGENT_SMTP_PORT"),
        recipient,
        transport: transport(raw.AGENT_SMTP_MODE),
        user: user || undefined,
      })
      : undefined;
    const fallbackDirectory = nodeUrl.fileURLToPath(new URL("../../var/msg/", import.meta.url));

    /** @returns {string} */
    this.getFallbackDirectory = () => fallbackDirectory;
    /** @returns {TeqFw_Site_AgentMessage_Mail|undefined} */
    this.getMail = () => mail;
    Object.freeze(this);
  }
}

export const __deps__ = Object.freeze({
  default: Object.freeze({
    nodeUrl: "node:url",
    reader: "TeqFw_Cfg_Reader$",
  }),
});
