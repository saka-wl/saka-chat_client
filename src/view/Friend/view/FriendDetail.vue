<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { NButton } from 'naive-ui';
import FriendCard from '../component/FriendCard.vue';
import { ref, watch } from 'vue';
import { IUserFriend } from '../../../api/friend';
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../../store/userInfo.pinia';

const route = useRoute();
const router = useRouter();
const friendInfo = ref<IUserFriend>();
const { userFriendList, userInfo } = storeToRefs(useUserInfoStore())

watch(() => route.params.id, (newVal) => {
    if (!newVal) {
        return;
    }
    friendInfo.value = userFriendList.value?.find(it => it.id == newVal)
}, {
    immediate: true
})
const goToChat = () => {
    router.push({
        name: 'friendchat',
        params: {
            userId: userInfo.value?.id || '',
            friendAccount: friendInfo.value?.friendAccount || '',
            friendId: friendInfo.value?.friendId || '',
            friendNickname: friendInfo.value?.friendNickname || '',
            friendAvatar: friendInfo.value?.friendAvatar || '',
            chatRoomId: friendInfo.value?.chatRoomId as string,
        }
    });
}
</script>

<template>
    <div class="friend-detail-container">
        <FriendCard :avatar="friendInfo.friendAvatar" :nickname="friendInfo.friendNickname" :account="friendInfo.friendAccount" :isOnline="friendInfo.isOnline" />
        <n-button type="info" @click="goToChat">
            去聊天
        </n-button>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
</style>