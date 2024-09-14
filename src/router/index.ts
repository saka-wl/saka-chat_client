
import { createMemoryHistory, createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { AUTHORIZATION } from '../constant/request';

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
    },
    {
        path: '/user',
        name: 'user',
        component: () => import('../view/UserInfo/index.vue')
    },
    {
        path: '/file',
        name: 'file',
        component: () => import('../view/File/index.vue'),
        children: [
            {
                path: 'search-file',
                name: 'search-file',
                component: () => import('../view/File/view/SearchFile.vue')
            },
            {
                path: 'upload-file',
                name: 'upload-file',
                component: () => import('../view/File/view/UploadFile.vue')
            },
            {
                path: 'mine-file',
                name: 'mine-file',
                component: () => import('../view/File/view/MineFile.vue')
            },
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const needAuthRouteNames = ['/user', '/friend', '/chat']

router.beforeEach(async (to, from) => {
    const isAuthenticated = localStorage.getItem(AUTHORIZATION);
    const isNeedAuth = needAuthRouteNames.find(it => to.fullPath.indexOf(it));
    if (isNeedAuth && !isAuthenticated && to.name !== 'home') {
        window.$message.warning('您还未登录！', { closable: true });
        // 将用户重定向到登录页面
        return { name: 'home' };
    }
    return true;
})

export default router;