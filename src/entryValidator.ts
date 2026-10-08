import { type Result, err, ok } from "./result.ts";

export type ValidatorError =
    | "EMPTY_FILE_NAME"
    | "EMPTY_LANGUAGE"
    | "INVALID_FILE_NAME"
    | "DUPLICATE_ENTRY";

export type ValidEntry = { key: string; language: string };

export function validateEntry(
    key: string,
    language: string,
    existingEntries: Record<string, string> = {},
): Result<ValidEntry, ValidatorError> {
    const trimmedKey = key.trim();
    const trimmedLanguage = language.trim();
    const isPattern = trimmedKey.includes("*");
    const patternExtension = trimmedKey.slice(2);
    if (!trimmedKey) {
        return err("EMPTY_FILE_NAME");
    }
    if (!trimmedLanguage) {
        return err("EMPTY_LANGUAGE");
    }
    if (trimmedKey.includes("/") || trimmedKey.includes("\\")) {
        return err("INVALID_FILE_NAME");
    }
    if (/^\.+$/.test(trimmedKey)) {
        return err("INVALID_FILE_NAME");
    }
    if (
        isPattern &&
        (!trimmedKey.startsWith("*.") ||
            patternExtension === "" ||
            patternExtension.includes("*") ||
            patternExtension.includes("."))
    ) {
        return err("INVALID_FILE_NAME");
    }
    if (Object.hasOwn(existingEntries, trimmedKey)) {
        return err("DUPLICATE_ENTRY");
    }
    return ok({ key: trimmedKey, language: trimmedLanguage });
}
