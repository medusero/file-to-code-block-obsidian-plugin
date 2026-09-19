import test from "node:test";
import assert from "node:assert/strict";
import { detectLanguage } from "../src/languageMap.ts";

test("detecta yaml para .yaml y .yml, json para .json, bash para .zshrc y undefined para README.md", () => {
    assert.strictEqual(detectLanguage("compose.yml"), "yaml");
    assert.strictEqual(detectLanguage("compose.yaml"), "yaml");
    assert.strictEqual(detectLanguage("compose.json"), "json");
    assert.strictEqual(detectLanguage(".zshrc"), "bash");
    assert.strictEqual(detectLanguage("README.md"), undefined);
});
