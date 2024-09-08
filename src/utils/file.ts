
import { FILE_SLICE_SINGLE_SIZE, FILE_TOTAL_SLICE, WEB_WORKER_NUMBER } from "../constant/file";
import { addFileChunkApi, handleNormalFileApi, IFileUploadInfo } from "../api/file";
// @ts-ignore
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
            // 速度加快一倍
            spark.append(e.target.result.slice(0, Math.ceil(FILE_SLICE_SINGLE_SIZE / 5) + index));
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
        const fileEndIndex = Math.min(FILE_TOTAL_SLICE, file.size - 1);
        fileReader.readAsArrayBuffer(file.slice(0, fileEndIndex));
    })
}

export function getArrMd5Info(imgsBlobArr: Array<Blob>) {
    return new Promise((resolve) => {
        let finishedIndex = 0
        let res = []
        const spark = new sparkmd5.ArrayBuffer();
        for (let i = 0; i < imgsBlobArr.length; i++) {
            const fileReader = new FileReader();
            fileReader.onload = (e: any) => {
                spark.append(e.target.result);
                res[i] = spark.end()
                finishedIndex++
                if (finishedIndex === imgsBlobArr.length) {
                    resolve(res)
                }
            };
            fileReader.readAsArrayBuffer(imgsBlobArr[i]);
        }
    })
}


export const getLargeFileSliceInfo = async (file: File): Promise<IFileSlice[]> => {
    const fileToalSize = file.size;
    const result: Array<IFileSlice> = [];
    // 需要处理的文件切片总个数
    const fileHandleLength = Math.ceil(fileToalSize / FILE_SLICE_SINGLE_SIZE);
    // 可以处理文件的线程数
    let handleWebWorkerNumber = Math.min(fileHandleLength, WEB_WORKER_NUMBER);
    if (fileHandleLength > 25) handleWebWorkerNumber += 2;
    // 每个线程需要处理多少文件
    const singleWebWorkerHandleFileSliceNum = Math.ceil(fileHandleLength / handleWebWorkerNumber);
    let finishedNumber = 0;
    return new Promise((resolve, _) => {
        for (let i = 0; i < handleWebWorkerNumber; i++) {
            // 创建一个新的 Worker 线程
            const worker = new Worker(
                new URL(
                    './worker_chunk.js',
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

export const getLargeFileInfo = async (file: File): Promise<string> => {
    return new Promise((res, rej) => {
        // 整体文件的hash
        const workerFile = new Worker(
            new URL(
                './worker_file.js',
                import.meta.url
            ),
            {
                type: 'module'
            }
        );
        workerFile.postMessage(file);
        workerFile.onmessage = (e) => {
            res(e.data.hash)
        }
    })
}

const getLargeFileHash = (fileChunks: string[]): string => {
    const fileHash = sparkmd5.hash(JSON.stringify(fileChunks));
    return fileHash;
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

interface IUseLargeUploadFile {
    fileName: string;
    fileId: string;
    fileSliceInfo: IFileSlice[];
    fileUploadInfo: IFileUploadInfo;
}
/**
 * 大文件分片处理hook
 * @param file 
 * @returns 
 */
export const useLargeUploadFile = async (file: File): Promise<IUseLargeUploadFile> => {
    const fileSliceInfo = await getLargeFileSliceInfo(file);
    const fileHash = getLargeFileHash(fileSliceInfo.map(it => it.hash));
    const fileUploadInfo = { fileId: fileHash, hasUploadedHash: [], needUploadedHash: fileSliceInfo.map(it => it.hash) };
    const fileName = file.name;
    return {
        fileName: fileName,
        fileSliceInfo,
        fileUploadInfo,
        fileId: fileHash,
    };
}

export interface IFileInfo {
    id: string;
    fileId: string;
    fileName: string;
    fileSliceInfo: IFileSlice[];  // 文件分片信息
    hasUploadedHash: string[];
    needUploadedHash: string[];
    videoPreview: string[];
}
export const handleFileChunkUpload = async (fileInfo: IFileInfo, chunkHash: string, updateFileUploadProcess: Function, fileInit: Function): Promise<IFileInfo | string> => {
    let item = fileInfo.fileSliceInfo.find(it => it.hash === chunkHash);
    const resp = await addFileChunkApi(item?.content as File, fileInfo.id, chunkHash, fileInfo.fileId);
    if (resp && typeof resp === 'string') {
        updateFileUploadProcess(100);
        window.$message.success("文件上传完成！", { closable: true });
        const timer = setTimeout(() => {
            // fileInit();
            clearTimeout(timer);
        }, 1000)
        return resp;
    } else if (resp && resp.length > 0) {
        fileInfo.needUploadedHash = fileInfo.needUploadedHash.filter(it => it !== chunkHash);
        fileInfo.hasUploadedHash.push(chunkHash);
        updateFileUploadProcess(Math.floor(100 / (fileInfo.needUploadedHash.length + fileInfo.hasUploadedHash.length)));
    }
    return fileInfo;
}