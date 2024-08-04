<script lang="ts" setup>
import { NGradientText } from 'naive-ui';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import { getAllRequestFromMe } from '../../../api/friend';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import FriendRequestCard from '../component/FriendRequestCard.vue';

export interface IFriendRequest {
    requestId: number;
    toUserId: string;
    requestMessage: string;
    isDispose: number;
    createdAt: string;
    toUserAccount: string;
    toUserNickname: string;
    toUserAvatar: string;
}

const { userInfo } = storeToRefs(useUserInfoStore())
const pendingRequest = ref<IFriendRequest[]>([])
const completedRequest = ref<IFriendRequest[]>([])

const init = async () => {
    if (!userInfo.value?.id) {
        window.$message.warning("请先登录", { closable: true })
        return
    }
    const { code, data } = await getAllRequestFromMe({ fromUserId: userInfo.value.id });
    if (code !== 200) {
        window.$message.warning('请重新获取！', { closable: true })
        return
    }
    let pendingRequestTmp = []
    let pendingRequestIndex = 0
    let completedRequestTmp = []
    let completedRequestIndex = 0
    for (let i = 0; i < data.length; i++) {
        const tmp = {
            requestId: data[i].requestInfo.id,
            toUserId: data[i].requestInfo.toUserId,
            requestMessage: data[i].requestInfo.requestMessage,
            isDispose: data[i].requestInfo.isDispose,
            createdAt: data[i].requestInfo.createdAt,
            toUserAccount: data[i].toUserInfo.account,
            toUserNickname: data[i].toUserInfo.nickname,
            toUserAvatar: data[i].toUserInfo.avatar
        }
        if (tmp.isDispose === 0)
            pendingRequestTmp[pendingRequestIndex ++] = tmp;
        else
            completedRequestTmp[completedRequestIndex ++] = tmp;
        pendingRequest.value = pendingRequestTmp;
        completedRequest.value = completedRequestTmp;
    }
}
init()
</script>

<template>
    <div class="request-from-me-container">
        <div class="pending-request">
            <n-gradient-text type="info">
                您待处理的好友请求
            </n-gradient-text>
            <FriendRequestCard v-for="item in pendingRequest" :props="{ ... item, type: 'requestFromMe' }" :key="item.requestId" />
        </div>
        <div class="complete-request">
            <n-gradient-text type="info">
                您已完成的好友请求
            </n-gradient-text>
            <FriendRequestCard v-for="item in completedRequest" :props="{ ... item, type: 'requestToMe' }" :key="item.requestId" />
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
</style>