<script lang="ts" setup>
import { RouterLink, useRouter } from 'vue-router';
import { NButton } from 'naive-ui';

const router = useRouter();
const jumpTo = (path: string) => {
    router.push(path);
}
</script>

<template>
    <div class="file-container">
        <div class="file-link">
            <n-button quaternary type="info" @click="jumpTo('/file/search-file')">
                Search File
            </n-button>
            <n-button quaternary type="info" @click="jumpTo('/file/upload-file')">
                Upload File
            </n-button>
            <n-button quaternary type="info" @click="jumpTo('/file/mine-file')">
                Mine File
            </n-button>
        </div>
        <router-view></router-view>
    </div>
</template>

<style lang="scss" scoped>
.file-container {
    .file-link {

    }
}
</style>