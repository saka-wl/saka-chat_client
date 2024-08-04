<script lang="ts" setup>
import { NAvatar, NButton } from "naive-ui";
import { computed, ref } from "vue";
import { useUserInfoStore } from '../../../store/userInfo.pinia.ts';
import { normalImageUrl } from "../../../constant/request.ts"
import { IFriendRequest } from "../view/RequestFromMe.vue";

interface IFriendRequestWithType {
    requestId: number;
    toUserId: string;
    requestMessage: string;
    isDispose: number;
    createdAt: string;
    toUserAccount: string;
    toUserNickname: string;
    toUserAvatar: string;
    type: 'requestToMe' | 'requestFromMe';
}

interface IProps {
    props: IFriendRequestWithType;
}

const { props } = defineProps<IProps>();

// const props = withDefaults(defineProps<IFriendRequestWithType>(), {
//     props: {
//         requestId: 0,
//         toUserId: '',
//         requestMessage: '没有名字的小Saka',
//         isDispose: 0,
//         createdAt: '',
//         toUserAccount: '',
//         toUserNickname: '',
//         toUserAvatar: '',
//         type: 'requestToMe',
//     }
// });

console.log(props)

const { userInfo } = useUserInfoStore()

const imageUrl = computed(() => {
    return normalImageUrl + props.toUserAvatar
});

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
            <n-button tertiary type="primary">
                同意
            </n-button>
            <n-button tertiary type="error">
                拒绝
            </n-button>
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