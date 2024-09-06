<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { NInput, NButton } from 'naive-ui';
import LargeFileUpload from "../../../component/LargeFileUpload/index.vue"
import { ref } from 'vue';

const route = useRoute();
const largeFileUploadRef = ref();
const emit = defineEmits<{
    (e: 'update:inputMessage', value: string) : void
    (e: 'sendMessage') : void
}>();
const props = defineProps<{ inputMessage: string }>();
const { friendId, chatRoomId } = route.params;

const handleMsgSend = () => {
    largeFileUploadRef.value.fileUploadFinished();
    if(props.inputMessage !== '') emit('sendMessage');
}
</script>

<template>
    <div class="chatroom-input">
        <div class="input-container">
            <n-input class="input" @input="(e) => { emit('update:inputMessage', e) }" type="textarea" placeholder="" />
            <LargeFileUpload ref="largeFileUploadRef" class="large-file-upload" :friendId="friendId" :chatRoomId="chatRoomId"></LargeFileUpload>
        </div>
        <n-button @click="handleMsgSend">send</n-button>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";
.chatroom-input {
    height: 100%;
    .input {
        background: transparent;
    }
    .input-container {
        display: flex;
        .large-file-upload {
            width: 300px;
        }
    }
}
</style>