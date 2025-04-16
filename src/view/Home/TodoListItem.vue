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
    <div class="todo-list-section">
        <h2 class="section-title">{{ props.title }}</h2>
        <div class="todo-list">
            <div class="todo-item" v-for="item in props.list" :class="{
                'not-started': props.status === 0,
                'in-progress': props.status === 1,
                'completed': props.status === 2
            }">
                <div class="todo-content">
                    <div class="todo-info">
                        <span class="time">创建时间: <hr>
                            {{ formatDate(item.time) }}</span>
                        <span class="name">{{ item.eventName }}</span>
                        <span class="deadline">截止时间: <hr>
                            {{ formatDate(item.deadline) }}</span>
                    </div>
                    <div class="todo-actions">
                        <button class="action-btn start-btn" @click="props.eventTypeToOnGoing(item.id)" v-if="props.status === 0">开始该事件</button>
                        <button class="action-btn complete-btn" @click="props.eventTypeToFinished(item.id)" v-if="props.status === 1">完成该事件</button>
                        <button class="action-btn delete-btn" @click="props.deleteEvent(item.id)">删除该事件</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.todo-list-section {
    margin-bottom: 2rem;

    .section-title {
        color: #2c3e50;
        margin-bottom: 1rem;
        font-size: 1.5rem;
        font-weight: 600;
    }

    .todo-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .todo-item {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;

        &.not-started {
            border-left: 4px solid #e74c3c;
        }

        &.in-progress {
            border-left: 4px solid #f39c12;
        }

        &.completed {
            border-left: 4px solid #27ae60;
            opacity: 0.8;
        }

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
    }

    .todo-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    .todo-info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        .time, .deadline {
            font-size: 0.7rem;
            color: #666;
        }

        .name {
            font-size: 1.1rem;
            font-weight: 500;
            color: #2c3e50;
        }
    }

    .todo-actions {
        display: flex;
        gap: 0.5rem;
    }

    .action-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;

        &:hover {
            transform: scale(1.05);
        }

        &.start-btn {
            background-color: #3498db;
            color: white;
        }

        &.complete-btn {
            background-color: #2ecc71;
            color: white;
        }

        &.delete-btn {
            background-color: #e74c3c;
            color: white;
        }
    }
}
</style>