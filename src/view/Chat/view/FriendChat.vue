<script lang="ts" setup>
import { useRoute } from 'vue-router';
import ChatRoomContent from '../component/ChatRoomContent.vue';
import ChatRoomHead from '../component/ChatRoomHead.vue';
import ChatRoomInput from '../component/ChatRoomInput.vue';
import { io } from "socket.io-client"
import { ref } from 'vue';
import { AUTHORIZATION } from '../../../constant/request';

const route = useRoute();
// console.log(route.params, route.query)
const { friendNickname, userId, friendId } = route.params as { friendNickname: string; userId: string; friendId: string };
const inputMessage = ref<string>('');

const socket = io("http://localhost:3001");
socket.on("connect", () => {
    socket.emit('userLogin', {
        token: localStorage.getItem(AUTHORIZATION),
        userId,
        socketId: socket.id
    })

    socket.on('getMsgFromFriend', (message: any) => {
        console.log(message)
    })
});

const handleSendMsg = () => {
    socket.emit('sendMsgToFriend', {
        userId,
        friendId: userId,
        token: localStorage.getItem(AUTHORIZATION),
        message: inputMessage.value
    })
}

</script>

<template>
    <div class="friend-chat-container">
        <ChatRoomHead class="chatroom-head" :nickname="friendNickname" />
        <ChatRoomContent class="chatroom-content" />
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