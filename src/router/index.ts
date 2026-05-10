import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/Index.vue'

// 路由规则
const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: 'login',
        name: "/"

    }, {
        path: "/login",
        component: () => import('@/views/login/login.vue'),
        name: "login"
    },
    {
        path: '/dashboard',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: '/dashboard',
                component: () => import('@/layout/dashboard.vue'),
                name: 'dashboard',
                meta: {
                    title: '首页',
                    icon: '#icondashboard'
                }
            }
        ]
    },
    {
        path: "/system",
        component: Layout,
        name: "system",
        meta: {
            title: "系统管理",
            icon: "Setting",
            roles: ["sys:manage"],
        },
        children: [
            {
                path: "/adminUser",
                component: () => import('@/views/system/AdminUser.vue'),
                name: "adminUser",
                meta: {
                    title: "管理员管理",
                    icon: "UserFilled",
                    roles: ["sys:adminUser"],
                },
            },
            {
                path: "/userList",
                component: () => import('@/views/system/UserList.vue'),
                name: "userList",
                meta: {
                    title: "用户管理",
                    icon: "Wallet",
                    roles: ["sys:userList"],
                },
            },
            {
                path: "/menuList",
                component: () => import('@/views/system/MenuList.vue'),
                name: "menuList",
                meta: {
                    title: "菜单管理",
                    icon: "Menu",
                    roles: ["sys:menu"],
                },
            },
        ],
    },
    {
        path: "/goodsRoot",
        component: Layout,
        name: "goodsRoot",
        meta: {
            title: "菜品管理",
            icon: "Setting",

            roles: ["sys:goodsRoot"],
        },
        children: [
            {
                path: "/goodsType",
                component: () => import('@/views/goods/GoodsType.vue'),
                name: "goodsType",
                meta: {
                    title: "菜品分类",
                    icon: "UserFilled",
                    roles: ["sys:goodsType"],
                },
            }, {
                path: "/IngredType",
                component: () => import('@/views/goods/IngredType.vue'),
                name: "IngredType",
                meta: {
                    title: "食材分类",
                    icon: "UserFilled",
                    roles: ["sys:IngredType"],
                },
            },
            {
                path: "/unusedList",
                component: () => import('@/views/goods/UnusedList.vue'),
                name: "unusedList",
                meta: {
                    title: "审核菜品",
                    icon: "Wallet",
                    roles: ["sys:unusedList"],
                },
            },

        ],
    },
    // {
    //     path: "/mine",
    //     component: Layout,
    //     name: "order",
    //     meta: {
    //         title: "收藏管理",
    //         icon: "Setting",
    //         roles: ["sys:order"],
    //     },
    //     children: [
    //         {
    //             path: "/unusedOrder",
    //             component: () => import('@/views/order/UnusedOrder.vue'),
    //             name: "unusedOrder",
    //             meta: {
    //                 title: "收藏",
    //                 icon: "UserFilled",
    //                 roles: ["sys:unusedOrder"],
    //             },
    //         },
    //         {
    //             path: "/buyOrder",
    //             component: () => import('@/views/order/BuyOrder.vue'),

    //             name: "buyOrder",
    //             meta: {
    //                 title: "收藏",
    //                 icon: "Wallet",
    //                 roles: ["sys:buyOrder"],
    //             },
    //         },
    //     ],
    // },
    // {
    //     path: "/comment",
    //     component: Layout,
    //     name: "comment",
    //     meta: {
    //         title: "评论管理",
    //         icon: "Setting",
    //         roles: ["sys:comment"],
    //     },
    //     children: [
    //         {
    //             path: "/commentList",
    //             component: () => import('@/views/comment/CommentList.vue'),
    //             name: "commentList",
    //             meta: {
    //                 title: "评论列表",
    //                 icon: "UserFilled",
    //                 roles: ["sys:commentList"],
    //             },
    //         },
    //     ],
    // }
]


// 创建路由
const router = createRouter({
    history: createWebHistory(),
    routes//routes是routes：routes的缩写，第二个routes代表第5行中的routes
})
// 导出路由
export default router