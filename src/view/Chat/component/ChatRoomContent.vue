<script lang="ts" setup>
import { useRoute } from 'vue-router';
import ChatMessageInfoItem from './ChatMessageInfoItem.vue';

const route = useRoute();

const { friendAvatar } = route.params as { friendAvatar: string };

</script>

<template>
    <div class="chatroom-content-container">
        <ChatMessageInfoItem type="left" message="11111" :avatar="friendAvatar" color="" />
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";

</style>