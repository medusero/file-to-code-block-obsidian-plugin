import {
    type SettingDefinition,
    App,
    PluginSettingTab,
    Setting,
} from "obsidian";
import type MyPlugin from "./main.ts";

export class MyPluginSettingTab extends PluginSettingTab {
    plugin: MyPlugin;

    constructor(app: App, plugin: MyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    getSettingDefinitions(): SettingDefinition[] {
        return [
            {
                name: "List",
                desc: "List user dictionary",
                render: (setting: Setting) => {
                    const listEl = setting.controlEl.createDiv(
                        "dotfiles-language-list",
                    );
                    const paintList = () => {
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
