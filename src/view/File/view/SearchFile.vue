
<script lang="ts" setup>
import { FormInst, NForm, NFormItem, NInput, NButton, NGradientText, NDivider } from 'naive-ui';
import { ref } from 'vue';
import { getFilesByCondition } from '../../../api/file';
import LargeFileDownload from "../../../component/LargeFileDownload/index.vue";

const formRef = ref<FormInst | null>(null);
const formValue = ref({
    id: null,
    fileName: null,
    ownUserId: null,
    status: 1,
});
const resultFiles = ref<Object[]>([]);

const handleSearchFile = async () => {
    let { code, data, msg } = await getFilesByCondition(formValue.value, undefined);
    if(code !== 200) return;
    data = data.map((it: any) => {
        it.videoPreview = JSON.parse(it.videoPreview);
        it.fileUploadInfo = JSON.parse(it.fileUploadInfo as unknown as string);
        return it;
    })
    resultFiles.value = data;
}
</script>

<template>
    <div class="search-file-container">
        <n-divider title-placement="left">
            <n-gradient-text type="info">
                Search
            </n-gradient-text>
        </n-divider>

        <n-form
            ref="formRef"
            inline
            :label-width="80"
            :model="formValue"
        >
            <n-form-item label="id">
                <n-input v-model:value="formValue.id" placeholder="输入文件id" />
            </n-form-item>
            <n-form-item label="fileName">
                <n-input v-model:value="formValue.fileName" placeholder="输入文件名" />
            </n-form-item>
            <n-form-item>
                <n-button attr-type="button" @click="handleSearchFile">
                    Search
                </n-button>
            </n-form-item>
        </n-form>
        <n-divider title-placement="left">
            <n-gradient-text type="info">
                Result
            </n-gradient-text>
        </n-divider>
        <LargeFileDownload v-for="item in resultFiles" :fileInfo="item" />
    </div>
</template>

<style lang="scss" scoped>

</style>