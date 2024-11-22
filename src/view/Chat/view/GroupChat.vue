<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import { IGroupChatRoom } from '../../../api/groupchatmsg';

const route = useRoute();
const router = useRouter();
const { chatGroupList, userInfo } = storeToRefs(useUserInfoStore());

const chatRoomInfo = ref<IGroupChatRoom | null>(null);

watch(() => route.params.chatRoomId, (newVal) => {
    
}, {
    immediate: true
})

</script>

<template>
    <div class="group-chat-container">
        111
    </div>
</template>

<style lang="scss" scoped>

</style>