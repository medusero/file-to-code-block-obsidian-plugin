import assert from "node:assert/strict";
import test from "node:test";
import { extractPrismLanguages } from "../src/prismLanguages.ts";

test("debe devolver undefined ante entradas que no son el objeto languages", () => {
    assert.deepStrictEqual(extractPrismLanguages(null), undefined);
    assert.deepStrictEqual(extractPrismLanguages(undefined), undefined);
    assert.deepStrictEqual(extractPrismLanguages("foo"), undefined);
});
test("debe devolver undefined ante ausencia de objeto languages", () => {
    assert.deepStrictEqual(extractPrismLanguages({}), undefined);
});
test("debe devolver undefined si languages no tiene su forma correcta", () => {
    assert.deepStrictEqual(
        extractPrismLanguages({ languages: null }),
        undefined,
    );
    assert.deepStrictEqual(
        extractPrismLanguages({ languages: "bash" }),
        undefined,
    );
});
test("debe devolver undefined ante un languages como array", () => {
    assert.deepStrictEqual(
        extractPrismLanguages({ languages: [{}] }),
        undefined,
    );
});
test("debe devolver undefined ante un languages vacío", () => {
    assert.deepStrictEqual(extractPrismLanguages({ languages: {} }), undefined);
});
test("debe devolver undefined cuando solo hay claves auxiliares", () => {
    assert.deepStrictEqual(
        extractPrismLanguages({ languages: { extend() {} } }),
        undefined,
    );
});
test("debe devolver los códigos correctos ante un languages bien formado", () => {
    assert.deepStrictEqual(
        extractPrismLanguages({ languages: { bash: {}, sh: {} } }),
        ["bash", "sh"],
    );
});
test("debe devolver solo el código e ignorar las funciones", () => {
    assert.deepStrictEqual(
        extractPrismLanguages({
            languages: { bash: {}, extend() {}, insertBefore() {}, DFS() {} },
        }),
        ["bash"],
    );
});
test("debe devolver solo el código e ignorar valores que no son objetos", () => {
    assert.deepStrictEqual(
        extractPrismLanguages({ languages: { bash: {}, broken: null } }),
        ["bash"],
    );
});
