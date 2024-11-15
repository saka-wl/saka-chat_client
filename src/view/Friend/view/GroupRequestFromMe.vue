<script lang="ts" setup>
import { NGradientText } from 'naive-ui';
import { ref } from 'vue';
import { getAllChatGroupRequestByConditionApi, IChatGroupRequest } from '../../../api/groupchatmsg';
import { useUserInfoStore } from '../../../store/userInfo.pinia';

const pendingRequest = ref<IChatGroupRequest[]>([]);
const resolvedRequest = ref<IChatGroupRequest[]>([]);
const { userInfo } = useUserInfoStore();

async function init() {
    const { code, data, msg } = await getAllChatGroupRequestByConditionApi({ fromUserId: (userInfo?.id || '').toString() });
    if(code !== 200 || !data) {
        window.$message.warning(msg || '获取数据失败！', { closable: true });
        return;
    }
    console.log(data);
}

init();

</script>

<template>
    <div class="group-request-from-me-container">
        <div class="pending-request">
            <n-gradient-text type="info">
                群主待处理的群聊请求
            </n-gradient-text>
        </div>
        <div class="complete-request">
            <n-gradient-text type="info">
                群主已完成的群聊请求
            </n-gradient-text>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";

</style>