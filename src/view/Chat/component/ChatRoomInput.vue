<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { NInput, NButton } from 'naive-ui';

const route = useRoute();
const emit = defineEmits<{
    (e: 'update:inputMessage', value: string) : void
    (e: 'sendMessage') : void
}>();
const props = defineProps<{ inputMessage: string }>();

</script>

<template>
    <div class="chatroom-input">
        <n-input class="input" @input="(e) => { emit('update:inputMessage', e) }" type="textarea" placeholder="" />
        <n-button @click="emit('sendMessage')">send</n-button>
    </div>
</template>

<style lang="scss" scoped>
@import "src/assets/style/common.scss";
.chatroom-input {
    .input {
        background: transparent;
        height: 100%;
    }
}
</style>