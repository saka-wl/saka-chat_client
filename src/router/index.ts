
import { createMemoryHistory, createRouter } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import("../view/Home/index.vue"),
        meta: {
            title: '主页',
            needAuth: false,
            KeepAlive: false
        }
    }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router;