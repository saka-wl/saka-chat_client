<script lang="ts" setup>
import { computed } from 'vue';
import { normalImageUrl } from '../../../constant/request';
import { NButton } from 'naive-ui';
import { addChatGroupRoomApi } from '../../../api/groupchatmsg';

interface IProps {
    chatRoomId: string | number;
    chatRoomName: string;
    avatar?: string | null;
    status: number;  // 0 - 处理中  1 - 已允许  2 - 已拒绝
    type: number;    // 0 - 群聊邀请用户  1 - 用户申请主动加入群聊
    requestId: string | number;
    fromUserId: number | string;
    toUserId: number | string;
    cardType: 'mine-invite-others' | 'others-request-me';

}
const props = withDefaults(defineProps<IProps>(), {
    avatar: '',
});

console.log(props);

const emit = defineEmits(['updateRequest']);

const imageUrl = computed(() => {
    return normalImageUrl + props.avatar
});

const textRecord = {
    'mine-invite-others-allowed': 'ta同意了加入该群的请求～',
    'mine-invite-others-refused': 'ta拒绝了加入该群的请求～',
    'mine-invite-others-pending': 'ta正在处理请求～',
    'others-request-me-allowed': '您同意了该群聊的请求',
    'others-request-me-refused': '您拒绝了该群聊的请求'
}

const getTextRecord = (status: number, type: number) => {
    if(props.cardType === 'mine-invite-others') {
        if(status === 0) return textRecord['mine-invite-others-pending'];
        if(status === 1) return textRecord['mine-invite-others-allowed'];
        if(status === 2) return textRecord['mine-invite-others-refused'];
    }else{
        if(status === 1) return textRecord['others-request-me-allowed'];
        if(status === 2) return textRecord['others-request-me-refused'];
    }
}

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
            <!--处理中 -->
            <div v-if="props.status === 0 && props.cardType === 'others-request-me'">
                <n-button tertiary type="primary" @click="() => handleGroupChatRequest(1)">
                    同意
                </n-button>
                <n-button tertiary type="error" @click="() => handleGroupChatRequest(2)">
                    拒绝
                </n-button>
            </div>
            <!-- 已允许 || 已拒绝 -->
            <div v-else>
                {{ getTextRecord(props.status, props.type) }}
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