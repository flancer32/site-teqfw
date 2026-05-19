// @ts-check

/**
 * @namespace TeqFw_Site_App
 * @description Composes the SSR site runtime with the TeqFW web host.
 */

export default class TeqFw_Site_App {
  /**
   * @param {object} deps
   * @param {TeqFw_Site_Controller_Ssr} deps.controller
   * @param {TeqFw_Site_Env_Loader} deps.envLoader
   * @param {Fl32_Web_Back_Handler_Pre_Log} deps.logHandler
   * @param {Fl32_Web_Node_Events} deps.nodeEvents
   * @param {Fl32_Web_Back_PipelineEngine} deps.pipeline
   * @param {Fl32_Web_Back_Config_Runtime$Factory} deps.runtimeConfigFactory
   * @param {Fl32_Web_Back_Server} deps.server
   * @param {TeqFw_Site_Model_StaticFiles} deps.staticFiles
   * @param {Fl32_Web_Back_Handler_Static} deps.staticHandler
   */
  constructor({controller, envLoader, logHandler, nodeEvents, pipeline, runtimeConfigFactory, server, staticFiles, staticHandler}) {
    const {once} = nodeEvents;
    let configured = false;
    let composed = false;
    let started = false;

    this.start = async ({projectRoot = process.cwd()} = {}) => {
      if (!configured) {
        runtimeConfigFactory.configure(await envLoader.load({projectRoot}));
        runtimeConfigFactory.freeze();
        configured = true;
      }

      if (!composed) {
        await staticHandler.init({sources: staticFiles.getSources()});
        pipeline.addHandler(logHandler);
        pipeline.addHandler(staticHandler);
        pipeline.addHandler(controller);
        composed = true;
      }

      if (!started) {
        await server.start();
        const instance = server.getInstance();
        if (instance && !instance.listening && typeof instance.once === "function") {
          await once(instance, "listening");
        }
        started = true;
      }

      return server.getInstance();
    };

    this.stop = async () => {
      if (started) {
        await server.stop();
        started = false;
      }
    };

    this.run = async ({projectRoot, cliArgs = []}) => {
      void cliArgs;
      const instance = await this.start({projectRoot});
      const address = instance && typeof instance.address === "function" ? instance.address() : undefined;
      const port = address && typeof address === "object" ? address.port : "unknown";
      console.log(`TeqFW site is available on http://127.0.0.1:${port} (${projectRoot})`);

      const [signal] = await Promise.race([
        once(process, "SIGINT"),
        once(process, "SIGTERM"),
      ]);
      if (signal) console.log(`Stopping on ${signal}.`);
      await this.stop();
      return 0;
    };
  }
}

export const __deps__ = Object.freeze({
  controller: "TeqFw_Site_Controller_Ssr$",
  envLoader: "TeqFw_Site_Env_Loader$",
  logHandler: "Fl32_Web_Back_Handler_Pre_Log$",
  nodeEvents: "node:events",
  pipeline: "Fl32_Web_Back_PipelineEngine$",
  runtimeConfigFactory: "Fl32_Web_Back_Config_Runtime__Factory$",
  server: "Fl32_Web_Back_Server$",
  staticFiles: "TeqFw_Site_Model_StaticFiles$",
  staticHandler: "Fl32_Web_Back_Handler_Static$",
});
