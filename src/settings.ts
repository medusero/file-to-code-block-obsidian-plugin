export interface PluginSettings {
    customLanguageMap: Record<string, string>;
}

export const DEFAULT_SETTINGS: PluginSettings = {
    customLanguageMap: {},
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

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
