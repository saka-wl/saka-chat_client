
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../store/userInfo.pinia';
import { useUploadFile } from '../../utils/file';

const { userInfo } = storeToRefs(useUserInfoStore())

const handleUploadFile = async (e: Event) => {
    if(!userInfo.value?.id) {
        window.$message.warning("您还未登录！");
        return;
    }
    const resp = await useUploadFile(e.target.files[0], userInfo.value.id as string);
}
</script>

<template>
    <div class="file-upload-container">
        <input type="file" @change="handleUploadFile" />
    </div>
</template>

<style scoped lang="scss">

</style>