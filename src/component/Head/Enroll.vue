<script lang="ts" setup>
import { ref } from 'vue';
import { NForm, NFormItem, NInput, NRow, NCol, NButton, NUpload, UploadFileInfo } from 'naive-ui';
import { useUserInfoStore } from "../../store/userInfo.pinia"
import { getCaptchaApi } from '../../api/user/captcha';
import { normalImageRequest } from '../../constant/request';

const { userEnroll } = useUserInfoStore();
const formRef = ref(null);
const model = ref({
    account: "",
    password: "",
    code: "",
    phone: "",
    email: "",
    avatar: "",
    nickname: ""
})
const codeImageUrl = ref<string>("");

const getCaptcha = async () => {
    codeImageUrl.value = await getCaptchaApi();
}

getCaptcha();

const rules = {
    account: [
        { required: true, message: "请输入账号", trigger: "blur" }
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" }
    ],
    code: [
        { required: true, message: "请输入验证码", trigger: "blur" }
    ]
}

const enroll = async () => {
    console.log(model.value);
    const notAllow = [null, undefined, ""];
    if (notAllow.includes(model.value.account) || notAllow.includes(model.value.password) || notAllow.includes(model.value.code)) {
        window.$message.warning("请填写完整信息!");
        return;
    }
    const resp = await userEnroll({
        ...model.value
    }, getCaptcha);
    if(resp) {
        emit('closeMoal');
    }
}

const handleImageUploadFinish = ({
    file,
    event
}: {
    file: UploadFileInfo
    event?: ProgressEvent
}) => {
    let resp = JSON.parse((event?.target as XMLHttpRequest).response);
    if (resp.code === 200 && resp.data) {
        model.value.avatar = resp.data;
    }
    else if (resp?.msg === 'File too large') {
        window.$message.warning("文件过大，请重新上传");
    }
    else {
        window.$message.warning(resp?.msg || "上传失败，请重新上传");
    }
}

const imageExt = ["image/jpg", "image/tiff", "image/gif", "image/svg", "image/jfif", "image/webp", "image/png", "image/bmp", "image/jpeg", "image/x-icon"];
const beforeImageUpload = (data: {
    file: UploadFileInfo
    fileList: UploadFileInfo[]
}) => {
    if (!imageExt.includes(data.file.file?.type || "")) {
        window.$message.warning('只能上传图片文件，请重新上传')
        return false
    }
    return true
}

const emit = defineEmits<{
    closeMoal: []
}>();

</script>

<template>
    <div class="enroll-componet">
        <n-form ref="formRef" :model="model" :rules="rules">
            <n-form-item path="account" label="账号">
                <n-input v-model:value="model.account" />
            </n-form-item>
            <n-form-item path="password" label="密码">
                <n-input v-model:value="model.password" />
            </n-form-item>
            <n-form-item path="phone" label="手机号">
                <n-input v-model:value="model.phone" />
            </n-form-item>
            <n-form-item path="email" label="邮箱">
                <n-input v-model:value="model.email" />
            </n-form-item>
            <n-form-item path="nickname" label="用户名">
                <n-input v-model:value="model.nickname" />
            </n-form-item>
            <n-upload :action="normalImageRequest" list-type="image-card" @finish="handleImageUploadFinish"
                @before-upload="beforeImageUpload" :max="1">
                点击上传头像
            </n-upload>
            <n-form-item path="code" label="验证码">
                <n-input v-model:value="model.code" />
                <div v-html="codeImageUrl" @click="getCaptcha()"></div>
            </n-form-item>

            <n-row :gutter="[0, 24]">
                <n-col :span="24">
                    <div style="display: flex; justify-content: flex-end">
                        <n-button round type="primary" @click="enroll">
                            注册
                        </n-button>
                    </div>
                </n-col>
            </n-row>
        </n-form>
    </div>
</template>

<style scoped lang="scss"></style>