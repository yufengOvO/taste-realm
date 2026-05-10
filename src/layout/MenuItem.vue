<template>
    <template v-for="menu in menuList" :key="menu.path">
        <!-- 有子菜单的情况 -->
        <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
            <template #title>
                <el-icon class="menu-icon">
                    <component :is="menu.meta.icon"></component>
                </el-icon>
                <span class="menu-title">{{ menu.meta.title }}</span>
            </template>
            <menu-item :menuList="menu.children"></menu-item>
        </el-sub-menu>
        
        <!-- 无子菜单的情况 -->
        <el-menu-item v-else :index="menu.path">
            <el-icon class="menu-icon">
                <component :is="menu.meta.icon"></component>
            </el-icon>
            <template #title>
                <span class="menu-title">{{ menu.meta.title }}</span>
            </template>
        </el-menu-item>
    </template>
</template>

<script setup lang="ts">
defineProps(['menuList'])
</script>

<style scoped lang="scss">
.menu-icon {
    font-size: 18px;
    transition: all 0.3s ease;
}

.menu-title {
    font-size: 14px;
    font-weight: 500;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
    transition: all 0.3s ease;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
    background: rgba(230, 126, 34, 0.08) !important;
}

:deep(.el-menu-item.is-active) {
    background: linear-gradient(135deg, rgba(230, 126, 34, 0.12), rgba(243, 156, 18, 0.08)) !important;
    color: #e67e22 !important;
    font-weight: 600;
}
</style>
