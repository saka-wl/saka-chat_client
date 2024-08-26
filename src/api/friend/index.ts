
import { ResponseData } from "../common.ts";
import axios from "../request.ts";

export const sendFriendRequst = async ({
    fromUserId,
    toUserId,
    requestMessage = ''
}: {
    fromUserId: string;
    toUserId: string;
    requestMessage: string;
}): Promise<ResponseData<boolean> | boolean> => {
    return await axios.post("/api/c/friend/super/sendFriendRequst", {
        fromUserId,
        toUserId,
        requestMessage
    })
}

export interface IGetAllRequest {
    requestInfo: {
        id: number;
        fromUserId: string;
        toUserId: string;
        requestMessage: string;
        isDispose: number;
        createdAt: string;
    };
    toUserInfo: {
        id: number;
        account: string;
        nickname: string;
        avatar: string;
    };
}

export const getAllRequestFromMe = async ({ fromUserId } : { fromUserId: string }): Promise<ResponseData<IGetAllRequest[]>> => {
    return await axios.get('/api/c/friend/super/getAllRequestFromMe?' + 'fromUserId=' + fromUserId)
}

export const getAllRequestToMe = async ({ toUserId } : { toUserId: string }): Promise<ResponseData<IGetAllRequest[]>> => {
    return await axios.get('/api/c/friend/super/getAllRequestToMe?' + 'toUserId=' + toUserId)
}

export const handleFriendRequestApi = async ({ requestId, isDispose, userId, friendId }: { requestId: number, isDispose: number, userId: string, friendId: string }) => {
    return await axios.post("/api/c/friend/super/handleFriendRequest", {
        requestId,
        isDispose,
        userId,
        friendId
    })
}

export interface IUserFriend {
    id: string;
    userId: string;
    friendId: string;
    chatRoomId: string;
    friendAccount: string;
    friendNickname: string;
    friendAvatar: string;
    friendEmail: string;
    isOnline: boolean;
}

export const getAllMyFriendApi = async (userId: string): Promise<ResponseData<IUserFriend[]>> => {
    return await axios.post('/api/c/friend/super/getAllMyFriend', { userId })
}