<script setup lang="ts">
import { NDivider, NSelect, NButton, NInput, NFormItem, NGradientText, UploadFileInfo, NUpload } from 'naive-ui';
import { ref } from 'vue';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import { createNewGroupChatApi, getAllFriendChatGroupByConditionApi, IGroupChatRoom } from '../../../api/groupchatmsg';
import GroupChatCard from '../component/GroupChatCard.vue';
import { normalImageRequest } from '../../../constant/request';

const makeGroupChatFormData = ref<{ chatRoomName: string; humanIds: (string | number)[]; avatar: string | null; }>({
    chatRoomName: '',
    humanIds: [],
    avatar: null
})
const searchGroupChatFormData = ref({
    id: null,
    chatRoomName: '',
});
const { userFriendList, userInfo } = useUserInfoStore();

const myFriends = ref(userFriendList?.map(it => {
    let userId: string | null = null;
    if(it.userId != userInfo?.id) userId = it.userId;
    else userId = it.friendId;
    return {
        label: 'nickname: ' + it.friendNickname + ' - id: ' + userId,
        value: userId
    }
}));
const searchedGroupChatList = ref<IGroupChatRoom[]>([]);

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
    if (!searchGroupChatFormData.value.id && searchGroupChatFormData.value.chatRoomName === '') {
        window.$message.warning('请输入群聊名字或者id！', { closable: true })
        return;
    }
    const params: { id?: number | string; chatRoomName?: string } = {};
    if (searchGroupChatFormData.value.id) params.id = searchGroupChatFormData.value.id;
    if (searchGroupChatFormData.value.chatRoomName) params.chatRoomName = searchGroupChatFormData.value.chatRoomName;
    const { code, data, msg } = await getAllFriendChatGroupByConditionApi(params);
    if (code !== 200 || !data) {
        window.$message.warning(msg || '查询失败！', { closable: true });
        return;
    }
    searchedGroupChatList.value = data.filter(it => {
        const hasIncludedIds: (string | number)[] = JSON.parse(it.humanIds);
        const userId = userInfo?.id || '';
        if (hasIncludedIds.includes(userId.toString()) || hasIncludedIds.includes(~~userId)) return false;
        return true;
    });
}

const handleImageUploadFinish = ({
    // @ts-ignore
    file,
    event
}: {
    file: UploadFileInfo
    event?: ProgressEvent
}) => {
    let resp = JSON.parse((event?.target as XMLHttpRequest).response);
    if (resp.code === 200 && resp.data) {
        makeGroupChatFormData.value.avatar = resp.data;
    }
    else if (resp?.msg === 'File too large') {
        window.$message.warning("文件过大，请重新上传", { closable: true });
    }
    else {
        window.$message.warning(resp?.msg || "上传失败，请重新上传", { closable: true });
    }
}

const imageExt = ["image/jpg", "image/tiff", "image/gif", "image/svg", "image/jfif", "image/webp", "image/png", "image/bmp", "image/jpeg", "image/x-icon"];
const beforeImageUpload = (data: {
    file: UploadFileInfo
    fileList: UploadFileInfo[]
}) => {
    if (!imageExt.includes(data.file.file?.type || "")) {
        window.$message.warning('只能上传图片文件，请重新上传', { closable: true })
        return false
    }
    return true
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
                <n-form-item>
                    <n-upload :action="normalImageRequest" list-type="image-card" @finish="handleImageUploadFinish"
                        @before-upload="beforeImageUpload" :max="1">
                        点击上传头像
                    </n-upload>
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
                <GroupChatCard v-for="item in searchedGroupChatList" :key="item.id" :chatRoomId="item.id"
                    :chatRoomName="item.chatRoomName" :avatar="item.avatar" :toUserId="item.makerUserId"
                    :fromUserId="userInfo?.id!" />
                <p>
                    <n-gradient-text type="primary" v-if="searchedGroupChatList && searchedGroupChatList.length === 0">
                        Null~
                    </n-gradient-text>
                </p>

            </div>
        </div>
    </div>
</template>

<style lang="scss"></style>