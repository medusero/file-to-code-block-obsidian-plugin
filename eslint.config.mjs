import { defineConfig } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";

export default defineConfig([
    ...obsidianmd.configs.recommended,
    {
        ignores: ["main.js"],
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: [
                        "eslint.config.*",
                        "esbuild.config.mjs",
                    ],
                },
            },
        },
    },
    {
        files: ["**/*.ts"],
        rules: {
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/consistent-type-assertions": [
                "error",
                {
                    assertionStyle: "never",
                },
            ],
        },
    },
    {
        files: ["test/**/*.ts"],
        rules: {
            "@typescript-eslint/no-floating-promises": [
                "error",
                {
                    allowForKnownSafeCalls: [
                        {
                            from: "package",
                            name: ["suite", "test"],
                            package: "node:test",
                        },
                    ],
                },
            ],
        },
    },
]);
