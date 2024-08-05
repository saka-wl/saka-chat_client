
import { IUserEnrollParams } from "../../store/userInfo.pinia.ts";
import { ResponseData } from "../common.ts";
import axios from "../request.ts";

export interface Ilogin {
    id: string;
    account: string;
    nickname: string;
    phone: string;
    email: string;
    avatar: string;
    password?: string;
}

export const loginApi = async (account: string, password: string, code: string): Promise<ResponseData<Ilogin | null>> => {
    return await axios.post("/api/c/user/login", {
        account,
        password,
        code
    })
}

export const enrollApi = async (obj: IUserEnrollParams): Promise<ResponseData<string>> => {
    return await axios.post("/api/c/user/enroll", {
        ...obj
    })
}

export const autoLoginApi = async (): Promise<ResponseData<Ilogin>> => {
    return await axios.get("/api/c/user/super/whoami")
}

export interface ISearchUser extends Ilogin {
    hasAddFriend?: boolean;
}

export const searchUserApi = async (
    { account = "", id = "", nickname = "", userId = "" }: { account: string | null; id: string | null; nickname: string | null; userId: string | null }
): Promise<ResponseData<ISearchUser[]>> => {
    return await axios.post("/api/c/user/super/searchUser", {
        account, id, nickname, userId
    })
}

