<script lang="ts" setup>
import { NPopover, NBadge, NAvatar, NModal, NCard, NGradientText } from 'naive-ui';
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
const avatarUrl = computed(() => {
    return normalImageUrl + userInfo.value?.avatar;
})
</script>

<template>
    <div class="login-info-container">
        <n-popover trigger="hover" placement="bottom">
            <template #trigger>
                <n-avatar v-if="!userInfo?.avatar" @click="!userInfo?.id && (isModalShow = true)">
                    Ciallo
                </n-avatar>
                <n-badge value="" v-else>
                    <n-avatar :src="avatarUrl" class="avatar-image" object-fit="cover"></n-avatar>
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
        <n-card style="width: 600px" :title="modalStatus === 'login' ? '登录' : '注册'" :bordered="false" size="huge"
            role="dialog" aria-modal="true">
            <template v-if="modalStatus === 'login'">
                <Login @closeModal="isModalShow = false" />
            </template>
            <template v-else>
                <Enroll @closeModal="isModalShow = false" />
            </template>

            <template #footer>
                <div class="modal-footer" @click="modalStatus = modalStatus === 'login' ? 'enroll' : 'login'">
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
</template>


<style scoped lang="scss"></style>