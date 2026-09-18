// @ts-check

/**
 * @namespace TeqFw_Site_Model_AgentMessage_Archive
 * @description Stores accepted agent messages locally when SMTP delivery is unavailable.
 */

export default class TeqFw_Site_Model_AgentMessage_Archive {
  /**
   * @param {object} deps
   * @param {TeqFw_Site_Config_AgentMessage} deps.config
   * @param {TeqFw_Site_Node_Crypto} deps.crypto
   * @param {TeqFw_Site_Node_FsPromises} deps.fs
   * @param {TeqFw_Site_Node_Path} deps.path
   */
  constructor({config, crypto, fs, path}) {
    const directory = config.getFallbackDirectory();

    /**
     * @param {TeqFw_Site_AgentMessage_Record} record
     * @param {string} record.agent
     * @param {string} record.message
     * @returns {Promise<void>}
     */
    this.save = async function (record) {
      const {agent, message} = record;
      await fs.mkdir(directory, {mode: 0o700, recursive: true});
      const name = `${Date.now()}-${crypto.randomUUID()}.json`;
      const payload = JSON.stringify({agent, message, receivedAt: new Date().toISOString()}) + "\n";
      await fs.writeFile(path.join(directory, name), payload, {encoding: "utf8", flag: "wx", mode: 0o600});
    };
    Object.freeze(this);
  }
}

export const __deps__ = Object.freeze({
  default: Object.freeze({
    config: "TeqFw_Site_Config_AgentMessage$",
    crypto: "node:crypto",
    fs: "node:fs/promises",
    path: "node:path",
  }),
});
