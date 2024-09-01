
import { FILE_SLICE_SINGLE_SIZE, WEB_WORKER_NUMBER } from "../constant/file";
import { handleNormalFileApi } from "../api/file";
import sparkmd5 from "../utils/sparkMd5";

export interface IFileSlice {
    start: number;
    end: number;
    index: number;
    hash: string;
    content: Blob;
}

export function createMd5ChunkInfo(file: File, index: number, chunkSize: number) {
    return new Promise((resolve) => {
        const start = index * chunkSize;
        const end = start + chunkSize;
        const fileReader = new FileReader();
        const spark = new sparkmd5.ArrayBuffer();
        /**
         * onload 该事件在读取操作完成时触发
         * @param {*} e 就是 -> file.slice(start, end)
         */
        fileReader.onload = (e: any) => {
            spark.append(e.target.result);
            resolve({
                start,
                end,
                index,
                hash: spark.end(),
                // 文件分片的内容
                content: new Blob([e.target.result])
            });
        };
        fileReader.readAsArrayBuffer(file.slice(start, end));
    });
}

export function createMd5FileInfo(file: File): Promise<{ hash: string }> {
    const spark = new sparkmd5.ArrayBuffer();
    return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            spark.append(e.target?.result);
            resolve({
                hash: spark.end(),
            });
        };
        fileReader.readAsArrayBuffer(file);
    })
}

export const getLargeFileSliceInfo = async (file: File): Promise<IFileSlice[]> => {
    const fileToalSize = file.size;
    const result: Array<IFileSlice> = [];
    // 需要处理的文件切片总个数
    const fileHandleLength = Math.ceil(fileToalSize / FILE_SLICE_SINGLE_SIZE);
    // 可以处理文件的线程数
    const handleWebWorkerNumber = Math.min(fileHandleLength, WEB_WORKER_NUMBER);
    // 每个线程需要处理多少文件
    const singleWebWorkerHandleFileSliceNum = Math.ceil(fileHandleLength / handleWebWorkerNumber);
    let finishedNumber = 0;
    return new Promise((resolve, reject) => {
        for (let i = 0; i < handleWebWorkerNumber; i++) {
            // 创建一个新的 Worker 线程
            const worker = new Worker(
                new URL(
                    './worker.js',
                    import.meta.url
                ),
                {
                    type: 'module'
                }
            );
            const startFileSliceIndex = i * singleWebWorkerHandleFileSliceNum;
            let endFileSliceIndex = startFileSliceIndex + singleWebWorkerHandleFileSliceNum;
            if(endFileSliceIndex > fileHandleLength) endFileSliceIndex = fileHandleLength;
            worker.postMessage({
                file, 
                chunkSize: FILE_SLICE_SINGLE_SIZE, 
                startFileSliceIndex, 
                endFileSliceIndex
            })
            worker.onmessage = (e) => {
                for (let j = startFileSliceIndex; j < endFileSliceIndex; j++) {
                    result[j] = e.data[j - startFileSliceIndex];
                }
                // 关闭线程
                worker.terminate();
                finishedNumber++;
                if (finishedNumber === handleWebWorkerNumber) {
                    resolve(result);
                }
            }
        }
    })
}

/**
 * 普通文件处理hook
 * @param file 
 * @param type 
 */
export const useUploadFile = async (file: File, ownUserId: string) => {
    const { hash } = await createMd5FileInfo(file);
    const { code, data, msg } = await handleNormalFileApi(file, ownUserId, hash);
    if (code !== 200 || !data) {
        window.$message.warning(msg, { closable: true });
        return;
    }
    return data;
}

/**
 * 大文件分片处理hook
 * @param file 
 * @returns 
 */
export const useLargeUploadFile = async (file: File) => {
    // 整体文件的hash
    const { hash } = await createMd5FileInfo(file);
    const fileSliceInfo = await getLargeFileSliceInfo(file);
    const fileUploadInfo = { fileId: hash, hasUploadedHash: [], needUploadedHash: fileSliceInfo.map(it => it.hash) };
    return {
        fileName: file.name,
        fileSliceInfo,
        fileUploadInfo,
        fileId: hash,
    }
}