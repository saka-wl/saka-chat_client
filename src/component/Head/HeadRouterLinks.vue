<script lang="ts" setup>
import { RouterLink, useRouter } from 'vue-router';
import { NButton } from 'naive-ui';

const router = useRouter();
const jumpTo = (path: string) => {
    router.push(path);
}
</script>

<template>
    <div class="head-router-links-container">
        <n-button text @click="jumpTo('/')" class="home-icon icon">
            <span class="iconfont">&#xe768;</span>
        </n-button>
        <n-button text @click="jumpTo('/friend')" class="friend-icon icon">
            <span class="iconfont">&#xe728;</span>
        </n-button>
        <n-button text @click="jumpTo('/chat/friendchat')" class="chat-icon icon">
            <span class="iconfont">&#xea94;</span>
        </n-button>
        <n-button text @click="jumpTo('/user')" class="mine-icon icon">
            <span class="iconfont">&#xe619;</span>
        </n-button>
        <n-button text @click="jumpTo('/file/search-file')" class="file-icon icon">
            <span class="iconfont">&#xe671;</span>
        </n-button>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
.head-router-links-container {
    .icon span{
        margin: 0 px2vw(100);
        margin-top: px2vw(13);
        font-size: px2vw(27);
        color: #2080f0;
        &:hover {
            color: #18a058;
        }
    }
}
</style>