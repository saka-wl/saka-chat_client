
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';

const props = defineProps<{ avatarUrl: string; }>();
const avatarImageUrl = ref<string | null>(null);
let avatarImageBlob: Blob | null = null;

const imageEl = ref();
// 方格的画布
const touchCanvasEl = ref();
// 内容显示的画布（蓝色区域）
const contentCanvasEl = ref();
const isCanvasShow = ref(false);

const GRID_COLOR = '#000000';
const GROUP_COLOR = 'rgb(197, 255, 255, 0.4)';
// 方格的边框大小
const GRID_LINE_WIDTH = 0.5;
// 每个方格大小
const GRID_WIDTH = 15;
let isDrawing = false;
let HEIGHT = 600;
let WIDTH = 800;
let curRangle: Array<Array<number>> = [];

function init() {
    curRangle = [];
    HEIGHT = 600;
    isCanvasShow.value = false;
    avatarImageBlob = null;
    avatarImageUrl.value = null;
    imageEl.value.onload = () => {
        WIDTH = imageEl.value.width;
        initCanvas();
    }
}

onMounted(() => {
    init();
})

watch(() => props.avatarUrl, () => {
    init();
})

// 初始化画布
async function initCanvas() {
    isCanvasShow.value = true;
    await nextTick();
    touchCanvasEl.value.height = HEIGHT;
    touchCanvasEl.value.width = WIDTH;
    contentCanvasEl.value.height = HEIGHT;
    contentCanvasEl.value.width = WIDTH;
    drawBlockLayer();
    bindEvent();
}

function drawBlockLayer() {
    const ctx = touchCanvasEl.value.getContext('2d');
    if(!ctx) return;
    // 设置透明背景
    ctx.clearRect(0, 0, touchCanvasEl.value.width, touchCanvasEl.value.height);
    // 设置线条样式
    ctx.strokeStyle = GRID_COLOR; // 线条颜色
    ctx.lineWidth = GRID_LINE_WIDTH; // 线条宽度
    /**
     * 横竖每隔 GRID_WIDTH 画一条线,构成一个网格
     */
    for (let i = 0; i < touchCanvasEl.value.width; i += GRID_WIDTH) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, touchCanvasEl.value.height);
        ctx.stroke();
    }
    for (let i = 0; i < touchCanvasEl.value.height; i += GRID_WIDTH) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(touchCanvasEl.value.width, i);
        ctx.stroke();
    }
}

function getClickPage(e: any) {
    const { left, top } = touchCanvasEl.value.getBoundingClientRect();
    const { clientX, clientY } = e;
    const x = parseFloat(clientX - left);
    const y = parseFloat(clientY - top);
    return { x, y };
}

// 将区域在画布中画出来
const drawCanvas = (style = GROUP_COLOR) => {
    const ctx = contentCanvasEl.value?.getContext('2d');
    if (!ctx) {
        return;
    }
    ctx.fillStyle = style;
    ctx.fillRect(
        curRangle[0][0], 
        curRangle[0][1], 
        curRangle[1][0] - curRangle[0][0], 
        curRangle[1][1] - curRangle[0][1]
    );
};

// 清空画布
const clearCanvas = () => {
    const ctx = contentCanvasEl.value?.getContext('2d');
    if (!ctx) {
        return;
    }
    ctx.clearRect(0, 0, contentCanvasEl.value.width, contentCanvasEl.value.height);
    drawCanvas();
}

function bindEvent() {
    touchCanvasEl.value.addEventListener('mousedown', (e) => {
        isDrawing = true;
        curRangle = [];
        const { x, y } = getClickPage(e);
        curRangle[0] = [x, y];
    })
    touchCanvasEl.value.addEventListener('mousemove', (e) => {
        if(!isDrawing) return;
        const { x, y } = getClickPage(e);
        if(curRangle[1]) clearCanvas();
        curRangle[1] = [x, y];
        drawCanvas();
    })
    touchCanvasEl.value.addEventListener('mouseup', (e) => {
        isDrawing = false;
        const { x, y } = getClickPage(e);
        curRangle[1] = [x, y];
        drawCanvas();
        getImageData();
    })
}

function getImageData() {
    const cvs = document.createElement('canvas')
    cvs.width = WIDTH
    cvs.height = HEIGHT
    const ctx: CanvasRenderingContext2D = cvs.getContext('2d') as CanvasRenderingContext2D;
    const originWidth = imageEl.value.naturalWidth;
    const originHeight = imageEl.value.naturalHeight;
    console.log(        
        curRangle[0][0] * (originWidth / WIDTH), 
        curRangle[0][1] * (originHeight / HEIGHT), 
        (curRangle[1][0] - curRangle[0][0]) * (originWidth / WIDTH), 
        (curRangle[1][1] - curRangle[0][1]) * (originHeight / HEIGHT))
    ctx.drawImage(
        imageEl.value,
        curRangle[0][0] * (originWidth / WIDTH), 
        curRangle[0][1] * (originHeight / HEIGHT), 
        (curRangle[1][0] - curRangle[0][0]) * (originWidth / WIDTH), 
        (curRangle[1][1] - curRangle[0][1]) * (originHeight / HEIGHT),
        0, 
        0, 
        Math.abs(curRangle[1][0] - curRangle[0][0]), 
        Math.abs(curRangle[1][1] - curRangle[0][1]),
    );
    cvs.toBlob((blob) => {
        const url = URL.createObjectURL(blob as Blob);
        avatarImageUrl.value = url;
        avatarImageBlob = blob;
    })
}

</script>

<template>
    <div class="canvas-screen-shot-container">
        <canvas id="content-canvas" ref="contentCanvasEl" v-if="isCanvasShow"></canvas>
        <canvas id="touch-canvas" ref="touchCanvasEl" v-if="isCanvasShow"></canvas>
        <img :src="props.avatarUrl" alt="" id="bg-image" ref="imageEl">
        <img :src="avatarImageUrl" alt="" id="avatar-image" v-if="avatarImageUrl">
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";
.canvas-screen-shot-container {
    position: relative;
    height: 600px;
    margin: 50px auto;
    #bg-image {
        height: 600px;
    }
    #touch-canvas, #content-canvas {
        position: absolute;
        left: 0;
        right: 0;
    }
    .avatar-image {
    }
}
</style>