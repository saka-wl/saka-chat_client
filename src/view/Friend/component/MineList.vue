<script lang="ts" setup>
import { ref } from 'vue';
import NormalItem from '../../../component/Card/NormalItem.vue';
import { IUserFriend } from '../../../api/friend';
import { useUserInfoStore } from '../../../store/userInfo.pinia';
import { storeToRefs } from 'pinia';
import FriendCard from './FriendCard.vue';
import { useRouter } from 'vue-router';

const isMyFriendListShow = ref(false)
const isMyGroupFriendListShow = ref(false)
const { userInfo, userFriendList } = storeToRefs(useUserInfoStore())
const { getUserFriendList } = useUserInfoStore();
const router = useRouter();

const init = async () => {
    if(!userInfo.value?.id) {
        window.$message.warning("您还未登录！", { closable: true })
    }
    if(!userFriendList?.value) {
        await getUserFriendList()
    }
}

const goToFriendDetail = (item: IUserFriend) => {
    router.push({ name: 'friendDetail', params: { id: item.id, chatRoomId: item.chatRoomId }});
}

init()
</script>

<template>
    <div class="minelist-container">
        <NormalItem word="去搜索你的朋友" type="icon-right" v-memo="[]" @click="$router.push({ name: 'search' })" />
        <NormalItem word="我的好友请求" type="icon-right" v-memo="[]" @click="$router.push({ name: 'request-from-me' })" />
        <NormalItem word="ta想和我交朋友" type="icon-right" v-memo="[]" @click="$router.push({ name: 'request-to-me' })" />
        <NormalItem word="我的朋友" type="icon-left" v-memo="[]"
            @click="isMyFriendListShow = !isMyFriendListShow" />
        <div class="myfriend-list" :style="{ height: isMyFriendListShow ? '60%' : '0' }">
            <FriendCard
                v-for="item in userFriendList" 
                :avatar="item.friendAvatar" 
                :nickname="item.friendNickname" 
                :account="item.friendAccount"
                :isOnline="item.isOnline"
                @click="goToFriendDetail(item)"
            />
        </div>
        <NormalItem word="我的群聊" type="icon-left" v-memo="[]"
            @click="isMyGroupFriendListShow = !isMyGroupFriendListShow" />
        <div class="mygroup-list" :style="{ height: isMyGroupFriendListShow ? '60%' : '0' }">

        </div>
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
.minelist-container {
    height: 100%;
    overflow-y: scroll;
    .myfriend-list {
        background-color: rgb(228, 255, 255);
        transition: all .3s;
        overflow-y: scroll;
    }
    .mygroup-list {
        background-color: rgb(228, 255, 255);
        transition: all .3s;
        overflow-y: scroll;
    }
}
</style>