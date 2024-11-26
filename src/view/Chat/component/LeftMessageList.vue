<script lang="ts" setup>
import { ref } from 'vue';
import { getFriendNewMsgApi, IFriendHistoryMsg } from '../../../api/friendchatmsg';
import LeftMessageItem from './LeftMessageItem.vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import { $on } from '../../../utils/emit';
import { getChatGroupAllNewMessageApi, IGroupHistoryMsg } from '../../../api/groupchatmsg/message';

type ILeftMsg = Partial<{
    chatRoomId: string;
    newMsgCount: number;
    type: 0 | 1;     // 0 - 群聊  1 - 好友

    userId: string;
    friendId: string;
    friendNickname: string;
    friendAvatar: string;

    chatRoomName: string;
    chatRoomAvatar: string;
}>

const leftMsgList = ref<ILeftMsg[]>([]);
const { userFriendList, userInfo, chatGroupList } = storeToRefs(useUserInfoStore());
const router = useRouter()
const route = useRoute();

const getFriendNewMsg = async () => {
    // 获取好友的新消息
    const { code, data, msg } = await getFriendNewMsgApi(route.params.chatRoomId as string);
    if (code !== 200) {
        window.$message.warning(msg || "服务器错误！", { closable: true });
        return;
    }
    let vals: ILeftMsg[] = [];
    for (let key in data.newChatMsgRes) {
        let tmp = userFriendList.value?.find(it => it.friendId == key);
        if (vals.find(it => it.chatRoomId == tmp?.chatRoomId)) continue;
        if (!tmp) continue;
        vals.push({
            userId: userInfo.value?.id as string,
            friendId: key,
            newMsgCount: data.newChatMsgRes[key],
            friendNickname: tmp.friendNickname,
            friendAvatar: tmp.friendAvatar,
            chatRoomId: tmp.chatRoomId,
            type: 1,
        });
    }
    if (route.params.friendId) {
        data.historyChatMsgRes.push(route.params.friendId as string);
    }
    data.historyChatMsgRes = data.historyChatMsgRes.filter(it => it != userInfo.value?.id);
    for (let item of data.historyChatMsgRes) {
        let tmp = userFriendList.value?.find(it => it.friendId == item);
        if (vals.find(it => it.chatRoomId == tmp?.chatRoomId)) continue;
        if (!tmp) continue;
        vals.push({
            userId: userInfo.value?.id as string,
            friendId: item,
            newMsgCount: 0,
            friendNickname: tmp.friendNickname,
            friendAvatar: tmp.friendAvatar,
            chatRoomId: tmp.chatRoomId,
            type: 1,
        });
    }
    leftMsgList.value = vals;
}

const getChatGroupNewMsg = async () => {
    // 获取群聊的新消息
    const { code, data, msg } = await getChatGroupAllNewMessageApi(userInfo.value?.id!);
    const { newMsgRes, oldMsgRes } = data;
    let vals: ILeftMsg[] = [];
    for(let key in newMsgRes) {
        const chatRoomInfo = chatGroupList.value?.find(it => it.id == key);
        vals.push({
            chatRoomId: chatRoomInfo?.id?.toString(),
            newMsgCount: newMsgRes[key],
            type: 0,
            chatRoomName: chatRoomInfo?.chatRoomName,
            chatRoomAvatar: chatRoomInfo?.avatar!,
        })
    }
    for(let key in oldMsgRes) {
        const chatRoomInfo = chatGroupList.value?.find(it => it.id == key);
        if(vals.findIndex(it => it.chatRoomId == key) !== -1) continue;
        vals.push({
            chatRoomId: chatRoomInfo?.id?.toString(),
            newMsgCount: 0,
            type: 0,
            chatRoomName: chatRoomInfo?.chatRoomName,
            chatRoomAvatar: chatRoomInfo?.avatar!,
        })
    }
    console.log(vals);
    leftMsgList.value.push(... vals);
}

async function init() {
    await getFriendNewMsg();
    await getChatGroupNewMsg();
}
init();

const handleFriendChatClick = (item: ILeftMsg) => {
    if ('friendId' in item && item.type === 1) {
        leftMsgList.value = leftMsgList.value.map(it => {
            if (it.chatRoomId === item.chatRoomId) {
                it.newMsgCount = 0;
            }
            return it;
        })
        router.push({
            name: 'friendchat',
            params: {
                userId: item.userId,
                friendId: item.friendId,
                friendNickname: item.friendNickname,
                friendAvatar: item.friendAvatar,
                chatRoomId: item.chatRoomId
            } as any
        });
    } else if ('chatRoomName' in item && item.type === 0) {
        leftMsgList.value = leftMsgList.value.map(it => {
            if (it.chatRoomId === item.chatRoomId) {
                it.newMsgCount = 0;
            }
            return it;
        })
        router.push({
            name: 'grouproomchat',
            params: {
                chatRoomId: item?.chatRoomId, 
                type: 0, 
                chatRoomName: item?.chatRoomName, 
                chatRoomAvatar: item?.chatRoomAvatar! 
            } as any
        });
    }
}

$on('notifyNewMsg', (data: IFriendHistoryMsg) => {
    let flag = false;
    leftMsgList.value = leftMsgList.value.map(it => {
        if (it.type === 1 && it.chatRoomId === data.chatRoomId) {
            flag = true;
            it.newMsgCount = (it.newMsgCount || 0) + 1;
        }
        return { ...it, type: 1 };
    });
    if (!flag) {
        const friendInfo = userFriendList.value?.find(it => it.friendId == data.fromUserId);
        leftMsgList.value.push({
            userId: data?.userId,
            chatRoomId: data?.chatRoomId,
            type: 1,
            newMsgCount: 1,
            friendId: friendInfo?.id,
            friendNickname: friendInfo?.friendNickname,
            friendAvatar: friendInfo?.friendAvatar,
        });
    }
});

$on('notifyNewGroupMsg', (data: IGroupHistoryMsg) => {
    let flag = false;
    leftMsgList.value = leftMsgList.value.map(it => {
        if (it.type === 0 && it.chatRoomId == data.chatRoomId) {
            flag = true;
            it.newMsgCount = (it.newMsgCount || 0) + 1;
        }
        return { ...it };
    });
    if (!flag) {
        const chatRoomInfo = chatGroupList.value?.find(it => it.id == data.chatRoomId);
        leftMsgList.value.push({ 
            chatRoomId: data?.chatRoomId, 
            type: 0, 
            newMsgCount: 1, 
            chatRoomName: chatRoomInfo?.chatRoomName, 
            chatRoomAvatar: chatRoomInfo?.avatar! 
        });
    }
});

</script>

<template>
    <div class="left-message-list-container">
        <LeftMessageItem v-for="item in leftMsgList" :avatar="item?.friendAvatar || item?.chatRoomAvatar"
            :newMsgCount="item.newMsgCount" :name="item?.friendNickname || item?.chatRoomName" :type="item.type"
            @click="handleFriendChatClick(item)" />
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
</style>