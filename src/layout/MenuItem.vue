<template>
    <!-- 循环菜单 -->
    <template v-for="menu in menuList" :key="menu.path">
        <!-- 若一级菜单下有二级菜单 -->
        <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
            <!-- 读取一级菜单 -->
            <template #title>
                <el-icon>
                    <!-- 动态组件 -->
                    <component :is="menu.meta.icon"></component>
                </el-icon>
                <span>{{ menu.meta.title }}</span>
            </template>
            <!-- 递归调用生成二级菜单-->
            <menu-item :menuList="menu.children"></menu-item>
        </el-sub-menu>
        <!-- 若只有一级菜单 -->
        <el-menu-item v-else :index="menu.path">
            <!-- 生成一级菜单 -->
            <el-icon>
                <!-- 动态组件 -->
                <component :is="menu.meta.icon"></component>
            </el-icon>
            <template #title>{{ menu.meta.title }}</template>
        </el-menu-item>
    </template>
</template>

<script setup lang="ts">
//接收父住建传递过来的菜单数据
defineProps(['menuList'])
</script>