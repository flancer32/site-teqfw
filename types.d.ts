declare global {
  type TeqFw_Cfg_Loader = {load(sources: ReadonlyArray<TeqFw_Cfg_Source>): Promise<void>};
  type TeqFw_Cfg_Source_DotenvFile = {create(options: {path: string, id?: string}): TeqFw_Cfg_Source};
  type TeqFw_Cfg_Source_ProcessEnv = {create(environment: NodeJS.ProcessEnv, id?: string): TeqFw_Cfg_Source};
  type TeqFw_Log_Provider = {forSource(source: string): {info(message: string): void}};
  type TeqFw_Site_App = import("./src/App.mjs").default;
  type TeqFw_Site_Config = import("./src/Config.mjs").default;
  type TeqFw_Site_Config$Page = import("./src/Config.mjs").Page;
  type TeqFw_Site_Config$PageHero = import("./src/Config.mjs").PageHero;
  type TeqFw_Site_Config$PagePrinciple = import("./src/Config.mjs").PagePrinciple;
  type TeqFw_Site_Config$Site = import("./src/Config.mjs").Site;
  type TeqFw_Site_Controller_Ssr = import("./src/Controller/Ssr.mjs").default;
  type TeqFw_Site_Model_Navigation = import("./src/Model/Navigation.mjs").default;
  type TeqFw_Site_Model_Page = import("./src/Model/Page.mjs").default;
  type TeqFw_Site_Model_SiteMap = import("./src/Model/SiteMap.mjs").default;
  type TeqFw_Site_Model_Renderer = import("./src/Model/Renderer.mjs").default;
  type TeqFw_Site_Model_RouteMap = import("./src/Model/RouteMap.mjs").default;
  type TeqFw_Site_Model_StaticFiles = import("./src/Model/StaticFiles.mjs").default;
  type TeqFw_Site_Responder_Html = import("./src/Responder/Html.mjs").default;
  type TeqFw_Site_Node_Events = typeof import("node:events");
  type TeqFw_Site_Node_Fs = typeof import("node:fs");
  type TeqFw_Site_Node_Path = typeof import("node:path");
  type TeqFw_Site_Node_FsPromises = typeof import("node:fs/promises");
  type TeqFw_Site_Node_Process = typeof import("node:process");
  type TeqFw_Site_Node_Url = typeof import("node:url");
  type TeqFw_Site_Nunjucks = typeof import("nunjucks");
}

export {};
