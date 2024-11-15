<script lang="ts" setup>
import { computed } from 'vue';
import { normalImageUrl } from '../../../constant/request';
import { NButton } from 'naive-ui';

interface IProps {
    chatRoomId: string | number;
    chatRoomName: string;
    avatar: string | null;
    status: number;  // 0 - 处理中  1 - 已允许  2 - 已拒绝
    type: number;    // 0 - 群聊邀请用户  1 - 用户申请主动加入群聊
}
const props = withDefaults(defineProps<IProps>(), {
    avatar: '',
});

const imageUrl = computed(() => {
    return normalImageUrl + props.avatar
});

const textRecord = {
    'group-allowed': '您已同意了该群聊的邀请',
    'group-rejected': '您已拒绝了该群聊的邀请',
    'user-allowed': 'ta同意了您的加群申请',
    'user-rejected': 'ta拒绝了您的加群申请',
}

const getTextRecord = (status: number, type: number) => {
    if(status === 1 && type === 0) return textRecord['group-allowed'];
    if(status === 2 && type === 0) return textRecord['group-rejected'];
    if(status === 1 && type === 1) return textRecord['user-allowed'];
    if(status === 2 && type === 1) return textRecord['user-rejected'];
}

const handleGroupChatRequest = async (status: number) => {

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
            <div v-if="props.status === 0">
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
    background-color: #f2f2f2;
    .group-chat-info {
        display: flex;
    }
}
</style>