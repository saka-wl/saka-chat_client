<script setup lang="ts">
import Head from './view/Home/component/Head.vue';
import { NMessageProvider } from 'naive-ui';

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
