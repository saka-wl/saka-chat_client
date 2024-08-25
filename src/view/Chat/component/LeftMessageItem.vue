
<script lang="ts" setup>
import { NAvatar } from 'naive-ui';
import { normalImageUrl } from '../../../constant/request';
import { computed } from 'vue';

const props = defineProps({
    avatar: String,
    newMsgCount: Number,
    newMsg: String,
})
const avatarUrl = computed(() => {
    return normalImageUrl + props.avatar;
})

</script>

<template>
    <div class="left-message-item-container">
        <div class="avatar">
            <n-avatar :src="avatarUrl" object-fit="cover"></n-avatar>
        </div>
        <div class="msg">
            {{ props.newMsg }} - {{ props.newMsgCount }}
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
.left-message-item-container {
    display: flex;
}
</style>