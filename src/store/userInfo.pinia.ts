
import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';
import { autoLoginApi, enrollApi, Ilogin, loginApi } from '../api/user/user';
import { AUTHORIZATION } from '../constant/request';

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
    userLogin: (account: string, password: string, code: string, reFreshCaptcha: Function) => void;
    userEnroll: (obj: IUserEnrollParams, reFreshCaptcha: Function) => void;
    userLoginOut: () => void;
    userAutoLogin: () => void;
}

export const useUserInfoStore = defineStore('userInfo', (): IUserStore => {
    const userInfo = ref<Ilogin | null>(null)
    let isLoading = false;
    // 登录
    const userLogin = async (account: string, password: string, code: string, reFreshCaptcha: Function) => {
        if (isLoading) {
            window.$message.warning("请勿重复提交");
            return;
        }
        isLoading = true;
        const resp = await loginApi(account, password, code);
        if (resp.code === 200 && resp.data) {
            userInfo.value = resp.data;
            window.$message.success('登录成功，你好' + (resp.data?.nickname || 'saka'));
        }
        else if(resp.code === 410) {
            window.$message.warning(resp.msg);
            reFreshCaptcha();
        }
        else{
            window.$message.warning(resp.msg);
        }
        isLoading = false;
    }
    // 注册
    const userEnroll = async (obj: IUserEnrollParams, reFreshCaptcha: Function) => {
        if (isLoading) {
            window.$message.warning("请勿重复提交");
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
            window.$message.success('注册成功，你好' + (obj.nickname || 'saka'));
        }
        else if(resp.code === 410) {
            window.$message.warning(resp.msg);
            reFreshCaptcha();
        }
        else{
            window.$message.warning(resp.msg);
        }
        isLoading = false;
    }
    // 退出登录
    const userLoginOut = () => {
        window.$message.success('再见啦，' + (userInfo.value?.nickname || 'saka') + '同学～');
        userInfo.value = null;
        localStorage.removeItem(AUTHORIZATION);
    }

    // 自动登录
    const userAutoLogin = async () => {
        const resp = await autoLoginApi();
        if(resp.code === 200 && resp.data) {
            userInfo.value = resp.data;
            window.$message.success('自动登录成功，你好' + (resp.data?.nickname || 'saka'));
        }else{
            window.$message.warning(resp.msg);
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