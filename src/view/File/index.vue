<script lang="ts" setup>
import { useRouter } from 'vue-router';
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
            <!-- <n-button quaternary type="info" @click="jumpTo('/file/md-file')">
                Md File
            </n-button> -->
        </div>
        <router-view></router-view>
    </div>
</template>

<style lang="scss" scoped>
.file-container {
    padding: 20px;
    background-color: #f5f7fa;
    min-height: 100vh;

    .file-link {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
        padding: 16px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

        :deep(.n-button) {
            min-width: 120px;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(32, 128, 240, 0.2);
            }
        }
    }
}
</style>