<script lang="ts" setup>
import { computed } from 'vue';
import { normalImageUrl } from '../../../constant/request';
import { NAvatar } from 'naive-ui';

interface IProps {
    avatar: string | null;
    chatRoomId: string | number;
    chatRoomName: string;
}
const props = withDefaults(defineProps<IProps>(), {
    avatar: '',
    chatRoomName: '',
    chatRoomId: '',
});

const imageUrl = computed(() => {
    return normalImageUrl + props.avatar
});
</script>

<template>
    <div class="friend-card-container">
        <n-avatar :src="imageUrl" object-fit="cover">
            <template v-if="props.avatar === ''">
                {{ props.chatRoomName }}
            </template>
        </n-avatar>
        <div class="user-info__message">
            <div class="nickname">群聊名称：{{ props.chatRoomName }}</div>
            <div class="account">群聊id：{{ props.chatRoomId }}</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
.friend-card-container {
    width: px2vw(700);
    background-color: #f2f2f2;
    display: flex;

    .user-info {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        &__message {}
    }
}
</style>