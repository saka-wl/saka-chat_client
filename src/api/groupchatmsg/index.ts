
import { ResponseData } from '../common';
import request from '../request';

export interface ICreateGroupChatFormData {
    chatRoomName: string;
    humanIds: (string | number)[];
    humanNumber?: number;
    avatar?: string | null;
    makerUserId: number | string;
}

export const createNewGroupChatApi = async (data: ICreateGroupChatFormData): Promise<ResponseData<any>> => {
    return await request({
        method: 'POST',
        url: 'api/c/chatgroup/super/createNewChatGroup',
        data
    })
}