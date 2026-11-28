import { isPlainObject } from "./objectChecker.ts";

export interface PluginSettings {
    customLanguageMap: Record<string, string>;
}

export const DEFAULT_SETTINGS: PluginSettings = {
    customLanguageMap: {},
};

function isStringPair(entry: [string, unknown]): entry is [string, string] {
    return typeof entry[1] === "string";
}

export function parseSettings(raw: unknown): PluginSettings {
    const settingsObject = isPlainObject(raw) ? raw : {};
    const entryMap = Object.entries(
        isPlainObject(settingsObject.customLanguageMap)
            ? settingsObject.customLanguageMap
            : DEFAULT_SETTINGS.customLanguageMap,
    );
    const stringPairs = entryMap.filter(isStringPair);
    const onlyStrings = Object.fromEntries(stringPairs);

    return {
        ...DEFAULT_SETTINGS,
        customLanguageMap: onlyStrings,
    };
}
