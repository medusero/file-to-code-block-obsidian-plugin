import { basename } from "node:path";
import { Plugin, Modal, App, Setting, Notice, MarkdownView } from "obsidian";
import { type FileReadError, readDotFile } from "./fileReader.ts";
import { detectLanguage } from "./languageMap.ts";
import { buildCodeBlock } from "./noteBuilder.ts";
import { InputModal } from "./PathInputModal.ts";
import { expandHomePath } from "./pathExpander.ts";
import { type PluginSettings, parseSettings } from "./settings.ts";
import { MyPluginSettingTab } from "./SettingsTab.ts";

const CODEBLOCK_ERROR_MESSAGES: Record<FileReadError, string> = {
    FILE_NOT_FOUND: "File not found",
    FILE_TOO_LARGE: "The file is too large; Are you sure it's a text file?",
    TOO_MANY_LINES: "The file has too many lines for a simple code block",
    PERMISSION_DENIED: "You don't have permissions to open this file",
    UNKNOWN_ERROR: "Unknown error",
};

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
    declare settings: PluginSettings;
    async onload(): Promise<void> {
        this.settings = parseSettings(await this.loadData());
        this.addSettingTab(new MyPluginSettingTab(this.app, this));
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
        const path = expandHomePath(inputPath);
        const content = await readDotFile(path);
        const file = basename(path);
        const language = detectLanguage(file, this.settings.customLanguageMap);
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
            new Notice(CODEBLOCK_ERROR_MESSAGES[content.error]);
        }
    }
}
