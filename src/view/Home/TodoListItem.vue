<script lang="ts" setup>
import type { ITodoListItem } from './useTodoList';
import { formatDate } from '../../utils/formatTime';

const props = defineProps<{
    title: string;
    list: ITodoListItem[];
    status: number;
    eventTypeToOnGoing: Function;
    deleteEvent: Function;
    eventTypeToFinished: Function;
}>();
</script>

<template>
    <div>
        <h2 class="event-type">{{ props.title }}</h2>
        <div class="not-start-list" v-for="item in props.list">
            <span>time: {{ formatDate(item.time) }}</span>
            <span>name: {{ item.eventName }}</span>
            <span>deadline: {{ formatDate(item.deadline) }}</span>
            <button @click="props.eventTypeToOnGoing(item.id)" v-if="props.status === 0">开始该事件</button>
            <button @click="props.eventTypeToFinished(item.id)" v-if="props.status === 1">完成该事件</button>
            <button @click="props.deleteEvent(item.id)">删除该事件</button>
        </div>
    </div>
</template>

<style scoped>
span {
  margin: 20px;
}
</style>