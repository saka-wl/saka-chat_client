import { ResponseData } from "../common.ts";
import axios from "../request.ts";

interface IGetFriendHistoryMsgApiParams {
    chatRoomId: string;
    status?: number;
}
export interface IFriendHistoryMsg {
    id: number;
    chatRoomId: string;
    createdAt?: string;
    fromUserId: string;
    toUsereId: string;
    messageInfo: string;
    messageType: string;
    status: number;
    avatar?: string;
}
export const getFriendHistoryMsgApi = async (obj: IGetFriendHistoryMsgApiParams): Promise<ResponseData<IFriendHistoryMsg[]>> => {
    return await axios.post("/api/c/friendchat/super/getFriendHistoryMsg", obj);
}

export interface IFriendNewMsg extends IFriendHistoryMsg {
    friendAccount: string;
    friendNickname: string;
    friendAvatar: string;
    newMsgCount: number;
}
export const getFriendNewMsgApi = async (chatRoomId: string): Promise<ResponseData<IFriendNewMsg[]>> => {
    return await axios.get('/api/c/friendchat/super/getUserAllNewMessageList?chatRoomId=' + chatRoomId)
}

export const updateFriendChatMsgStatusApi = async (userId: string, chatRoomId: string) => {
    return await axios.get('/api/c/friendchat/super/changeNewMsgStatus?chatRoomId=' + chatRoomId + '&userId=' + userId);
}