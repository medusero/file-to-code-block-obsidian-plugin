import { isPlainObject } from "./objectChecker.ts";

export interface PluginSettings {
    customLanguageMap: Record<string, string>;
}

export const DEFAULT_SETTINGS: PluginSettings = {
    customLanguageMap: {},
};

export function parseSettings(raw: unknown): PluginSettings {
    const settings = isPlainObject(raw) ? (raw as Partial<PluginSettings>) : {};
    const entryMap = Object.entries(
        isPlainObject(settings.customLanguageMap)
            ? settings.customLanguageMap
            : DEFAULT_SETTINGS.customLanguageMap,
    );
    const stringPairs = entryMap.filter(
        ([, value]) => typeof value === "string",
    );
    const onlyStrings = Object.fromEntries(stringPairs);

    return {
        ...DEFAULT_SETTINGS,
        customLanguageMap: onlyStrings,
    };
}
