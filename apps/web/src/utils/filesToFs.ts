import type { projectFiles } from "@boltyy/shared";
import type { FileSystemTree } from "@webcontainer/api";

export function filesToFs(files: projectFiles): FileSystemTree {
    const root: FileSystemTree = {};

    for (const file of files) {
        const parts = file.path.split('/');
        let current = root;

        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current[part]) {
                current[part] = { directory: {} };
            }
            // @ts-ignore
            current = current[part].directory;
        }

        const fileName = parts[parts.length - 1];
        current[fileName] = {
            file: {
                contents: file.content
            }
        };
    }

    return root;
}