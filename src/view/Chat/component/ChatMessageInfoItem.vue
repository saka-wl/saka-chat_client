
<script lang="ts" setup>
import { NAvatar, NButton } from 'naive-ui';
import { getFileInfoApi, IFileInfoApi } from '../../../api/file';
import { ref } from 'vue';
import LargeFileDownload from "../../../component/LargeFileDownload/index.vue";
import ChatBubble from '../../../component/Message/ChatBubble.vue'; //聊天气泡
import VideoDownload from "../../../component/VideoDownload/index.vue"

const props = defineProps<{ type: 'left' | 'right', message: string, color: string, avatar: string, messageType: string }>();
let fileInfo = ref<IFileInfoApi | null>(null)

async function init() {
    if (props.messageType === 'file' || props.messageType === 'video') {
        const resp = await getFileInfoApi({ id: ~~props.message });
        if(!resp) {
            return;
        }
        fileInfo.value = resp[0];
    }
    console.log(props.type);
    
}

init();

</script>

<template>
    <div class="chat-message-info-item-container">
        <n-avatar
            :class="['avatar',props.type]"
            round
            size="small"
            :src="props.avatar"
        />
        <div class="message" v-if="props.messageType === 'string'">
             <ChatBubble :message="props.message" :type="props.type" />
        </div>
        <!-- 文件类型 -->
        <div class="file-tag" v-else-if="fileInfo && (props.messageType === 'file' || props.messageType === 'video')">
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
    position: relative;
    align-items: flex-start;
    .avatar {
        height: px2vw(30);
        width: px2vw(30);
        margin: 0 px2vw(10);
        &.right{
            position: absolute;
            right: px2vw(10);
        }
    }
    .message, .file-tag, .video-tag {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: px2vw(10); // 留出一定的间距
        margin-right: px2vw(10); // 留出一定的间距
        flex: 1;
    }
}
</style>