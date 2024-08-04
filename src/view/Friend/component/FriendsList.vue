<script lang="ts" setup>
import NormalItem from '../../../component/Card/NormalItem.vue';
</script>

<template>
    <div class="friendlist-container">
        <NormalItem 
            word="去搜索你的朋友" 
            type="icon-right" 
            v-memo="[]" 
            @click="$router.push({ name: 'search' })" 
        />
        <NormalItem 
            word="我的好友请求" 
            type="icon-right" 
            v-memo="[]"
            @click="$router.push({ name: 'request-from-me' })" 
        />
        <NormalItem 
            word="ta想和我交朋友" 
            type="icon-right" 
            v-memo="[]"
            @click="$router.push({ name: 'request-to-me' })" 
        />
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
</style>