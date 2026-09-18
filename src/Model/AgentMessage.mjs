// @ts-check

/**
 * @namespace TeqFw_Site_Model_AgentMessage
 * @description Accepts a validated agent message and delivers or archives it without exposing its content in logs.
 */

export default class TeqFw_Site_Model_AgentMessage {
  /**
   * @param {object} deps
   * @param {TeqFw_Site_Model_AgentMessage_Archive} deps.archive
   * @param {TeqFw_Site_Config_AgentMessage} deps.config
   * @param {TeqFw_Log_Provider} deps.logger
   * @param {TeqFw_Site_Model_AgentMessage_Mailer} deps.mailer
   */
  constructor({archive, config, logger, mailer}) {
    const log = logger.forSource("TeqFw_Site_Model_AgentMessage");

    /**
     * @param {TeqFw_Site_AgentMessage_Record} record
     * @param {string} record.agent
     * @param {string} record.message
     * @returns {Promise<void>}
     */
    this.accept = async (record) => {
      const mail = config.getMail();
      if (mail) {
        try {
          await mailer.send({...record, mail});
          log.info("Agent message delivered by email");
          return;
        } catch (error) {
          log.error("Agent message email delivery failed", {err: error});
          // Local persistence is the required fallback for every SMTP failure.
        }
      }
      await archive.save(record);
      log.info("Agent message stored locally");
    };
    Object.freeze(this);
  }
}

export const __deps__ = Object.freeze({
  default: Object.freeze({
    archive: "TeqFw_Site_Model_AgentMessage_Archive$",
    config: "TeqFw_Site_Config_AgentMessage$",
    logger: "TeqFw_Log_Provider$",
    mailer: "TeqFw_Site_Model_AgentMessage_Mailer$",
  }),
});
