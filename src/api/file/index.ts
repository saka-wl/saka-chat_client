
import axios from "../request.ts";
import { Md5 } from 'ts-md5';

export interface IFileInfo {
    fileId: string;
    fileName: string;
    pwd: string;
    ownUserId: string;
    status: number;
    fileType: number;
}

export function createMd5ChunkInfo(file: File, index: number, chunkSize: number) {
    return new Promise((resolve) => {
        const start = index * chunkSize;
        const end = start + chunkSize;
        const fileReader = new FileReader();
        const md5 = new Md5();
        /**
         * onload 该事件在读取操作完成时触发
         * @param {*} e 就是 -> file.slice(start, end)
         */
        fileReader.onload = (e: any) => {
            md5.appendByteArray(e.target.result);
            resolve({
                start,
                end,
                index,
                hash: md5.end(),
                // 文件分片的内容
                content: new Blob([e.target.result])
            });
        };
        fileReader.readAsArrayBuffer(file.slice(start, end));
    });
}

export function createMd5FileInfo(file: File) {
    const md5 = new Md5();
    return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            md5.appendByteArray(e.target.result);
            resolve({
                hash: md5.end()
            });
        };
        fileReader.readAsArrayBuffer(file);
    })
}

/**
 * 1 -> 普通文件；2 -> 大文件；3 -> 视频流小文件；4 -> 视频流大文件
 * @param file 
 * @param type 
 */
export const uploadFile = (file: File, type = 1) => {
    if(type === 1 || type === 3) {
        handleNormalFile(file);
    }else if(type === 2 || type === 4) {
        handleLargeFile(file);
    }
}

const handleNormalFile = async (file: File) => {
    console.log(await createMd5FileInfo(file));
    // const formData = new FormData();
    // formData.append('file', file);
    // return await axios.post('/common/uploadNormalFile/single/normalfile');
}

const handleLargeFile = async (file: File) => {

}