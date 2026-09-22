import test from "node:test";
import assert from "node:assert/strict";
import { computeFence, buildCodeBlock } from "../src/noteBuilder.ts";

test("detecta si devuelve la cantidad correcta de backticks", () => {
    assert.strictEqual(computeFence("content with no backticks"), "```");
    assert.strictEqual(computeFence("content with ```3``` backticks"), "````");
    assert.strictEqual(
        computeFence("content with ``2`` and ````4```` backticks"),
        "`````",
    );
});

test("detecta si devuelve el bloque de código correctamente formateado", () => {
    const text1 = "This is a test with final breakline";
    const text2 = "This is a test without final breakline with code language";
    const text3 = "This is a test with initial breakline";
    const test1 = buildCodeBlock(`${text1}\n`, "");
    const test2 = buildCodeBlock(`${text2}`, "text");
    const test3 = buildCodeBlock(`\n${text3}`, undefined);
    const backticks = "```";
    assert.strictEqual(test1, `${backticks}\n${text1}\n${backticks}`);
    assert.strictEqual(test2, `${backticks}text\n${text2}\n${backticks}`);
    assert.strictEqual(test3, `${backticks}\n\n${text3}\n${backticks}`);
});
