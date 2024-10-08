<script lang="ts" setup>
import { ref } from 'vue';
import { getFriendNewMsgApi, IFriendHistoryMsg } from '../../../api/friendchatmsg';
import LeftMessageItem from './LeftMessageItem.vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import { $on } from '../../../utils/emit';

interface ILeftMsg {
    userId: string;
    friendId: string;
    friendNickname: string;
    friendAvatar: string;
    chatRoomId: string;
    newMsgCount: number;
}

const leftMsgList = ref<ILeftMsg[]>([]);
const { userFriendList, userInfo } = storeToRefs(useUserInfoStore());
const router = useRouter()
const route = useRoute();

async function init() {
    const { code, data, msg } = await getFriendNewMsgApi(route.params.chatRoomId as string);
    if(code !== 200) {
        window.$message.warning(msg || "服务器错误！", { closable: true });
        return;
    }
    let vals: ILeftMsg[] = [];
    for(let key in data.newChatMsgRes) {
        let tmp = userFriendList.value?.find(it => it.friendId == key);
        if(vals.find(it => it.chatRoomId == tmp?.chatRoomId)) continue;
        if(!tmp) continue;
        vals.push({
            userId: userInfo.value?.id as string,
            friendId: key,
            newMsgCount: data.newChatMsgRes[key],
            friendNickname: tmp.friendNickname,
            friendAvatar: tmp.friendAvatar,
            chatRoomId: tmp.chatRoomId
        });
    }
    if(route.params.friendId) {
        data.historyChatMsgRes.push(route.params.friendId as string);
    }
    data.historyChatMsgRes = data.historyChatMsgRes.filter(it => it != userInfo.value?.id);
    for(let item of data.historyChatMsgRes) {
        let tmp = userFriendList.value?.find(it => it.friendId == item);
        if(vals.find(it => it.chatRoomId == tmp?.chatRoomId)) continue;
        if(!tmp) continue;
        vals.push({
            userId: userInfo.value?.id as string,
            friendId: item,
            newMsgCount: 0,
            friendNickname: tmp.friendNickname,
            friendAvatar: tmp.friendAvatar,
            chatRoomId: tmp.chatRoomId
        });
    }
    leftMsgList.value = vals;
}
init();

const handleFriendChatClick = (item: ILeftMsg) => {
    leftMsgList.value = leftMsgList.value.map(it => {
        if(it.chatRoomId === item.chatRoomId) {
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
        }
    });
}

$on('notifyNewMsg', (data: IFriendHistoryMsg) => {
    leftMsgList.value = leftMsgList.value.map(it => {
        if(it.chatRoomId === data.chatRoomId) {
            it.newMsgCount = (it.newMsgCount || 0) + 1;
        }
        return it;
    })
});

</script>

<template>
    <div class="left-message-list-container">
        <LeftMessageItem 
            v-for="item in leftMsgList" 
            :avatar="item.friendAvatar" 
            :newMsgCount="item.newMsgCount" 
            @click="handleFriendChatClick(item)" 
        />
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
</style>