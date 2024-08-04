import { IGetAllRequest } from "../../../api/friend";

export interface IFriendRequest {
    requestId: number;
    fromUserId?: string;
    toUserId?: string;
    requestMessage: string;
    isDispose: number;
    createdAt: string;
    toUserAccount: string;
    toUserNickname: string;
    toUserAvatar: string;
}

interface IHandleFriendRequestToPropsReturn {
    pendingRequest: IFriendRequest[];
    completedRequest: IFriendRequest[];
}

export const handleFriendRequestToProps = (data: IGetAllRequest[]): IHandleFriendRequestToPropsReturn => {
    let pendingRequest = []
    let pendingRequestIndex = 0
    let completedRequest = []
    let completedRequestIndex = 0
    for (let i = 0; i < data.length; i++) {
        const tmp = {
            requestId: data[i].requestInfo.id,
            fromUserId: data[i].requestInfo.fromUserId,
            requestMessage: data[i].requestInfo.requestMessage,
            isDispose: data[i].requestInfo.isDispose,
            createdAt: data[i].requestInfo.createdAt,
            toUserAccount: data[i].toUserInfo.account,
            toUserNickname: data[i].toUserInfo.nickname,
            toUserAvatar: data[i].toUserInfo.avatar
        }
        if (tmp.isDispose === 0){
            pendingRequest[pendingRequestIndex++] = tmp;
        }
        else {
            completedRequest[completedRequestIndex++] = tmp;
        }
    }
    return {
        pendingRequest,
        completedRequest
    }
}

interface IFriendRequestWithType {
    requestId: number;
    toUserId?: string;
    fromUserId?: string;
    requestMessage: string;
    isDispose: number;
    createdAt: string;
    toUserAccount: string;
    toUserNickname: string;
    toUserAvatar: string;
    type: 'requestToMe' | 'requestFromMe';
}

export interface IProps {
    props: IFriendRequestWithType;
}