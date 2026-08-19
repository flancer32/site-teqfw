// @ts-check

/**
 * @namespace TeqFw_Site_Cli_Plugin
 * @description Composes the SSR site handlers during the TeqFW CLI lifecycle.
 */

/**
 * @param {object} deps
 * @param {TeqFw_Site_Controller_Ssr} deps.controller
 * @param {TeqFw_Web_Back_Handler_Pre_Log} deps.logHandler
 * @param {TeqFw_Log_Provider} deps.logger
 * @param {TeqFw_Web_Back_PipelineEngine} deps.pipeline
 * @param {TeqFw_Site_Model_StaticFiles} deps.staticFiles
 * @param {TeqFw_Web_Back_Handler_Static} deps.staticHandler
 * @returns {TeqFw_Cli_Api_Plugin}
 */
export default function TeqFw_Site_Cli_Plugin({controller, logHandler, logger, pipeline, staticFiles, staticHandler}) {
  const log = logger.forSource("TeqFw_Site_Cli_Plugin");
  let started = false;

  return {
    /** Registers all request handlers before the CLI command starts the server. */
    onStartup: async function () {
      if (started) return;
      await staticHandler.init({sources: staticFiles.getSources()});
      pipeline.addHandler(logHandler);
      pipeline.addHandler(staticHandler);
      pipeline.addHandler(controller);
      started = true;
      log.info("SSR site handlers initialized");
    },

    /** Stops the web server when it is running. */
    onShutdown: async function () {
      started = false;
    },
  };
}

export const __deps__ = Object.freeze({
  default: Object.freeze({
    controller: "TeqFw_Site_Controller_Ssr$",
    logHandler: "TeqFw_Web_Back_Handler_Pre_Log$",
    logger: "TeqFw_Log_Provider$",
    pipeline: "TeqFw_Web_Back_PipelineEngine$",
    staticFiles: "TeqFw_Site_Model_StaticFiles$",
    staticHandler: "TeqFw_Web_Back_Handler_Static$",
  }),
});
