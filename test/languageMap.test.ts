import assert from "node:assert/strict";
import test from "node:test";
import { detectLanguage } from "../src/languageMap.ts";

test("detecta yaml para .yaml y .yml, json para .json, bash para .zshrc y undefined para README.md", () => {
    assert.strictEqual(detectLanguage("compose.yml"), "yaml");
    assert.strictEqual(detectLanguage("compose.yaml"), "yaml");
    assert.strictEqual(detectLanguage("compose.json"), "json");
    assert.strictEqual(detectLanguage(".zshrc"), "bash");
    assert.strictEqual(detectLanguage("README.md"), undefined);
});

test("comprueba la prioridad de diccionarios", () => {
    assert.strictEqual(detectLanguage(".zshrc", { ".zshrc": "ts" }), "ts");
});

test("comprueba si devuelve undefined", () => {
    assert.strictEqual(detectLanguage("toString"), undefined);
    assert.strictEqual(detectLanguage("valueOf"), undefined);
    assert.strictEqual(detectLanguage("hasOwnProperty"), undefined);
    assert.strictEqual(detectLanguage("notas.toString"), undefined);
});

test("comprueba si devuelve 'kdl'", () => {
    assert.strictEqual(detectLanguage("config.kdl", { "*.kdl": "kdl" }), "kdl");
});
test("comprueba si devuelve undefined a partir de archivo sin extensión", () => {
    assert.strictEqual(detectLanguage("kdl", { "*.kdl": "kdl" }), undefined);
});
test("comprueba si devuelve 'json'", () => {
    assert.strictEqual(
        detectLanguage("config.json", { "*.json": "jsonc" }),
        "jsonc",
    );
});
test("comprueba si devuelve 'zsh' priorizando el nombre exacto", () => {
    assert.strictEqual(
        detectLanguage(".zshrc", { ".zshrc": "zsh", "*.zshrc": "x" }),
        "zsh",
    );
});
test("comprueba si devuelve undefined a partir de un patrón conocido sin extensión", () => {
    assert.strictEqual(detectLanguage("yaml"), undefined);
});
