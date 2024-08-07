
import { createMemoryHistory, createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import("../view/Home/index.vue"),
        meta: {
            title: '主页',
            needAuth: false,
            keepAlive: false
        }
    },
    {
        path: '/userInfo',
        name: 'userInfo',
        component: () => import("../view/UserInfo/index.vue"),
        meta: {
            title: '用户详情',
            needAuth: true,
            keepAlive: false
        }
    },
    {
        path: '/chat',
        name: 'chat',
        component: () => import("../view/Chat/index.vue"),
        meta: {
            title: '聊天',
            needAuth: true,
            keepAlive: true
        },
        children: [
            {
                path: 'friendchat',
                name: 'friendchat',
                component: () => import("../view/Chat/view/FriendChat.vue"),
                meta: {
                    title: '好友聊天',
                    needAuth: true,
                    keepAlive: true
                }
            }
        ]
    },
    {
        path: '/friend',
        name: 'friend',
        component: () => import("../view/Friend/index.vue"),
        meta: {
            title: '朋友',
            needAuth: true,
            keepAlive: false
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
    history: createWebHashHistory(),
    routes,
})

export default router;