import assert from "node:assert/strict";
import { homedir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { expandHomePath } from "../src/pathExpander.ts";

test("Validar la correcta expansión del directorio del usuario", () => {
    assert.strictEqual(expandHomePath("~"), homedir());
    assert.strictEqual(expandHomePath("~/.zshrc"), join(homedir(), ".zshrc"));
    assert.strictEqual(
        expandHomePath(join(homedir(), ".zshrc")),
        join(homedir(), ".zshrc"),
    );
});

test("Validar la devolución sin cambios de una ruta inválida", () => {
    assert.strictEqual(expandHomePath("~something"), "~something");
});

test("Validar la correcta resolución según plataforma", () => {
    assert.strictEqual(
        expandHomePath("~\\.gitconfig", "win32"),
        join(homedir(), "\\.gitconfig"),
    );
});
