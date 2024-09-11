
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { NButton } from 'naive-ui';
import { uploadImageApi } from '../../api/file';
import { FabricController } from './FabricController';

const props = defineProps<{ avatarUrl: string; }>();
const avatarImageUrl = ref<string | null>(null);
let avatarImageBlob: Blob | null = null;

// 内容显示的画布（蓝色区域）
const contentCanvasEl = ref();
const newImageEl = ref();

let HEIGHT = 600;
let WIDTH = ref<number | null>(null);
let scale = 1;

let canvasController: any = null;

function init() {
    const image = new Image();
    image.height = 600;
    image.src = props.avatarUrl;
    image.onload = async (e: any) => {
        scale = e.target.naturalHeight / HEIGHT;
        WIDTH.value = image.width / scale;
        await nextTick();
        contentCanvasEl.value.height = HEIGHT;
        contentCanvasEl.value.width = WIDTH.value;
        canvasController = new FabricController(contentCanvasEl.value);
        canvasController.clear();
        canvasController.add();
    }
}

onMounted(() => {
    init();
})

watch(() => props.avatarUrl, (newVal) => {
    newVal && init();
})

const getScreenShotImage = () => {
    let curRangle = canvasController.getScreenShotImage();
    if(!curRangle || !WIDTH.value) return;
    console.log(curRangle);
    const image = new Image();
    image.height = 600;
    image.width = WIDTH.value || 800;
    image.src = props.avatarUrl;
    image.onload = async (e: any) => {
        const cvs = document.createElement('canvas');
        cvs.width = curRangle[1][0];
        cvs.height = curRangle[1][1];
        const ctx: CanvasRenderingContext2D = cvs.getContext('2d') as CanvasRenderingContext2D;
        const originWidth = image.naturalWidth;
        const originHeight = image.naturalHeight;

        ctx.drawImage(
            image,
            curRangle[0][0] * (originWidth / (WIDTH.value as number)), 
            curRangle[0][1] * (originHeight / HEIGHT), 
            curRangle[1][0] * (originWidth / (WIDTH.value as number)), 
            curRangle[1][1] * (originHeight / HEIGHT),
            0, 
            0, 
            curRangle[1][0], 
            curRangle[1][1],
        );
        cvs.toBlob(async (blob) => {
            const url = URL.createObjectURL(blob as Blob);
            avatarImageUrl.value = url;
            avatarImageBlob = blob;
        })
    }
}

const emit = defineEmits(['updateAvatar']);

const updateAvatar = async () => {
    if(!avatarImageBlob || !avatarImageUrl) {
        window.$message.warning('您还未选择图片！');
        return;
    }
    const { code, data } = await uploadImageApi(avatarImageBlob);
    if(code !== 200) return;
    emit('updateAvatar', {
        originUrl: data,
        localUrl: avatarImageUrl.value
    });
    close();
}

</script>

<template>
    <div 
        class="canvas-screen-shot-container"
        v-if="WIDTH"
        :style="{
            width: WIDTH + 'px',
            height: HEIGHT + 'px',
            backgroundImage: `url(${props.avatarUrl})`,
            backgroundSize: '100% 100%'
        }"
    >
        <canvas id="content-canvas" ref="contentCanvasEl"></canvas>
    </div>
    <div class="canvas-btn">
        <img :src="avatarImageUrl" alt="" id="avatar-image" ref="newImageEl" v-if="avatarImageUrl">
        <n-button @click="getScreenShotImage">生成图片</n-button>
        <n-button @click="updateAvatar">确认修改</n-button>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";
.canvas-screen-shot-container {
    position: relative;
    margin: 50px auto;
    #bg-image {
        height: 600px;
    }
    #touch-canvas, #content-canvas {
        position: absolute;
        height: 600px;
        left: 0;
        right: 0;
    }
    .avatar-image {
    }
}
</style>