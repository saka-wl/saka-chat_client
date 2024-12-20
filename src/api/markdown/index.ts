import { ResponseData } from "../common.ts";
import axios from "../request.ts";

export type IMdFileInfo = {
    id: string;
    fileTitle: string;
    fileContent: string;
    collaborateUserIds: string[] | string;
    ownUserId: string;
};

/**
 * 创建新的md文档
 * @param data 
 * @returns 
 */
export const createMdFileApi = async (data: { ownUserId: string; collaborateUserIds: string[]; fileTitle: string; fileContent: string; }): Promise<ResponseData<null>> => {
    return await axios({
        method: 'post',
        url: '/api/c/markdown/createMdFile',
        data
    });
}

/**
 * 修改md文档
 * @param data 
 * @returns 
 */
export const changeMdFileApi = async (data: { id: string; fileContent: string; fileTitle: string }): Promise<ResponseData<null>> => {
    return await axios({
        method: 'post',
        url: '/api/c/markdown/changeMdFile',
        data
    });
}

/**
 * 获取文档内容
 * @param data 
 * @returns 
 */
export const getMdFileContentApi = async (data: { id: string }): Promise<ResponseData<IMdFileInfo>> => {
    return await axios({
        method: 'post',
        url: '/api/c/markdown/getMdFileContent',
        data
    });
}

/**
 * 获取某人的所有文档List (不包含文件内容)
 * @param data 
 * @returns 
 */
export const getMdFilesListApi = async (data: { userId: string }): Promise<ResponseData<IMdFileInfo[]>> => {
    return await axios({
        method: 'post',
        url: '/api/c/markdown/getMdFilesList',
        data
    });
}