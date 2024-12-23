<template>
    <div class="md-file-container">
        <div class="left-banner">
            <NormalItem word="新建你的文档" type="icon-right" v-memo="[]" @click="createNewMdFile" />
            <NormalItem word="我的文档" type="icon-left" v-memo="[]"
                @click="isMineMdFilesListShow = !isMineMdFilesListShow" />
            <div class="mine-mdFile-list" :style="{ height: isMineMdFilesListShow ? '60%' : '0' }">
                <div class="mdFile-item" v-for="item in mineMdFileList" :key="item.id" @click="handleClickMdFile(item)">
                    《{{ item.fileTitle }}》
                </div>
            </div>
            <NormalItem word="协作文档" type="icon-left" v-memo="[]"
                @click="isMdFilesListShow = !isMdFilesListShow" />
            <div class="mine-mdFile-list" :style="{ height: isMdFilesListShow ? '60%' : '0' }">
                <div class="mdFile-item" v-for="item in collaborateFileList" :key="item.id" @click="handleClickMdFile(item)">
                    《{{ item.fileTitle }}》
                </div>
            </div>
        </div>
        <div class="right-content">
            <div class="collaborate-choose" v-if="!mdFileInfo.id">
                <p>选择你的文档协作者：</p>
                <n-select v-model:value="mdFileInfo.collaborateUserIds" multiple :options="myFriends"
                        style="max-width: 50%;" />
            </div>
            <n-form-item label="文档标题">
                <n-input :disabled="mdFileInfo.id" v-model:value="mdFileInfo.fileTitle" style="width: 400px;"></n-input>
            </n-form-item>
            <div class="collaborate-choose" v-if="!mdFileInfo.id">
                <p>选择你的文档协作者：</p>
                <n-select v-model:value="mdFileInfo.collaborateUserIds" multiple :options="myFriends"
                        style="max-width: 50%;" />
            </div>
            <Editor class="md-editor" :value="markdownContent" :locale="zhHans" :uploadImages="uploadImage" @change="handleMdFileChange" />
            <n-button type="primary" @click="mdFileSubmit" style="margin-top: 20px;margin-bottom: 100px;">提交</n-button>
        </div>
    </div>
</template>

<script setup lang="ts">

import { Editor } from "@bytemd/vue-next"; // 导入编辑器组件
import * as Y from 'yjs';   // 协同编辑算法库

import zhHans from "bytemd/lib/locales/zh_Hans.json"; // 汉化
import 'juejin-markdown-themes/dist/juejin.min.css'
import "bytemd/dist/index.css"; // 导入编辑器样式
import { ref } from 'vue';
import NormalItem from "../../../component/Card/NormalItem.vue";
import { changeMdFileApi, createMdFileApi, getMdFileContentApi, getMdFilesListApi, IMdFileInfo } from "../../../api/markdown";
import { NFormItem, NInput, NSelect, NButton } from "naive-ui";
import { useUserInfoStore } from "../../../store/userInfo.pinia";
import { uploadImageApi } from "../../../api/file";
import { normalImageUrl } from "../../../constant/request";

const ydoc = new Y.Doc();

const markdownContent = ref<string>('');
const isMineMdFilesListShow = ref(false);
const isMdFilesListShow = ref(false);
const { userFriendList, userInfo } = useUserInfoStore();
const mdFileInfo = ref<any>({
    id: null,
    collaborateUserIds: null,
    ownUserId: null,
    fileTitle: null,
});
const mineMdFileList = ref<IMdFileInfo[]>([]);
const collaborateFileList = ref<IMdFileInfo[]>([]);

const myFriends = ref(userFriendList?.map(it => {
    let userId: string | null = null;
    if(it.userId != userInfo?.id) userId = it.userId;
    else userId = it.friendId;
    return {
        label: 'nickname: ' + it.friendNickname + ' - id: ' + userId,
        value: userId
    }
}));

const handleMdFileChange = (val: string) => {
    markdownContent.value = val;
}

const createNewMdFile = async () => {
    mdFileInfo.value = {
        id: null,
        collaborateUserIds: null,
        ownUserId: userInfo?.id!,
        fileTitle: null,
    }
    markdownContent.value = '';
}

const uploadImage = async (image: File[]) => {
    const { code, data } = await uploadImageApi(image[0]);
    return [
        {
            title: data,
            url: normalImageUrl + data
        }
    ];
}

async function init() {
    mineMdFileList.value = [];
    collaborateFileList.value = [];
    const { code, data, msg } = await getMdFilesListApi({
        userId: userInfo?.id!.toString()!
    });
    if(code !== 200) {
        window.$message.warning(msg || '获取数据失败！');
        return;
    }
    for(const item of data) {
        if(item.ownUserId == userInfo?.id) {
            mineMdFileList.value?.push(item);
        }else{
            collaborateFileList.value?.push(item);
        }
    }
}

init();

const handleClickMdFile = async (item: IMdFileInfo) => {
    const { code, data, msg } = await getMdFileContentApi({ id: item.id });
    if(code !== 200) {
        window.$message.warning(msg || '获取数据失败！');
        return;
    }
    mdFileInfo.value.id = data.id;
    mdFileInfo.value.collaborateUserIds = JSON.parse(data.collaborateUserIds as string);
    mdFileInfo.value.fileTitle = data.fileTitle;
    mdFileInfo.value.ownUserId = data.ownUserId;
    markdownContent.value = data.fileContent;
}

const mdFileSubmit = async () => {
    if(!mdFileInfo.value!.ownUserId) mdFileInfo.value!.ownUserId = userInfo?.id!;
    if(!mdFileInfo.value.id) {
        // 新建
        const {code} = await createMdFileApi({
            ownUserId: mdFileInfo.value.ownUserId,
            collaborateUserIds: mdFileInfo.value.collaborateUserIds,
            fileTitle: mdFileInfo.value.fileTitle,
            fileContent: markdownContent.value
        });
        (code === 200) && window.$message.success('创建成功');
    }else{
        // 更新
        const {code} = await changeMdFileApi({
            id: mdFileInfo.value.id,
            fileTitle: mdFileInfo.value.fileTitle,
            fileContent: markdownContent.value
        });
        (code === 200) && window.$message.success('更新成功');
    }
    init();
}
</script>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
.md-file-container {
    display: flex;
    height: 100%;
    .left-banner {
        flex: 0 0 px2vw(250);
        height: 100%;
        // background-color: rgb(32, 67, 97);
        .mine-mdFile-list {
            background-color: rgb(228, 255, 255);
            transition: all .1s;
            overflow-y: scroll;
        }
        .mdFile-item {
            height: 30px;
            background-color: rgb(228, 255, 255);
            display: flex;
            align-items: center;
            padding: 5px;
            border-bottom: 1px solid rgb(236, 237, 237);
        }
    }
    .right-content {
        flex: 1 1;
        height: 100%;
        margin: 10px;
        .collaborate-choose {
            margin: px2vw(10);
            margin-left: 0;
        }
        .md-editor {
            :deep(.bytemd) {
                height: 700px;
            }
        }
    }
}
</style>