
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { loginApi } from '../api/user/user';

export const useUserInfoStore = defineStore('userInfo', () => {
    const userInfo = ref({
        loginId: "",
        account: "",
        nickname: ""
    })
    let isLoading = false;
    const userLogin = async (account: string, password: string, code: string) => {
        if(isLoading) return;
        isLoading = true;
        const resp = await loginApi(account, password, code);
        if(resp.code === 200 && resp.data) {
            userInfo.value.loginId = resp.data.loginId;
            userInfo.value.nickname = resp.data.nickname;
            userInfo.value.account = resp.data.account;
        }
        isLoading = false;
    }

    return {
        userInfo,
        userLogin
    }
})