import test from "node:test";
import assert from "node:assert/strict";
import { sanitizePath } from "../src/pathSanitizer.ts";

test("Validar la eliminación de comillas y espacios en blanco", () => {
    assert.strictEqual(sanitizePath('"ruta/de/ejemplo1"'), "ruta/de/ejemplo1");
    assert.strictEqual(
        sanitizePath("\'ruta/de/ejemplo2\'"),
        "ruta/de/ejemplo2",
    );
    assert.strictEqual(
        sanitizePath("\"ruta/de/ejemplo3\'"),
        "ruta/de/ejemplo3",
    );
    assert.strictEqual(sanitizePath('"ruta/de/ejemplo4'), "ruta/de/ejemplo4");
    assert.strictEqual(sanitizePath("ruta/de/ejemplo5"), "ruta/de/ejemplo5");
    assert.strictEqual(sanitizePath('" ruta/de/ejemplo6 '), "ruta/de/ejemplo6");
    assert.strictEqual(
        sanitizePath('" ruta/de/ejemplo7 "'),
        "ruta/de/ejemplo7",
    );
    assert.strictEqual(sanitizePath("ruta/de/e'jemplo8"), "ruta/de/e'jemplo8");
});
