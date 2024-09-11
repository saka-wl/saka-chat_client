
import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';
import { autoLoginApi, enrollApi, Ilogin, loginApi } from '../api/user/user';
import { AUTHORIZATION } from '../constant/request';
import { useMessage } from "naive-ui"
import { getAllMyFriendApi, IUserFriend } from '../api/friend';
import { IFriendHistoryMsg } from '../api/friendchatmsg';
import { socket } from "../utils/socket.ts";
import { $emit, $off } from '../utils/emit.ts';
import { useRouter } from 'vue-router';

const router = useRouter();

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
    userFriendList: Ref<IUserFriend[] | null>;
    isSocketLogin: boolean;
    userLogin: (account: string, password: string, code: string, reFreshCaptcha: Function) => Promise<boolean | undefined>;
    userEnroll: (obj: IUserEnrollParams, reFreshCaptcha: Function) => Promise<boolean | undefined>;
    userLoginOut: (cb: () => void) => void;
    userAutoLogin: () => void;
    getUserFriendList: () => Promise<boolean | undefined>;
    socketLogin: () => Promise<void>;
    changeUserInfo: (data: Ilogin) => void;
}

declare global {
    interface Window {
        $message: ReturnType<typeof useMessage>;
    }
}

export const useUserInfoStore = defineStore('userInfo', (): IUserStore => {
    const userInfo = ref<Ilogin | null>(null);
    let isUserInfoLoading = false;
    const userFriendList = ref<IUserFriend[] | null>(null);
    let isUserFriendListLoading = false;
    let isSocketLogin = false;

    // 获取好友列表
    const getUserFriendList = async () => {
        if(isUserFriendListLoading) {
            window.$message.warning("请勿重复提交", { closable: true });
            return;
        }
        isUserInfoLoading = true;
        let { code, data } = await getAllMyFriendApi(userInfo.value?.id || '')
        isUserInfoLoading = false;
        if(code === 200) {
            data = data.map(it => {
                if(userInfo.value?.id != it.userId) {
                    let t = it.userId
                    it.userId = it.friendId
                    it.friendId = t
                }
                return it
            })
            userFriendList.value = data
            return true;
        }
        window.$message.warning("获取好友列表失败", { closable: true });
        return false;
    }
    // 登录
    const userLogin = async (account: string, password: string, code: string, reFreshCaptcha: Function) => {
        if (isUserInfoLoading) {
            window.$message.warning("请勿重复提交", { closable: true });
            return;
        }
        isUserInfoLoading = true;
        const resp = await loginApi(account, password, code);
        if (resp.code !== 200 || !resp.data) {
            window.$message.warning(resp.msg, { closable: true });
            reFreshCaptcha();
            isUserInfoLoading = false;
            return false;
        }
        userInfo.value = resp.data;
        
        window.$message.success('登录成功，你好' + (resp.data?.nickname || 'saka'), { closable: true });
        isUserInfoLoading = false;
        // 无需等待
        getUserFriendList();
        socketLogin();
        return true;
    }
    // 注册
    const userEnroll = async (obj: IUserEnrollParams, reFreshCaptcha: Function) => {
        if (isUserInfoLoading) {
            window.$message.warning("请勿重复提交", { closable: true });
            return;
        }
        isUserInfoLoading = true;
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
            userFriendList.value = [];
            isUserInfoLoading = false;
            getUserFriendList();
            socketLogin();
            return true;
        }
        else if (resp.code === 410) {
            window.$message.warning(resp.msg, { closable: true });
            reFreshCaptcha();
        }
        else {
            window.$message.warning(resp.msg, { closable: true });
        }
        isUserInfoLoading = false;
        return false;
    }

    // 退出登录
    const userLoginOut = (cb: () => void) => {
        window.$message.success('再见啦，' + (userInfo.value?.nickname || 'saka') + '同学～', { closable: true });
        socket.emit('userLogout', userInfo.value?.id);
        userInfo.value = null;
        userFriendList.value = null;
        isSocketLogin = false;
        localStorage.removeItem(AUTHORIZATION);
        $off('notifyNewMsg');
        cb();
        router.push('/');
    }

    // 自动登录 聊天断开
    const userAutoLogin = async () => {
        const resp = await autoLoginApi();
        if (resp.code === 200 && resp.data) {
            userInfo.value = resp.data;
            window.$message.success('自动登录成功，你好' + (resp.data?.nickname || 'saka'), { closable: true });
            await socketLogin();
            await getUserFriendList();
        } else {
            window.$message.warning(resp.msg, { closable: true });
        }
    }

    // 登录信息修改
    const changeUserInfo = (data: Ilogin) => {
        console.log(userInfo.value, data);
        if(userInfo.value) {
            userInfo.value.avatar = data.avatar;
            userInfo.value.email = data.email;
            userInfo.value.nickname = data.nickname;
            userInfo.value.phone = data.phone;
        }
    }

    // 实时聊天 + 用户上线
    const socketLogin = async () => {
        if (isSocketLogin) {
            window.$message.success("您的聊天已经处于链接状态", { closable: true });
            return;
        }
        if (!userInfo.value) {
            window.$message.warning("您还未登录，请先登录吧～", { closable: true });
            return;
        }
        /**
         * 实时聊天 + 用户上线
         */
        let token = localStorage.getItem(AUTHORIZATION);
        if(!token || !userInfo.value?.id) {
            window.$message.warning("您还未登录，或者好友信息错误", { closable: true })
            return
        }

        isSocketLogin = true;
        socket.emit('userLogin', {
            token,
            userId: userInfo.value?.id,
            socketId: socket.id
        })

        socket.on('getMsgFromFriend', (data: IFriendHistoryMsg) => {
            $emit('notifyNewMsg', { ...data, mySocketId: socket.id });
        })

        socket.on('getMsgFromMine', (data: IFriendHistoryMsg) => {
            $emit('updateMineMsg', {
                ... data,
                userId: userInfo.value?.id
            })
        })

        /**
         * 接收消息方监听消息撤回
         */
        socket.on('friendWithDrawMsg', (id: string) => {
            $emit('friendWithDrawMsg', id);
        })

        socket.on('userForceLogout', () => {
            userLoginOut(() => window.$message.warning('您在别处登录啦~', { closable: true }));
        })

        socket.on('friendOnlineChange', (friendId: string, isOnline: boolean) => {
            userFriendList.value?.forEach((it, index) => {
                if(it.friendId == friendId || it.userId == friendId) {
                    it.isOnline = isOnline;
                }
            })
            $emit('updateFiendOnlineStatus', friendId, isOnline);
        })

        socket.on("connect_error", () => {
            // userLoginOut(() => { window.$message.warning('服务器错误', { closable: true }); });
        });

        socket.on("disconnect", (reason) => {
            // userLoginOut(() => { window.$message.warning('服务器错误', { closable: true }); });
        });

    }

    return {
        userInfo,
        userFriendList,
        isSocketLogin,
        userLogin,
        userEnroll,
        userLoginOut,
        userAutoLogin,
        getUserFriendList,
        socketLogin,
        changeUserInfo
    }
})