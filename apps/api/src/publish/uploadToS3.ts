import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { s3 } from "./aws";
import mime from "mime-types";
import fs from "fs";
import path from "path";

const BUCKET = process.env.S3_BUCKET!;

export async function uploadDirectoryToS3(
    localDir: string,
    projectId: string
) {
    const files = walk(localDir);

    for (const file of files) {
        const fileStream = fs.createReadStream(file.fullPath);
        const contentType = mime.lookup(file.relativePath) || "application/octet-stream";

        const key = `projects/${projectId}/${file.relativePath.replace(/\\/g, "/")}`;
        console.log("key", key);
        // console.log("s3-->", s3)
        const upload = new Upload({
            client: s3,
            params: {
                Bucket: BUCKET,
                Key: key,
                Body: fileStream,
                ContentType: contentType as string,
            },
        });

        await upload.done();
    }
}

function walk(dir: string, base = dir): { fullPath: string; relativePath: string }[] {
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
