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
        <n-button quaternary type="info" @click="jumpTo('/')">
            Home
        </n-button>
        <n-button quaternary type="info" @click="jumpTo('/friend')">
            Friends
        </n-button>
        <n-button quaternary type="info" @click="jumpTo('/chat')">
            Chat
        </n-button>
        <n-button quaternary type="info" @click="jumpTo('/user')">
            Mine
        </n-button>
    </div>
</template>

<style scoped lang="scss">
.head-router-links-container {

}
</style>