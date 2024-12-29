<template>
    <div class="md-file-edit-container">
        <div class="collaborate-choose" v-if="!mdFileInfo.id">
            <p>选择你的文档协作者：</p>
            <n-select v-model:value="mdFileInfo.collaborateUserIds" multiple :options="myFriends"
                style="max-width: 50%;" />
        </div>
        <n-form-item label="文档标题">
            <n-input v-model:value="mdFileInfo.fileTitle" style="width: 400px;"></n-input>
        </n-form-item>
        <div id="markdown-editor" ref='mdEditorRef'></div>
        <n-button type="primary" @click="mdFileSubmit" style="margin-top: 20px;margin-bottom: 100px;">提交</n-button>
        <n-upload :action="normalImageRequest" ref="imageUploadRef" list-type="image-card" @finish="handleImageUploadFinish" :max="1" v-show="false" id="md-image-upload">
            点击上传头像
        </n-upload>
    </div>
</template>

<script lang="ts" setup>
// 控制台运行：  PORT=3005 npx y-websocket
// import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
import { ref } from 'vue';
import { createMdFileApi } from "../../../api/markdown";
import { NFormItem, NInput, NSelect, NButton } from "naive-ui";
import { useUserInfoStore } from "../../../store/userInfo.pinia";
import { normalImageRequest } from "../../../constant/request";
import { NUpload } from 'naive-ui';
import { type IMdFileInfoEdit, useMdFile } from '../utils/useMdFile';
import { useRouter } from 'vue-router';

const { userFriendList, userInfo } = useUserInfoStore();

const router = useRouter();

const mdFileInfo = ref<IMdFileInfoEdit>({
    id: null,
    collaborateUserIds: null,
    ownUserId: null,
    fileTitle: null,
});
const myFriends = ref(userFriendList?.map(it => {
    let userId: string | null = null;
    if(it.userId != userInfo?.id) userId = it.userId;
    else userId = it.friendId;
    return {
        label: 'nickname: ' + it.friendNickname + ' - id: ' + userId,
        value: userId
    }
}));

const { 
    mdEditorRef, 
    imageUploadRef, 
    handleImageUploadFinish, 
    getQuillValue,
} = useMdFile();

const mdFileSubmit = async () => {
    if(!mdFileInfo.value!.ownUserId) mdFileInfo.value!.ownUserId = userInfo?.id!;
    // 新建
    const {code} = await createMdFileApi({
        ownUserId: mdFileInfo.value.ownUserId,
        collaborateUserIds: mdFileInfo.value.collaborateUserIds as string[],
        fileTitle: mdFileInfo.value.fileTitle || '',
        fileContent: JSON.stringify(getQuillValue().getContents())
    });
    (code === 200) && window.$message.success('创建成功');
}
</script>

<style lang="scss">
@import url('./md-editor.scss');
.collaborate-choose {
    margin: px2vw(10);
    margin-left: 0;
}
</style>