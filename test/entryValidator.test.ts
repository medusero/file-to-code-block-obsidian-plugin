import assert from "node:assert/strict";
import test from "node:test";
import { validateEntry } from "../src/entryValidator.ts";
import { err, ok } from "../src/result.ts";

test("debe devolver 'EMPTY_FILE_NAME' si no hay nombre de archivo o patrón", () => {
    assert.deepStrictEqual(validateEntry("  ", "sh"), err("EMPTY_FILE_NAME"));
});
test("debe devolver 'EMPTY_LANGUAGE' si no hay código de lenguaje", () => {
    assert.deepStrictEqual(validateEntry("*.sh", "  "), err("EMPTY_LANGUAGE"));
});
test("debe devolver 'EMPTY_FILE_NAME' si faltan los dos campos", () => {
    assert.deepStrictEqual(validateEntry("  ", "  "), err("EMPTY_FILE_NAME"));
});
test("debe devolver 'INVALID_FILE_NAME' si la primera entrada incluye un '/", () => {
    assert.deepStrictEqual(
        validateEntry("dir/file.sh", "sh"),
        err("INVALID_FILE_NAME"),
    );
});
test("debe devolver 'INVALID_FILE_NAME' si la primera entrada incluye un '\\", () => {
    assert.deepStrictEqual(
        validateEntry("dir\\file.sh", "sh"),
        err("INVALID_FILE_NAME"),
    );
});
test("debe devolver 'INVALID_FILE_NAME' si la primera entrada es solo puntos", () => {
    assert.deepStrictEqual(validateEntry(".", "sh"), err("INVALID_FILE_NAME"));
    assert.deepStrictEqual(validateEntry("..", "sh"), err("INVALID_FILE_NAME"));
});
test("debe devolver 'INVALID_FILE_NAME' si la primera entrada es solo un '*'", () => {
    assert.deepStrictEqual(validateEntry("*", "sh"), err("INVALID_FILE_NAME"));
});
test("debe devolver 'INVALID_FILE_NAME' si la primera entrada es solo una pareja de '**'", () => {
    assert.deepStrictEqual(validateEntry("**", "sh"), err("INVALID_FILE_NAME"));
});
test("debe devolver 'INVALID_FILE_NAME' si la primera entrada incluye un '*' que no esté al inicio", () => {
    assert.deepStrictEqual(
        validateEntry("sh*", "sh"),
        err("INVALID_FILE_NAME"),
    );
});
test("debe devolver 'INVALID_FILE_NAME' si la primera entrada va encerrada entre dos '*'", () => {
    assert.deepStrictEqual(
        validateEntry("*.s*", "sh"),
        err("INVALID_FILE_NAME"),
    );
});
test("debe devolver 'INVALID_FILE_NAME' si la primera entrada es un patrón sin extensión", () => {
    assert.deepStrictEqual(validateEntry("*.", "sh"), err("INVALID_FILE_NAME"));
});
test("debe devolver 'INVALID_FILE_NAME' si la primera entrada incluye un '*' y tiene más de un punto", () => {
    assert.deepStrictEqual(
        validateEntry("*.tar.gz", "gz"),
        err("INVALID_FILE_NAME"),
    );
});
test("debe devolver una entrada válida si la primera entrada no contiene '*' ni puntos", () => {
    assert.deepStrictEqual(
        validateEntry("Justfile", "makefile"),
        ok({ key: "Justfile", language: "makefile" }),
    );
});
test("debe devolver una entrada válida si la primera entrada es un nombre de archivo exacto con varios puntos", () => {
    assert.deepStrictEqual(
        validateEntry("docker-compose.override.yml", "yml"),
        ok({ key: "docker-compose.override.yml", language: "yml" }),
    );
});
test("debe devolver una entrada válida si hay espacios en blanco rodeando las entradas", () => {
    assert.deepStrictEqual(
        validateEntry(" *.sh ", " sh "),
        ok({ key: "*.sh", language: "sh" }),
    );
});
test("debe devolver 'DUPLICATE_ENTRY' si la entrada ya está en el diccionario", () => {
    assert.deepStrictEqual(
        validateEntry("*.zshrc", "zsh", { "*.zshrc": "zsh" }),
        err("DUPLICATE_ENTRY"),
    );
});
test("debe devolver 'DUPLICATE_ENTRY' si la entrada ya está en el diccionario pero el lenguaje no coincide", () => {
    assert.deepStrictEqual(
        validateEntry("*.zshrc", "zsh", { "*.zshrc": "bash" }),
        err("DUPLICATE_ENTRY"),
    );
});
test("debe devolver 'DUPLICATE_ENTRY' si la entrada ya está en el diccionario ante entradas con espacios alrededor", () => {
    assert.deepStrictEqual(
        validateEntry(" *.zshrc ", " zsh ", { "*.zshrc": "zsh" }),
        err("DUPLICATE_ENTRY"),
    );
});
test("debe devolver 'ok' si el mapa está vacío y la clave es 'toString'", () => {
    assert.deepStrictEqual(
        validateEntry("toString", " zsh ", {}),
        ok({ key: "toString", language: "zsh" }),
    );
});
test("debe devolver 'ok' si el mapa tiene contenido pero la entrada no está en él", () => {
    assert.deepStrictEqual(
        validateEntry("*.zshrc", " zsh ", { "*.sh": "bash" }),
        ok({ key: "*.zshrc", language: "zsh" }),
    );
});
