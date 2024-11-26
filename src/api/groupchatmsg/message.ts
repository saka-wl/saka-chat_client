
import { ResponseData } from '../common';
import request from '../request';

export interface IGroupHistoryMsg {
    id: string;
    fromUserId: string;
    chatRoomId: string;
    messageInfo: string;
    messageType: string;
    status: number;
    toUserIds: string | (string | number)[];
}

export type IUsersInfo = Record<string, {
    id: number;
    nickname: string;
    isOnline: number;
    avatar: string;
}>

export const getChatGroupMessageApi = async (chatRoomId: string): Promise<ResponseData<{ chatMsg: IGroupHistoryMsg[]; usersInfo: IUsersInfo }>> => {
    return await request({
        method: 'post',
        url: '/api/c/chatgroupmessage/super/getGroupChatMessage',
        data: {
            chatRoomId
        }
    })
}

export type INewMessageInfo = {
    newMsgRes: Record<number, number>;
    oldMsgRes: Record<number, number>;
};

export const getChatGroupAllNewMessageApi = async (userId: number | string): Promise<ResponseData<INewMessageInfo>> => {
    return await request({
        method: 'get',
        url: '/api/c/chatgroupmessage/super/getChatGroupNewMessage',
        params: { userId }
    })
}