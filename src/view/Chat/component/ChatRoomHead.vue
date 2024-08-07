<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps<{ nickname: string }>();
console.log(props);

</script>

<template>
    <div class="chatroom-head-container">
        {{ props.nickname || '' }}
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";
.chatroom-head-container {
    
}
</style>