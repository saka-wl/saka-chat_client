
// 文件的每一段切片大小
export const FILE_SLICE_SINGLE_SIZE = 200 * 1024 * 1024;

// 浏览器切片时使用几个线程
export const WEB_WORKER_NUMBER = 4;

// 对于文件整体的hash，使用文件多大输入（已不适用）
export const FILE_TOTAL_SLICE = 1024 * 1024 * 200;

// 文件下载使用的chunk存储在localStorage里面的名字
export const FILE_CHUNK_DOWNLOAD_AUTHORIZATION = 'Saka-Chat-File-Chunk';

// 视频的第一段下载的大小
export const VIDEO_STREAM_START_SIZE = 5 * 1024 * 1024;

// 视频使用206下载分界线
export const VIDEO_USE_STREAM_DOWNLOAD_SIZE = 30 * 1024 * 1024;