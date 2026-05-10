<template>
    <div class="menu-container">
        <!-- Logo区域 -->
        <div class="logo-section" :class="{ 'collapsed': isCollapse }">
            <transition name="fade">
                <span v-show="!isCollapse" class="logo-title">{{ title }}</span>
            </transition>
        </div>
        
        <!-- 菜单 -->
        <el-menu 
            :default-active="activeIndex" 
            class="el-menu-vertical" 
            :collapse="isCollapse"
            unique-opened
            router 
            :collapse-transition="false"
            background-color="transparent"
            text-color="#606266"
            active-text-color="#e67e22"
        >
            <MenuItem :menuList="menuList" />
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import MenuItem from './MenuItem.vue';
import { ref, watch, computed, reactive } from "vue";
import { useRoute } from 'vue-router';
import { collapseStore } from '@/store/collapse/index';
import { userStore } from '@/store/user';

const collStore = collapseStore()
const ustore = userStore()
const route = useRoute();

const isCollapse = computed(() => collStore.getCollapse)
const title = ref("味界探索");

const activeIndex = computed(() => {
    return route.path;
})

const rawData = computed(() => {
    return ustore.getMenuList
})

function transformMenuData(rawData: any[]): any[] {
    const menuList: any[] = [];
    const tempMap: { [key: number]: any } = {};

    rawData.forEach(item => {
        const title = item.title || "";
        tempMap[item.menuId] = {
            path: item.path,
            component: 'Layout',
            name: title.toLowerCase().replace(/ /g, '_'),
            meta: {
                title: title,
                icon: item.icon.replace('icon', 'HomeFilled'),
                roles: [`sys:${title.toLowerCase().replace(/ /g, '_')}`],
            },
            children: [],
        };
    });

    rawData.forEach(item => {
        const menuItem = tempMap[item.menuId];
        const parent = item.parentId ? tempMap[item.parentId] : null;
        if (parent) {
            parent.children.push(menuItem);
        } else {
            menuList.push(menuItem);
        }
    });

    return menuList;
}

const transformedMenuList = transformMenuData(rawData.value);
const menuList = reactive(transformedMenuList);
</script>

<style scoped lang="scss">
.menu-container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.logo-section {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    background: linear-gradient(135deg, #e67e22, #f39c12);
    transition: all 0.3s ease;
    overflow: hidden;
    
    &.collapsed {
        padding: 0;
    }
}

.logo-title {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.el-menu-vertical {
    flex: 1;
    border-right: none;
    padding: 12px 8px;
    overflow-y: auto;
    overflow-x: hidden;
    
    &:not(.el-menu--collapse) {
        width: 100%;
    }
}

/* 菜单项样式 */
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
    height: 48px;
    line-height: 48px;
    margin-bottom: 4px;
    border-radius: 10px;
    transition: all 0.3s ease;
    
    &:hover {
        background: rgba(230, 126, 34, 0.08) !important;
    }
}

:deep(.el-menu-item.is-active) {
    background: linear-gradient(135deg, rgba(230, 126, 34, 0.12), rgba(243, 156, 18, 0.08)) !important;
    color: #e67e22 !important;
    font-weight: 600;
    position: relative;
    
    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 24px;
        background: linear-gradient(180deg, #e67e22, #f39c12);
        border-radius: 0 3px 3px 0;
    }
}

:deep(.el-sub-menu) {
    margin-bottom: 4px;
}

:deep(.el-sub-menu .el-sub-menu__title) {
    border-radius: 10px;
}

:deep(.el-sub-menu .el-menu) {
    background: transparent !important;
    padding: 4px 0;
}

:deep(.el-sub-menu .el-menu .el-menu-item) {
    padding-left: 52px !important;
    height: 44px;
    line-height: 44px;
    font-size: 13px;
}

/* 折叠状态下的样式 */
:deep(.el-menu--collapse) {
    .el-menu-item,
    .el-sub-menu__title {
        padding: 0 !important;
        display: flex;
        justify-content: center;
        
        .el-sub-menu__icon-arrow {
            display: none;
        }
    }
    
    .el-sub-menu__title {
        .el-icon {
            margin: 0;
        }
    }
}

/* 图标样式 */
:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
    font-size: 18px;
    margin-right: 12px;
    width: 18px;
    height: 18px;
}

/* 滚动条样式 */
.el-menu-vertical::-webkit-scrollbar {
    width: 4px;
}

.el-menu-vertical::-webkit-scrollbar-track {
    background: transparent;
}

.el-menu-vertical::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 2px;
}

.el-menu-vertical::-webkit-scrollbar-thumb:hover {
    background: #c0c4cc;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
