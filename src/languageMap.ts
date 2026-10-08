const knownFiles: Readonly<Record<string, string>> = {
    ".zshrc": "bash",
    ".zshenv": "bash",
    ".zprofile": "bash",
    ".bashrc": "bash",
    ".bash_profile": "bash",
    ".bash_aliases": "bash",
    ".profile": "bash",
    ".gitconfig": "ini",
    ".gitignore": "gitignore",
    ".gitattributes": "text",
    ".gitmodules": "ini",
    ".vimrc": "vim",
    ".gvimrc": "vim",
    ".editorconfig": "ini",
    ".npmrc": "ini",
    ".eslintrc": "json",
    ".prettierrc": "json",
    ".stylelintrc": "json",
    ".babelrc": "json",
    ".nvmrc": "text",
    ".flake8": "ini",
    ".pylintrc": "ini",
};

const knownExtensions: Readonly<Record<string, string>> = {
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    lua: "lua",
    el: "elisp",
    sh: "bash",
    py: "py",
};

export function detectLanguage(
    fileName: string,
    customLanguageMap: Record<string, string> = {},
): string | undefined {
    const extension = fileName.replace(/^.*\./, "");
    const key = `*.${extension}`;
    const hasExtension = fileName.includes(".");
    if (Object.hasOwn(customLanguageMap, fileName)) {
        return customLanguageMap[fileName];
    } else if (hasExtension && Object.hasOwn(customLanguageMap, key)) {
        return customLanguageMap[key];
    } else if (Object.hasOwn(knownFiles, fileName)) {
        return knownFiles[fileName];
    } else {
        if (hasExtension && Object.hasOwn(knownExtensions, extension)) {
            return knownExtensions[extension];
        }
    }
}
