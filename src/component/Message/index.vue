<script lang="ts" setup>
import { defineProps } from 'vue';
import LargeFileDownload from "../LargeFileDownload/index.vue";
import { NPopover, NButton } from 'naive-ui';

const props = defineProps<{
    messageType: String;
    message: String;
    type: "right" | "left";
    fileInfo: Object | null;
}>();

const withDrawMsg = () => {
    console.log(props.fileInfo);
}

</script>


<template>
    <div :class="['chat-message-bubble', 'message', props.type]" v-if="props.messageType === 'string'">
        <n-popover trigger="hover">
            <template #trigger>
                <p>{{ message }}</p>
            </template>
            <n-button quaternary type="error" @click="withDrawMsg">
                撤回这条消息
            </n-button>
        </n-popover>
    </div>
    <div :class="['chat-video-' + props.type]" v-else-if="props.fileInfo && (props.messageType === 'file' || props.messageType === 'video')">
        <n-popover trigger="hover">
            <template #trigger>
                <LargeFileDownload :fileInfo="props.fileInfo" />
            </template>
            <n-button quaternary type="error" @click="withDrawMsg">
                撤回这条消息
            </n-button>
        </n-popover>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";

.chat-message-bubble {
    max-width: px2vw(1000);
    padding: px2vw(0) px2vw(15);
    min-height: px2vw(40);
    border-radius: px2vw(15);
    margin: px2vw(5) 0;
    background-color: #f1f1f1;
    position: relative;
    // display: inline-block;
    font-size: px2vw(14);
    line-height: 1.5;
    word-wrap: break-word;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: px2vw(10); // 留出一定的间距
    margin-right: px2vw(10); // 留出一定的间距

    &.right {
        background-color: #007bff;
        color: white;
        margin-left: auto;
        position: relative;
        right: px2vw(50);

        &::after {
            content: '';
            position: absolute;
            top: 50%;
            right: px2vw(-15);
            width: 0;
            height: 0;
            border-width: px2vw(10);
            border-style: solid;
            border-color: transparent transparent transparent #007bff;
            transform: translateY(-50%);
        }
    }

    &.left {
        background-color: #e0e0e0;
        color: black;
        align-self: start;

        &::before {
            content: '';
            display: block;
            position: absolute;
            top: 50%;
            left: px2vw(-15); // 调整三角形的位置
            width: 0;
            height: 0;
            border-width: px2vw(10);
            border-style: solid;
            border-color: transparent #e0e0e0 transparent transparent;
            transform: translateY(-50%);
        }
    }
}
.chat-video-right{

}
</style>