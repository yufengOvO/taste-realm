<template>
    <!-- 使用菜单logo组件 -->
    <MenuLogo></MenuLogo>
    <!-- 菜单组件-->
    <el-menu v-bind:default-active="activeIndex" class="el-menu-vertical-demo" :collapse="isCollapse" unique-opened
        router @open="handleOpen" @close="handleClose" background-color="#E1FFFF">
        <MenuItem :menuList="menuList">
        </MenuItem>
    </el-menu>
</template>

<script setup lang="ts">

import MenuItem from './MenuItem.vue';
//导入ref和reactive函数
//import { ref, reactive, computed } from 'vue'


// 导入菜单logo组件MenuLogo
import MenuLogo from './MenuLogo.vue'


import { useRoute } from 'vue-router';

//引入共享数据
import { collapseStore } from '@/store/collapse/index';
const collStore = collapseStore()
const isCollapse = computed(() => {
    return collStore.getCollapse
})
const route = useRoute();
//获取激活的菜单
const activeIndex = computed(() => {
    const { path } = route;
    return path;
})




// 不能折叠整个菜单
//const isCollapse = ref(false)
// 需要展开和收起的菜单的方法
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}

import { userStore } from '@/store/user';
const ustore = userStore()

// 获取菜单数据--原始数据
const rawData = computed(() => {
    return ustore.getMenuList
})
import { reactive, computed } from 'vue';

// 转换函数
function transformMenuData(rawData: any[]): any[] {
    const menuList: any[] = [];
    const tempMap: { [key: number]: any } = {}; // 临时映射,用于储存已转换菜单项

    // 第一步: 创建临时映射
    rawData.forEach(item => {
        const title = item.title || ""; // 确保 title 存在并且是字符串
        tempMap[item.menuId] = {
            path: item.path,
            component: 'Layout', // 假设所有组件都是 Layout
            name: title.toLowerCase().replace(/ /g, '_'), // 转换标题为小写并用下划线替换空格
            meta: {
                title: title,
                icon: item.icon.replace('icon', 'HomeFilled'), // 假设 icon 前缀需要替换
                roles: [`sys:${title.toLowerCase().replace(/ /g, '_')}`], // 转换角色
            },
            children: [], // 初始化 children 数组
        };
    });

    // 第二步: 构建嵌套结构
    rawData.forEach(item => {
        const menuItem = tempMap[item.menuId];
        const parent = item.parentId ? tempMap[item.parentId] : null;
        if (parent) { // 如果存在父菜单项,将当前菜单项添加到父菜单项的 children 数组中
            parent.children.push(menuItem);
        } else {
            // 如果没有父菜单项(即顶级菜单),将当前菜单项添加到 menuList 数组中
            menuList.push(menuItem);
        }
    });

    return menuList;
}

// 调用转换函数

const transformedMenuList = transformMenuData(rawData.value);
// 创建reactive数组
const menuList = reactive(transformedMenuList);








//菜单数据:
// const menuList = reactive([
//     {
//         path: "/dashboard",
//         component: "Layout",
//         name: "dashboard",
//         meta: {
//             title: "首页",
//             icon: "HomeFilled",
//             roles: ["sys:dashboard"],
//         },
//     },
//     {
//         path: "/system",
//         component: "Layout",
//         name: "system",
//         meta: {
//             title: "系统管理",
//             icon: "Setting",
//             roles: ["sys:manage"],
//         },
//         children: [

//             {
//                 path: "/adminUser",
//                 component: "/system/AdminUser",
//                 name: "adminUser",
//                 meta: {
//                     title: "管理员管理",
//                     icon: "UserFilled",
//                     roles: ["sys:adminUser"],
//                 },
//             },
//             {
//                 path: "/userList",
//                 component: "/system/UserList",
//                 name: "userList",
//                 meta: {
//                     title: "用户管理",
//                     icon: "Wallet",
//                     roles: ["sys:userList"],
//                 },
//             },
//             {
//                 path: "/menuList",
//                 component: "/system/MenuList",
//                 name: "menuList",
//                 meta: {
//                     title: "菜单管理",
//                     icon: "Menu",
//                     roles: ["sys:menu"],
//                 },
//             },
//         ],
//     },
//     {
//         path: "/goodsRoot",
//         component: "Layout",
//         name: "goodsRoot",
//         meta: {
//             title: "商品管理",
//             icon: "Files",
//             roles: ["sys:goodsRoot"],
//         },
//         children: [
//             {
//                 path: "/goodsType",
//                 component: "/goods/GoodsType",
//                 name: "goodsType",
//                 meta: {
//                     title: "商品分类",
//                     icon: "Grid",
//                     roles: ["sys:goodsType"],
//                 },
//             },
//             {
//                 path: "/unusedList",
//                 component: "/goods/UnusedList",
//                 name: "unusedList",
//                 meta: {
//                     title: "闲置商品",

//                     icon: "Filter",
//                     roles: ["sys:unusedList"],
//                 },
//             },
//             {
//                 path: "/buyList",
//                 component: "/goods/BuyList",
//                 name: "buyList",
//                 meta: {
//                     title: "求购商品",
//                     icon: "Aim",
//                     roles: ["sys:buyList"],
//                 },
//             },
//         ],
//     },
//     {
//         path: "/order",
//         component: "Layout",
//         name: "order",
//         meta: {
//             title: "订单管理",
//             icon: "DocumentCopy",
//             roles: ["sys:order"],
//         },
//         children: [
//             {
//                 path: "/unusedOrder",
//                 component: "/order/UnusedOrder",
//                 name: "unusedOrder",
//                 meta: {
//                     title: "闲置订单",
//                     icon: "Tickets",
//                     roles: ["sys:unusedOrder"],
//                 },
//             },
//             {
//                 path: "/buyOrder",
//                 component: "/order/BuyOrder",
//                 name: "buyOrder",
//                 meta: {
//                     title: "求购订单",
//                     icon: "Document",
//                     roles: ["sys:buyOrder"],
//                 },
//             },
//         ],
//     },
//     {
//         path: "/comment",
//         component: "Layout",
//         name: "comment",
//         meta: {
//             title: "评论管理",
//             icon: "ChatLineSquare",
//             roles: ["sys:comment"],
//         },
//         children: [

//             {
//                 path: "/commentList",
//                 component: "/comment/CommentList",
//                 name: "commentList",
//                 meta: {
//                     title: "评论列表",
//                     icon: "ChatDotSquare",
//                     roles: ["sys:commentList"],
//                 },
//             },
//         ],
//     },
// ]);

</script>
<style scoped>
/* 菜单样式 */
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 230px;
    min-height: 400px;
}

.el-menu {
    border-right: none;
}

:deep(.el-sub-menu.el-sub-menu__title) {
    color: #409eff !important;
}

:deep(.el-menu.el-menu-item) {
    color: #bfcbd9;
}

/* 菜单点中文字的颜色 */
:deep(.el-menu-item.is-active) {
    color: #409eff !important;
}

/* 当前打开菜单的所有子菜单颜色 */
:deep(.is-opened.el-menu-item) {
    background-color: #ccffff !important;
}

/* 鼠标移动菜单的颜色 */
:deep(.el-menu-item:hover) {
    background-color: #ccffff !important;
}
</style>