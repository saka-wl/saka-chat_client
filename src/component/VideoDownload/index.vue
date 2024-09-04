<script lang="ts" setup>
import { ref } from 'vue';
import { getFileChunkApi, IFileInfoApi, videoPreview } from '../../api/file';
import { NButton, NProgress } from 'naive-ui';
import { largeFileUrl } from '../../constant/request';
import { delay, getFileExtName, jsonToObj } from '../../utils/format';
import { FILE_CHUNK_DOWNLOAD_AUTHORIZATION } from '../../constant/file';

const props = defineProps<{
    fileInfo: Partial<IFileInfoApi>
}>();

console.log(props);

const videoRef = ref();
const videoUrl = 'ffmpeg-' + props.fileInfo.fileId + '.mp4';

// 'video/mp4; codecs="avc1.64001F, mp4a.40.2"'
// 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'

if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
    // 流式播放
    var mediaSource = new MediaSource()
    videoRef.value.src = URL.createObjectURL(mediaSource)
    mediaSource.addEventListener('sourceopen', sourceOpen)
    videoRef.value.height = 300
} else {
    console.error('Unsupported MIME type or codec: ', mimeCodec)
}

const isTimeEnough = () => {
    // 当前缓冲数据是否足够播放
    for (let i = 0; i < videoRef.value.buffered.length; i++) {
        const bufferend = videoRef.value.buffered.end(i);
        if (videoRef.value.currentTime < bufferend && bufferend - videoRef.value.currentTime >= 3) // 提前3s下载视频
            return true
    }
    return false
}

function sourceOpen(e: Event) {
    var mediaSource = e.target as MediaSource;
    var sourceBuffer: any;

    const startLoad = async () => {
        const respBlob = await videoPreview(videoUrl, 0, startSize)
        sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)

        try {
            sourceBuffer.appendBuffer(respBlob)
            await delay(50)
            if (!videoRef.value.canPlayType) {
                videoRef.value.src = videoUrl
                videoRef.value.height = 500
                return
            }
        } catch (err) {
            console.log(err)
            videoRef.value.src = videoUrl
            videoRef.value.height = 500
            return
        }
        let timer = setInterval(() => {
            if (!isTimeEnough()) {
                clearInterval(timer)
                send()
            }
        }, 1000)
    }


    /**
     * 递归请求播放数据，Rangle请求头，请求视频数据片段
     */
    const send = async () => {
        let timer: any;
        if (index >= numChunks) {
            sourceBuffer.addEventListener('updateend', async function (_) {
                clearInterval(timer)
                mediaSource.endOfStream()
            })
        } else {
            const start = index * chunkSize + startSize + 1
            const end = Math.min(start + chunkSize - 1, totalSize - 1)
            const respBlob = await getVideoStream(url, start, end)
            index++
            try {
                sourceBuffer.appendBuffer(respBlob)
                // ！！！这里为何有延迟？上一次appendBuffer还未完成就执行下一个appendBuffer就会报错！！！-_-
                // await delay(50)
                if (!isTimeEnough()) await delay(500);

                timer = setInterval(() => {
                    if (!isTimeEnough()) {
                        send()
                        clearInterval(timer)
                    }
                }, 200)

            } catch (err) {
                console.log(err)
                videoRef.src = url
                videoRef.height = 500
                return
            }
        }
    }
    startLoad()
}

</script>

<template>
    <div class="video-download-container">
        <video :ref="videoRef" controls preload="auto"></video>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";

</style>