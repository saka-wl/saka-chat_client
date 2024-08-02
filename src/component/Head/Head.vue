<script lang="ts" setup>
import { NPopover, NBadge, NAvatar, NModal, NCard, NGradientText, useMessage } from 'naive-ui';
import Login from './Login.vue';
import { computed, ref } from 'vue';
import Enroll from './Enroll.vue';
import { useUserInfoStore } from '../../store/userInfo.pinia';
import { storeToRefs } from 'pinia';
import { normalImageUrl } from '../../constant/request';

const { userInfo } = storeToRefs(useUserInfoStore());
const { userLoginOut } = useUserInfoStore();

const modalStatus = ref<null | 'login' | 'enroll'>('login');
const isModalShow = ref(false);
declare global {
	interface Window {
		$message: ReturnType<typeof useMessage>;
	}
}
// 挂载全局消息提示，挂载一次即可
window.$message = useMessage();

const avatarUrl = computed(() => {
    console.log(normalImageUrl + userInfo.value?.avatar)
    return normalImageUrl + userInfo.value?.avatar;
})

</script>

<template>
    <div class="head-container">
        <div class="head-container__btn-controller">
            <div>1</div>
            <div>2</div>
            <div>3</div>
        </div>
        <div class="head-container__login-info">
            <n-popover trigger="hover" placement="bottom">
                <template #trigger>
                    <n-badge value="">
                        <n-avatar @click="!userInfo?.id && (isModalShow = true)" :src="avatarUrl">
                            <template v-if="!userInfo?.avatar">
                                Ciallo
                            </template>
                        </n-avatar>
                    </n-badge>
                </template>
                <div v-if="userInfo?.id">
                    <div>你好，{{ userInfo?.nickname || 'saka' }}</div>
                    <div>去信息详情页</div>
                    <div @click="userLoginOut()">退出登陆</div>
                </div>
                <div v-else>
                    <div>点击头像登录</div>
                </div>
            </n-popover>
        </div>
        <n-modal v-model:show="isModalShow">
            <n-card style="width: 600px" :title="modalStatus === 'login' ? '登录' : '注册'" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <template v-if="modalStatus === 'login'">
                    <Login />
                </template>
                <template v-else>
                    <Enroll />
                </template>

                <template #footer>
                    <div class="modal-footer" @click="modalStatus = modalStatus === 'login' ? 'enroll' : 'login' ">
                        <n-gradient-text type="info" v-if="modalStatus === 'login'">
                            还未注册？去注册 ^-^
                        </n-gradient-text>
                        <n-gradient-text type="info" v-else>
                            有账号啦？去登陆 ^-^
                        </n-gradient-text>
                    </div>
                </template>
            </n-card>
        </n-modal>
    </div>
</template>

<style scoped lang="scss"></style>