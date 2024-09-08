
import { largeFileChunkUrl } from "../../constant/request.ts";
import { ResponseData } from "../common.ts";
import axios from "../request.ts";

// 1 -> 普通文件；2 -> 大文件；3 -> 视频小文件；4 -> 视频流大文件

// 普通文件上传 -》
export const handleNormalFileApi = async (file: File, ownUserId: string, hash: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return await axios.post<any, ResponseData<string | undefined>>(
        '/common/uploadNormalFile/single/normalfile?hash=' + hash + '&ownUserId=' + ownUserId,
        formData
    );
}

// 大文件上传 -》
interface IEditNewFileInfo {
    fileId: string;
    pwd?: string;
    fileName: string;
    ownUserId?: string;
    fileUploadInfo: IFileUploadInfo;
    videoPreview: string;
}
export interface IFileUploadInfo {
    fileId: string;
    hasUploadedHash: Array<string>;
    needUploadedHash: Array<string>;
}
export const editNewFileInfoApi = async (param: IEditNewFileInfo): Promise<{ id: string; needUploadedHash: string[]; }> => {
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

// 文件信息获取 -》
export interface IFileInfoApi {
    id: number;
    fileId: string;
    fileName: string;
    pwd: string;
    ownUserId: string;
    status: number;
    fileType: number;
    videoPreview: string;
    fileUploadInfo: {
        fileId: string;
        hasUploadedHash: string[];
        needUploadedHash: string[];
    };
}
/**
 * 获取文件信息
 * @param param 
 * @returns 
 */
export const getFileInfoApi = async (param: Partial<IFileInfoApi>): Promise<IFileInfoApi[] | null> => {
    let { code, data, msg } =  await axios.post<Partial<IFileInfoApi>, ResponseData<IFileInfoApi[]>>(
        `/common/uploadLargeFile/getfileinfo`,
        param
    );
    if(code !== 200) return null;
    if(data && data.length > 0) {
        data = data.map(it => {
            it.videoPreview = JSON.parse(it.videoPreview);
            it.fileUploadInfo = JSON.parse(it.fileUploadInfo as unknown as string);
            return it;
        })
    }
    return data;
}

export const getFileChunkApi = async (chunkHash: string): Promise<Blob> => {
    return await axios.get('/common/uploadLargeFile/getfilechunk?chunkHash=' + chunkHash, {
        responseType: 'blob'
    });
}

/**
 * 流式获取视频（预览）
 * @param filename 
 * @param start 
 * @param end 
 * @returns 
 */
export const videoPreviewApi = async (filename: string, start: number, end: number) => {
    return await axios.get<null, BufferSource>('/common/download/video/' + filename, {
        headers: {
            Range: `bytes=${start}-${end}`,
        },
        responseType: 'arraybuffer'
    })
}

/**
 * 
 * @param filename 获取文件的大小
 * @returns 
 */
export const getFileSizeApi = async (filename: string) => {
    return await axios.post<string, ResponseData<number | null>>('/common/download/getfilesize', {
        filename
    });
}

export interface IVideoPreviewPic {
    blob: Blob;
    hash: string;
    url?: string;
}

/**
 * 上传视频帧
 * @param imgsBlobArr 
 * @returns 
 */
export async function videoPreviewPicApi(imgsBlobArr: IVideoPreviewPic[]) {
    const form = new FormData()
    for (let i = 0; i < imgsBlobArr.length; i++) {
        form.append('files', new File([imgsBlobArr[i].blob], imgsBlobArr[i].hash + '.png', { type: 'image/png' }))
    }
    return await axios({
        url: '/common/uploadNormalFile/many/images',
        method: 'POST',
        data: form,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}