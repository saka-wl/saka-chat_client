<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NProgress, NCheckbox } from 'naive-ui';
import { handleFileChunkUpload, IFileInfo, useLargeUploadFile } from '../../utils/file';
import { editNewFileInfoApi, IVideoPreviewPic, videoPreviewPicApi } from '../../api/file';
import { storeToRefs } from 'pinia';
import { socket } from '../../utils/socket';
import { AUTHORIZATION } from '../../constant/request';
import { useUserInfoStore } from '../../store/userInfo.pinia';
import { getVideoFrame } from '../../utils/video';
import { VIDEO_FRAME_SLICE_TIME } from '../../constant/file';

/**
 * 0 -> 刚开始状态；1 -> 文件正在分片；
 * 2 -> 文件分片成功；3 -> 正在上传；
 * 4 -> 上传暂停；
 */
const fileInputStaus = ref<number>(0);
const { userInfo } = storeToRefs(useUserInfoStore());
const props = defineProps<{
    friendId: String;
    chatRoomId: String;
}>();
let fileInfo: IFileInfo | null = null;
const fileUploadProcess = ref<number>(0);
const isNeedPreviewPic = ref<boolean>(false);
let fileType = 'file';

const fileInit = () => {
    fileInputStaus.value = 0;
    fileUploadProcess.value = 0;
    fileInfo = null;
}

const fileUploadFinished = (fileId = fileInfo?.id) => {
    if(!fileId) {
        return;
    }
    window.$message.success("文件上传完成!", { closable: true });
    socket.emit('sendMsgToFriend', {
        userId: userInfo.value?.id,
        friendId: props.friendId,
        token: localStorage.getItem(AUTHORIZATION),
        message: fileId.toString(),
        chatRoomId: props.chatRoomId,
        messageType: fileType,
    });
    fileInit();
}

const handleUploadFile = async (e: any) => {
    fileInit();
    fileInputStaus.value = 1;
    if(!e.target?.files || !e.target?.files[0]) {
        fileInputStaus.value = 0;
        return;
    }
    if(e.target.files[0].name.endsWith('.mp4')) {
        fileType = 'video';
    }
    // 处理文件分片
    const { fileSliceInfo, ...params } = await useLargeUploadFile(e.target?.files[0]);
    // 生成视频的图片帧
    let videoFrame: string | IVideoPreviewPic[] = await getVideoFrame(e.target?.files[0], VIDEO_FRAME_SLICE_TIME);
    if(typeof videoFrame === 'string') {
        window.$message.warning(videoFrame, { closable: true });
        videoFrame = []
    } else {
        // 无需等待
        videoPreviewPicApi(videoFrame);
    }

    const { id, needUploadedHash } = await editNewFileInfoApi({ ...params, ownUserId: userInfo.value?.id || '0', videoPreview: JSON.stringify(videoFrame.map(it => it.hash)) });
    if (needUploadedHash) fileUploadProcess.value = Math.floor((fileSliceInfo.length - needUploadedHash.length) * 100 / fileSliceInfo.length);
    fileInfo = {
        id,
        fileId: params.fileId,
        fileName: params.fileName,
        fileSliceInfo,
        needUploadedHash: needUploadedHash || fileSliceInfo.map(it => it.hash),
        hasUploadedHash: [],
        videoPreview: videoFrame.map(it => it.hash),
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
    if (fileInputStaus.value === 0 || fileInputStaus.value === 1 || fileInputStaus.value === 3 || !fileInfo) {
        window.$message.warning("文件还未分片成功或正在上传文件！", { closable: true });
        return;
    }
    if (fileInputStaus.value === 4) {
        // 需要等待？ - 点击暂停，恢复速度过快问题
        window.$message.warning("文件恢复上传成功！", { closable: true });
    }
    fileInputStaus.value = 3;
    if(fileInfo.needUploadedHash.length === 0) {
        window.$message.success('点击 <send> 将文件发送给用户吧～', { closable: true });
        return;
    }
    for (let chunkHash of fileInfo.needUploadedHash) {
        if (fileInputStaus.value === 4) {
            // 文件上传暂停
            return;
        }
        const resp = await handleFileChunkUpload(
            fileInfo as IFileInfo, 
            chunkHash, 
            (value: number) => {
                fileUploadProcess.value = Math.min(100, fileUploadProcess.value + value)
            },
            fileInit
        );
        if(typeof resp === 'string') {
            window.$message.success('点击 <send> 将文件发送给用户吧～', { closable: true });
            // 文件上传完成！发送消息
            break;
        }
        fileInfo = resp;
    }
}

const fileStopUpload = () => {
    fileInputStaus.value = 4;
}

const fileDeleteUpload = () => {
    fileInit();
}

defineExpose({
    fileUploadFinished
})

</script>

<template>
    <div class="file-upload-container">
        <input class="file-input" type="file" @change="handleUploadFile" />
        <n-checkbox v-model:checked="isNeedPreviewPic" class="input-checkbox">
            生成预览图片
        </n-checkbox>
        <div>
            <div class="file-process">
            <n-progress 
                type="line" 
                :percentage="fileUploadProcess" 
                indicator-placement="inside" 
                v-if="fileInputStaus !== 0 && fileInputStaus !== 1"
                style="width: 200px;" 
            />
            </div>
            <n-button 
                type="info" 
                @click="fileUpload" 
                size="small" 
                v-if="fileInputStaus === 4 || fileInputStaus === 2"
            >
                开始/继续上传
            </n-button>
            <n-button
                type="warning" 
                @click="fileStopUpload" 
                size="small" 
                v-if="fileInputStaus === 3"
            >
                暂停上传
            </n-button>
            <n-button type="error" @click="fileDeleteUpload" size="small" v-if="fileInputStaus !== 0">
                重新上传
            </n-button>
        </div>

    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
.file-upload-container {
    margin: px2vw(15);
    .input-checkbox {
        margin-left: px2vw(20);
    }
    .file-input {
        outline: none;
        background-color: #0a0a23;
        color: #fff;
        border: none;
        border-radius: px2vw(5);
        padding: px2vw(3);
        height: px2vw(32);
        width: px2vw(180);
        font-size: px2vw(12);
    }
    .file-process {
        font-size: 12px;
    }
}
</style>