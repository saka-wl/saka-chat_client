
import { ResponseData } from '../common';
import request from '../request';

export interface IGroupChatRoom {
    id: number | string;
    chatRoomName: string;
    makerUserId: number | string;
    avatar: string | null;
    humanNumber: number;
    humanIds: string;
}

export interface ICreateGroupChatFormData {
    id?: string;
    chatRoomName: string;
    humanIds: (string | number)[];
    humanNumber?: number;
    avatar?: string | null;
    makerUserId: number | string;
}

/**
 * 创建新的群聊
 * @param data 
 * @returns 
 */
export const createNewGroupChatApi = async (data: ICreateGroupChatFormData): Promise<ResponseData<IGroupChatRoom>> => {
    return await request({
        method: 'POST',
        url: 'api/c/chatgroup/super/createNewChatGroup',
        data
    })
}

export interface IGroupChatRoomCondition {
    chatRoomName?: string;
    id?: number | string;
    fromUserId?: number | string;
    toUserId?: number | string;
}

/**
 * 根据条件获取群聊列表
 * 用于用户查询聊天列表
 * @param data 
 * @returns 
 */
export const getAllFriendChatGroupByConditionApi = async (data: IGroupChatRoomCondition): Promise<ResponseData<IGroupChatRoom[]>> => {
    return await request({
        method: 'POST',
        url: 'api/c/chatgroup/super/getAllFriendChatGroupByCondition',
        data
    })
}

/**
 * 根据userId查询当前用户所有的群聊
 * @param userId 
 */
export const getAllChatRoomGroupByUserId = async (userId: string | number): Promise<ResponseData<IGroupChatRoom[]>> => {
    return await request({
        method: 'get',
        url: 'api/c/chatgroup/super/getAllChatRoomGroupByUserId',
        params: {
            userId
        }
    })
}


// -------- 下面是关于群聊请求的


/**
 * 群聊邀请用户加入: type = 0
 * fromUserId -> makerUserId
 * toUserId -> 被邀请用户的id
 * 用户主动申请加入群聊: type = 1
 * fromUserId -> 发出申请的用户id
 * toUserId -> makerUserId
 */
export interface IChatGroupRequest {
    id?: number | string;
    chatRoomId: number | string;
    chatRoomName: string;
    fromUserId: number | string;
    toUserId?: number | string;
    toUserIds?: (number | string)[];
    requestDesc: string;
    type?: 0 | 1;
    status?: 0 | 1 | 2;
    chatRoomAvatar?: string;
}

/**
 * 群聊邀请用户加入
 * @param data 
 */
export const sendGroupChatRequestFromGroupApi = async (data: IChatGroupRequest): Promise<ResponseData<string>> => {
    data.type = 0;
    data.status = 0;
    return await request({
        method: 'POST',
        url: 'api/c/chatgroup/super/sendGroupChatRequest',
        data
    });
}

/**
 * 用户主动申请加入群聊: type = 1
 * fromUserId -> 发出申请的用户id
 * toUserId -> makerUserId
 * @param data 
 */
export const sendGroupChatRequestFromUserApi = async (data: IChatGroupRequest): Promise<ResponseData<number | null>> => {
    data.type = 1;
    data.status = 0;
    return await request({
        method: 'POST',
        url: 'api/c/chatgroup/super/sendGroupChatRequest',
        data
    });
}

export interface IChatGroupRequestCondition {
    fromUserId?: number | string;
    toUserId?: number | string;
    userId?: number | string;
}

/**
 * 查询群聊请求
 * @param data 
 * @returns 
 */
export const getAllChatGroupRequestByConditionApi = async (data: IChatGroupRequestCondition): Promise<ResponseData<IChatGroupRequest[]>> => {
    return await request({
        method: 'POST',
        url: 'api/c/chatgroup/super/getAllChatGroupRequestByCondition',
        data
    })
}

interface IAddChatGroupRoom {
    status: number;
    userId: number | string;
    requestId: number | string;
    chatRoomId: number | string;
}

/**
 * 允许/拒绝群聊请求
 * @param data 
 * @returns 
 */
export const addChatGroupRoomApi = async (data: IAddChatGroupRoom): Promise<ResponseData<boolean | null>> => {
    return await request({
        method: 'post',
        url: 'api/c/chatgroup/super/addChatGroupRoom',
        data
    })
}