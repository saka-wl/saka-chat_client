<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue';
import { largeFileUrl, REQUEST_URL } from '../../constant/request';
// @ts-ignore
import { handleVideoMediaSource } from "./mediaSourceHelp.ts";
import { VIDEO_CHUNK_DOWNLOAD_BEFORE_SEC, VIDEO_CHUNK_SIZE, VIDEO_STREAM_START_SIZE } from "../../constant/file";
import { videoPreviewApi, getFileSizeApi, IFileInfoApi } from "../../api/file/index"
import { delay } from "../../utils/format"


const props = defineProps<{
    fileInfo: Partial<IFileInfoApi>
}>();

const videoRef = ref();
const videoUrl = props.fileInfo.fileId + '.mp4';
const videoNormalUrl = largeFileUrl + props.fileInfo.fileId + '.mp4';
let videoSize: number | null = 0;

// 'video/mp4; codecs="avc1.64001F, mp4a.40.2"'
// 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

async function init() {
    const { code, data, msg } = await getFileSizeApi(videoUrl);
    videoSize = data;
    if(code !== 200 || !videoSize) {
        window.$message.warning(msg || '该文件已经不存在！', { closable: true });
        return;
    }
    
    // 初始化视频
    // if(videoSize < VIDEO_USE_STREAM_DOWNLOAD_SIZE) {
    //     // 普通的播放方式
    //     videoRef.value.src = videoNormalUrl;
    //     return;
    // }
    console.log("info: video use stream.")
    // 流播放
    handleVideoMediaSource();
}

const handleVideoMediaSource = () => {
    if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
        // 流式播放
        var mediaSource = new MediaSource();
        videoRef.value.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', sourceOpen);
        // videoRef.value.height = 300;
    } else {
        console.error('Unsupported MIME type or codec: ', mimeCodec)
    }
}

const isTimeEnough = () => {
    // 当前缓冲数据是否足够播放
    for (let i = 0; i < videoRef.value.buffered.length; i++) {
        const bufferend = videoRef.value.buffered.end(i);
        if (videoRef.value.currentTime < bufferend && bufferend - videoRef.value.currentTime >= VIDEO_CHUNK_DOWNLOAD_BEFORE_SEC) // 提前n s下载视频
            return true;
    }
    return false;
}

function sourceOpen(e: Event) {
    let index = 0;
    const mediaSource = e.target as MediaSource;
    const sourceBuffer: SourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    const videoChunks = Math.ceil((videoSize as number) / VIDEO_CHUNK_SIZE);

    const getVideoStream = (start: number, end: number) => {
        return new Promise(async (res, rej) => {
            const respBlob = await videoPreviewApi(videoUrl, start, end);
            try {
                sourceBuffer.appendBuffer(respBlob);
                sourceBuffer.onupdateend = () => {
                    res(true);
                }
            }catch(err) {
                res(false);
            }
        })
    }

    const startLoad = async () => {
        while(index < videoChunks) {
            const start = index * VIDEO_CHUNK_SIZE;
            const end = Math.min(start + VIDEO_CHUNK_SIZE - 1, (videoSize as number) - 1);
            const resp = await getVideoStream(start, end);
            if(!resp) {
                videoRef.value.src = videoNormalUrl;
                break;
            }
        }
    }

    startLoad();
}

init();

</script>

<template>
    <div class="video-download-container">
        视频
        <video class="video" ref="videoRef" controls preload="auto"></video>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";

.video-download-container {
    .video {
        height: px2vw(400);
        border-radius: px2vw(10);
    }
}
</style>