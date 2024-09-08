<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import ChatRoomContent from '../component/ChatRoomContent.vue';
import ChatRoomHead from '../component/ChatRoomHead.vue';
import ChatRoomInput from '../component/ChatRoomInput.vue';
import { ref, watch } from 'vue';
import { AUTHORIZATION } from '../../../constant/request';
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import { getFriendHistoryMsgApi, IFriendHistoryMsg, updateFriendChatMsgStatusApi } from '../../../api/friendchatmsg';
import formatTime from '../../../utils/formatTime';
import { socket } from '../../../utils/socket';
import { $on } from '../../../utils/emit';

const route = useRoute();
const router = useRouter();
const inputMessage = ref<string>('');
const chatMessage = ref<IFriendHistoryMsg[]>([]);
const { userInfo, userFriendList } = storeToRefs(useUserInfoStore());

interface IChatRoomInfo {
    friendNickname: string; 
    userId: string; 
    friendId: string; 
    friendAvatar: string;
    chatRoomId: string;
}
let chatRoomInfo: IChatRoomInfo | null = null

async function init() {
    chatRoomInfo = route.params as unknown as IChatRoomInfo;

    if(!chatRoomInfo || !chatRoomInfo.chatRoomId) {
        window.$message.warning("请选择用户", { closable: true });
        router.push('/friend');
        return;
    }

    let { code, data } = await getFriendHistoryMsgApi({ chatRoomId: chatRoomInfo.chatRoomId })
    if(code !== 200 || typeof data !== 'object') {
        window.$message.warning("获取聊天数据失败！", { closable: true })
        return
    }
    data = data.map(it => {
        if(it.createdAt) it.createdAt = formatTime(new Date(it.createdAt));
        it.avatar = it.fromUserId == userInfo.value?.id ? userInfo.value.avatar : chatRoomInfo?.friendAvatar;
        it.userId = userFriendList.value[0]?.userId;
        return it
    })
    chatMessage.value = data
    // 更新消息状态
    updateFriendChatMsgStatusApi((userInfo.value?.id as unknown as string).toString(), chatRoomInfo.chatRoomId);
}

init();

watch(() => route.params.chatRoomId, (newVal, oldVal) => {
    if(oldVal && newVal !== oldVal) init();
});

/**
 * 发送消息
 */
const handleSendMsg = () => {
    if(!chatRoomInfo?.userId || !chatRoomInfo?.friendId) {
        window.$message.warning("您还未登录，或者好友信息错误", { closable: true })
        return
    }

    /**
     * 发送消息
     */
    socket.emit('sendMsgToFriend', {
        userId: userInfo.value?.id,
        friendId: chatRoomInfo.friendId,
        token: localStorage.getItem(AUTHORIZATION),
        message: inputMessage.value,
        chatRoomId: route.params?.chatRoomId
    });
}

/**
 * 接收到消息就添加
 */
$on('notifyNewMsg', (data: IFriendHistoryMsg) => {
    if(chatMessage.value.find(it => it.id === data.id)) return;
    chatMessage.value = [... chatMessage.value, { ... data, avatar: chatRoomInfo?.friendAvatar }]
})

$on('updateMineMsg', (data: IFriendHistoryMsg) => {
    if(chatMessage.value.find(it => it.id === data.id)) return;
    chatMessage.value = [... chatMessage.value, { ... data, avatar: userInfo.value?.avatar }]
})

</script>

<template>
    <div class="friend-chat-container">
        <ChatRoomHead class="chatroom-head" :nickname="chatRoomInfo?.friendNickname || ''" />
        <ChatRoomContent class="chatroom-content" :chatMessage="chatMessage" />
        <ChatRoomInput class="chatroom-input" v-model:inputMessage="inputMessage" @sendMessage="handleSendMsg" />
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";

.friend-chat-container {
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