
// 文件的每一段切片大小
export const FILE_SLICE_SINGLE_SIZE = 200 * 1024 * 1024;

// 浏览器切片时使用几个线程
export const WEB_WORKER_NUMBER = 4;

// 对于文件整体的hash，使用文件多大输入（已不适用）
export const FILE_TOTAL_SLICE = 1024 * 1024 * 200;

// 文件下载使用的chunk存储在localStorage里面的名字
export const FILE_CHUNK_DOWNLOAD_AUTHORIZATION = 'Saka-Chat-File-Chunk';

// 视频的第一段下载的大小
export const VIDEO_STREAM_START_SIZE = 30 * 1024 * 1024;

// 视频流下载每段的大小
export const VIDEO_CHUNK_SIZE = 15 * 1024 * 1024;

// 视频使用206下载分界线,30MB
export const VIDEO_USE_STREAM_DOWNLOAD_SIZE = 30 * 1024 * 1024;

// 提前n秒下载视频流
export const VIDEO_CHUNK_DOWNLOAD_BEFORE_SEC = 5;

// 视频帧的获取间隔时间
export const VIDEO_FRAME_SLICE_TIME = 10;