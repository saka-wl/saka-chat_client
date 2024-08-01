<script lang="ts" setup>
import { ref } from 'vue';
import { NForm, NFormItem, NInput, NRow, NCol, NButton, NUpload } from 'naive-ui';
import { useUserInfoStore } from "../../store/userInfo.pinia"
import { getCaptchaApi } from '../../api/user/captcha';

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
const userAvatar = ref([]);

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
    const notAllow = [null, undefined, ""];
    if (notAllow.includes(model.value.account) || notAllow.includes(model.value.password) || notAllow.includes(model.value.code)) {
        window.$message.warning("请填写完整信息!");
        return;
    }
    userEnroll({
        ...model.value
    }, getCaptcha);
}

const handlePreview = () => {

}

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
            <n-upload
                action="http://localhost:3000/common/uploadNormalFile/single/image"
                :default-file-list="userAvatar"
                list-type="image-card"
                @preview="handlePreview"
            >
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