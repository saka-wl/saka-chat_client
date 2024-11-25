<script lang="ts" setup>
import ChatMessageInfoItem from './ChatMessageInfoItem.vue';
import { normalImageUrl } from '../../../constant/request';
import { IGroupHistoryMsg, IUsersInfo } from '../../../api/groupchatmsg/message';
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../../store/userInfo.pinia';

// const route = useRoute();
const { userInfo } = storeToRefs(useUserInfoStore());
const props = defineProps<{ chatMessage: IGroupHistoryMsg[]; usersInfo: IUsersInfo }>();

const getAvatar = (userId: string) => {
    return normalImageUrl + props.usersInfo?.[userId?.toString()].avatar;
}

</script>

<template>
    <div class="chatroom-content-container">
        <ChatMessageInfoItem
            v-for="item in props.chatMessage"
            :type="item.fromUserId == userInfo?.id ? 'right': 'left'"
            :message="item.messageInfo" 
            :avatar="getAvatar(item.fromUserId)"
            color=""
            :messageType="item.messageType"
            :chatMsgId="~~item.id"
            :key="item.id"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";

</style>