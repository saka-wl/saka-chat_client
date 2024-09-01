import { createMd5ChunkInfo } from "./file";

onmessage = async (e) => {
    const proms = [];
    const { file, chunkSize, startFileSliceIndex, endFileSliceIndex } = e.data;
    if(startFileSliceIndex >= endFileSliceIndex) {
        postMessage(proms);
        return;
    }
    for (let i = startFileSliceIndex; i < endFileSliceIndex; i++) {
        proms.push(createMd5ChunkInfo(file, i, chunkSize));
    }
    const chunks = await Promise.all(proms);
    postMessage(chunks);
};