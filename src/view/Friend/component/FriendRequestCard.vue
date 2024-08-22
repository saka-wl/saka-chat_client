<script lang="ts" setup>
import { NAvatar, NButton } from "naive-ui";
import { computed, ref } from "vue";
import { useUserInfoStore } from '../../../store/userInfo.pinia.ts';
import { normalImageUrl } from "../../../constant/request.ts"
import { IProps } from "../utils/handleFriendRequest.ts";
import { handleFriendRequestApi } from "../../../api/friend/index.ts";
import { storeToRefs } from "pinia";

const { props } = defineProps<IProps>();
const { userInfo } = storeToRefs(useUserInfoStore())
const { getUserFriendList } = useUserInfoStore();
const emit = defineEmits(['handleFriendRequest'])

const imageUrl = computed(() => {
    return normalImageUrl + props.toUserAvatar
});

const handleFriendRequest = async (isDispose: number) => {
    if (!userInfo.value?.id) {
        window.$message.warning("您还未登录", { closable: true })
        return
    }
    const fetch = async () => await handleFriendRequestApi({
        isDispose,
        userId: userInfo.value?.id || '',
        friendId: (props.toUserId ? props.toUserId : props.fromUserId) || '',
        requestId: props.requestId
    })
    const title = (isDispose === -1 ? '不' : '') + "同意ta的好友请求";
    const content = "你确定" + (isDispose === -1 ? '拒绝' : '同意') + "ta的好友请求吗？";
    window.$dialog.warning({
        title,
        content,
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: async () => {
            await fetch();
            await getUserFriendList();
        }
    })
    emit("handleFriendRequest", props.requestId, isDispose)
}

</script>

<template>
    <div class="friend-request-card-container">
        <div class="user-info">
            <n-avatar :src="imageUrl" object-fit="cover">
                <template v-if="props.toUserAvatar === ''">
                    {{ props.toUserNickname }}
                </template>
            </n-avatar>
            <div class="user-info__message">
                <div class="account-info">
                    <div class="nickname">昵称：{{ props.toUserNickname }}</div>
                    <div class="account">账号：{{ props.toUserAccount }}</div>
                </div>
                <div class="request-message">
                    {{ props.requestMessage }}
                </div>
            </div>
        </div>
        <div class="hander-button" v-if="props.type === 'requestToMe'">
            <template v-if="props.isDispose === 0">
                <n-button tertiary type="primary" @click="() => handleFriendRequest(1)">
                    同意
                </n-button>
                <n-button tertiary type="error" @click="() => handleFriendRequest(-1)">
                    拒绝
                </n-button>
            </template>
            <template v-else>
                {{ props.isDispose === -1 ? '您已拒绝' : '您已同意' }}
            </template>
        </div>
        <div class="hander-status" v-else>
            {{
                props.isDispose === 0 ?
                    'ta正在处理中' :
                    (props.isDispose === -1 ?
                        'ta已拒绝' :
                        'ta同意了你们的好友请求'
                    )
            }}
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";

.friend-request-card-container {
    width: px2vw(700);
    background-color: #f2f2f2;

    .user-info {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        &__message {
            .account-info {
                display: flex;
            }
        }
    }

    .make-friend {}
}
</style>