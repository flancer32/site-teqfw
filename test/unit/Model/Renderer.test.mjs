import assert from "node:assert/strict";
import test from "node:test";
import {fileURLToPath} from "node:url";

import Renderer from "../../../src/Model/Renderer.mjs";

test("Renderer renders semantic content through Nunjucks templates", async () => {
  const page = {
    hero: {cta: "Get the ADSM book", ctaHref: "http://fly.wiredgeese.com/flancer/leanpub/adsm-en/", kicker: "ADSM", title: "Hero thesis"},
    id: "home",
    intro: "Intro text",
    route: "/",
    summary: "Summary",
    template: "page/index.html",
    title: "TeqFW",
  };
  const renderer = new Renderer({
    config: {
      getBrand: () => ({
        ariaLabel: "TeqFW home",
        desktopText: "Tequila Framework & ADSM",
        homeHref: "/",
        logoAlt: "",
        logoSrc: "/favicon.ico",
        mobileText: "TeqFW / ADSM",
      }),
      getFooter: () => ({
        author: {label: "Alex Gusev", route: "/contacts"},
        identity: "Tequila Framework & ADSM",
        statement: "public proof product for controlled agent-driven JavaScript evolution",
      }),
      getSite: () => ({
        footer: {
          author: {label: "Alex Gusev", route: "/contacts"},
          identity: "Tequila Framework & ADSM",
          statement: "public proof product for controlled agent-driven JavaScript evolution",
        },
        lang: "en",
        name: "TeqFW",
        strapline: "Code is cheap. Show me the spec.",
        title: "ADSM and TeqFW Ecosystem",
        url: "https://teqfw.com",
      }),
      getTemplateRoot: () => fileURLToPath(new URL("../../../tmpl/", import.meta.url)),
    },
    navigation: {getItems: () => [
      {href: "/method", isCurrent: false, label: "Method"},
      {href: "/ecosystem", isCurrent: false, label: "Ecosystem"},
      {href: "/proof", isCurrent: false, label: "Proof"},
      {href: "/demo/pages/", isCurrent: false, label: "Demo"},
      {href: "/contacts", isCurrent: false, label: "Contacts"},
    ]},
    pages: {getByRoute: () => page, getGeneratedDemoPages: () => []},
  });

  const html = await renderer.render("/");

  assert.match(html, /Hero thesis/);
  assert.match(html, /Get the ADSM book/);
  assert.match(html, /href="http:\/\/fly\.wiredgeese\.com\/flancer\/leanpub\/adsm-en\/"/);
  assert.doesNotMatch(html, /https:\/\/leanpub\.com\/adsm-ru/);
  assert.doesNotMatch(html, /https:\/\/leanpub\.com\/adsm-en/);
  assert.match(html, /View public proof/);
  assert.match(html, /Why control breaks/);
  assert.match(html, /Repeated agent sessions can scatter product decisions across prompts, chats, and temporary context\./);
  assert.match(html, /What should stay stable/);
  assert.match(html, /The repository needs product memory that both people and future agents can use\./);
  assert.match(html, /How the control layer works/);
  assert.match(html, /ADSM, TeqFW, and GitHub Flows keep agent work tied to durable product material\./);
  assert.match(html, /Code is cheap\. Show me the spec\./);
  assert.match(html, /GitHub Flows/);
  assert.match(html, /This site is the proof/);
  assert.match(html, /This site itself is proof: it was created by a Codex agent/);
  assert.match(html, /Public proof stays open for inspection\./);
  assert.match(html, /Continue from the point that matters now\./);
  assert.match(html, /Understand ADSM/);
  assert.match(html, /Map the ecosystem/);
  assert.doesNotMatch(html, /primary commercial next step/);
  assert.doesNotMatch(html, /The risk is not that AI is dangerous/);
  assert.match(html, /<a class="brand" href="\/" aria-current="page" aria-label="TeqFW home">/);
  assert.match(html, /Tequila Framework &amp; ADSM/);
  assert.match(html, /TeqFW \/ ADSM/);
  assert.match(html, /<details class="site-nav site-nav--mobile">/);
  assert.match(html, /<summary class="nav-toggle" aria-label="Open primary navigation">/);
  assert.match(html, /href="\/method"/);
  assert.match(html, /href="\/demo\/pages\/"/);
  assert.match(html, />Demo</);
  assert.doesNotMatch(html, />Overview</);
  assert.match(html, /<strong>Tequila Framework &amp; ADSM<\/strong>/);
  assert.match(html, /public proof product for controlled agent-driven JavaScript evolution by <a href="\/contacts">Alex Gusev<\/a>\./);
  assert.doesNotMatch(html, /Footer navigation/);
  assert.doesNotMatch(html, /F\. Lancer/);
});

