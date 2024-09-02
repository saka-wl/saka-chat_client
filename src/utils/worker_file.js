import { createMd5FileInfo } from "./file";

onmessage = async (e) => {
    postMessage(await createMd5FileInfo(e.data));
};