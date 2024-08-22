<script lang="ts" setup>
import { useRoute } from 'vue-router';
import ChatRoomContent from '../component/ChatRoomContent.vue';
import ChatRoomHead from '../component/ChatRoomHead.vue';
import ChatRoomInput from '../component/ChatRoomInput.vue';
import { io } from "socket.io-client"
import { ref } from 'vue';
import { AUTHORIZATION, socketFriendChatUrl } from '../../../constant/request';
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import { getFriendHistoryMsgApi, IFriendHistoryMsg } from '../../../api/friendchatmsg';
import formatTime from '../../../utils/formatTime';

const route = useRoute();
let { friendNickname, userId, friendId, friendAvatar } = route.params as { friendNickname: string; userId: string; friendId: string; friendAvatar: string };
const inputMessage = ref<string>('');
const chatMessage = ref<IFriendHistoryMsg[]>([]);
const { userInfo, userFriendList } = storeToRefs(useUserInfoStore());
const { getUserFriendList } = useUserInfoStore();
const socket = io(socketFriendChatUrl);

async function init() {
    /**
     * 如果链接直接跳转过来，可能会处于无friend信息状态
     */
    if(!userFriendList.value) {
        await getUserFriendList();
    }
    if (!friendId && userFriendList.value) {
        for (let item of userFriendList.value) {
            if(item.chatRoomId === route.query.chatRoomId) {
                friendId = item.friendId;
                friendAvatar = item.friendAvatar;
                friendNickname = item.friendNickname;
                userId = userInfo.value?.id || '';
            }
            break;
        }
    }

    /**
     * 实时聊天
     */
    socket.on("connect", () => {
        let token = localStorage.getItem(AUTHORIZATION);
        if(!token || !userInfo.value?.id) {
            window.$message.warning("您还未登录，或者好友信息错误", { closable: true })
            return
        }
        socket.emit('userLogin', {
            token,
            userId: userInfo.value?.id,
            socketId: socket.id
        })

        socket.on('getMsgFromFriend', (data: IFriendHistoryMsg) => {
            console.log(data)
            chatMessage.value = [... chatMessage.value, {
                ... data,
                avatar: friendAvatar
            }]
        })
    });
    if(route.query?.chatRoomId) {
        let { code, data } = await getFriendHistoryMsgApi({ chatRoomId: route.query?.chatRoomId as string })
        if(code !== 200 || typeof data !== 'object') {
            window.$message.warning("获取聊天数据失败！", { closable: true })
            return
        }
        data = data.map(it => {
            if(it.createdAt) it.createdAt = formatTime(new Date(it.createdAt));
            // console.log(it.fromUserId, userInfo.value?.id)
            it.avatar = it.fromUserId == userInfo.value?.id ? userInfo.value.avatar : friendAvatar;
            return it
        })
        chatMessage.value = data
    }

}

init()

/**
 * 发送消息
 */
const handleSendMsg = () => {
    if(!userId || !friendId) {
        window.$message.warning("您还未登录，或者好友信息错误", { closable: true })
        return
    }

    chatMessage.value = [... chatMessage.value, {
        id: Math.random(),
        fromUserId: userId,
        toUsereId: friendId,
        messageInfo: inputMessage.value,
        chatRoomId: route.query?.chatRoomId as string,
        avatar: userInfo.value?.avatar,
        status: 1,
        messageType: 'message'
    }]

    socket.emit('sendMsgToFriend', {
        userId: userInfo.value?.id,
        friendId: friendId,
        token: localStorage.getItem(AUTHORIZATION),
        message: inputMessage.value,
        chatRoomId: route.query?.chatRoomId
    })
}

</script>

<template>
    <div class="friend-chat-container">
        <ChatRoomHead class="chatroom-head" :nickname="friendNickname" />
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
        height: px2vw(240);
        border-top: 0.8px solid rgb(206, 206, 206);
    }
}
</style>