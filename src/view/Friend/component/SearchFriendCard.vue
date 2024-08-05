<script lang="ts" setup>
import { NInput, NButton } from 'naive-ui';
import { ref } from 'vue';
import { sendFriendRequst } from '../../../api/friend/index.ts';
import { useUserInfoStore } from '../../../store/userInfo.pinia.ts';
import { storeToRefs } from 'pinia';
import FriendCard from "./FriendCard.vue"

interface IProps {
    id: string;
    avatar: string;
    nickname: string;
    account: string;
    hasAddFriend: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
    id: '',
    avatar: '',
    nickname: '没有名字的小Saka',
    account: '',
    hasAddFriend: false
});

console.log(props)

const makeFriendMessage = ref("")
const { userInfo } = storeToRefs(useUserInfoStore())

const handleSend = () => {
    window.$dialog.warning({
        title: '发送好友请求',
        content: '你确定发送好友请求吗？',
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: async () => {
            if(!userInfo.value?.id) {
                window.$message.warning("您还未登录！", { closable: true })
                return;
            }
            if(userInfo.value.id == props.id) {
                window.$message.warning("别给自己发送好友请求捏~", { closable: true })
                return;
            }
            const resp = await sendFriendRequst({
                fromUserId: userInfo.value?.id,
                toUserId: props.id,
                requestMessage: makeFriendMessage.value
            })
            if(resp) {
                window.$message.success("发送成功！", { closable: true })
            }else{
                window.$message.success("服务器错误！", { closable: true })
            }
        },
        onNegativeClick: () => {}
    })
}

</script>

<template>
    <div class="friend-detail-container">
        <FriendCard :avatar="props.avatar" :nickname="props.nickname" :account="props.account" />
        <div class="make-friend" v-if="!props.hasAddFriend">
            <n-input v-model:value="makeFriendMessage" type="text" placeholder="写下好友之间的添加提示吧~" />
            <n-button strong secondary type="info" @click="handleSend">发送</n-button>
        </div>
        <div v-else>你们已经是朋友啦</div>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";

.friend-detail-container {
    width: px2vw(700);
    background-color: #f2f2f2;

    .user-info {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        &__message {}
    }

    .make-friend {}
}
</style>