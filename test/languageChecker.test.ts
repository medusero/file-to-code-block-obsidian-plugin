import assert from "node:assert/strict";
import test from "node:test";
import { isKnownLanguage, KNOWN_LANGUAGES } from "../src/languageChecker.ts";

test("debe devolver true ante la coincidencia con 'bash'", () => {
    assert.strictEqual(isKnownLanguage("bash", ["bash", "ini"]), true);
});
test("debe devolver true ante la coincidencia con 'ini'", () => {
    assert.strictEqual(isKnownLanguage("ini", ["bash", "ini"]), true);
});
test("debe devolver false ante la ausencia de 'klingon'", () => {
    assert.strictEqual(isKnownLanguage("klingon", ["bash", "ini"]), false);
});
test("debe devolver true ante la coincidencia con 'bash' a pesar de las mayúsculas", () => {
    assert.strictEqual(isKnownLanguage("Bash", ["bash", "ini"]), true);
    assert.strictEqual(isKnownLanguage("BASH", ["bash", "ini"]), true);
});
test("debe devolver true ante la coincidencia con 'bash' a pesar de los espacios", () => {
    assert.strictEqual(isKnownLanguage(" bash ", ["bash", "ini"]), true);
});
test("debe devolver false ante una lista vacía", () => {
    assert.strictEqual(isKnownLanguage("bash", []), false);
});
test("debe devolver false ante una búsqueda vacía", () => {
    assert.strictEqual(isKnownLanguage("", ["bash", "ini"]), false);
});
test("debe devolver false ante una búsqueda solo con espacios", () => {
    assert.strictEqual(isKnownLanguage("  ", ["bash", "ini"]), false);
});
test("debe devolver false ante solo un prefijo conocido", () => {
    assert.strictEqual(isKnownLanguage("bas", ["bash", "ini"]), false);
});
test("debe devolver false ante un texto que contiene una coincidencia", () => {
    assert.strictEqual(isKnownLanguage("bashx", ["bash", "ini"]), false);
});
test("debe devolver false ante un texto con un espacio interior", () => {
    assert.strictEqual(isKnownLanguage("ba sh", ["bash", "ini"]), false);
});
test("debe verificar que todas las entradas están en minúsculas y carecen de espacios", () => {
    KNOWN_LANGUAGES.forEach((language) =>
        assert.strictEqual(language, language.toLowerCase().trim()),
    );
});
