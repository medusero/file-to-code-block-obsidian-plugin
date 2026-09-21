import { App, Modal, Setting } from "obsidian";
import { sanitizePath } from "./pathSanitizer.ts";

export class InputModal extends Modal {
    path: string;
    onSubmit: (path: string) => void;
    constructor(app: App, onSubmit: (path: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
        this.path = "";
    }

    onOpen(): void {
        const { contentEl } = this;
        contentEl.createEl("h2", { text: "Give me a path" });
        new Setting(contentEl).setName("Path:").addText((text) => {
            text.onChange((value) => {
                this.path = value;
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
        const cleanPath = sanitizePath(this.path);
        this.close();
        this.onSubmit(cleanPath);
    }

    onClose(): void {
        const { contentEl } = this;
        contentEl.empty();
    }
}
