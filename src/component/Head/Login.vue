<script lang="ts" setup>
import { ref } from 'vue';
import { NForm, NFormItem, NInput, NRow, NCol, NButton } from 'naive-ui';
import { useUserInfoStore } from "../../store/userInfo.pinia"
import { getCaptchaApi } from '../../api/user/captcha';

const { userLogin } = useUserInfoStore();

const formRef = ref(null);
const model = ref({
    account: "",
    password: "",
    code: ""
})
const codeImageUrl = ref<string>("");

const emit = defineEmits(['closeModal']);

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

const login = async () => {
    const notAllow = [null, undefined, ""];
    if(notAllow.includes(model.value.account) || notAllow.includes(model.value.password) || notAllow.includes(model.value.code)) {
        window.$message.warning("请填写完整信息!", { closable: true });
        return;
    }
    const resp = await userLogin(model.value.account, model.value.password, model.value.code, getCaptcha);
    console.log(resp)
    if(resp) {
        emit('closeModal');
    }
}

</script>

<template>
    <div class="login-componet">
        <n-form ref="formRef" :model="model" :rules="rules">
            <n-form-item path="account" label="账号">
                <n-input v-model:value="model.account" />
            </n-form-item>
            <n-form-item path="password" label="密码">
                <n-input v-model:value="model.password" type="password" />
            </n-form-item>
            <n-form-item path="code" label="验证码">
                <n-input v-model:value="model.code" />
                <div v-html="codeImageUrl"></div>
            </n-form-item>

            <n-row :gutter="[0, 24]">
                <n-col :span="24">
                    <div style="display: flex; justify-content: flex-end">
                        <n-button 
                            round 
                            type="primary"
                            @click="login"
                        >
                            登录
                        </n-button>
                    </div>
                </n-col>
            </n-row>

        </n-form>
    </div>
</template>

<style scoped lang="scss">

</style>