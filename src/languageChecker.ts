export function isKnownLanguage(
    language: string,
    knownLanguages: readonly string[],
): boolean {
    const normalizedLanguage = language.toLowerCase().trim();
    return knownLanguages.includes(normalizedLanguage);
}

export const KNOWN_LANGUAGES: readonly string[] = [
    "bash",
    "shell",
    "ini",
    "toml",
    "yaml",
    "json",
    "lua",
    "elisp",
    "nix",
    "vim",
    "nginx",
    "python",
    "py",
    "ruby",
    "javascript",
    "typescript",
    "css",
    "markdown",
    "docker",
    "makefile",
    "diff",
    "git",
    "properties",
    "plaintext",
    "text",
];
