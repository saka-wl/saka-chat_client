
import { VIDEO_CHUNK_DOWNLOAD_BEFORE_SEC, VIDEO_CHUNK_SIZE, VIDEO_STREAM_START_SIZE } from "../../constant/file";
import { videoPreviewApi } from "../../api/file/index"
import { delay } from "../../utils/format"
import type { Ref } from 'vue';

// 'video/mp4; codecs="avc1.64001F, mp4a.40.2"'
// 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

export interface IVideoInfo {
    videoRef: Ref;
    videoUrl: string;
    videoSize: number;
    videoNormalUrl: string;
}

export const handleVideoMediaSource = (videoInfo: IVideoInfo) => {
    if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
        // 流式播放
        var mediaSource = new MediaSource();
        videoInfo.videoRef.value.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', (e) => sourceOpen(e, videoInfo));
        // videoInfo.videoRef.value.height = 300;
    } else {
        console.error('Unsupported MIME type or codec: ', mimeCodec)
    }
}

const isTimeEnough = (videoRef: Ref) => {
    // 当前缓冲数据是否足够播放
    for (let i = 0; i < videoRef.value.buffered.length; i++) {
        const bufferend = videoRef.value.buffered.end(i);
        if (videoRef.value.currentTime < bufferend && bufferend - videoRef.value.currentTime >= VIDEO_CHUNK_DOWNLOAD_BEFORE_SEC) // 提前n s下载视频
            return true;
    }
    return false;
}

function sourceOpen(e: Event, videoInfo: IVideoInfo) {
    let index = 0;
    var mediaSource = e.target as MediaSource;
    var sourceBuffer: any;
    const videoChunks = Math.ceil(videoInfo.videoSize / VIDEO_CHUNK_SIZE);
    let timer: number;

    const startLoad = async () => {
        const respBlob = await videoPreviewApi(videoInfo.videoUrl, 0, VIDEO_STREAM_START_SIZE);
        sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

        try {
            sourceBuffer.appendBuffer(respBlob);
            await delay(50)
            if (!videoInfo.videoRef.value.canPlayType) {
                videoInfo.videoRef.value.src = videoInfo.videoUrl;
                return
            }
        } catch (err) {
            console.log(err);
            videoInfo.videoRef.value.src = videoInfo.videoUrl;
            return
        }
        // timer = setInterval(() => {
        //     if (!isTimeEnough(videoInfo.videoRef)) {
        //         clearInterval(timer)
        //         send()
        //     }
        // }, 1000)
    }
    /**
     * 递归请求播放数据，Rangle请求头，请求视频数据片段
     */
    const send = async () => {
        if (index >= videoChunks) {
            sourceBuffer.addEventListener('updateend', async function () {
                clearInterval(timer)
                mediaSource.endOfStream()
            })
            return;
        }
        const start = index * VIDEO_CHUNK_SIZE + VIDEO_STREAM_START_SIZE + 1;
        const end = Math.min(start + VIDEO_CHUNK_SIZE - 1, videoInfo.videoSize - 1);
        const respBlob = await videoPreviewApi(videoInfo.videoUrl, start, end);
        index++
        try {
            sourceBuffer.appendBuffer(respBlob)
            // ！！！这里为何有延迟？上一次appendBuffer还未完成就执行下一个appendBuffer就会报错！！！-_-
            // await delay(50)
            if (!isTimeEnough(videoInfo.videoRef)) await delay(500);

            timer = setInterval(() => {
                if (!isTimeEnough(videoInfo.videoRef)) {
                    send()
                    clearInterval(timer)
                }
            }, 200)
        } catch (err) {
            console.log(err);
            videoInfo.videoRef.value.src = videoInfo.videoUrl;
            return
        }
    }
    startLoad()
}