
import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';
import { autoLoginApi, enrollApi, Ilogin, loginApi } from '../api/user/user';
import { AUTHORIZATION } from '../constant/request';
import { useMessage } from "naive-ui"

export interface IUserEnrollParams {
    account: string;
    password: string;
    code: string;
    nickname: string;
    phone: string;
    email: string;
    avatar: string;
}

interface IUserStore {
    userInfo: Ref<Ilogin | null>;
    userLogin: (account: string, password: string, code: string, reFreshCaptcha: Function) => Promise<boolean | undefined>;
    userEnroll: (obj: IUserEnrollParams, reFreshCaptcha: Function) => Promise<boolean | undefined>;
    userLoginOut: () => void;
    userAutoLogin: () => void;
}

declare global {
    interface Window {
        $message: ReturnType<typeof useMessage>;
    }
}

export const useUserInfoStore = defineStore('userInfo', (): IUserStore => {
    const userInfo = ref<Ilogin | null>(null)
    let isLoading = false;
    // 登录
    const userLogin = async (account: string, password: string, code: string, reFreshCaptcha: Function) => {
        if (isLoading) {
            window.$message.warning("请勿重复提交", { closable: true });
            return;
        }
        isLoading = true;
        const resp = await loginApi(account, password, code);
        if (resp.code === 200 && resp.data) {
            userInfo.value = resp.data;
            window.$message.success('登录成功，你好' + (resp.data?.nickname || 'saka'), { closable: true });
            isLoading = false;
            return true;
        }
        else if (resp.code === 410) {
            window.$message.warning(resp.msg, { closable: true });
            reFreshCaptcha();
        }
        else {
            window.$message.warning(resp.msg, { closable: true });
        }
        isLoading = false;
        return false;
    }
    // 注册
    const userEnroll = async (obj: IUserEnrollParams, reFreshCaptcha: Function) => {
        if (isLoading) {
            window.$message.warning("请勿重复提交", { closable: true });
            return;
        }
        isLoading = true;
        const resp = await enrollApi(obj);
        if (resp.code === 200 && resp.data) {
            userInfo.value = {
                account: obj.account,
                nickname: obj.nickname,
                phone: obj.phone,
                email: obj.email,
                avatar: obj.avatar,
                id: resp.data
            };
            window.$message.success('注册成功，你好' + (obj.nickname || 'saka'), { closable: true });
            isLoading = false;
            return true;
        }
        else if (resp.code === 410) {
            window.$message.warning(resp.msg, { closable: true });
            reFreshCaptcha();
        }
        else {
            window.$message.warning(resp.msg, { closable: true });
        }
        isLoading = false;
        return false;
    }
    // 退出登录
    const userLoginOut = () => {
        window.$message.success('再见啦，' + (userInfo.value?.nickname || 'saka') + '同学～', { closable: true });
        userInfo.value = null;
        localStorage.removeItem(AUTHORIZATION);
    }

    // 自动登录
    const userAutoLogin = async () => {
        const resp = await autoLoginApi();
        if (resp.code === 200 && resp.data) {
            userInfo.value = resp.data;
            window.$message.success('自动登录成功，你好' + (resp.data?.nickname || 'saka'), { closable: true });
        } else {
            window.$message.warning(resp.msg, { closable: true });
        }
    }

    return {
        userInfo,
        userLogin,
        userEnroll,
        userLoginOut,
        userAutoLogin
    }
})