<script lang="ts" setup>
import { NAvatar, NInput, NButton } from 'naive-ui';
import { normalImageUrl } from '../../../constant/request';
import { computed, ref } from 'vue';
import { sendGroupChatRequestFromUserApi } from '../../../api/groupchatmsg';

interface IProps {
    chatRoomId: string | number;
    chatRoomName: string;
    avatar: string | null;
    toUserId: number | string; // 群聊的 makerUserId
    fromUserId: number | string; // 发出申请的用户id
}
const props = withDefaults(defineProps<IProps>(), {
    chatRoomId: '',
    chatRoomName: '没有名字的群聊～',
    avatar: null
});

const imageUrl = computed(() => {
    return normalImageUrl + props.avatar
});

const chatDesc = ref('');

const joinGroupChat = async () => {
    if(!props.chatRoomId || !props.fromUserId || !props.toUserId) {
        window.$message.warning('加入群聊发送申请失败！', { closable: true });
        return;
    }
    const { data, code, msg } = await sendGroupChatRequestFromUserApi({
        chatRoomId: props.chatRoomId,
        chatRoomName: props.chatRoomName,
        fromUserId: props.fromUserId,
        toUserId: props.toUserId,
        requestDesc: chatDesc.value
    });
    if(code !== 200 || !data) {
        window.$message.warning(msg || '加入群聊发送申请失败！', { closable: true });
        return;
    }
}

</script>

<template>
    <div class="group-chat-card-container">
        <div class="group-chat-info">
            <n-avatar :src="imageUrl" object-fit="cover">
                <template v-if="props.avatar === '' || !props.avatar">
                    {{ props.chatRoomName }}
                </template>
            </n-avatar>
            <div class="chat-group-info__message">
                <div class="nickname">群聊名字：{{ props.chatRoomName }}</div>
                <div class="account">群聊账号：{{ props.chatRoomId }}</div>
            </div>
        </div>
        <div class="group-chat-desc">
            <n-input v-model:value="chatDesc" type="textarea" placeholder="输入群聊添加的请求信息" />
            <n-button @click="joinGroupChat">发送添加请求</n-button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";

.group-chat-card-container {
    width: px2vw(700);
    background-color: #f2f2f2;

    .group-chat-info {
        display: flex;

        .chat-group-info {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            &__message {}
        }
    }
}
</style>