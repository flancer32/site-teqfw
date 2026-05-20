import assert from "node:assert/strict";
import test from "node:test";

import createContainer from "../bootstrap/container.mjs";

test("serves SSR pages, static files, and 404 for unknown routes", async () => {
  process.env.TEQFW_WEB_SERVER_PORT = "0";
  const container = await createContainer();
  const app = await container.get("TeqFw_Site_App$");
  const server = await app.start();
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const home = await fetch(`${baseUrl}/`);
    assert.equal(home.status, 200);
    const homeText = await home.text();
    assert.match(homeText, /Get the ADSM book/);
    assert.match(homeText, /href="http:\/\/fly\.wiredgeese\.com\/flancer\/leanpub\/adsm-en\/"/);
    assert.doesNotMatch(homeText, /https:\/\/leanpub\.com\/adsm-ru/);
    assert.doesNotMatch(homeText, /https:\/\/leanpub\.com\/adsm-en/);
    assert.match(homeText, /View public proof/);
    assert.match(homeText, /@teqfw\/di/);
    assert.match(homeText, /Build JavaScript products that agents can safely evolve\./);
    assert.match(homeText, /Why control breaks/);
    assert.match(homeText, /Repeated agent sessions can scatter product decisions across prompts, chats, and temporary context\./);
    assert.match(homeText, /What should stay stable/);
    assert.match(homeText, /The repository needs product memory that both people and future agents can use\./);
    assert.match(homeText, /How the control layer works/);
    assert.match(homeText, /ADSM, TeqFW, and GitHub Flows keep agent work tied to durable product material\./);
    assert.match(homeText, /GitHub Flows/);
    assert.match(homeText, /This site is the proof/);
    assert.match(homeText, /This site itself is proof: it was created by a Codex agent/);
    assert.match(homeText, /Public proof stays open for inspection\./);
    assert.match(homeText, /Continue from the point that matters now\./);
    assert.match(homeText, /Understand ADSM/);
    assert.match(homeText, /Map the ecosystem/);
    assert.match(homeText, /Code is cheap\. Show me the spec\./);
    assert.doesNotMatch(homeText, /primary commercial next step/);
    assert.doesNotMatch(homeText, /The risk is not that AI is dangerous/);
    assert.doesNotMatch(homeText, /href="\/access"/);
    assert.doesNotMatch(homeText, />Access</);

    const proof = await fetch(`${baseUrl}/proof`);
    assert.equal(proof.status, 200);
    const proofText = await proof.text();
    assert.match(proofText, /<body class="layout-content">/);
    assert.match(proofText, /Can LLM agents safely evolve a real JavaScript product\?/);
    assert.match(proofText, /Start with this site\./);
    assert.match(proofText, /The current product website is the primary proof product\./);
    assert.match(proofText, /id="current-public-proof"/);
    assert.match(proofText, /@teqfw\/github-flows/);
    assert.match(proofText, /GitHub Flows App/);
    assert.match(proofText, /created through ADSM methodology and the technical base for TeqFW, but not TeqFW-based\./);
    assert.match(proofText, /late binding without transpilation/);
    assert.match(proofText, /What this evidence supports\./);
    assert.match(proofText, /it does not prove universal applicability, mass adoption, finished ecosystem completeness, or future directions such as Mindstream and packaged adoption\./);
    assert.match(proofText, /This page does not use planned demonstrations, private contexts, gated materials, or paid materials as current public proof\./);
    assert.match(proofText, /Next: understand how the control layer works\./);
    assert.doesNotMatch(proofText, /Code is cheap\. Show me the spec\./);
    assert.doesNotMatch(proofText, /Proof Principle/);
    assert.doesNotMatch(proofText, /Current Public Proof/);
    assert.doesNotMatch(proofText, /You do not have to take the method on trust\./);
    assert.doesNotMatch(proofText, /What this page does not ask you to believe\./);
    assert.doesNotMatch(proofText, /layout-proof/);

    const demo = await fetch(`${baseUrl}/demo/pages/`);
    assert.equal(demo.status, 200);
    const demoText = await demo.text();
    assert.match(demoText, /Watch a constrained GitHub Issue move toward a bounded production page\./);
    assert.match(demoText, /The public input is a constrained GitHub Issue, not arbitrary publishing\./);
    assert.match(demoText, /Only machine-validated generated changes may continue toward publication\./);
    assert.match(demoText, /Demo Pages is not hosting, a CMS, or a publishing entitlement\./);
    assert.match(demoText, /No validated generated Demo Pages are published yet\./);
    assert.match(demoText, /href="\/demo\/pages\/"/);
    assert.match(demoText, /Method[\s\S]*Ecosystem[\s\S]*Proof[\s\S]*Demo[\s\S]*Contacts/);
    assert.match(demoText, /not official TeqFW, ADSM, or Alex Gusev editorial content\./);

    const philosophy = await fetch(`${baseUrl}/ecosystem/philosophy`);
    assert.equal(philosophy.status, 200);
    const philosophyText = await philosophy.text();
    assert.match(philosophyText, /TeqFW is an architectural philosophy/);
    assert.match(philosophyText, /TeqFW is a philosophy for JavaScript web applications built and evolved with LLM agents\./);
    assert.match(philosophyText, /A compact orientation to the architectural principles behind TeqFW, with a link to the maintained source document\./);
    assert.match(philosophyText, /the browser is the universal runtime and JavaScript is native to it/);
    assert.match(philosophyText, /TeqFW makes application structure explicit and analyzable\./);
    assert.match(philosophyText, /dependencies and module relationships visible through explicit contracts, predictable namespaces, runtime linking, and machine-oriented documentation/);
    assert.match(philosophyText, /Machine interfaces/);
    assert.match(philosophyText, /Open GitHub source/);
    assert.match(philosophyText, /href="https:\/\/raw\.githubusercontent\.com\/teqfw\/di\/refs\/heads\/main\/PHILOSOPHY\.md"/);
    assert.match(philosophyText, /<link rel="canonical" href="https:\/\/teqfw\.com\/ecosystem\/philosophy">/);
    assert.doesNotMatch(philosophyText, /Code is cheap\. Show me the spec\./);
    assert.doesNotMatch(philosophyText, /Understand ADSM/);
    assert.doesNotMatch(philosophyText, /Review proof/);

    const legacy = await fetch(`${baseUrl}/philosophy`, {redirect: "manual"});
    assert.equal(legacy.status, 301);
    assert.equal(legacy.headers.get("location"), "/ecosystem/philosophy");

    const legacyAccess = await fetch(`${baseUrl}/access`, {redirect: "manual"});
    assert.equal(legacyAccess.status, 301);
    assert.equal(legacyAccess.headers.get("location"), "/contacts");

    const contacts = await fetch(`${baseUrl}/contacts`);
    assert.equal(contacts.status, 200);
    assert.match(await contacts.text(), /alex@wiredgeese\.com/);

    const css = await fetch(`${baseUrl}/assets/css/site.css`);
    assert.equal(css.status, 200);
    assert.match(css.headers.get("content-type") ?? "", /text\/css/);

    const missing = await fetch(`${baseUrl}/missing`);
    assert.equal(missing.status, 404);
  } finally {
    await app.stop();
    delete process.env.TEQFW_WEB_SERVER_PORT;
  }
});
