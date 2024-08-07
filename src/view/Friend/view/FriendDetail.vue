<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { NButton } from 'naive-ui';
import FriendCard from '../component/FriendCard.vue';
const route = useRoute();
const router = useRouter();
const { friendAvatar, chatRoomId, friendNickname, userId, friendEmail, friendAccount, friendId } = 
    route.params as { friendAvatar: string, chatRoomId: string, friendNickname: string, userId: string, friendEmail: string, friendAccount: string, friendId: string };
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