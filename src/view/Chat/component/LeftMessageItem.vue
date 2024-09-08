
<script lang="ts" setup>
import { NAvatar, NBadge } from 'naive-ui';
import { normalImageUrl } from '../../../constant/request';
import { computed } from 'vue';

const props = defineProps({
    avatar: String,
    newMsgCount: Number,
})
const avatarUrl = computed(() => {
    return normalImageUrl + props.avatar;
})

</script>

<template>
    <div class="left-message-item-container">
        <div class="avatar">
            <n-badge :value="props.newMsgCount">
                <n-avatar :src="avatarUrl" object-fit="cover"></n-avatar>
            </n-badge>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
.left-message-item-container {
    display: flex;
}
</style>