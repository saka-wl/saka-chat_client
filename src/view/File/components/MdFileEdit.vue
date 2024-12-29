<template>
    <div class="md-file-edit-container">
        <n-form-item label="文档标题">
            <n-input :disabled="true" v-model:value="mdFileInfo.fileTitle" style="width: 400px;"></n-input>
        </n-form-item>
        <n-button @click="connectSocketHandler">
            实时同步
        </n-button>
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
import { changeMdFileApi, getMdFileContentApi } from "../../../api/markdown";
import { NFormItem, NInput, NButton } from "naive-ui";
import { normalImageRequest } from "../../../constant/request";
import { NUpload } from 'naive-ui';
import { type IMdFileInfoEdit, useMdFile } from '../utils/useMdFile';
import { useRoute } from 'vue-router';
import { useUserInfoStore } from '../../../store/userInfo.pinia';

const route = useRoute();
const { userInfo } = useUserInfoStore();

const mdFileInfo = ref<IMdFileInfoEdit>({
    id: null,
    collaborateUserIds: null,
    ownUserId: null,
    fileTitle: null,
    fileContent: null,
});

const { 
    mdEditorRef, 
    imageUploadRef, 
    handleImageUploadFinish, 
    getQuillValue, 
    setQuillValue,
    connectSocket,
} = useMdFile();

async function init() {
    const id = route.query.id as string;
    const { code, data, msg } = await getMdFileContentApi({ id });
    if(code !== 200) {
        window.$message.warning(msg || '获取数据失败！');
        return;
    }
    mdFileInfo.value.id = data.id;
    mdFileInfo.value.collaborateUserIds = JSON.parse(data.collaborateUserIds as string);
    mdFileInfo.value.fileTitle = data.fileTitle;
    mdFileInfo.value.ownUserId = data.ownUserId;
    mdFileInfo.value.fileContent = data.fileContent;
    setQuillValue(JSON.parse(data.fileContent as string));
}

init();

const connectSocketHandler = () => {
    console.log(userInfo)
    connectSocket(mdFileInfo.value.id, userInfo?.nickname as string);
    setTimeout(() => {
        let content = getQuillValue().getContents().ops
        if(content.length === 0 || (content.length === 1 && content[0].insert === '\n'))
            setQuillValue(JSON.parse(mdFileInfo.value.fileContent as string));
    }, 500)
}

const mdFileSubmit = async () => {
    // 更新
    const {code} = await changeMdFileApi({
        id: mdFileInfo.value.id as string,
        fileTitle: mdFileInfo.value.fileTitle || '',
        fileContent: JSON.stringify(getQuillValue().getContents())
    });
    console.log(getQuillValue().getContents());
    ;(code === 200) && window.$message.success('更新成功');
}
</script>

<style lang="scss">
@import url('./md-editor.scss');
.collaborate-choose {
    margin: px2vw(10);
    margin-left: 0;
}
</style>