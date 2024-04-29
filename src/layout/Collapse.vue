<template>
    <!-- 折叠图标 -->
    <el-icon :size="30" @click="iconClick">
        <!-- 动态组件：来回切换两个折叠图标 -->
        <component :is="status ? Expand : Fold"></component>
    </el-icon>
</template>

<script setup lang="ts">
// 导入共享数据
import { collapseStore } from '@/store/collapse/index';
import { computed } from 'vue';
// 导入折叠组件的两个图标
import { Expand, Fold } from "@element-plus/icons-vue";
// 实例化共享数据
const store = collapseStore()
// 获取共享数据，并将值赋给status变量
const status = computed(() => {
    return store.getCollapse
})
// 点击图标--点击时，让共享数据的值取反
const iconClick = () => {
    store.setCollapse(!store.collapse)
}
</script>
<style scoped></style>