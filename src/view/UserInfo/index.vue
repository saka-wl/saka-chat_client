<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../store/userInfo.pinia';
import { normalImageUrl } from '../../constant/request';
import { ref } from 'vue';
import { NModal, NCard, NUpload, FormRules, FormInst, FormItemInst, FormItemRule, NForm, NFormItem, NInput, NCol, NRow, NButton } from 'naive-ui';
import CanvasScreenShot from '../../component/Canvas/CanvasScreenShot.vue';
import { changeUserInfoApi } from '../../api/user/user';

const { userInfo } = storeToRefs(useUserInfoStore());
const isAvatarModalShow = ref(false);
// const account = ref('');
// const nickname = ref('');
// const email = ref('');
// const phone = ref('');
const avatar = ref('');

const avatarUrl = ref<string | null>(null);
const formRef = ref<FormInst | null>(null)
const rPasswordFormItemRef = ref<FormItemInst | null>(null)

export interface IUserInfo {
    account: string | null
    nickname: string | null
    email: string | null
    phone: string | null
    originPassword: string | null
    password: string | null
    avatar: string | null
}
const modelRef = ref<IUserInfo>({
    account: null,
    nickname: null,
    email: null,
    phone: null,
    originPassword: null,
    password: null,
    avatar: null,
})

function init() {
    modelRef.value.account = userInfo.value?.account || '';
    modelRef.value.nickname = userInfo.value?.nickname || '';
    modelRef.value.email = userInfo.value?.email || '';
    modelRef.value.phone = userInfo.value?.phone || '';
    modelRef.value.avatar = userInfo.value?.avatar || '';
}

init();

const handleAvatarChoose = (e: any) => {
    if (e.fileList.length !== 1) {
        e.fileList.shift();
    }
    const fileReader = new FileReader();

    fileReader.onload = function (e) {
        if (!e.target || !e.target.result) return;
        avatarUrl.value = window.URL.createObjectURL(new Blob([e.target.result]))
    }
    fileReader.readAsArrayBuffer(e.fileList[0].file);
}

const handleAvatarUpdate = (data: { originUrl: string; localUrl: string; }) => {
    modelRef.value.avatar = data.originUrl;
    isAvatarModalShow.value = false;
}

const rules: FormRules = {}

const handlePasswordInput = () => {
    if (modelRef.value.password) {
        rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
    }
}

const handleChangeUserInfo = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate(async (errors) => {
        if (errors) {
            window.$message.warning('验证失败', { closable: true })
            return;
        }
        if(!Object.values(modelRef.value).find(it => it)) {
            window.$message.warning('请填写修改信息！', { closable: true });
            return;
        }
        const { code, data, msg } = await changeUserInfoApi(modelRef.value);
        window.$message.success('修改成功！', { closable: true });
    })
}

</script>

<template>
    <div class="user-info-container">
        <n-form ref="formRef" :model="modelRef" :rules="rules">
            <n-form-item path="account" label="账号">
                <n-input v-model:value="modelRef.account" :disabled="true" @keydown.enter.prevent />
            </n-form-item>
            <n-form-item path="nickname" label="昵称">
                <n-input v-model:value="modelRef.nickname" @keydown.enter.prevent />
            </n-form-item>
            <n-form-item path="email" label="邮箱">
                <n-input v-model:value="modelRef.email" @keydown.enter.prevent />
            </n-form-item>
            <n-form-item path="phone" label="电话">
                <n-input v-model:value="modelRef.phone" @keydown.enter.prevent />
            </n-form-item>
            <n-form-item path="originPassword" label="原密码">
                <n-input v-model:value="modelRef.originPassword" type="password" @input="handlePasswordInput"
                    @keydown.enter.prevent />
            </n-form-item>
            <n-form-item ref="rPasswordFormItemRef" first path="password" label="新密码">
                <n-input v-model:value="modelRef.password" :disabled="!modelRef.originPassword" type="password"
                    @keydown.enter.prevent />
            </n-form-item>
            <n-form-item ref="avatar" first path="avatar" label="头像">
                <img :src="normalImageUrl + modelRef.avatar" alt="" @click="isAvatarModalShow = true">
            </n-form-item>
            <n-row :gutter="[0, 24]">
                <n-col :span="24">
                    <div style="display: flex; justify-content: flex-end">
                        <n-button round type="primary" @click="handleChangeUserInfo">
                            修改
                        </n-button>
                    </div>
                </n-col>
            </n-row>
        </n-form>

        <n-modal v-model:show="isAvatarModalShow">
            <n-card style="width: 80%" title="修改头像" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <n-upload :custom-request="() => { }" :on-change="handleAvatarChoose" list-type="image-card"
                    :multiple="false">
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
    padding: px2vw(40);

    img {
        height: px2vw(100);
        width: px2vw(100);
    }
}
</style>