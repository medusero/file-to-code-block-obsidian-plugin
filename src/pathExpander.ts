import { homedir } from "node:os";
import { join } from "node:path";

export function expandHomePath(
    inputPath: string,
    platform: string = process.platform,
): string {
    if (
        inputPath === "~" ||
        (inputPath.startsWith("~\\") && platform === "win32")
    ) {
        return join(homedir(), inputPath.slice(1));
    } else if (inputPath.startsWith("~/")) {
        return join(homedir(), inputPath.slice(1));
    }
    return inputPath;
}
