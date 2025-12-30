import { WebContainer } from "@webcontainer/api";


let webcontainerPromise: Promise<WebContainer> | null = null;

export async function getWebContainer() {
    if (!webcontainerPromise) {
        webcontainerPromise = WebContainer.boot();
    }
    return webcontainerPromise;
}