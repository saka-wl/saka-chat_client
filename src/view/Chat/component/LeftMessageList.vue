<script lang="ts" setup>
import { ref } from 'vue';
import { getFriendNewMsgApi, IFriendNewMsg } from '../../../api/friendchatmsg';
import LeftMessageItem from './LeftMessageItem.vue';
import { useRoute, useRouter } from 'vue-router';

const leftMsgList = ref<IFriendNewMsg[]>([]);
const router = useRouter()
const route = useRoute();

async function init() {
    const { code, data, msg } = await getFriendNewMsgApi(route.query.chatRoomId as string);
    if(code !== 200) {
        window.$message.warning(msg || "服务器错误！", { closable: true });
        return;
    }
    leftMsgList.value = Object.values(data);
}
init();

const handleFriendChatClick = (item: IFriendNewMsg) => {
    router.push({
        name: 'friendchat',
        query: {
            chatRoomId: item.chatRoomId
        },
        params: {
            userId: item.toUsereId,
            friendId: item.fromUserId,
            friendNickname: item.friendNickname,
            friendAvatar: item.friendAvatar
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