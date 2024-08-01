<script setup lang="ts">
import { NMessageProvider } from 'naive-ui';
import Head from './component/Head/Head.vue';
import { useUserInfoStore } from './store/userInfo.pinia';

const { userAutoLogin } = useUserInfoStore();
userAutoLogin();
</script>

<template>
	<div class="app-container">
			<div class="top">
				<n-message-provider>
					<Head />
				</n-message-provider>
			</div>
			<div class="content">
				<router-view></router-view>
			</div>
	</div>
</template>

<style scoped></style>
