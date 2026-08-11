// @ts-check

/**
 * @namespace TeqFw_Site_App
 * @description Composes the SSR site handlers during the TeqFW CLI lifecycle.
 */

export default class TeqFw_Site_App {
  /**
   * @param {object} deps
   * @param {TeqFw_Site_Controller_Ssr} deps.controller
   * @param {TeqFw_Cfg_Source_DotenvFile} deps.dotenv
   * @param {TeqFw_Cfg_Loader} deps.cfgLoader
   * @param {TeqFw_Cfg_Source_ProcessEnv} deps.processEnv
   * @param {TeqFw_Site_Node_FsPromises} deps.fs
   * @param {TeqFw_Web_Back_Handler_Pre_Log} deps.logHandler
   * @param {TeqFw_Web_Back_PipelineEngine} deps.pipeline
   * @param {TeqFw_Site_Model_StaticFiles} deps.staticFiles
   * @param {TeqFw_Web_Back_Handler_Static} deps.staticHandler
   * @param {TeqFw_Log_Provider} deps.logger
   * @param {TeqFw_Site_Node_Path} deps.path
   * @param {TeqFw_Site_Node_Process} deps.process
   */
  constructor({cfgLoader, controller, dotenv, fs, logHandler, logger, path, pipeline, process, processEnv, staticFiles, staticHandler}) {
    const log = logger.forSource("TeqFw_Site_App");
    let started = false;

    /**
     * Loads configuration and registers all request handlers before the CLI command starts the server.
     * @returns {Promise<void>}
     */
    this.onStartup = async () => {
      if (started) return;
      const projectRoot = process.cwd();
      const sources = [];
      try {
        await fs.access(path.join(projectRoot, ".env"));
        sources.push(dotenv.create({path: path.join(projectRoot, ".env"), id: "site-dotenv"}));
      } catch (error) {
        if (error?.code !== "ENOENT") throw error;
      }
      sources.push(processEnv.create(process.env, "process-env"));
      await cfgLoader.load(sources);
      await staticHandler.init({sources: staticFiles.getSources()});
      pipeline.addHandler(logHandler);
      pipeline.addHandler(staticHandler);
      pipeline.addHandler(controller);
      started = true;
      log.info("SSR site handlers initialized");
    };

    /**
     * Stops the web server when it is running.
     * @returns {Promise<void>}
     */
    this.onShutdown = async () => {
      started = false;
    };
  }
}

export const __deps__ = Object.freeze({
  cfgLoader: "TeqFw_Cfg_Loader$",
  controller: "TeqFw_Site_Controller_Ssr$",
  dotenv: "TeqFw_Cfg_Source_DotenvFile$",
  fs: "node:fs/promises",
  logHandler: "TeqFw_Web_Back_Handler_Pre_Log$",
  logger: "TeqFw_Log_Provider$",
  path: "node:path",
  pipeline: "TeqFw_Web_Back_PipelineEngine$",
  process: "node:process",
  processEnv: "TeqFw_Cfg_Source_ProcessEnv$",
  staticFiles: "TeqFw_Site_Model_StaticFiles$",
  staticHandler: "TeqFw_Web_Back_Handler_Static$",
});
