<script lang="ts" setup>
import { useRoute } from 'vue-router';
import ChatMessageInfoItem from './ChatMessageInfoItem.vue';
import { IFriendHistoryMsg } from '../../../api/friendchatmsg';
import { normalImageUrl } from '../../../constant/request';

const route = useRoute();
const props = defineProps<{ chatMessage: IFriendHistoryMsg[] }>();

</script>

<template>
    <div class="chatroom-content-container">
        <ChatMessageInfoItem
            v-for="item in props.chatMessage"
            :type="item.userId == item.fromUserId ? 'right': 'left'"
            :message="item.messageInfo" 
            :avatar="normalImageUrl + item.avatar"
            color=""
            :messageType="item.messageType"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";

</style>