import { homedir } from "node:os";
import { join } from "node:path";

export function expandHomePath(inputPath: string): string {
    if (inputPath === "~" || inputPath.startsWith("~/")) {
        return join(homedir(), inputPath.slice(1));
    }
    return inputPath;
}
