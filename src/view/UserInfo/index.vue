<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../store/userInfo.pinia';
import { normalImageUrl } from '../../constant/request';
import { ref } from 'vue';
import { NModal, NCard, NUpload } from 'naive-ui';
import CanvasScreenShot from '../../component/Canvas/CanvasScreenShot.vue';

const { userInfo } = storeToRefs(useUserInfoStore());
const isAvatarModalShow = ref(false);
const account = ref('');
const nickname = ref('');
const email = ref('');
const phone = ref('');
const avatar = ref('');

const avatarUrl = ref<string | null>(null);

function init() {
    account.value = userInfo.value?.account || '';
    nickname.value = userInfo.value?.nickname || '';
    email.value = userInfo.value?.email || '';
    phone.value = userInfo.value?.phone || '';
    avatar.value = userInfo.value?.avatar || '';
}

init();

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

const handleAvatarUpdate = (data: { originUrl: string; localUrl: string; }) => {
    avatar.value = data.originUrl;
}

</script>

<template>
    <div class="user-info-container">
        <p>name: {{ nickname }}</p>
        <p>account: {{ account }}</p>
        <p>email: {{ email }}</p>
        <p>phone: {{ phone }}</p>
        <p>
            <span>avatar</span>
            <img :src="normalImageUrl + avatar" alt="" @click="isAvatarModalShow = true">
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
            <CanvasScreenShot v-if="avatarUrl" :avatarUrl="avatarUrl" @updateAvatar="handleAvatarUpdate" />
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