<script lang="ts" setup>
import { ref } from 'vue';
import { getFileChunkApi, IFileInfoApi } from '../../api/file';
import { NButton } from 'naive-ui';
import { largeFileUrl } from '../../constant/request';
import { getFileExtName } from '../../utils/format';

const props = defineProps<{
    fileInfo: Partial<IFileInfoApi>
}>();
/**
 * 文件下载状态
 * 0：未开始
 * 1：下载中
 * 2：暂停下载
 */
const fileDownloadStatus = ref<number>(0);

const handleFileDownloadNormal = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = props.fileInfo.fileName as string;
    link.target = "_blank"; // 可选，如果希望在新窗口中下载文件，请取消注释此行
    link.click();
}

const handleFileChunkDownload = (res) => {
    const { data, headers } = res
    const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
    // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
    //const blob = new Blob([JSON.stringify(data)], ...)
    const blob = new Blob([data], {type: headers['content-type']})
    let dom = document.createElement('a')
    let url = window.URL.createObjectURL(blob)
    dom.href = url
    dom.download = decodeURI(fileName)
    dom.style.display = 'none'
    document.body.appendChild(dom)
    dom.click()
    document.body.removeChild(dom)
    window.URL.revokeObjectURL(url)
}

const handleFileDownloadChunk = async () => {
    if (typeof props.fileInfo.fileUploadInfo === 'string') return;
    const test = props.fileInfo.fileUploadInfo?.hasUploadedHash as string[];
    const test01 = test[0];
    const resp = await getFileChunkApi(test[0]);
    // const resp2 = await getFileChunkApi(test[1]);
    handleFileChunkDownload(resp);
}

</script>

<template>
    <div class="large-file-download">
        文件名：{{ props.fileInfo.fileName }}
        <n-button @click="handleFileDownloadNormal(largeFileUrl + (props.fileInfo.fileId || '') + getFileExtName(props.fileInfo.fileName || ''))">普通下载文件</n-button>
        <n-button @click="handleFileDownloadChunk">切片合成下载文件</n-button>
    </div>
</template>

<style lang="scss" scoped>

</style>