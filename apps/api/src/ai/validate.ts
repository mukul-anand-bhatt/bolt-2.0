import { GeneratedFiles } from "@boltyy/shared";

const REQUIRED_FILES = ["src/app.tsx", "src/main.tsx"];

const FORBIDDEN_PREFIXES = [
    "node_modules",
    "build",
    "config",
    "public",
    "src",
    "tsconfig.json",
    "vite.config.ts",
    ".env"
]


export function validateGeneratedFiles(files: GeneratedFiles) {
    if (!Array.isArray(files)) {
        throw new Error("Invalid File Structure")
    }

    for (const file of files) {
        if (typeof file.path !== "string" || typeof file.content !== "string") {
            throw new Error("Invalid File Structure")
        }

        for (const forbidden of FORBIDDEN_PREFIXES) {
            if (file.path.startsWith(forbidden)) {
                throw new Error("Invalid File Structure")
            }
        }
        for (const required of REQUIRED_FILES) {
            if (!files.some(f => f.path === required)) {
                throw new Error(`Missing required file: ${required}`);
            }
        }
        return true;
    }
}
