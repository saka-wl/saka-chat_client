<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { NButton } from 'naive-ui';
import FriendCard from '../component/FriendCard.vue';
import { watch } from 'vue';
const route = useRoute();
const router = useRouter();
let { friendAvatar, chatRoomId, friendNickname, userId, friendAccount, friendId } = 
    route.params as { friendAvatar: string, chatRoomId: string, friendNickname: string, userId: string, friendEmail: string, friendAccount: string, friendId: string };

watch(() => route.params, (newVal) => {
    friendAvatar = newVal.friendAvatar as string
    chatRoomId = newVal.chatRoomId as string
    friendNickname = newVal.friendNickname as string
    userId = newVal.userId as string
    friendAccount = newVal.friendAccount as string
    friendId = newVal.friendId as string
})
const goToChat = () => {
    router.push({
        name: 'friendchat',
        query: {
            chatRoomId
        },
        params: {
            userId,
            friendAccount,
            friendId,
            friendNickname,
            friendAvatar
        }
    });
}
</script>

<template>
    <div class="friend-detail-container">
        <FriendCard :avatar="friendAvatar" :nickname="friendNickname" :account="friendAccount" />
        <n-button type="info" @click="goToChat">
            去聊天
        </n-button>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
</style>