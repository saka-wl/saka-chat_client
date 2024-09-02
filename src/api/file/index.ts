
import { ResponseData } from "../common.ts";
import axios from "../request.ts";

export interface IFileInfo {
    fileId: string;
    fileName: string;
    pwd: string;
    ownUserId: string;
    status: number;
    fileType: number;
}
// 1 -> 普通文件；2 -> 大文件；3 -> 视频小文件；4 -> 视频流大文件

// 普通文件 -》
export const handleNormalFileApi = async (file: File, ownUserId: string, hash: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return await axios.post<any, ResponseData<string | undefined>>(
        '/common/uploadNormalFile/single/normalfile?hash=' + hash + '&ownUserId=' + ownUserId,
        formData
    );
}

// 大文件 -》
interface IEditNewFileInfo {
    fileId: string;
    pwd?: string;
    fileName: string;
    ownUserId?: string;
    fileUploadInfo: IFileUploadInfo;
}
export interface IFileUploadInfo {
    fileId: string;
    hasUploadedHash: Array<string>;
    needUploadedHash: Array<string>;
}
export const editNewFileInfoApi = async (param: IEditNewFileInfo): Promise<{ id: string; needUploadedHash: string[] }> => {
    const { code, data, msg } = await axios.post<IEditNewFileInfo, ResponseData<{ id: string; needUploadedHash: string[] }>>('/common/uploadLargeFile/editNewFileInfo', param);
    msg && window.$message.success(msg, { closable: true });
    return data;
}

export const addFileChunkApi = async (file: File, id: string, hash: string, fileId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const { code, data, msg } =  await axios.post<any, ResponseData<string | string[]>>(
        `/common/uploadLargeFile/uploadFileChunk?id=${id}&chunkHash=${hash}&fileId=${fileId}`,
        formData
    );
    msg && window.$message.success(msg, { closable: true });
    return data;
}