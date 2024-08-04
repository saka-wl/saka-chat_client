<script lang="ts" setup>
import { NGradientText } from 'naive-ui';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import { getAllRequestFromMe } from '../../../api/friend';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import FriendRequestCard from '../component/FriendRequestCard.vue';
import { handleFriendRequestToProps, IFriendRequest } from '../utils/handleFriendRequest';

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
    <div class="request-from-me-container">
        <div class="pending-request">
            <n-gradient-text type="info">
                ta待处理的好友请求
            </n-gradient-text>
            <FriendRequestCard @handleFriendRequest="handleFriendRequest" v-for="item in pendingRequest"
                :props="{ ...item, type: 'requestFromMe' }" :key="item.requestId" />
        </div>
        <div class="complete-request">
            <n-gradient-text type="info">
                ta已完成的好友请求
            </n-gradient-text>
            <FriendRequestCard @handleFriendRequest="handleFriendRequest" v-for="item in completedRequest"
                :props="{ ...item, type: 'requestFromMe' }" :key="item.requestId" />
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
</style>