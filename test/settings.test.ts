import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_SETTINGS, parseSettings } from "../src/settings.ts";

test("comprueba si devuelve valores por defecto para undefined y null", () => {
    assert.deepStrictEqual(parseSettings(undefined), { customLanguageMap: {} });
    assert.deepStrictEqual(parseSettings(null), { customLanguageMap: {} });
});
test("comprueba si devuelve valores por defecto para lo que no sea un objeto", () => {
    assert.deepStrictEqual(parseSettings(42), { customLanguageMap: {} });
    assert.deepStrictEqual(parseSettings("Hi"), { customLanguageMap: {} });
});
test("comprueba si devuelve valores por defecto para un objeto sin el formato adecuado", () => {
    assert.deepStrictEqual(parseSettings({ 3: 14 }), { customLanguageMap: {} });
});
test("comprueba si conserva valores para un objeto con el formato adecuado", () => {
    assert.deepStrictEqual(
        parseSettings({ customLanguageMap: { uno: "uno", dos: "dos" } }),
        {
            customLanguageMap: {
                uno: "uno",
                dos: "dos",
            },
        },
    );
});
test("comprueba si conserva un valor correcto", () => {
    assert.deepStrictEqual(
        parseSettings({ customLanguageMap: { uno: 1, dos: "dos" } }),
        {
            customLanguageMap: {
                dos: "dos",
            },
        },
    );
});
test("comprueba que no son el mismo objeto", () => {
    assert.notStrictEqual(
        parseSettings(undefined).customLanguageMap,
        DEFAULT_SETTINGS.customLanguageMap,
    );
});
test("comprueba si ante texto devuelve mapa vacío por defecto", () => {
    assert.deepStrictEqual(parseSettings({ customLanguageMap: "texto" }), {
        customLanguageMap: {},
    });
});
test("comprueba si ante array devuelve mapa vacío por defecto", () => {
    assert.deepStrictEqual(parseSettings({ customLanguageMap: ["a", "b"] }), {
        customLanguageMap: {},
    });
});
