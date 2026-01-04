import { Upload } from "@aws-sdk/lib-storage";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";
import fs from "fs";
import path from "path";
import { s3 } from "./s3";

const BUCKET = process.env.S3_BUCKET!;

export async function uploadDirectoryToS3(
    distPath: string,
    projectId: string
) {
    const files = walk(distPath);

    for (const file of files) {
        const key = `projects/${projectId}/${file.relativePath.replace(/\\/g, "/")}`;

        console.log("Uploading:", key);

        const upload = new Upload({
            client: s3,
            params: {
                Bucket: BUCKET,
                Key: key,
                Body: fs.createReadStream(file.fullPath),
                ContentType: mime.lookup(file.relativePath) || "application/octet-stream",
            },
        });

        await upload.done();
    }
}

function walk(dir: string, base = dir): {
    fullPath: string;
    relativePath: string;
}[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files: any[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...walk(fullPath, base));
        } else {
            files.push({
                fullPath,
                relativePath: path.relative(base, fullPath),
            });
        }
    }

    return files;
}
