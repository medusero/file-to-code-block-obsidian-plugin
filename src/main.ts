import { basename, join, resolve } from "node:path";
import { homedir } from "node:os";
import { Plugin, Modal, App, Setting, Notice, MarkdownView } from "obsidian";
import { readDotFile } from "./fileReader.ts";
import { detectLanguage } from "./languageMap.ts";
import { buildCodeBlock } from "./noteBuilder.ts";
import { InputModal } from "./PathInputModal.ts";

class LanguageModal extends Modal {
    language: string;
    onSubmit: (language: string) => void;
    constructor(app: App, onSubmit: (language: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
        this.language = "";
    }

    onOpen(): void {
        const { contentEl } = this;
        contentEl.createEl("h2", {
            text: "No code language detected: give me one",
        });
        new Setting(contentEl).setName("Language:").addText((text) => {
            text.onChange((value) => {
                this.language = value;
            });

            text.inputEl.addEventListener("keydown", (event: KeyboardEvent) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    this.submitAndClose();
                }
            });

            setTimeout(() => text.inputEl.focus(), 0);
        });

        new Setting(contentEl).addButton((btn) =>
            btn
                .setButtonText("Save")
                .setCta()
                .onClick(() => {
                    this.submitAndClose();
                }),
        );
    }

    private submitAndClose() {
        this.close();
        this.onSubmit(this.language);
    }

    onClose(): void {
        const { contentEl } = this;
        contentEl.empty();
    }
}

export default class MyPlugin extends Plugin {
    async onload(): Promise<void> {
        this.addCommand({
            id: "dotfiles-to-block",
            name: "Dotfiles to code block",
            callback: () => {
                new InputModal(this.app, async (inputPath) => {
                    await this.writeCodeBlock(inputPath);
                }).open();
            },
        });
    }

    expandHomePath(inputPath: string): string {
        if (inputPath === "~" || inputPath.startsWith("~/")) {
            return join(homedir(), inputPath.slice(1));
        }
        return resolve(inputPath);
    }

    insertCodeBlock(codeBlock: string) {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
            const editor = view.editor;
            editor.replaceSelection(codeBlock);
        } else {
            new Notice("No active markdown note found");
        }
    }
    async writeCodeBlock(inputPath: string): Promise<void> {
        const path = this.expandHomePath(inputPath);
        const content = await readDotFile(path);
        const file = basename(path);
        const language = detectLanguage(file);
        if (content.ok) {
            if (language === undefined) {
                new LanguageModal(this.app, (inputLanguage) => {
                    const codeBlock = buildCodeBlock(
                        content.data,
                        inputLanguage,
                    );
                    this.insertCodeBlock(codeBlock);
                }).open();
            } else {
                const codeBlock = buildCodeBlock(content.data, language);
                this.insertCodeBlock(codeBlock);
            }
        } else {
            if (content.error === "TOO_MANY_LINES") {
                new Notice(
                    "The file has too many lines for a simple code block",
                );
            } else if (content.error === "FILE_TOO_LARGE") {
                new Notice(
                    "The file is too large; Are you sure it's a text file?",
                );
            } else if (content.error === "PERMISSION_DENIED") {
                new Notice("You don't have permissions to open this file");
            } else if (content.error === "FILE_NOT_FOUND") {
                new Notice("File not found");
            } else {
                new Notice("Unknown error");
            }
        }
    }
}
