<script lang="ts" setup>
import { ref } from 'vue';
import { getFriendNewMsgApi, IFriendNewMsg } from '../../../api/friendchatmsg';
import LeftMessageItem from './LeftMessageItem.vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../../store/userInfo.pinia';

const leftMsgList = ref<IFriendNewMsg[]>([]);
const { userFriendList } = storeToRefs(useUserInfoStore());
const router = useRouter()
const route = useRoute();

async function init() {
    const { code, data, msg } = await getFriendNewMsgApi(route.params.chatRoomId as string);
    if(code !== 200) {
        window.$message.warning(msg || "服务器错误！", { closable: true });
        return;
    }
    let tmp = Object.values(data);
    tmp.forEach(item => {
        item.friendAvatar = userFriendList.value?.find(it => it.userId == item.fromUserId || it.friendId == item.fromUserId)?.friendAvatar || '';
    });
    leftMsgList.value = tmp;
}
init();

const handleFriendChatClick = (item: IFriendNewMsg) => {
    router.push({
        name: 'friendchat',
        // query: {
        //     chatRoomId: item.chatRoomId
        // },
        params: {
            userId: item.toUsereId,
            friendId: item.fromUserId,
            friendNickname: item.friendNickname,
            friendAvatar: item.friendAvatar,
            chatRoomId: item.chatRoomId
        }
    });
}

</script>

<template>
    <div class="left-message-list-container">
        <LeftMessageItem 
            v-for="item in leftMsgList" 
            :avatar="item.friendAvatar" 
            :newMsgCount="item.newMsgCount" 
            :newMsg="item.messageInfo" 
            @click="handleFriendChatClick(item)" 
        />
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
</style>