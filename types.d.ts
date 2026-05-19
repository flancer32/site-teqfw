declare global {
  type TeqFw_Site_App = import("./src/App.mjs").default;
  type TeqFw_Site_Config = import("./src/Config.mjs").default;
  type TeqFw_Site_Config$Page = import("./src/Config.mjs").Page;
  type TeqFw_Site_Config$PageHero = import("./src/Config.mjs").PageHero;
  type TeqFw_Site_Config$PagePrinciple = import("./src/Config.mjs").PagePrinciple;
  type TeqFw_Site_Config$Site = import("./src/Config.mjs").Site;
  type TeqFw_Site_Controller_Ssr = import("./src/Controller/Ssr.mjs").default;
  type TeqFw_Site_Env_Loader = import("./src/Env/Loader.mjs").default;
  type TeqFw_Site_Model_Navigation = import("./src/Model/Navigation.mjs").default;
  type TeqFw_Site_Model_Page = import("./src/Model/Page.mjs").default;
  type TeqFw_Site_Model_SiteMap = import("./src/Model/SiteMap.mjs").default;
  type TeqFw_Site_Model_Renderer = import("./src/Model/Renderer.mjs").default;
  type TeqFw_Site_Model_RouteMap = import("./src/Model/RouteMap.mjs").default;
  type TeqFw_Site_Model_StaticFiles = import("./src/Model/StaticFiles.mjs").default;
  type TeqFw_Site_Responder_Html = import("./src/Responder/Html.mjs").default;
}

export {};
