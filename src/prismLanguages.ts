import { isPlainObject } from "./objectChecker.ts";

export function extractPrismLanguages(prism: unknown): string[] | undefined {
    if (!isPlainObject(prism)) {
        return undefined;
    }
    if (!isPlainObject(prism.languages)) {
        return undefined;
    }
    const languageNames: string[] = [];
    for (const [key, value] of Object.entries(prism.languages)) {
        if (isPlainObject(value)) {
            languageNames.push(key);
        }
    }
    return languageNames.length > 0 ? languageNames : undefined;
}
