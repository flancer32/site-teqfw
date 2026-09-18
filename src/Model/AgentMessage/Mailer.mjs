// @ts-check

/**
 * @namespace TeqFw_Site_Model_AgentMessage_Mailer
 * @description Delivers one validated agent message through the configured SMTP transport.
 */

const TIMEOUT_MS = 10_000;

/**
 * @param {unknown} value
 * @returns {string}
 */
function mailHeader(value) {
  if (typeof value !== "string" || value.length === 0 || /[\r\n]/u.test(value)) throw new TypeError("SMTP header value is invalid");
  return value;
}

/**
 * @param {any} socket
 * @returns {(command?: string) => Promise<string>}
 */
function smtpReader(socket) {
  let buffer = "";
  /** @type {Error|undefined} */
  let failure;
  /** @type {Array<{reject: (reason: Error) => void, resolve: (value: string) => void}>} */
  const pending = [];
  /** @type {string[]} */
  let lines = [];
  /** @param {Error} error */
  const reject = (error) => {
    failure ??= error;
    while (pending.length) pending.shift()?.reject(failure);
  };
  socket.on("error", reject);
  socket.on("close", () => reject(new Error("SMTP connection closed")));
  socket.on("timeout", () => reject(new Error("SMTP response timed out")));
  socket.on("data", (chunk) => {
    buffer += String(chunk);
    let end;
    while ((end = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, end).replace(/\r$/u, "");
      buffer = buffer.slice(end + 1);
      lines.push(line);
      if (/^\d{3} /u.test(line)) {
        const response = lines.join("\n");
        lines = [];
        pending.shift()?.resolve(response);
      }
    }
  });
  return (command = undefined) => new Promise((resolve, rejectResponse) => {
    if (failure) {
      rejectResponse(failure);
      return;
    }
    pending.push({reject: rejectResponse, resolve});
    if (command !== undefined) socket.write(command + "\r\n");
  });
}

/**
 * @param {(command?: string) => Promise<string>} read
 * @param {string} command
 * @returns {Promise<void>}
 */
async function command(read, command) {
  const response = await read(command);
  if (!/(?:^|\n)[23]\d\d /u.test(response)) throw new Error("SMTP command was rejected");
}

/**
 * @param {any} socket
 * @param {string} event
 * @returns {Promise<any>}
 */
function waitForConnection(socket, event) {
  return new Promise((resolve, reject) => {
    let settled = false;
    /** @param {Error} error */
    const fail = (error) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      reject(error);
    };
    socket.once(event, () => {
      if (settled) return;
      settled = true;
      resolve(socket);
    });
    socket.once("error", fail);
    socket.once("close", () => fail(new Error("SMTP connection closed")));
    socket.once("timeout", () => fail(new Error("SMTP connection timed out")));
    if (typeof socket.setTimeout === "function") socket.setTimeout(TIMEOUT_MS);
  });
}

export default class TeqFw_Site_Model_AgentMessage_Mailer {
  /**
   * @param {object} deps
   * @param {TeqFw_Site_Node_Net} deps.net
   * @param {TeqFw_Site_Node_Tls} deps.tls
   */
  constructor({net, tls}) {
    /**
     * @param {TeqFw_Site_AgentMessage_Delivery} request
     * @param {string} request.agent
     * @param {TeqFw_Site_AgentMessage_Mail} request.mail
     * @param {string} request.message
     * @returns {Promise<void>}
     */
    this.send = async function (request) {
      const {agent, mail, message} = request;
      const from = mailHeader(mail.from);
      const recipient = mailHeader(mail.recipient);
      let socket = mail.transport === "implicit-tls"
        ? await waitForConnection(tls.connect({host: mail.host, port: mail.port, servername: mail.host}), "secureConnect")
        : await waitForConnection(net.createConnection({host: mail.host, port: mail.port}), "connect");
      try {
        let read = smtpReader(socket);
        const greeting = await read();
        if (!/(?:^|\n)2\d\d /u.test(greeting)) throw new Error("SMTP greeting was rejected");
        let hello = await read("EHLO teqfw.com");
        if (!/(?:^|\n)2\d\d /u.test(hello)) throw new Error("SMTP EHLO was rejected");
        if (mail.transport === "starttls") {
          if (!/(?:^|\n)250[- ]STARTTLS(?:\s|$)/iu.test(hello)) throw new Error("SMTP server does not advertise STARTTLS");
          const response = await read("STARTTLS");
          if (!/(?:^|\n)220 /u.test(response)) throw new Error("SMTP STARTTLS was rejected");
          socket = await waitForConnection(tls.connect({socket, servername: mail.host}), "secureConnect");
          read = smtpReader(socket);
          hello = await read("EHLO teqfw.com");
          if (!/(?:^|\n)2\d\d /u.test(hello)) throw new Error("SMTP EHLO after STARTTLS was rejected");
        }
        if (mail.user || mail.password) {
          if (!mail.user || !mail.password) throw new Error("SMTP credentials are incomplete");
          await command(read, "AUTH PLAIN " + Buffer.from(`\u0000${mail.user}\u0000${mail.password}`, "utf8").toString("base64"));
        }
        await command(read, `MAIL FROM:<${from}>`);
        await command(read, `RCPT TO:<${recipient}>`);
        const data = await read("DATA");
        if (!/(?:^|\n)3\d\d /u.test(data)) throw new Error("SMTP message data was rejected");
        const content = [
          `From: ${from}`,
          `To: ${recipient}`,
          "Subject: TeqFW agent message",
          "MIME-Version: 1.0",
          "Content-Type: text/plain; charset=us-ascii",
          "",
          `Agent: ${agent}`,
          "",
          message,
        ].join("\r\n").replace(/^\./gmu, "..");
        const accepted = await read(content + "\r\n.");
        if (!/(?:^|\n)2\d\d /u.test(accepted)) throw new Error("SMTP message was rejected");
        await read("QUIT").catch(() => undefined);
      } finally {
        socket.destroy();
      }
    };
    Object.freeze(this);
  }
}

export const __deps__ = Object.freeze({
  default: Object.freeze({
    net: "node:net",
    tls: "node:tls",
  }),
});
