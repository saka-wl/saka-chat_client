<script lang="ts" setup>

</script>

<template>
    <div class="icon-container">
        <div class="icon">
            <span class="iconfont icon-left icon__left"></span>
        </div>
        <div class="icon">
            <span class="iconfont icon-right icon__right"></span>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";

.icon-container {
    display: flex;
    width: px2vw(80);
    justify-content: space-between;

    .icon {
        @include flexCenterHW(26, 26);
        overflow: hidden;
        border-radius: 50%;
        cursor: pointer;

        &__left {
            font-size: px2vw(26);
            background-color: green;
            transition: all 0.5s;

            &:hover {
                transform: scale(1.6);
            }
        }

        &__right {
            font-size: px2vw(26);
            background-color: red;
            transition: all 0.5s;

            &:hover {
                transform: scale(1.6);
            }
        }
    }
}
</style>