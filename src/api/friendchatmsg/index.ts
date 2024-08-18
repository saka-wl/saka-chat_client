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