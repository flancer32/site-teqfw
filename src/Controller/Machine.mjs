// @ts-check

/**
 * @namespace TeqFw_Site_Controller_Machine
 * @description Serves the curated Markdown and llms.txt machine interface.
 */

export default class TeqFw_Site_Controller_Machine {
  /**
   * @param {object} deps
   * @param {TeqFw_Web_Back_Enum_Stage} deps.STAGE
   * @param {TeqFw_Web_Back_Dto_Info__Factory} deps.dtoInfoFactory
   * @param {typeof import("node:fs")} deps.fs
   * @param {TeqFw_Site_Model_MachineDocuments} deps.documents
   */
  constructor({STAGE, dtoInfoFactory, fs, documents}) {
    const info = dtoInfoFactory.create({
      after: ["TeqFw_Web_Back_Handler_Static"],
      name: this.constructor.name,
      stage: STAGE.PROCESS,
    });

    /**
     * Serves one exact machine-document route.
     * @param {TeqFw_Web_Back_Dto_RequestContext} context
     * @returns {Promise<void>}
     */
    this.handle = async (context) => {
      const document = documents.getByUrl(context.request.url ?? "/");
      if (!document) return;
      const content = await fs.promises.readFile(document.path, "utf8");
      context.response.writeHead(200, {
        "cache-control": "public, max-age=300",
        "content-type": document.contentType,
      });
      context.response.end(context.request.method === "HEAD" ? "" : content);
      context.completed = true;
    };

    /**
     * Returns the handler registration metadata.
     * @returns {TeqFw_Web_Back_Dto_Info}
     */
    this.getRegistrationInfo = () => info;
  }
}

export const __deps__ = Object.freeze({
  STAGE: "TeqFw_Web_Back_Enum_Stage$",
  documents: "TeqFw_Site_Model_MachineDocuments$",
  dtoInfoFactory: "TeqFw_Web_Back_Dto_Info__Factory$",
  fs: "node:fs",
});
