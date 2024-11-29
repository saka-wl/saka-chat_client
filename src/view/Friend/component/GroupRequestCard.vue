<script lang="ts" setup>
import { computed } from 'vue';
import { normalImageUrl } from '../../../constant/request';
import { NButton } from 'naive-ui';
import { addChatGroupRoomApi } from '../../../api/groupchatmsg';
import { useUserInfoStore } from '../../../store/userInfo.pinia';

interface IProps {
    chatRoomId: string | number;
    chatRoomName: string;
    avatar?: string | null;
    status: number;  // 0 - 处理中  1 - 已允许  2 - 已拒绝
    type: number;    // 0 - 由群主发起的群聊邀请->群聊的makerUserId为fromUserId  1 - 由用户发起的加群请求->群聊的makerUserId为toUserId
    requestId: string | number;
    fromUserId: number | string;
    toUserId: number | string;
}
const props = withDefaults(defineProps<IProps>(), {
    avatar: '',
});
const { userInfo } = useUserInfoStore();

/**
 * 1. 群主发起的群聊邀请 && 我是群主 -> ta同意/拒绝/正在处理你的群聊邀请
 * 2. 群主发起的群聊邀请 && 我是用户 -> 按钮 ｜ 您已同意/拒绝了群主的群聊邀请
 * 3. 用户发起的加群请求 && 我是群主 -> 按钮 ｜ 您已同意/拒绝了ta的群聊申请
 * 4. 用户发起的加群请求 && 我是用户 -> 群主同意/拒绝/正在处理你的群聊申请
 */
const textEnum = {
    'status-invite-iAm-leader': {
        'allowed': 'ta同意了你的群聊邀请',
        'rejected': 'ta拒绝了你的群聊邀请',
        'pending': 'ta正在处理你的群聊邀请',
    },
    'status-invite-iAm-normalUser': {
        'allowed': '您已经同意了群主的群聊邀请',
        'rejected': '您已经拒绝了群主的群聊邀请',
        'pending': null
    },
    'status-request-iAm-leader': {
        'allowed': '您已经同意了ta的群聊申请',
        'rejected': '您已经拒绝了ta的群聊申请',
        'pending': null
    },
    'status-request-iAm-normalUser': {
        'allowed': '群主同意了你的群聊申请',
        'rejected': '群主拒绝了你的群聊申请',
        'pending': '群主正在处理你的群聊申请',
    }
}

const getTypeText = () => {
    let key: 'allowed' | 'rejected' | 'pending' | null = null;
    if(props.status === 0) key = 'pending';
    if(props.status === 1) key = 'allowed';
    if(props.status === 2) key = 'rejected';
    if(userInfo?.id == props.fromUserId && props.type === 0) {
        // 群主发起的群聊邀请 && 我是群主
        return textEnum['status-invite-iAm-leader'][key!];
    }
    if(userInfo?.id != props.fromUserId && props.type === 0) {
        // 群主发起的群聊邀请 && 我是用户
        return textEnum['status-invite-iAm-normalUser'][key!];
    }
    if(userInfo?.id == props.toUserId && props.type === 1) {
        // 用户发起的加群请求 && 我是群主
        return textEnum['status-request-iAm-leader'][key!];
    }
    if(userInfo?.id != props.toUserId && props.type === 1) {
        // 用户发起的加群请求 && 我是用户
        return textEnum['status-request-iAm-normalUser'][key!];
    }
}

const emit = defineEmits(['updateRequest']);

const imageUrl = computed(() => {
    return normalImageUrl + props.avatar
});

const handleGroupChatRequest = async (status: number) => {
    let userId: number | string = '';
    if(props.type === 0) userId = props.toUserId;
    if(props.type === 1) userId = props.fromUserId;
    const { code, data, msg } = await addChatGroupRoomApi({
        status,
        chatRoomId: props.chatRoomId,
        requestId: props.requestId,
        userId
    });
    if(code !== 200) {
        window.$message.warning(msg || '操作失败！', { closable: true });
        return;
    }
    data && window.$message.success(msg || '操作成功！', { closable: true });
    emit('updateRequest');
}

</script>

<template>
    <div class="group-request-card">
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
        <div class="request-status">
            <div v-if="getTypeText() === null">
                <n-button tertiary type="primary" @click="() => handleGroupChatRequest(1)">
                    同意
                </n-button>
                <n-button tertiary type="error" @click="() => handleGroupChatRequest(2)">
                    拒绝
                </n-button>
            </div>
            <div v-else>
                {{ getTypeText() }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";

.group-request-card {
    width: px2vw(700);
    margin: px2vw(20);
    background-color: #f2f2f2;
    .group-chat-info {
        display: flex;
    }
}
</style>