<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { NInput } from 'naive-ui';

const route = useRoute();
const emit = defineEmits<(e: 'update:inputMessage', value: string) => void>();
const props = defineProps<{ inputMessage: string }>();

</script>

<template>
    <div class="chatroom-input">
        <n-input class="input" @input="(e) => { emit('update:inputMessage', e) }" type="textarea" placeholder="" />
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