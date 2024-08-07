<script lang="ts" setup>

</script>

<template>
    <div class="layout-two-column-container">
        <div class="left">
            <!-- <MineList /> -->
            <slot></slot>
        </div>
        <div class="right">
            <router-view></router-view>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";
.layout-two-column-container {
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