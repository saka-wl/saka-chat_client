
<script lang="ts" setup>
import { NAvatar, NButton } from 'naive-ui';
import { getFileInfoApi, IFileInfoApi } from '../../../api/file';
import { ref } from 'vue';
import LargeFileDownload from "../../../component/LargeFileDownload/index.vue";

const props = defineProps<{ type: 'left' | 'right', message: string, color: string, avatar: string, messageType: string }>();
let fileInfo = ref<IFileInfoApi | null>(null)

async function init() {
    if (props.messageType === 'file') {
        const resp = await getFileInfoApi({ id: ~~props.message });
        if(!resp) {
            return;
        }
        fileInfo.value = resp[0];
    }
}

init();

</script>

<template>
    <div class="chat-message-info-item-container">
        <n-avatar
            class="avatar"
            round
            size="small"
            :src="props.avatar"
        />
        <div class="message" v-if="props.messageType === 'string'">
            {{ props.message }}
        </div>
        <!-- 文件类型 -->
        <div class="file-tag" v-if="fileInfo && props.messageType === 'file'">
            <LargeFileDownload :fileInfo="fileInfo" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";
.chat-message-info-item-container {
    display: flex;
    padding: px2vw(5);
    margin-bottom: px2vw(20);
    .avatar {
        height: px2vw(30);
        width: px2vw(30);
    }
}
</style>