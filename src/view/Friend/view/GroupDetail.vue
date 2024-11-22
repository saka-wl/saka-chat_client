<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { NButton } from 'naive-ui';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import { normalImageUrl } from '../../../constant/request';
import colorthief from 'colorthief';
import { IGroupChatRoom } from '../../../api/groupchatmsg';

const route = useRoute();
const router = useRouter();
const chatRoom = ref<IGroupChatRoom>();
const { chatGroupList, userInfo } = storeToRefs(useUserInfoStore());

watch(() => route.params.id, (newVal) => {
    if (!newVal) {
        return;
    }
    chatRoom.value = chatGroupList.value?.find(it => it.id == newVal)
}, {
    immediate: true
})
const goToChat = () => {
    const chatRoomId = route.params.id;
    // const chatRoomItem = chatGroupList.value?.find(it => it.id == chatRoomId);
    router.push({
        name: 'grouproomchat',
        params: {
            chatRoomId
        }
    })
}

const bgColor = ref<string>('#fff');
const ColorThief = new colorthief();

// 鼠标移入事件
const onMouseEnter = async (event: MouseEvent) => {
    const img = event.target as HTMLImageElement;
    if (img) {
        try {
            const rgb: [number, number, number] | null = ColorThief.getColor(img, 1);
            if (rgb) {
                const [red, green, blue] = rgb;
                // 设置主色
                bgColor.value = `rgb(${red}, ${green}, ${blue})`;
            }
        } catch (err) {

        }

    }
}

// 鼠标移出事件
const onMouseLeave = () => {
    bgColor.value = '#fff'; // 主色：重置为白色
}
</script>

<template>
    <div class="chat-group-detail-container" :style="{ backgroundColor: bgColor }">
        <div class="avatar">
            <img :src="normalImageUrl + chatRoom?.avatar" alt="" class="avatar-image"
                @mouseenter="onMouseEnter($event)" @mouseleave="onMouseLeave()" crossOrigin="anonymous">
        </div>
        <div class="user-info">
            <p>
                <span>chatRoomName: {{ chatRoom?.chatRoomName || 'None~~' }}</span>
            </p>
            <p>
                chatRoomId: {{ chatRoom?.id || 'None~~' }}
            </p>
            <div style="display: flex; justify-content: center;">
                <n-button type="info" @click="goToChat">
                    去聊天
                </n-button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";

.chat-group-detail-container {
    padding: px2vw(40);

    .avatar {
        .avatar-image {
            height: px2vw(400);
            display: block;
            margin: px2vw(40) auto;
            position: relative;
            border-radius: px2vw(20);
        }
    }

    .user-info {
        p {
            text-align: center;
        }
    }
}
</style>