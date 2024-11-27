<script lang="ts" setup>
import { NGradientText } from 'naive-ui';
import { ref } from 'vue';
import { getAllChatGroupRequestByConditionApi, IChatGroupRequest } from '../../../api/groupchatmsg';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import GroupRequestCard from '../component/GroupRequestCard.vue';

const pendingRequest = ref<IChatGroupRequest[]>([]);
const resolvedRequest = ref<IChatGroupRequest[]>([]);
const { userInfo } = useUserInfoStore();

async function init() {
    const { code, data, msg } = await getAllChatGroupRequestByConditionApi({ fromUserId: (userInfo?.id || '').toString() });
    if(code !== 200 || !data) {
        window.$message.warning(msg || '获取数据失败！', { closable: true });
        return;
    }
    pendingRequest.value = data.filter(it => it.status === 0);
    resolvedRequest.value = data.filter(it => it.status === 1 || it.status === 2);
}

init();

</script>

<template>
    <div class="group-request-from-me-container">
        <div class="pending-request">
            <n-gradient-text type="info">
                ta待处理的群聊请求
            </n-gradient-text>
            <GroupRequestCard v-for="item in pendingRequest" @updateRequest="init()" :chatRoomId="item.chatRoomId" :chatRoomName="item.chatRoomName" :status="item.status!" :type="item.type!" :requestId="item.id!" :fromUserId="item.fromUserId" :toUserId="item.toUserId!" cardType="request-from-me" />
        </div>
        <div class="complete-request">
            <n-gradient-text type="info">
                ta已完成的群聊请求
            </n-gradient-text>
            <GroupRequestCard v-for="item in resolvedRequest" :chatRoomId="item.chatRoomId" :chatRoomName="item.chatRoomName" :status="item.status!" :type="item.type!" :requestId="item.id!" :fromUserId="item.fromUserId" :toUserId="item.toUserId!" cardType="request-from-me" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";

</style>