import { basename } from "node:path";
import {
    App,
    loadPrism,
    MarkdownView,
    Modal,
    Notice,
    Plugin,
    Setting,
} from "obsidian";
import { type FileReadError, readTextFile } from "./fileReader.ts";
import { isKnownLanguage, KNOWN_LANGUAGES } from "./languageChecker.ts";
import { detectLanguage } from "./languageMap.ts";
import { buildCodeBlock } from "./noteBuilder.ts";
import { expandHomePath } from "./pathExpander.ts";
import { InputModal } from "./PathInputModal.ts";
import { extractPrismLanguages } from "./prismLanguages.ts";
import { type PluginSettings, parseSettings } from "./settings.ts";
import { FileToCodeBlockSettingTab } from "./SettingsTab.ts";

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

            window.setTimeout(() => text.inputEl.focus(), 0);
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

export default class FileToCodeBlockPlugin extends Plugin {
    declare settings: PluginSettings;
    knownLanguages: readonly string[] = KNOWN_LANGUAGES;
    async onload(): Promise<void> {
        this.settings = parseSettings(await this.loadData());
        this.addSettingTab(new FileToCodeBlockSettingTab(this.app, this));
        this.addCommand({
            id: "insert-file",
            name: "Insert file as code block",
            callback: () => {
                new InputModal(this.app, (inputPath) => {
                    void this.writeCodeBlock(inputPath);
                }).open();
            },
        });
        void this.loadKnownLanguages();
    }

    async loadKnownLanguages(): Promise<void> {
        try {
            const result = extractPrismLanguages(await loadPrism());
            if (result !== undefined) {
                this.knownLanguages = result;
            }
        } catch {
            console.warn(
                "Could not load Prism; using the built-in language list",
            );
        }
    }
    insertCodeBlock(codeBlock: string): void {
        try {
            const view = this.app.workspace.getActiveViewOfType(MarkdownView);
            if (view) {
                const editor = view.editor;
                editor.replaceSelection(codeBlock);
            } else {
                new Notice("No active markdown note found");
            }
        } catch (error) {
            this.reportUnexpectedError(error);
        }
    }
    private reportUnexpectedError(error: unknown): void {
        console.error("File to Code Block:", error);
        new Notice(
            "Could not insert the file. See the developer console for details.",
        );
    }
    async writeCodeBlock(inputPath: string): Promise<void> {
        try {
            const path = expandHomePath(inputPath);
            const content = await readTextFile(path);
            const file = basename(path);
            const language = detectLanguage(
                file,
                this.settings.customLanguageMap,
            );
            if (content.ok) {
                if (language === undefined) {
                    new LanguageModal(this.app, (inputLanguage) => {
                        const codeBlock = buildCodeBlock(
                            content.data,
                            inputLanguage,
                        );
                        this.insertCodeBlock(codeBlock);
                        if (
                            inputLanguage.trim().length > 0 &&
                            !isKnownLanguage(inputLanguage, this.knownLanguages)
                        ) {
                            new Notice(
                                `Language "${inputLanguage}" may not be highlighted in reading view`,
                            );
                        }
                    }).open();
                } else {
                    const codeBlock = buildCodeBlock(content.data, language);
                    this.insertCodeBlock(codeBlock);
                }
            } else {
                new Notice(CODEBLOCK_ERROR_MESSAGES[content.error]);
            }
        } catch (error) {
            this.reportUnexpectedError(error);
        }
    }
}
