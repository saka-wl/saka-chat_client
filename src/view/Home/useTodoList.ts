import { ref, type Ref } from "vue";
import { v4 as uuidv4 } from 'uuid';

export interface ITodoListItem {
    id: string;
    time: number;
    eventName: string;
    deadline: number;
    status: number;
}

export function useTodoList() {
    /**
     * todolist 列表
     */
    const todoList = ref<ITodoListItem[]>(JSON.parse(localStorage.getItem('todolist') as string) || []);
    /**
     * 新建事件名字
     */
    const eventName = ref('');
    const deadlineRef = ref(null);

    const addTodo = () => {
        const inputDateValue = deadlineRef.value?.value;
        console.log(new Date(inputDateValue));
        todoList.value.push({
            id: uuidv4(),
            time: Date.now(),
            eventName: eventName.value,
            deadline: new Date(inputDateValue).valueOf(),
            /**
             * 0 - 未开始
             * 1 - 正在进行
             * 2 - 已完成
             */
            status: 0
        });
        handleTodoListChange();
    }

    const handleTodoListChange = () => localStorage.setItem('todolist', JSON.stringify(todoList.value));

    const getTodoListByType = (val: number) => {
        return todoList.value.filter(it => it.status === val);
    }
    const eventTypeToOnGoing = (id: string) => {
        todoList.value = todoList.value.map(it => {
            if (it.id !== id) return it;
            return { ...it, status: 1 };
        });
        handleTodoListChange();
    }
    const eventTypeToFinished = (id: string) => {
        todoList.value = todoList.value.map(it => {
            if (it.id !== id) return it;
            return { ...it, status: 2 };
        });
        handleTodoListChange();
    }
    const deleteEvent = (id: string) => {
        todoList.value = todoList.value.filter(it => it.id !== id);
        handleTodoListChange();
    }

    // 使用requestAnimationFrame实现高精度计时器
    let lastCheckTime = Date.now();
    let animationFrameId: number | null = null;
    
    const checkTodoDeadlines = (timestamp: number) => {
        // 每分钟检查一次
        const currentTime = Date.now();
        if (currentTime - lastCheckTime >= 1000 * 60) {
            lastCheckTime = currentTime;
            
            let warningMsg = '事件：';
            let endMsg = '事件：';
            let warningFlag = false;
            let endFlag = false;
            
            for (let item of todoList.value) {
                // 使用高精度时间戳进行比较
                if(item.status !== 2 && currentTime >= item.deadline) {
                    endMsg += item.eventName + ' ';
                    endFlag = true;
                } else if(item.status !== 2 && currentTime + 1000 * 60 * 5 >= item.deadline) {
                    warningMsg += item.eventName + ' ';
                    warningFlag = true;
                }
            }
            
            (warningFlag || endFlag) && window.$message.warning(
                (warningFlag ? warningMsg + '，即将到截至时间！' : '') + 
                '\n' + 
                (endFlag ? endMsg + '，已经超时啦！' : ''), 
                { closable: true }
            );
        }
        
        // 继续下一帧
        animationFrameId = requestAnimationFrame(checkTodoDeadlines);
    };
    
    // 启动动画帧循环
    const timer = {
        id: requestAnimationFrame(checkTodoDeadlines)
    };

    const closeTimer = () => {
        if (timer.id) {
            cancelAnimationFrame(timer.id);
            timer.id = null;
        }
    }

    return {
        todoList,
        eventName,
        deadlineRef,
        addTodo,
        handleTodoListChange,
        getTodoListByType,
        eventTypeToOnGoing,
        eventTypeToFinished,
        deleteEvent,
        timer,
        closeTimer
    }
}