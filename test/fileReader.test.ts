import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { writeFile, unlink, chmod, stat, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { readDotFile } from "../src/fileReader.ts";
import { err } from "../src/result.ts";

describe("fileReader validation tests", () => {
    const smallFilePath = join(import.meta.dirname, "small-file.txt");
    const largeFilePath = join(import.meta.dirname, "large-file.txt");
    const noPermissionsFilePath = join(
        import.meta.dirname,
        "no-permission-file.txt",
    );
    const noFilePath = join(import.meta.dirname, "no=file.txt");
    const manyLinesFilePath = join(import.meta.dirname, "many-lines-file.txt");
    const dirPath = join(import.meta.dirname, "not-file");

    before(async () => {
        await writeFile(smallFilePath, Buffer.alloc(1 * 1024 * 1024));
        await writeFile(largeFilePath, Buffer.alloc(2 * 1024 * 1024));
        await writeFile(noPermissionsFilePath, "test");
        await chmod(noPermissionsFilePath, 0o000);
        await writeFile(manyLinesFilePath, "Line\n".repeat(1001));
        await mkdir(dirPath);
    });

    after(async () => {
        await unlink(smallFilePath).catch((e) => {
            console.error(e);
        });
        await unlink(largeFilePath).catch((e) => {
            console.error(e);
        });
        await chmod(noPermissionsFilePath, 0o644);
        await unlink(noPermissionsFilePath).catch((e) => {
            console.error(e);
        });
        await unlink(manyLinesFilePath).catch((e) => {
            console.error(e);
        });
        await rm(dirPath, { recursive: true }).catch((e) => {
            console.error(e);
        });
    });

    it('debe devolver "FILE_TOO_LARGE" si el archivo iguala o supera los 2MB', async () => {
        const result = await readDotFile(largeFilePath);
        assert.deepStrictEqual(result, err("FILE_TOO_LARGE"));
    });

    it("no debe devolver ningún error si el archivo es menor a 2MB", async () => {
        const result = await readDotFile(smallFilePath);
        assert.equal(result.ok, true);
    });

    it('debe devolver "PERMISSION_DENIED" si el archivo no tiene permisos', async () => {
        const result = await readDotFile(noPermissionsFilePath);
        assert.deepStrictEqual(result, err("PERMISSION_DENIED"));
    });

    it('debe devolver "FILE_NOT_FOUND" si el archivo no existe', async () => {
        const result = await readDotFile(noFilePath);
        assert.deepStrictEqual(result, err("FILE_NOT_FOUND"));
    });

    it('debe devolver "TOO_MANY_LINES" si el archivo supera las 1000 líneas', async () => {
        const result = await readDotFile(manyLinesFilePath);
        assert.deepStrictEqual(result, err("TOO_MANY_LINES"));
    });

    it('debe devolver "UNKNOWN_ERROR" si el archivo no es un archivo', async () => {
        const result = await readDotFile(dirPath);
        assert.deepStrictEqual(result, err("UNKNOWN_ERROR"));
    });
});
