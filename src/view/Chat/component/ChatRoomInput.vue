<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { NInput, NButton } from 'naive-ui';
import LargeFileUpload from "../../../component/LargeFileUpload/index.vue"
import { ref, watch } from 'vue';

const route = useRoute();
const largeFileUploadRef = ref();
const emit = defineEmits<{
    (e: 'update:inputMessage', value: string) : void
    (e: 'sendMessage') : void
}>();
const props = defineProps<{ inputMessage: string }>();
interface IFriendInfo { friendId: string; chatRoomId: string };
const friendInfo = ref<IFriendInfo>();

watch(() => (route.params as any), (newVal: IFriendInfo) => {
    if(newVal) friendInfo.value = {
        friendId: newVal.friendId,
        chatRoomId: newVal.chatRoomId
    }
}, {
    immediate: true
})

const handleMsgSend = () => {
    largeFileUploadRef.value.fileUploadFinished();
    if(props.inputMessage !== '') emit('sendMessage');
}
</script>

<template>
    <div class="chatroom-input">
        <div class="input-container">
            <n-input class="input" @input="(e) => { emit('update:inputMessage', e) }" type="textarea" placeholder="" />
            <LargeFileUpload ref="largeFileUploadRef" class="large-file-upload" :friendId="friendInfo.friendId" :chatRoomId="friendInfo.chatRoomId"></LargeFileUpload>
        </div>
        <n-button @click="handleMsgSend">send</n-button>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";
.chatroom-input {

    .input-container {
        display: flex;
        .input {
            background: transparent;
            height: px2vw(300);
        }
        .large-file-upload {
            width: px2vw(900);
        }
    }
}
</style>