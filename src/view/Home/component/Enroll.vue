<script lang="ts" setup>
import { ref } from 'vue';
import { NForm, NFormItem, NInput } from 'naive-ui';

const formRef = ref(null);
const model = ref({
    account: "111",
    password: "222",
    code: "333"
})
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
</script>

<template>
    <div class="login-componet">
        666
        <n-form ref="formRef" :model="model" :rules="rules">
            <n-form-item path="account" label="账号">
                <n-input v-model:value="model.account" />
            </n-form-item>
            <n-form-item path="password" label="密码">
                <n-input v-model:value="model.password" type="password" />
            </n-form-item>
            <n-form-item path="code" label="验证码">
                <n-input v-model:value="model.code" />
            </n-form-item>
        </n-form>
    </div>
</template>

<style scoped lang="scss">
.login-componet {
    height: 800px;
    width: 50%;
}
</style>