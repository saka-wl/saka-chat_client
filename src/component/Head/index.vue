<script lang="ts" setup>
import { useDialog, useMessage } from 'naive-ui';
import HeadLeftIcon from './HeadLeftIcon.vue';
import HeadRouterLinks from "./HeadRouterLinks.vue";
import HeadAvatar from "./HeadAvatar.vue";

declare global {
    interface Window {
        $message: ReturnType<typeof useMessage>;
        $dialog: ReturnType<typeof useDialog>;
        showDirectoryPicker: Function;
        showOpenFilePicker: Function;
    }
}
const dialog = useDialog()
// 挂载全局消息提示，挂载一次即可
window.$message = useMessage();
window.$dialog = dialog;

</script>

<template>
    <div class="head-container">
        <HeadLeftIcon />
        <HeadRouterLinks />
        <HeadAvatar />
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";

.head-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: px2vw(10) px2vw(20);
    height: px2vw(50);
}
</style>