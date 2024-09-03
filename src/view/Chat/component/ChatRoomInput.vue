<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { NInput, NButton } from 'naive-ui';
import LargeFileUpload from "../../../component/LargeFileUpload/index.vue"

const route = useRoute();
const emit = defineEmits<{
    (e: 'update:inputMessage', value: string) : void
    (e: 'sendMessage') : void
}>();
const props = defineProps<{ inputMessage: string }>();
const { friendId, chatRoomId } = route.params;
</script>

<template>
    <div class="chatroom-input">
        <div class="input-container">
            <n-input class="input" @input="(e) => { emit('update:inputMessage', e) }" type="textarea" placeholder="" />
            <LargeFileUpload class="large-file-upload" :friendId="friendId as string" :chatRoomId="chatRoomId as string" />
        </div>
        <n-button @click="emit('sendMessage')">send</n-button>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";
.chatroom-input {
    .input {
        background: transparent;
        // height: 100%;
    }
    .input-container {
        display: flex;
        .large-file-upload {
            width: 300px;
        }
    }
}
</style>