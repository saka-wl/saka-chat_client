<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../store/userInfo.pinia';
import { normalImageUrl } from '../../constant/request';
import { Ref, ref } from 'vue';
import { NModal, NCard, NUpload, UploadFileInfo, tabPaneProps } from 'naive-ui';
import CanvasScreenShot from '../../component/Canvas/CanvasScreenShot.vue';

const { userInfo } = storeToRefs(useUserInfoStore());
const isAvatarModalShow = ref(false);
const avatarUrl = ref<string | null>(null);

const handleAvatarChoose = (e: any) => {
    if(e.fileList.length !== 1) {
        e.fileList.shift();
    }
    const fileReader = new FileReader();
    
    fileReader.onload = function(e) {
        if(!e.target || !e.target.result) return;
        avatarUrl.value = window.URL.createObjectURL(new Blob([e.target.result]))
    }
    fileReader.readAsArrayBuffer(e.fileList[0].file);
}

</script>

<template>
    <div class="user-info-container">
        <p>name: {{ userInfo?.nickname }}</p>
        <p>account: {{ userInfo?.account }}</p>
        <p>email: {{ userInfo?.email }}</p>
        <p>phone: {{ userInfo?.phone }}</p>
        <p>
            <span>avatar</span>
            <img :src="normalImageUrl + userInfo?.avatar" alt="" @click="isAvatarModalShow = true">
        </p>

        <n-modal v-model:show="isAvatarModalShow">
            <n-card
                style="width: 80%"
                title="修改头像"
                :bordered="false"
                size="huge"
                role="dialog"
                aria-modal="true"
            >
            <n-upload
                :custom-request="() => {}"
                :on-change="handleAvatarChoose"
                list-type="image-card"
                :multiple="false"
            >
                点击上传
            </n-upload>
            <CanvasScreenShot v-if="avatarUrl" :avatarUrl="avatarUrl" />
            </n-card>
        </n-modal>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
.user-info-container {
    img {
        height: px2vw(100);
        width: px2vw(100);
    }
}
</style>