
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

interface IGetAllRequestFromMe {
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

export const getAllRequestFromMe = async ({ fromUserId } : { fromUserId: string }): Promise<ResponseData<IGetAllRequestFromMe[]>> => {
    return await axios.get('/api/c/friend/super/getAllRequestFromMe?' + 'fromUserId=' + fromUserId)
}