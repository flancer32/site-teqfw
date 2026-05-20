// @ts-check

/**
 * @namespace TeqFw_Site_Model_DemoPages
 * @description Loads and validates generated Demo Pages metadata and templates.
 */

export default class TeqFw_Site_Model_DemoPages {
  constructor({config, fs, path}) {
    const metaPath = config.getDemoPagesMetaPath();
    const templateRoot = config.getTemplateRoot();
    const pages = loadMetadata(metaPath, fs).map((record, index) => {
      const page = normalizeRecord(record, index);
      const templateFile = path.join(templateRoot, page.template);
      validateTemplate(page, fs.readFileSync(templateFile, "utf8"));
      return deepFreeze(page);
    });
    const byRoute = new Map(pages.map((page) => [page.route, page]));

    this.getByRoute = (route) => byRoute.get(route) ?? null;
    this.getPages = () => pages;
  }
}

function loadMetadata(metaPath, fs) {
  try {
    const parsed = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    assertRecord(parsed, "demo-pages");
    if (!Array.isArray(parsed.pages)) throw new Error("demo-pages.pages must be an array");
    return parsed.pages;
  } catch (error) {
    if (isMissingFile(error)) return [];
    throw error;
  }
}

function normalizeRecord(value, index) {
  const path = `demo-pages.pages[${index}]`;
  assertRecord(value, path);
  assertNoForbiddenFields(value, path);

  const slug = normalizeSlug(value.slug, `${path}.slug`);
  const route = normalizeRoute(value.route, `${path}.route`, slug);
  const template = normalizeTemplate(value.template, `${path}.template`, slug);
  const title = normalizeString(value.title, `${path}.title`);
  const description = normalizeString(value.description, `${path}.description`);
  const area = value.area === undefined ? "demo" : normalizeString(value.area, `${path}.area`);

  if (value.demo !== true) throw new Error(`${path}.demo must be true`);
  if (value.generated !== true) throw new Error(`${path}.generated must be true`);
  if (value.isNavigable !== false) throw new Error(`${path}.isNavigable must be false`);
  if (value.isSitemap !== false) throw new Error(`${path}.isSitemap must be false`);
  if (area !== "demo") throw new Error(`${path}.area must be demo`);

  const trajectory = normalizeTrajectory(value.trajectory, `${path}.trajectory`);

  return {
    area,
    demo: true,
    description,
    generated: true,
    hero: {
      cta: "Back to Demo Pages",
      ctaHref: "/demo/pages/",
      kicker: "Generated Demo Page",
      title,
    },
    id: `demo-page-${slug}`,
    intro: description,
    isDemoGenerated: true,
    isNavigable: false,
    isSitemap: false,
    route,
    slug,
    summary: description,
    template,
    title,
    trajectory,
    trajectoryLinks: buildTrajectoryLinks(trajectory, route),
  };
}

function normalizeTrajectory(value, path) {
  if (value === undefined) return null;
  assertRecord(value, path);
  const result = {};
  for (const key of ["issueUrl", "pullRequestUrl", "validationUrl", "deploymentUrl", "finalUrl"]) {
    if (Object.hasOwn(value, key)) result[key] = normalizeString(value[key], `${path}.${key}`);
  }
  return Object.keys(result).length === 0 ? null : result;
}

function buildTrajectoryLinks(trajectory, route) {
  const result = [];
  if (trajectory?.issueUrl) result.push(freezeLink("Source issue", trajectory.issueUrl));
  if (trajectory?.pullRequestUrl) result.push(freezeLink("Pull request", trajectory.pullRequestUrl));
  if (trajectory?.validationUrl) result.push(freezeLink("Validation result", trajectory.validationUrl));
  if (trajectory?.deploymentUrl) result.push(freezeLink("Deployment action", trajectory.deploymentUrl));
  result.push(freezeLink("Published page", trajectory?.finalUrl ?? route));
  return Object.freeze(result);
}

function freezeLink(label, href) {
  return Object.freeze({href, label});
}

function normalizeRoute(value, path, slug) {
  const route = normalizeString(value, path);
  const expected = `/demo/pages/${slug}/`;
  if (route !== expected) throw new Error(`${path} must equal ${expected}`);
  return route;
}

function normalizeSlug(value, path) {
  const slug = normalizeString(value, path);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug)) throw new Error(`${path} must be a normalized safe slug`);
  return slug;
}

function normalizeTemplate(value, path, slug) {
  const template = normalizeString(value, path);
  const expected = `page/demo/pages/${slug}/index.html`;
  if (template !== expected) throw new Error(`${path} must equal ${expected}`);
  return template;
}

function validateTemplate(page, content) {
  const structure = /^\s*\{%\s*extends\s+["']layout\/content\.html["']\s*%\}\s*\{%\s*block\s+content\s*%\}[\s\S]*\{%\s*endblock\s*%\}\s*$/u;
  if (!structure.test(content)) {
    throw new Error(`Generated demo template ${page.template} must only extend layout/content.html and define a content block`);
  }
  for (const [pattern, message] of [
    [/\{\{/u, "must not contain output expressions"],
    [/\{#/u, "must not contain comments"],
    [/\{%\s*(include|import|from|macro|set|if|for|filter|call)\b/u, "must not contain unsupported Nunjucks directives"],
    [/<script\b/iu, "must not contain JavaScript"],
    [/<style\b/iu, "must not contain styles"],
    [/<img\b/iu, "must not contain images"],
    [/<svg\b/iu, "must not contain SVG"],
    [/<form\b/iu, "must not contain forms"],
    [/<iframe\b/iu, "must not contain iframes"],
    [/<object\b/iu, "must not contain objects"],
    [/<embed\b/iu, "must not contain embeds"],
    [/\son[a-z]+\s*=/iu, "must not contain inline event handlers"],
    [/javascript\s*:/iu, "must not contain javascript: URLs"],
  ]) {
    if (pattern.test(content)) throw new Error(`Generated demo template ${page.template} ${message}`);
  }
}

function assertNoForbiddenFields(value, path) {
  for (const key of ["brand", "footer", "hero", "navLabel", "navigation", "site"]) {
    if (Object.hasOwn(value, key)) throw new Error(`${path}.${key} is not allowed in generated demo metadata`);
  }
}

function assertRecord(value, path) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${path} must be an object`);
}

function normalizeString(value, path) {
  if (typeof value !== "string" || value.trim() === "") throw new Error(`${path} must be a non-empty string`);
  return value.trim();
}

function isMissingFile(error) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "ENOENT");
}

function deepFreeze(value) {
  if (Array.isArray(value)) {
    for (const item of value) deepFreeze(item);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) deepFreeze(item);
  }
  return Object.freeze(value);
}

export const __deps__ = Object.freeze({
  config: "TeqFw_Site_Config$",
  fs: "node:fs",
  path: "node:path",
});
