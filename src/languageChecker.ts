export function isKnownLanguage(
    language: string,
    knownLanguages: readonly string[],
): boolean {
    const normalizedLanguage = language.toLowerCase().trim();
    return knownLanguages.includes(normalizedLanguage);
}
