
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
    },
    {
        path: '/friend',
        name: 'friend',
        component: () => import("../view/Friend/index.vue"),
        meta: {
            title: '朋友',
            needAuth: true,
            KeepAlive: false
        },
        children: [
            {
                path: 'search',
                name: 'search',
                component: () => import("../view/Friend/view/Search.vue")
            },
            {
                path: 'request-from-me',
                name: 'request-from-me',
                component: () => import("../view/Friend/view/RequestFromMe.vue")
            },
            {
                path: 'request-to-me',
                name: 'request-to-me',
                component: () => import("../view/Friend/view/RequestToMe.vue")
            },
            {
                path: 'friendDetail/:id',
                name: 'friendDetail',
                component: () => import("../view/Friend/view/FriendDetail.vue")
            },
            {
                path: 'groupDetail/:id',
                name: 'groupDetail',
                component: () => import("../view/Friend/view/GroupDetail.vue")
            }
        ]
    }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router;