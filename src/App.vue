<script setup lang="ts">
import { NMessageProvider, NDialogProvider } from 'naive-ui';
import Head from './component/Head/index.vue';
import { useUserInfoStore } from './store/userInfo.pinia';

const { userAutoLogin } = useUserInfoStore();
userAutoLogin();
</script>

<template>
	<div class="app-container">
		<div class="top">
			<n-dialog-provider>
				<n-message-provider>
					<Head></Head>
				</n-message-provider>
			</n-dialog-provider>
		</div>
		<div class="content">
			<router-view></router-view>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
.app-container {
	height: 100vh;
	.content {
		height: calc(100% - px2vw(50));
	}
}
</style>
