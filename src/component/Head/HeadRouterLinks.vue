<script lang="ts" setup>
import { RouterLink } from 'vue-router';

</script>

<template>
    <div class="head-router-links-container">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/friend">Friends</RouterLink>
        <RouterLink to="/chat">Chat</RouterLink>
    </div>
</template>

<style scoped lang="scss">
.head-router-links-container {

}
</style>