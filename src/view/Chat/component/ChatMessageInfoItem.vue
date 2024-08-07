
<script lang="ts" setup>
import { NAvatar } from 'naive-ui';
const props = defineProps<{ type: 'left' | 'right', message: string, color: string, avatar: string }>();

</script>

<template>
    <div class="chat-message-info-item-container">
        <n-avatar
            class="avatar"
            round
            size="small"
            :src="props.avatar"
        />
        <div class="message">
            {{ props.message }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chat-message-info-item-container {
    display: flex;
    .avatar {
        height: px2vw(30);
        width: px2vw(30);
    }
}
</style>