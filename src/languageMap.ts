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
    ".tmux.conf": "tmux",
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

export function detectLanguage(fileName: string): string | undefined {
    if (fileName in knownFiles) {
        return knownFiles[fileName];
    } else {
        const extension = fileName.replace(/^.*\./, "");
        if (extension in knownExtensions) {
            return knownExtensions[extension];
        }
    }
}
