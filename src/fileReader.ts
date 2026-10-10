import { readFile, stat } from "node:fs/promises";
import { type Result, err, ok } from "./result.ts";

export type FileReadError =
    | "FILE_NOT_FOUND"
    | "PERMISSION_DENIED"
    | "UNKNOWN_ERROR"
    | "TOO_MANY_LINES"
    | "FILE_TOO_LARGE";

export async function readTextFile(
    filePath: string,
): Promise<Result<string, FileReadError>> {
    try {
        const maxSize = 2 * 1024 * 1024;
        const stats = await stat(filePath);
        if (stats.size < maxSize) {
            const content = await readFile(filePath, { encoding: "utf8" });
            const lineCount = content.split("\n").length;
            const maxLines = 1000;
            if (lineCount < maxLines) {
                return ok(content);
            } else {
                return err("TOO_MANY_LINES");
            }
        } else {
            return err("FILE_TOO_LARGE");
        }
    } catch (error) {
        if (error instanceof Error && "code" in error) {
            if (error.code === "ENOENT") {
                return err("FILE_NOT_FOUND");
            }
            if (error.code === "EACCES") {
                return err("PERMISSION_DENIED");
            }
        }
    }
    return err("UNKNOWN_ERROR");
}
