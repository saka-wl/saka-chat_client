<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { NButton, NTag } from 'naive-ui';
import { ref, watch } from 'vue';
import { IUserFriend } from '../../../api/friend';
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import { normalImageUrl } from '../../../constant/request';
import colorthief from 'colorthief';

const route = useRoute();
const router = useRouter();
const friendInfo = ref<IUserFriend>();
const { userFriendList, userInfo } = storeToRefs(useUserInfoStore())

watch(() => route.params.id, (newVal) => {
    if (!newVal) {
        return;
    }
    friendInfo.value = userFriendList.value?.find(it => it.id == newVal)
}, {
    immediate: true
})
const goToChat = () => {
    router.push({
        name: 'friendchat',
        params: {
            userId: userInfo.value?.id || '',
            friendAccount: friendInfo.value?.friendAccount || '',
            friendId: friendInfo.value?.friendId || '',
            friendNickname: friendInfo.value?.friendNickname || '',
            friendAvatar: friendInfo.value?.friendAvatar || '',
            chatRoomId: friendInfo.value?.chatRoomId as string,
        }
    });
}

const bgColor = ref<string>('#fff');
const ColorThief = new colorthief();

// 鼠标移入事件
const onMouseEnter = async (event: MouseEvent) => {
    const img = event.target as HTMLImageElement;
    if (img) {
        const rgb: [number, number, number] | null = ColorThief.getColor(img, 1);
        if (rgb) {
            const [red, green, blue] = rgb;
            // 设置主色
            bgColor.value = `rgb(${red}, ${green}, ${blue})`;
        }
    }
}

// 鼠标移出事件
const onMouseLeave = () => {
  bgColor.value = '#fff'; // 主色：重置为白色
}
</script>

<template>
    <div class="friend-detail-container" :style="{ backgroundColor: bgColor }">
        <div class="avatar">
            <img 
                :src="normalImageUrl + friendInfo?.friendAvatar" 
                alt="" 
                class="avatar-image" 
                @mouseenter="onMouseEnter($event)" 
                @mouseleave="onMouseLeave()"
                crossOrigin="anonymous"
            >
        </div>
        <div class="user-info">
            <p>
                <span>nickname: {{ friendInfo?.friendNickname || 'None~~' }}</span>
                <n-tag type="success" style="margin-left: 10px;" v-if="friendInfo?.isOnline">
                    Online
                </n-tag>
                <n-tag type="error" style="margin-left: 10px;" v-else>
                    不在线
                </n-tag>
            </p>
            <p>
                account: {{ friendInfo?.friendAccount || 'None~~' }}
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
.friend-detail-container {
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