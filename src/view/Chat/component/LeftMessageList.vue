<script lang="ts" setup>
import { ref } from 'vue';
import { getFriendNewMsgApi } from '../../../api/friendchatmsg';
import LeftMessageItem from './LeftMessageItem.vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../../store/userInfo.pinia';

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
    let vals: ILeftMsg[] = []
    for(let key in data.newChatMsgRes) {
        let tmp = userFriendList.value?.find(it => it.friendId == key);
        if(!tmp) continue;
        vals.push({
            userId: userInfo.value?.id as string,
            friendId: key,
            newMsgCount: data.newChatMsgRes[key],
            friendNickname: tmp.friendNickname,
            friendAvatar: tmp.friendAvatar,
            chatRoomId: tmp.chatRoomId
        })
    }
    leftMsgList.value = vals;
}
init();

const handleFriendChatClick = (item: ILeftMsg) => {
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