test("Renderer renders ecosystem philosophy with site canonical and source document link", async () => {
  const page = {
    hero: {
      cta: "Open GitHub source",
      ctaHref: "https://raw.githubusercontent.com/teqfw/di/refs/heads/main/PHILOSOPHY.md",
      kicker: "Ecosystem Philosophy",
      title: "TeqFW is a philosophy for JavaScript web applications built and evolved with LLM agents.",
    },
    id: "ecosystem-philosophy",
    intro: "A compact orientation to the architectural principles behind TeqFW, with a link to the maintained source document.",
    route: "/ecosystem/philosophy",
    summary: "Compact entry point to the TeqFW architectural philosophy.",
    template: "page/ecosystem/philosophy.html",
    title: "Ecosystem Philosophy",
  };
  const renderer = new Renderer({
    config: {
      getBrand: () => ({
        ariaLabel: "TeqFW home",
        desktopText: "Tequila Framework & ADSM",
        homeHref: "/",
        logoAlt: "",
        logoSrc: "/favicon.ico",
        mobileText: "TeqFW / ADSM",
      }),
      getFooter: () => ({
        author: {label: "Alex Gusev", route: "/contacts"},
        identity: "Tequila Framework & ADSM",
        statement: "public proof product for controlled agent-driven JavaScript evolution",
      }),
      getSite: () => ({
        footer: {
          author: {label: "Alex Gusev", route: "/contacts"},
          identity: "Tequila Framework & ADSM",
          statement: "public proof product for controlled agent-driven JavaScript evolution",
        },
        lang: "en",
        name: "TeqFW",
        strapline: "Code is cheap. Show me the spec.",
        title: "ADSM and TeqFW Ecosystem",
        url: "https://teqfw.com",
      }),
      getTemplateRoot: () => fileURLToPath(new URL("../../../tmpl/", import.meta.url)),
    },
    navigation: {getItems: () => []},
    pages: {getByRoute: () => page, getGeneratedDemoPages: () => []},
  });

  const html = await renderer.render("/ecosystem/philosophy");

  assert.match(html, /<link rel="canonical" href="https:\/\/teqfw\.com\/ecosystem\/philosophy">/);
  assert.match(html, /TeqFW is a philosophy for JavaScript web applications built and evolved with LLM agents\./);
  assert.match(html, /A compact orientation to the architectural principles behind TeqFW, with a link to the maintained source document\./);
  assert.match(html, /Key Principles/);
  assert.match(html, /the browser is the universal runtime and JavaScript is native to it/);
  assert.match(html, /TeqFW makes application structure explicit and analyzable\./);
  assert.match(html, /dependencies and module relationships visible through explicit contracts, predictable namespaces, runtime linking, and machine-oriented documentation/);
  assert.match(html, /Machine interfaces/);
  assert.match(html, /public contracts, integration patterns, and architectural assumptions/);
  assert.match(html, /Open GitHub source/);
  assert.match(html, /href="https:\/\/raw\.githubusercontent\.com\/teqfw\/di\/refs\/heads\/main\/PHILOSOPHY\.md"/);
  assert.doesNotMatch(html, /<link rel="canonical" href="https:\/\/raw\.githubusercontent\.com/);
  assert.doesNotMatch(html, /Code is cheap\. Show me the spec\./);
  assert.doesNotMatch(html, /Understand ADSM/);
  assert.doesNotMatch(html, /Review proof/);
});
