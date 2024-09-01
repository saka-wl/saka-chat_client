
<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { NButton } from 'naive-ui';
import { IFileSlice, useLargeUploadFile } from '../../utils/file';
import { addFileChunkApi, editNewFileInfoApi } from '../../api/file';
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../store/userInfo.pinia';

/**
 * 0 -> 刚开始状态；1 -> 文件正在分片；
 * 2 -> 文件分片成功；3 -> 正在上传；
 * 4 -> 上传暂停；
 */
const fileInputStaus = ref<number>(0);
const { userInfo } = storeToRefs(useUserInfoStore());
interface IFileInfo {
    id: string;
    fileId: string;
    fileName: string;
    fileSliceInfo: IFileSlice[];  // 文件分片信息
    hasUploadedHash: string[];
    needUploadedHash: string[];
}
let fileInfo: IFileInfo | null = null;
const fileUploadProcess = ref<number>(0);

const fileInit = () => {
    fileInputStaus.value = 0;
    fileUploadProcess.value = 0;
    fileInfo = null;
}

const handleUploadFile = async (e: Event) => {
    fileInit();
    fileInputStaus.value = 1;
    // 处理文件分片
    const { fileSliceInfo, ... params } = await useLargeUploadFile(e.target?.files[0]);
    const { id, needUploadedHash } = await editNewFileInfoApi({ ...params, ownUserId: userInfo.value?.id || '0' });
    if(needUploadedHash && needUploadedHash.length === 0) {
        window.$message.success("文件上传完成!", { closable: true });
        fileInit();
        return;
    }
    fileInfo = {
        id,
        fileId: params.fileId,
        fileName: params.fileName,
        fileSliceInfo,
        needUploadedHash: needUploadedHash || fileSliceInfo.map(it => it.hash),
        hasUploadedHash: [],
    }
    // 文件前后端分片信息处理完成
    fileInputStaus.value = 2;
    window.$message.success("文件分片完成，可以上传文件!", { closable: true });
    console.log("文件分片信息：");
    console.log(fileInfo);
}

/**
 * TODO 点击暂停，恢复速度过快问题
 */
const fileUpload = async () => {
    if(fileInputStaus.value === 0 || fileInputStaus.value === 1 || fileInputStaus.value === 3 || !fileInfo) {
        window.$message.warning("文件还未分片成功或正在上传文件！", { closable: true });
        return;
    }
    if(fileInputStaus.value === 4) {
        // 需要等待？ - 点击暂停，恢复速度过快问题
        window.$message.warning("文件恢复上传成功！", { closable: true });
    }
    fileInputStaus.value = 3;
    for(let chunkHash of fileInfo.needUploadedHash) {
        if(fileInputStaus.value === 4) {
            // 文件上传暂停
            return;
        }
        let item = fileInfo.fileSliceInfo.find(it => it.hash === chunkHash);
        const resp = await addFileChunkApi(item?.content as File, fileInfo.id, chunkHash, fileInfo.fileId);
        if(resp && typeof resp === 'string') {
            fileUploadProcess.value = 100;
            window.$message.success("文件上传完成！", { closable: true });
            await nextTick();
            fileInit();
            return;
        }else if(resp && resp.length > 0) {
            fileInfo.needUploadedHash = fileInfo.needUploadedHash.filter(it => it !== chunkHash);
            fileInfo.hasUploadedHash.push(chunkHash);
            fileUploadProcess.value = fileUploadProcess.value + Math.floor(1 / (fileInfo.needUploadedHash.length + fileInfo.hasUploadedHash.length));
        }
    }
    
}

const fileStopUpload = () => {
    fileInputStaus.value = 4;
}

const fileDeleteUpload = () => {
    fileInit();
}
</script>

<template>
    <div class="file-upload-container">
        <input type="file" @change="handleUploadFile" />
        <div class="file-process">
            {{ fileUploadProcess }}
        </div>
        <n-button type="info" @click="fileUpload">
            开始/继续上传
        </n-button>
        <n-button type="warning" @click="fileStopUpload">
            暂停上传
        </n-button>
        <n-button type="error" @click="fileDeleteUpload">
            重新上传
        </n-button>
    </div>
</template>

<style scoped lang="scss">

</style>