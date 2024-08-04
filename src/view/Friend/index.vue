<script lang="ts" setup>
import MineList from './component/MineList.vue';
</script>

<template>
    <div class="friend-container">
        <div class="left">
            <MineList />
        </div>
        <div class="right">
            <router-view></router-view>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";
.friend-container {
    display: flex;
    height: 100%;
    .left {
        width: px2vw(300);
        height: 100%;
    }
    .right {
        flex: 1 1 auto;
    }
}
</style>