<script lang="ts" setup>
import { NAvatar } from 'naive-ui';
import { getFileInfoApi, IFileInfoApi } from '../../../api/file';
import { ref } from 'vue';
import Message from '../../../component/Message/index.vue';

const props = defineProps<{ type: 'left' | 'right', message: string, color: string, avatar: string, messageType: string }>();
let fileInfo = ref<IFileInfoApi | null>(null)

async function init() {
    if (props.messageType === 'file' || props.messageType === 'video') {
        const resp = await getFileInfoApi({ id: ~~props.message });
        if (!resp) {
            return;
        }
        fileInfo.value = resp[0];
    }
}

init();

</script>

<template>
    <div class="chat-message-info-item-container">
        <n-avatar :class="['avatar', props.type]" round size="small" :src="props.avatar" />
        <Message :message="props.message" :type="props.type" :messageType="props.messageType" :fileInfo="fileInfo" />
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";

.chat-message-info-item-container {
    display: flex;
    padding: px2vw(5);
    margin-bottom: px2vw(20);
    position: relative;
    align-items: flex-start;
    position: relative;

    .avatar {
        height: px2vw(30);
        width: px2vw(30);
        margin: 0 px2vw(10);

        &.right {
            position: absolute;
            right: px2vw(10);
        }
    }
}
</style>