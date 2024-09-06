import { IVideoPreviewPic } from "../api/file";

/**
 * 视频帧处理
 * @param {*} file 
 * @param {*} duration 
 * @returns 
 */
export function getVideoFrame(file: File, duration: number): Promise<IVideoPreviewPic[] | string> {
    if(!file.name.endsWith('.mp4')) {
        Promise.reject('请放入一个mp4视频');
    }
    duration = ~~duration
    return new Promise((resolve, reject) => {
        if (typeof duration !== 'number') {
            reject("输入的时间应是一个数字！")
            return
        };
        duration = Math.ceil(duration)
        if (duration < 1) {
            reject("时间间隔太小啦！应该在2s以上！");
            return;
        }
        let task = (time = 1): Promise<{ url: string, blob: Blob }> => {
            return new Promise((r, j) => {
                if (!file) return null;
                vdo.currentTime = time
                vdo.oncanplay = () => {
                    const cvs = document.createElement('canvas')
                    cvs.width = vdo.videoWidth
                    cvs.height = vdo.videoHeight
                    const ctx: CanvasRenderingContext2D = cvs.getContext('2d') as CanvasRenderingContext2D;
                    ctx.drawImage(vdo, 0, 0, cvs.width, cvs.height)
                    cvs.toBlob((blob) => {
                        const url = URL.createObjectURL(blob as Blob);
                        r({
                            url,
                            blob: blob as Blob,
                        })
                    })
                }
            })
        }
        let res: Array<{ url: string; blob: Blob; }> = [];
        const vdo = document.createElement('video')
        vdo.muted = true
        vdo.autoplay = true
        vdo.src = URL.createObjectURL(file)
        vdo.oncanplay = async () => {
            const vdoEndTime = Math.floor(vdo.duration)
            for (let time = 1, i = 0; time < vdoEndTime && i < 10; time = time + duration, i++) {
                res[i] = await task(time);
            }
            const worker = new Worker(
                new URL(
                    './worker_image.js',
                    import.meta.url
                ),
                {
                    type: 'module'
                }
            );
            worker.postMessage(res.map(it => it.blob));
            worker.onmessage = (e) => {
                resolve(res.map((it, index) => ({ ... it, hash: e.data[index] })));
                worker.terminate();
            }
        }
    })
}