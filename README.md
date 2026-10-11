# File to Code Block

An Obsidian plugin that inserts a text file from your computer into the current note as a fenced code block, with the language detected from the file name.

It is handy for keeping copies of configuration files (dotfiles such as `.zshrc` or `.gitconfig`), scripts and other small text files in your notes. The block is inserted at the cursor position of the active note.

Desktop only: the plugin reads files with Node.js, which is not available in Obsidian Mobile.

## Installation

### Manual installation

1. Download `main.js`, `manifest.json` and `styles.css` from the [latest release](https://github.com/medusero/file-to-code-block-obsidian-plugin/releases/latest).
2. In your vault, create the folder `.obsidian/plugins/file-to-code-block/` and copy the three files into it. On some systems `.obsidian` is hidden; enable hidden files in your file manager to see it.
3. Reload Obsidian, then enable **File to Code Block** under **Settings -> Community plugins -> Installed plugins**.

## Configuration

In *Settings -> File to Code Block*:

| Setting              | Description                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| **Add entry**        | Adds a file name -> language pair (e.g. `.myrc` -> `bash`). Both fields are required and the file name must be new. |
| **Custom languages** | The list of entries you have added. They take priority over the built-in list.                          |

If you enter a language that Obsidian's code highlighter does not know, the plugin shows a notice. This is only a hint: the entry is still saved, and highlighting in reading view may simply be missing.

## Usage

Run **File to Code Block: Insert file as code block** from the command palette, then type the absolute path of the file. A leading `~` is expanded to your home directory.

- The language is taken from the file name, using a built-in list of well-known files and extensions (for example, `.zshrc` becomes `bash` and `.gitconfig` becomes `ini`) and your custom languages.
- If no language is detected, the plugin asks you for one.
- Files larger than 2 MB or with more than 1000 lines are rejected, so a wrong path (a binary, a log) does not flood your note.
- Error messages never show system paths, and the plugin only reads files; it never writes outside your vault.

## License

[MIT](LICENSE)
