<script lang="ts" setup>
import { computed, ref } from 'vue';
import { largeFileUrl, normalImageUrl } from '../../constant/request';
import { VIDEO_CHUNK_DOWNLOAD_BEFORE_SEC, VIDEO_CHUNK_SIZE, VIDEO_FRAME_SLICE_TIME, VIDEO_STREAM_START_SIZE } from "../../constant/file";
import { videoPreviewApi, getFileSizeApi, IFileInfoApi } from "../../api/file/index"


const props = defineProps<{
    fileInfo: Partial<IFileInfoApi>
}>();

const videoRef = ref();
const isVideoShow = ref(false);
const videoUrl = props.fileInfo.fileId + '.mp4';
const videoNormalUrl = largeFileUrl + props.fileInfo.fileId + '.mp4';
let videoSize: number | null = 0;

// 'video/mp4; codecs="avc1.64001F, mp4a.40.2"'
// 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
var mimeCodec = 'video/mp4; codecs="avc1.64001F, mp4a.40.2"';

async function videoInit() {
    const { code, data, msg } = await getFileSizeApi(videoUrl);
    videoSize = data;
    if (code !== 200 || !videoSize) {
        window.$message.warning(msg || '该文件已经不存在！', { closable: true });
        return;
    }

    // 初始化视频
    if(videoSize <= VIDEO_CHUNK_SIZE) {
        // 普通的播放方式
        videoRef.value.src = videoNormalUrl;
        return;
    }
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
    } else {
        console.error('Unsupported MIME type or codec: ', mimeCodec)
    }
}

const isTimeEnough = () => {
    // 当前缓冲数据是否足够播放
    if(!videoRef.value?.buffered || !videoRef.value.buffered.length) {
        return true;
    }
    for (let i = 0; i < videoRef.value.buffered.length; i++) {
        if(!videoRef.value.buffered) return true;
        const bufferend = videoRef.value.buffered?.end(i);
        if (bufferend - videoRef.value.currentTime >= VIDEO_CHUNK_DOWNLOAD_BEFORE_SEC) // 提前n s下载视频
            return true;
    }
    return false;
}

async function sourceOpen(e: Event) {
    let index = 0;
    const mediaSource = e.target as MediaSource;
    const sourceBuffer: SourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    const videoChunks = Math.ceil((videoSize as number) / VIDEO_CHUNK_SIZE);
    let isFetchingVideoStream = false;

    const addVideoStream = () => {
        if(index >= videoChunks) {
            timer && clearInterval(timer);
            return;
        };
        const start = index * VIDEO_CHUNK_SIZE;
        const end = Math.min(start + VIDEO_CHUNK_SIZE - 1, (videoSize as number) - 1);
        isFetchingVideoStream = true;
        return new Promise(async (res, rej) => {
            const respBlob = await videoPreviewApi(videoUrl, start, end);
            try {
                sourceBuffer.appendBuffer(respBlob);
                sourceBuffer.onupdateend = () => {
                    isFetchingVideoStream = false;
                    res(true);
                    index ++;
                }
            }catch(err) {
                console.log(err);
                res(false);
            }
        })
    }

    await addVideoStream();

    let timer = setInterval(() => {
        if(!isFetchingVideoStream && !isTimeEnough()) {
            addVideoStream();
        }
    }, 500);
}

const getImageUrl = (url: string) => {
    return normalImageUrl + url + '.png';
}

const handleVideoTime = (index: number) => {
    videoRef.value.currentTime = index * VIDEO_FRAME_SLICE_TIME;
}

</script>

<template>
    <div class="video-download-container">
        <video class="video-container" ref="videoRef" controls preload="auto" loading="lazy" v-if="isVideoShow"></video>
        <div class="image-container" v-else>
            <img :src="getImageUrl(props.fileInfo.videoPreview[0])" alt="" class="image-item">
            <span class="iconfont icon-player" @click="() => {
                isVideoShow = true;
                videoInit();
            }">&#xe635;</span>
        </div>
        <div class="preview-image">
            <img 
                v-for="(item, index) in props.fileInfo.videoPreview"
                loading="lazy"
                :src="getImageUrl(item)"
                @click="isVideoShow && handleVideoTime(index)"
                alt=""
            >
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";

.video-download-container {
    display: flex;
    .video-container {
        width: px2vw(600);
        border-radius: px2vw(10);
    }
    .image-container {
        width: px2vw(600);
        border-radius: px2vw(10);
        position: relative;
        min-height: px2vw(400);
        .icon-player {
            color: rgb(177, 177, 177);
        }
        .image-item {
            width: px2vw(600);
            border-radius: px2vw(10);
            position: absolute;
            left: 0;
            right: 0;
        }
        .icon-player {
            font-size: px2vw(80);
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -60%);
        }
    }

    .preview-image {
        width: px2vw(850);
        min-height: px2vw(400);
        display: flex;
        flex-wrap: wrap;
        img {
            height: px2vw(100);
            max-width: px2vw(200);
            margin: px2vw(10);
        }
    }
}
</style>