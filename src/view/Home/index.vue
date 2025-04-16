<script lang="ts" setup>
import { useTodoList } from './useTodoList'
import TodoListItem from './TodoListItem.vue';
import { onBeforeUnmount } from 'vue';

const {
  eventName,
  deadlineRef,
  addTodo,
  getTodoListByType,
  eventTypeToOnGoing,
  eventTypeToFinished,
  deleteEvent,
  timer,
  closeTimer,
} = useTodoList();

const todolistType = [
  { title: '未开始事件', status: 0 },
  { title: '进行中事件', status: 1 },
  { title: '已完成事件', status: 2 }
]

onBeforeUnmount(() => {
  closeTimer();
})
</script>

<template>
  <div class="app-container">
    <h1>To Do List</h1>
    <h4>Record your daily task</h4>
    <div class="add-btn">
      <input placeholder="事件" type="text" v-model="eventName" />
      <input type="datetime-local" ref="deadlineRef">
      <button @click="addTodo">添加事件</button>
    </div>
    <button @click="closeTimer">关闭事件提醒</button>
    <hr />
    <div class="event-list-finished">
      <TodoListItem v-for="(item, index) in todolistType" :key="index" :list="getTodoListByType(item.status)" :title="item.title"
        :status="item.status" :eventTypeToOnGoing="eventTypeToOnGoing" :deleteEvent="deleteEvent"
        :eventTypeToFinished="eventTypeToFinished" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/theme.scss";

.app-container {
    padding: $spacing-lg;
    max-width: 1000px;
    margin: 0 auto;
    
    h1 {
        color: $text-color;
        margin-bottom: $spacing-md;
        font-family: $font-family;
    }
    
    h4 {
        color: lighten($text-color, 20%);
        margin-bottom: $spacing-lg;
    }
    
    .add-btn {
        display: flex;
        gap: $spacing-md;
        margin-bottom: $spacing-lg;
        
        input {
            @include input;
            flex: 1;
        }
        
        button {
            @include button;
        }
    }
    
    button {
        @include button;
        background: $secondary-color;
        margin-bottom: $spacing-lg;
        
        &:hover {
            background: darken($secondary-color, 10%);
        }
    }
    
    hr {
        border: none;
        border-top: 1px solid $border-color;
        margin: $spacing-lg 0;
    }
    
    .event-list-finished {
        display: grid;
        gap: $spacing-lg;
        
        @include responsive('md') {
            grid-template-columns: repeat(3, 1fr);
        }
    }
}
</style>