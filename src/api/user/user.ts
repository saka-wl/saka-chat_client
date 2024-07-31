
import { ResponseData } from "../common.ts";
import axios from "../request.ts";

interface IloginApi {
    loginId: string;
    account: string;
    password: string;
    nickname: string;
}

export const loginApi = async (account: string, password: string, code: string): Promise<ResponseData<IloginApi | null>> => {
    return await axios.post("/api/c/user/login", {
        account,
        password,
        code
    })
}