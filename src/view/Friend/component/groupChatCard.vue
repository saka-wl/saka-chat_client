
<script lang="ts" setup>
import { NAvatar } from 'naive-ui';
import { normalImageUrl } from '../../../constant/request';
import { computed } from 'vue';

interface IProps {
    chatRoomName: string;
    id: string;
    avatar: string | null;
}
const props = withDefaults(defineProps<IProps>(), {
    id: '',
    chatRoomName: '没有名字的群聊～',
    avatar: null
});

const imageUrl = computed(() => {
    return normalImageUrl + props.avatar
});

</script>

<template>
    <div class="group-chat-card-container">
        <n-avatar :src="imageUrl" object-fit="cover">
            <template v-if="props.avatar === '' || !props.avatar">
                {{ props.chatRoomName }}
            </template>
        </n-avatar>
        <div class="chat-group-info__message">
            <div class="nickname">群聊名字：{{ props.chatRoomName }}</div>
            <div class="account">群聊账号：{{ props.id }}</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";
.group-chat-card-container {
    width: px2vw(700);
    background-color: #f2f2f2;
    display: flex;

    .chat-group-info {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        &__message {}
    }
}
</style>