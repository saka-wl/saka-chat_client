
<script lang="ts" setup>
import { NAvatar, NBadge, NTag } from 'naive-ui';
import { normalImageUrl } from '../../../constant/request';
import { computed } from 'vue';

const props = defineProps({
    avatar: String,
    newMsgCount: Number,
    type: Number,
    name: String,
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
            <n-tag :bordered="false" type="info">
                {{ props.type === 0 ? '群聊:' + props.name : '好友: ' + props.name }}
            </n-tag>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
.left-message-item-container {
    display: flex;
}
</style>