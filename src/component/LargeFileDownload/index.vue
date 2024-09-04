<script lang="ts" setup>
import { ref } from 'vue';
import { getFileChunkApi, IFileInfoApi } from '../../api/file';
import { NButton, NProgress } from 'naive-ui';
import { largeFileUrl } from '../../constant/request';
import { getFileExtName, jsonToObj } from '../../utils/format';
import { FILE_CHUNK_DOWNLOAD_AUTHORIZATION } from '../../constant/file';

const props = defineProps<{
    fileInfo: Partial<IFileInfoApi>
}>();

/**
 * 文件下载的模式
 * 0：普通模式下载
 * 1：切片模式下载 
 */
const fileDownloadType = ref<number>(0);

/**
 * 文件下载状态(用于切片下载模式)
 * 0：未开始
 * 1：下载中
 * 2：暂停下载
 */
const largeFileDownloadStatus = ref<number>(0);
/**
 * 大文件的下载百分比
 */
const largeFileDownloadProcess = ref<number>(0);

const handleFileDownloadNormal = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = props.fileInfo.fileName as string;
    link.target = "_blank"; // 可选，如果希望在新窗口中下载文件，请取消注释此行
    link.click();
    window.URL.revokeObjectURL(url)
}

const handleFileChunkDownload = (res: Blob, chunkHash: string) => {
    let dom = document.createElement('a')
    let url = window.URL.createObjectURL(res)
    dom.href = url
    dom.download = decodeURI(chunkHash + '-' + props.fileInfo.fileName);
    dom.style.display = 'none'
    document.body.appendChild(dom)
    dom.click()
    document.body.removeChild(dom)
    window.URL.revokeObjectURL(url)
}

const handleFileDownloadChunk = async () => {
    largeFileDownloadStatus.value = 1;
    const localStorageName = FILE_CHUNK_DOWNLOAD_AUTHORIZATION + props.fileInfo.id;
    if (typeof props.fileInfo.fileUploadInfo === 'string') return;
    let needDownloadFileHash = props.fileInfo.fileUploadInfo?.hasUploadedHash as string[];
    let tmp: Array<string> = jsonToObj(localStorage.getItem(localStorageName) as string) || needDownloadFileHash;
    for(let item of tmp) {
        if (largeFileDownloadStatus.value !== 1) {
            window.$message.success('停止下载成功！')
            return;
        }
        const resp = await getFileChunkApi(item);
        handleFileChunkDownload(resp, item);
        tmp = tmp.filter(it => it !== item);
        localStorage.setItem(localStorageName, JSON.stringify(tmp));
        largeFileDownloadProcess.value = 
            largeFileDownloadProcess.value +
            Math.floor(100 / (props.fileInfo.fileUploadInfo?.hasUploadedHash as string[]).length)
    }
    if (tmp.length === 0) {
        largeFileDownloadStatus.value = 0;
        window.$message.success('文件切片下载成功！');
    }
}

const handleFileChunkCombine = (e: any) => {
    if (typeof props.fileInfo.fileUploadInfo === 'string') return;
    const fileChunks = [].slice.call(e.target.files);
    const fileTmp: Array<File> = [];
    for(let item of (props.fileInfo.fileUploadInfo?.hasUploadedHash as string[])) {
        const fileChunk = fileChunks.find((it: File) => it.name.startsWith(item));
        if (!fileChunk) {
            window.$message.warning("文件切片不全！", { closable: true });
            return;
        }
        fileTmp.push(fileChunk);
    }
    const fileBlob = fileTmp.map((v: File) => v.slice(0, v.size));
    const file = new File(fileBlob, props.fileInfo.fileName || 'tmp.zip');
    handleFileDownloadNormal(window.URL.createObjectURL(file));
}

const handleCacheClear = () => {
    localStorage.removeItem(FILE_CHUNK_DOWNLOAD_AUTHORIZATION + props.fileInfo.id);
    largeFileDownloadProcess.value = 0;
}

function init() {
    const localStorageName = FILE_CHUNK_DOWNLOAD_AUTHORIZATION + props.fileInfo.id;
    if(!localStorage.getItem(localStorageName)) return;
    const fileChunks = JSON.parse(localStorage.getItem(localStorageName) as string);
    if(fileChunks.length === 0) {
        largeFileDownloadProcess.value = 100;
        return;
    }
    largeFileDownloadProcess.value = Math.floor(
        100 * fileChunks.length / (props.fileInfo.fileUploadInfo?.hasUploadedHash as string[]).length
    );
}
init();
</script>

<template>
    <div class="large-file-download">
        文件名：{{ props.fileInfo.fileName }}
        <n-button @click="() => fileDownloadType === 0 ? (fileDownloadType = 1) : (fileDownloadType = 0)">切换下载模式</n-button>
        <div class="normal-download" v-if="fileDownloadType === 0">
            <n-button @click="handleFileDownloadNormal(largeFileUrl + (props.fileInfo.fileId || '') + getFileExtName(props.fileInfo.fileName || ''))">普通下载文件</n-button>
        </div>
        <div class="chunk-download" v-if="fileDownloadType === 1">
            <div class="chunk-btn">
                <n-button @click="handleFileDownloadChunk">切片合成下载文件</n-button>
                <n-progress type="line" :percentage="largeFileDownloadProcess" indicator-placement="inside"
                    style="width: 200px;" class="file-process" />
                <n-button @click="() => largeFileDownloadStatus = 2">暂停下载</n-button>
                <n-button @click="() => (fileDownloadType = 1) && handleFileDownloadChunk()">继续下载</n-button>
                <n-button @click="handleCacheClear">清空缓存</n-button>
            </div>

            <span>文件合并：</span>
            <input type="file" placeholder="合成你的文件切片" multiple @change="handleFileChunkCombine">
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";
.large-file-download {
    .normal-download {

    }
    .chunk-download {
        .chunk-btn {
            display: flex;
            .file-process {
                margin-top: px2vw(15);
            }
        }
    }
}
</style>