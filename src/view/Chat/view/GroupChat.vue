<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import { IGroupChatRoom } from '../../../api/groupchatmsg';
import ChatRoomInput from '../component/ChatRoomInput.vue';
import { socket } from '../../../utils/socket';
import ChatRoomHead from '../component/ChatRoomHead.vue';
import { $on } from '../../../utils/emit';
import { getChatGroupMessageApi, IGroupHistoryMsg, IUsersInfo } from '../../../api/groupchatmsg/message';
import ChatGroupRoomContent from '../component/ChatGroupRoomContent.vue';

const route = useRoute();
const router = useRouter();
const { chatGroupList, userInfo } = storeToRefs(useUserInfoStore());

/**
 * 聊天室的信息
 */
const chatRoomInfo = ref<IGroupChatRoom | null | undefined>(null);
const inputMessage = ref<string>('');
const chatMessage = ref<IGroupHistoryMsg[]>([]);
const usersInfo = ref<IUsersInfo>();

const init = async () => {
    if(!chatRoomInfo.value?.id) {
        window.$message.warning("请选择一个用户聊天吧～", { closable: true });
        return;
    }
    const { code, data, msg } = await getChatGroupMessageApi(chatRoomInfo.value.id as string);
    if(code !== 200) {
        window.$message.warning("获取聊天数据失败！", { closable: true })
        return
    }
    chatMessage.value = data.chatMsg;
    usersInfo.value = data.usersInfo;
}

watch(() => route.params.chatRoomId, (newVal) => {
    chatRoomInfo.value = chatGroupList.value?.find(it => it.id == newVal);
    if(newVal) init();
}, {
    immediate: true
})

const handleSendMsg = () => {
    if (!chatRoomInfo?.value?.id) {
        window.$message.warning("您还未登录，或者好友信息错误", { closable: true })
        return
    }

    /**
     * 发送消息
     */
    socket.emit('sendMsgToChatGroupRoom', {
        fromUserId: userInfo.value?.id,
        chatRoomId: chatRoomInfo.value.id,
        messageInfo: inputMessage.value,
        messageType: 'string',
        status: 1,
        humanIds: chatRoomInfo.value.humanIds,
    });
}

/**
 * 接收到消息就添加
 */
$on('notifyNewGroupMsg', (data: IGroupHistoryMsg) => {
    if(chatMessage.value.find(it => it.id === data.id)) return;
    chatMessage.value.push(data);
});

/**
 * 更新自己的消息
 */
$on('updateMineGroupMsg', (data: IGroupHistoryMsg) => {
    if(chatMessage.value.find(it => it.id === data.id)) return;
    chatMessage.value.push(data);
});

</script>

<template>
    <div class="group-chat-container">
        <ChatRoomHead class="chatroom-head" :nickname="chatRoomInfo?.chatRoomName || ''" />
        <ChatGroupRoomContent class="chatroom-content" :chatMessage="chatMessage" :usersInfo="usersInfo!" />
        <ChatRoomInput class="chatroom-input" v-model:inputMessage="inputMessage" @sendMessage="handleSendMsg"
            :isChatGroupType="true" />
    </div>
</template>

<style lang="scss" scoped>
.group-chat-container {
    height: 100%;
    background: linear-gradient(to right bottom, #EAD6EE, #d7f2f0);
    display: flex;
    flex-direction: column;
    border-radius: px2vw(10) px2vw(10) 0 0;

    .chatroom-head {
        height: px2vw(45);
        border-bottom: 0.8px solid rgb(206, 206, 206);
    }

    .chatroom-content {
        flex: 1 1 auto;
        overflow-y: scroll;
    }

    .chatroom-input {
        height: px2vw(350);
        border-top: 0.8px solid rgb(206, 206, 206);
    }
}
</style>