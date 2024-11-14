<script setup lang="ts">
import { NDivider, NSelect, NButton, NInput, NFormItem, NGradientText } from 'naive-ui';
import { ref } from 'vue';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import { createNewGroupChatApi } from '../../../api/groupchatmsg';
import GroupChatCard from '../component/groupChatCard.vue';

const makeGroupChatFormData = ref<{ chatRoomName: string, humanIds: (string | number)[] }>({
    chatRoomName: '',
    humanIds: [],
})
const searchGroupChatFormData = ref({
    id: null,
    chatRoomName: '',
});
const { userFriendList, userInfo } = useUserInfoStore();

const myFriends = ref(userFriendList?.map(it => {
    return {
        label: 'nickname: ' + it.friendNickname + ' - id: ' + it.id,
        value: it.id
    }
}))

const createGroupChat = async () => {
    if (makeGroupChatFormData.value.chatRoomName === '' || makeGroupChatFormData.value.humanIds.length < 3) {
        window.$message.warning('请输入群聊名字，并且至少选择三个好友！', { closable: true })
        return;
    }
    const { code, data, msg } = await createNewGroupChatApi({
        ...makeGroupChatFormData.value,
        makerUserId: userInfo?.id!,
        humanNumber: makeGroupChatFormData.value.humanIds.length
    });
    if (code === 200 && data.id) {
        window.$message.success(data.chatRoomName + '创建成功！', { closable: true })
    } else {
        window.$message.warning(msg || '创建失败！', { closable: true })
    }
}

const searchGroupChat = async () => {

}

</script>

<template>
    <div class="group-search-container">
        <n-divider title-placement="left">
            创建群聊
        </n-divider>
        <div class="make-group-chat-content">
            <n-form ref="makeGroupChatFormRef" inline :label-width="80" :model="makeGroupChatFormData" size="medium">
                <n-form-item label="群聊的名字" path="chatRoomName">
                    <n-input v-model:value="makeGroupChatFormData.chatRoomName" placeholder="输入群聊的名字"
                        style="max-width: 50%;" />
                </n-form-item>
                <n-form-item label="选择好友" :width="200">
                    <n-select v-model:value="makeGroupChatFormData.humanIds" multiple :options="myFriends"
                        style="max-width: 50%;" />
                </n-form-item>
            </n-form>
            <n-button attr-type="button" @click="createGroupChat">
                Create Now!
            </n-button>
        </div>
        <n-divider title-placement="left">
            加入群聊
        </n-divider>
        <div class="search-group-chat-content">
            <n-form ref="createGroupChatFormRef" inline :label-width="80" :model="searchGroupChatFormData"
                size="medium">
                <n-form-item label="通过群聊的名字搜索" path="nickname">
                    <n-input v-model:value="searchGroupChatFormData.chatRoomName" placeholder="输入群聊的名字"
                        style="max-width: 50%;" />
                </n-form-item>
                <n-form-item label="通过群聊id搜索" :width="200">
                    <n-input v-model:value="searchGroupChatFormData.id" style="max-width: 50%;" />
                </n-form-item>
            </n-form>
            <n-button attr-type="button" @click="searchGroupChat">
                Search Now!
            </n-button>
            <div class="search-group-chat-result">
                <n-gradient-text type="success">
                    结果
                </n-gradient-text>
                <GroupChatCard chatRoomName="1111" id="111" />
            </div>
        </div>
    </div>
</template>

<style lang="scss"></style>