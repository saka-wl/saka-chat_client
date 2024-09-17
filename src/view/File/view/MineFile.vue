
<script lang="ts" setup>
import { ref } from 'vue';
import { changeFileInfo, getFilesByCondition, IFileInfoApi } from '../../../api/file';
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import { NGradientText, NDivider, NButton } from 'naive-ui';
import LargeFileDownload from "../../../component/LargeFileDownload/index.vue";

const resultFiles = ref<IFileInfoApi[]>([]);
const { userInfo } = storeToRefs(useUserInfoStore());

async function init() {
    if(!userInfo.value?.id) {
        window.$message.warning('你还未登录', { closable: true });
        return;
    }
    let { code, data, msg } = await getFilesByCondition({
        ownUserId: userInfo.value.id
    }, undefined);
    if(code !== 200) return;
    data = data.filter((it: any) => it.status !== -1);
    data = data.map((it: any) => {
        it.videoPreview = JSON.parse(it.videoPreview);
        it.fileUploadInfo = JSON.parse(it.fileUploadInfo as unknown as string);
        return it;
    })
    resultFiles.value = data;
}

init();

const fileHidden = async (id: number, ownUserId: string) => {
    await changeFileInfo({ status: 0 }, { id: ~~id, ownUserId });
    resultFiles.value.forEach(it => {
        if(it.id == id) {
            it.status = 0
        }
    })
}

const fileDelete = async (id: number, ownUserId: string) => {
    await changeFileInfo({ status: -1 }, { id: ~~id, ownUserId });
    resultFiles.value = resultFiles.value.filter((it: any) => it.id != id);
}

const fileShow = async (id: number, ownUserId: string) => {
    await changeFileInfo({ status: 1 }, { id: ~~id, ownUserId });
    resultFiles.value.forEach(it => {
        if(it.id == id) {
            it.status = 1
        }
    })
}

const wordType = (type: number | string): {
    type: 'info' | 'warning';
    word: string;
} => {
    if(~~type === 1) {
        return {
            type: 'info',
            word: '正常的文件'
        };
    }else if(~~type === 0) {
        return {
            type: 'warning',
            word: '您已经隐藏该文件'
        };
    }
    return {
        type: 'warning',
        word: 'Null~'
    }
}
</script>

<template>
    <div class="mine-file-container">
        <n-divider title-placement="left">
            <n-gradient-text type="info">
                Mine Files
            </n-gradient-text>
        </n-divider>
        <div v-for="item in resultFiles" class="file-item">
            <n-gradient-text :type="wordType(item.status)?.type" class="file-item__word">
                {{ wordType(item.status)?.word }}
            </n-gradient-text>
            <n-button type="warning" @click="fileHidden(item?.id, item.ownUserId)" v-if="item.status == 1">文件隐藏</n-button>
            <n-button type="success" @click="fileShow(item?.id, item.ownUserId)" v-if="item.status == 0">显示文件</n-button>
            <n-button type="error" @click="fileDelete(item?.id, item.ownUserId)">文件删除</n-button>
            <LargeFileDownload :fileInfo="item" />
        </div>
        
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";
.file-item {
    &__word {
        margin: 0 px2vw(20);
    }
}
</style>