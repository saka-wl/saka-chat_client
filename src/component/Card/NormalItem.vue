
<script setup lang="ts">
interface IProps {
    word: string,
    type: 'icon-left' | 'icon-right'
}
const props = withDefaults(defineProps<IProps>(), {
    word: '--',
    type: 'icon-left'
});

</script>

<template>
    <div class="normalItem-container">
        <span class="iconfont icon-right icon__right" v-if="props.type === 'icon-left'"></span>
        <div class="word">{{ props.word }}</div>
        <span class="iconfont icon-right icon__right" v-if="props.type === 'icon-right'"></span>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
.normalItem-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    cursor: pointer;
    height: px2vw(40);
    &:hover {
        background-color: rgba(245, 245, 245);
    }
    .icon__right {
        font-size: px2vw(30);
    }
    .word {
        font-size: px2vw(16);
        width: px2vw(120);
    }
}
</style>