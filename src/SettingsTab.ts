import {
    type SettingDefinition,
    App,
    Notice,
    PluginSettingTab,
    Setting,
    TextComponent,
} from "obsidian";
import { type ValidatorError, validateEntry } from "./entryValidator.ts";
import { isKnownLanguage } from "./languageChecker.ts";
import type FileToCodeBlockPlugin from "./main.ts";

const ENTRY_ERROR_MESSAGES: Record<ValidatorError, string> = {
    EMPTY_FILE_NAME: "Enter a file name or a pattern like *.ext",
    EMPTY_LANGUAGE: "Enter a language, for example bash",
    INVALID_FILE_NAME:
        "Invalid file name. Use an exact name like .bashrc or a pattern like *.ext, without slashes",
    DUPLICATE_ENTRY:
        "This file name or pattern is already in your list. Delete it first to change its language",
};

export class FileToCodeBlockSettingTab extends PluginSettingTab {
    plugin: FileToCodeBlockPlugin;

    constructor(app: App, plugin: FileToCodeBlockPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    getSettingDefinitions(): SettingDefinition[] {
        let textKey = "";
        let textLanguage = "";
        let paintList = (): void => {};
        let keyField: TextComponent | undefined;
        let languageField: TextComponent | undefined;
        return [
            {
                name: "Add entry",
                desc: "Manage your own entries",
                render: (setting: Setting) => {
                    textKey = "";
                    textLanguage = "";
                    const addTextEl = setting.controlEl.createDiv(
                        "file-to-code-block-add-entry",
                    );
                    new Setting(addTextEl)
                        .setName("Key")
                        .setDesc("Filename or pattern")
                        .addText((text) => {
                            keyField = text;
                            text.setPlaceholder("Example: .bashrc").onChange(
                                (value) => {
                                    textKey = value;
                                },
                            );
                        });
                    new Setting(addTextEl)
                        .setName("Language")
                        .setDesc("Code language")
                        .addText((text) => {
                            languageField = text;
                            text.setPlaceholder("Example: bash").onChange(
                                (value) => {
                                    textLanguage = value;
                                },
                            );
                        });
                    new Setting(addTextEl).addButton((button) => {
                        button
                            .setButtonText("Add")
                            .setCta()
                            .onClick(async () => {
                                const result = validateEntry(
                                    textKey,
                                    textLanguage,
                                    this.plugin.settings.customLanguageMap,
                                );
                                if (result.ok) {
                                    this.plugin.settings.customLanguageMap = {
                                        ...this.plugin.settings
                                            .customLanguageMap,
                                        [result.data.key]: result.data.language,
                                    };
                                    await this.plugin.saveData(
                                        this.plugin.settings,
                                    );
                                    textKey = "";
                                    textLanguage = "";
                                    keyField?.setValue("");
                                    languageField?.setValue("");
                                    paintList();
                                    new Notice("Entry added");
                                    if (
                                        !isKnownLanguage(
                                            result.data.language,
                                            this.plugin.knownLanguages,
                                        )
                                    ) {
                                        new Notice(
                                            `Language "${result.data.language}" may not be highlighted in reading view`,
                                        );
                                    }
                                } else {
                                    new Notice(
                                        ENTRY_ERROR_MESSAGES[result.error],
                                    );
                                }
                            });
                    });
                },
            },
            {
                name: "Custom languages",
                desc: "List user dictionary",
                render: (setting: Setting) => {
                    const listEl = setting.controlEl.createDiv(
                        "file-to-code-block-entry-list",
                    );
                    paintList = () => {
                        listEl.empty();
                        const entries = Object.entries(
                            this.plugin.settings.customLanguageMap,
                        );
                        for (const [key, language] of entries) {
                            new Setting(listEl)
                                .setName(key)
                                .setDesc(language)
                                .addButton((button) =>
                                    button
                                        .setButtonText("Delete")
                                        .onClick(async () => {
                                            delete this.plugin.settings
                                                .customLanguageMap[key];
                                            await this.plugin.saveData(
                                                this.plugin.settings,
                                            );
                                            paintList();
                                        }),
                                );
                        }
                    };
                    paintList();
                },
            },
        ];
    }
}
