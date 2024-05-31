<template>
    <!-- 使用菜单logo组件 -->
    <MenuLogo></MenuLogo>
    <!-- 菜单组件-->
    <el-menu v-bind:default-active="activeIndex" class="el-menu-vertical-demo" :collapse="isCollapse" unique-opened
        router @open="handleOpen" @close="handleClose" background-color="#F2E9E1">
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

</script>
<style scoped>
/* 菜谱主题配色 - 子菜单标题颜色 */
:deep(.el-sub-menu .el-sub-menu__title) {
    color: #91582f !important;
    /* 假设为深棕色，类似于焦糖或酱油的颜色 */
}

/* 菜谱主题配色 - 菜单项默认颜色 */
:deep(.el-menu .el-menu-item) {
    color: #50423c;
    /* 浅棕色或灰色，作为默认文本颜色 */
}

/* 菜单点中文字的颜色（当前选中的菜单项） */
:deep(.el-menu-item.is-active) {
    color: #e67e22 !important;
    /* 亮橙色，表示选中或高亮 */
    font-weight: bold;
    /* 可选：加粗字体以突出显示 */
}

/* 当前打开菜单的所有子菜单背景颜色 */
:deep(.is-opened .el-sub-menu) {
    background-color: #f0e0d6 !important;
    /* 浅黄色或米色，作为打开子菜单的背景 */
}

/* 当前打开菜单项的背景颜色（与鼠标悬停状态相同） */
:deep(.is-opened .el-menu-item) {}

/* 鼠标移动到菜单项上的颜色 */
:deep(.el-menu-item:hover) {
    background-color: #f0e0d6 !important;
    /* 与当前打开子菜单相同的背景颜色 */
    color: #e67e22 !important;
    /* 也可以设置鼠标悬停时的文本颜色为亮橙色 */
}

/* 可选：菜单项分隔线颜色（如果需要的话） */
:deep(.el-menu::before, .el-menu::after) {
    border-color: #a88734;
    /* 深一点的棕色作为分隔线颜色 */
}
</style>