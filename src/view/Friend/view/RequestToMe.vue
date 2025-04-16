<script lang="ts" setup>
import { NGradientText } from 'naive-ui';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import { getAllRequestToMe } from '../../../api/friend';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import FriendRequestCard from '../component/FriendRequestCard.vue';
import { handleFriendRequestToProps } from '../utils/handleFriendRequest';
import { IFriendRequest } from '../utils/handleFriendRequest';

const { userInfo } = storeToRefs(useUserInfoStore())
const pendingRequest = ref<IFriendRequest[]>([])
const completedRequest = ref<IFriendRequest[]>([])

const init = async () => {
    if (!userInfo.value?.id) {
        window.$message.warning("请先登录", { closable: true })
        return
    }
    const { code, data } = await getAllRequestToMe({ toUserId: userInfo.value.id });
    if (code !== 200) {
        window.$message.warning('请重新获取！', { closable: true })
        return
    }
    const res = handleFriendRequestToProps(data)
    pendingRequest.value = res.pendingRequest;
    completedRequest.value = res.completedRequest;
}

init()

const handleFriendRequest = (requestId: number, isDispose: number) => {
    const tmp = pendingRequest.value.find(it => it.requestId == requestId) as unknown as IFriendRequest
    tmp.isDispose = isDispose
    pendingRequest.value = pendingRequest.value.filter(it => it.requestId !== requestId)
    completedRequest.value.push(tmp)
}
</script>

<template>
    <div class="request-to-me-container">
        <div class="pending-request">
            <n-gradient-text type="info">
                您待处理的好友请求
            </n-gradient-text>
            <FriendRequestCard @handleFriendRequest="handleFriendRequest" v-for="item in pendingRequest" :props="{ ...item, type: 'requestToMe' }"
                :key="item.requestId" />
        </div>
        <div class="complete-request">
            <n-gradient-text type="info">
                您已完成的好友请求
            </n-gradient-text>
            <FriendRequestCard @handleFriendRequest="handleFriendRequest" v-for="item in completedRequest" :props="{ ...item, type: 'requestToMe' }"
                :key="item.requestId" />
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";

.request-to-me-container {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .pending-request,
    .complete-request {
        background: var(--n-color);
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }

        .n-gradient-text {
            display: block;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
        }
    }

    .pending-request {
        border-left: 4px solid #18a058;
    }

    .complete-request {
        border-left: 4px solid #2080f0;
        opacity: 0.8;
    }
}
</style>