import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the bilingual portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Ting-Yu Liu 劉庭妤｜Sustainability × Technology/);
  assert.match(html, /永續｜數位改善/);
  assert.match(html, /端到端人力洞察儀表板/);
  assert.match(html, /下載目前版本 HTML/);
  assert.match(html, /#<!-- -->永續 &amp; ESG/);
  assert.match(html, />編輯<\/button>/);
});

test("keeps the editor local, reversible and exportable", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /tyl-portfolio-editor-v2/);
  assert.match(page, /window\.localStorage\.setItem/);
  assert.match(page, /const exportData/);
  assert.match(page, /const importData/);
  assert.match(page, /const resetData/);
  assert.match(page, /contentEditable/);
  assert.match(page, /addItem\("project"\)/);
  assert.match(css, /\.editorBar/);
  assert.match(css, /\.inlineEditable/);
  assert.match(css, /@media print\{\.editToggle,\.editorBar,\.itemTools/);
});
