<script lang="ts" setup>
import friendsList from './component/FriendsList.vue';
</script>

<template>
    <div class="friend-container">
        <div class="left">
            <friendsList />
        </div>
        <div class="right">
            <router-view></router-view>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";
.friend-container {
    display: flex;
    .left {
        width: px2vw(300);
    }
    .right {
        flex: 1 1 auto;
    }
}
</style>