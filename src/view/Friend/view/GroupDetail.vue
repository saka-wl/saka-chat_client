<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { NButton, NGradientText, NAvatar, NFormItem, NSelect } from 'naive-ui';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import { normalImageUrl } from '../../../constant/request';
import colorthief from 'colorthief';
import { IGroupChatRoom, sendGroupChatRequestFromGroupApi } from '../../../api/groupchatmsg';

const route = useRoute();
const router = useRouter();
const chatRoom = ref<IGroupChatRoom>();
const usersAvatarList = ref<{ id: string; src: string; name: string }[]>([]);
const notAddedChatGroupUserList = ref<{ label: string; value: string }[]>();
const addGroupUsers = ref<(string | number)[]>([]);
const { chatGroupList, userInfo, userFriendList } = storeToRefs(useUserInfoStore());

watch(() => route.params.id, (newVal) => {
    if (!newVal) {
        return;
    }
    chatRoom.value = chatGroupList.value?.find(it => it.id == newVal);
    if (!chatRoom.value?.humanIds) {
        return;
    }
    const allUserIds = JSON.parse(chatRoom.value?.humanIds);
    const addedTmp = [];
    const notAddedTmp = [];
    const userId = userInfo.value?.id;
    for (let item of (userFriendList.value || [])) {
        let friendId = item.friendId;
        if (userId == item.friendId) friendId = item.userId;
        if (allUserIds.includes(friendId.toString())) {
            addedTmp.push({
                id: item?.id,
                name: item?.friendNickname,
                src: normalImageUrl + item?.friendAvatar,
            });
        } else if (userInfo.value?.id && chatRoom.value.makerUserId == userInfo.value.id) {
            let value = item.friendId;
            if (value == userInfo.value.id) value = item.userId;
            notAddedTmp.push({
                label: 'nickname: ' + item.friendNickname + ' - account: ' + item.id,
                value
            });
        }
    }
    if (userInfo.value?.id && chatRoom.value.makerUserId == userInfo.value.id) notAddedChatGroupUserList.value = notAddedTmp;
    usersAvatarList.value = addedTmp;
}, {
    immediate: true
});

const handleChatGroupInviteFriends = async () => {
    const { code, data, msg } = await sendGroupChatRequestFromGroupApi({
        chatRoomId: chatRoom.value?.id!,
        chatRoomName: chatRoom.value?.chatRoomName!,
        fromUserId: chatRoom.value?.makerUserId!,
        toUserIds: addGroupUsers.value!,
        requestDesc: '',
        chatRoomAvatar: chatRoom.value?.avatar!,
        type: 0,   // 由群主发起的群聊邀请
    });
    if(code !== 200) {
        window.$message.warning(msg || '邀请失败！', { closable: true });
        return;
    }
    window.$message.success('邀请成功！', { closable: true });
}

const goToChat = () => {
    const chatRoomId = route.params.id;
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
            <img :src="normalImageUrl + chatRoom?.avatar" alt="" class="avatar-image" @mouseenter="onMouseEnter($event)"
                @mouseleave="onMouseLeave()" crossOrigin="anonymous">
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
        <p>
            <n-gradient-text type="info" :size="22">
                群内好友：
            </n-gradient-text>
        </p>
        <div class="group-user-avatars">
            <div class="user-item" v-for="item in usersAvatarList">
                <n-avatar :src="item.src" object-fit="cover"></n-avatar>
                <n-gradient-text type="success" class="user-item-name">
                    {{ item.name }}
                </n-gradient-text>
            </div>
        </div>
        <div class="add-new-friend" v-if="userInfo?.id && chatRoom?.makerUserId == userInfo?.id">
            <!-- 群主邀请其他人 -->
            <p>
                <n-gradient-text type="info" :size="22">
                    邀请好友：
                </n-gradient-text>
            </p>
            <n-form-item label="选择好友" :width="200">
                <n-select v-model:value="addGroupUsers" multiple :options="notAddedChatGroupUserList"
                    style="max-width: 50%;" />
            </n-form-item>
            <n-button @click="handleChatGroupInviteFriends">一键邀请</n-button>
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

    .group-user-avatars {
        display: flex;

        .user-item {
            margin: px2vw(10);

            .user-item-name {
                margin-left: px2vw(5);
            }
        }
    }
}
</style>