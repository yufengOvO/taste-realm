<template>
    <el-container class="layout-container">
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '240px'" class="sidebar-container">
            <div class="sidebar-wrapper">
                <Menu />
            </div>
        </el-aside>
        
        <!-- 主内容区 -->
        <el-container class="main-container">
            <!-- 头部导航 -->
            <el-header class="header-container">
                <div class="header-left">
                    <div class="collapse-btn" @click="toggleCollapse">
                        <el-icon :size="20">
                            <component :is="isCollapse ? 'Expand' : 'Fold'" />
                        </el-icon>
                    </div>
                    <BreadCrumb />
                </div>
                
                <div class="header-right">
                    <div class="header-action" @click="handleRefresh">
                        <el-icon :size="18"><Refresh /></el-icon>
                    </div>
                    <div class="header-action" @click="handleFullscreen">
                        <el-icon :size="18"><FullScreen /></el-icon>
                    </div>
                    <Logout />
                </div>
            </el-header>
            
            <!-- 主内容 -->
            <el-main class="main-content">
                <div class="content-wrapper">
                    <router-view v-slot="{ Component }">
                        <transition name="fade-transform" mode="out-in">
                            <component :is="Component" />
                        </transition>
                    </router-view>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Refresh, FullScreen } from '@element-plus/icons-vue';
import Logout from "./Logout.vue";
import Menu from './Menu.vue';
import Collapse from './Collapse.vue';
import BreadCrumb from './BreadCrumb.vue';
import { collapseStore } from '@/store/collapse/index';

const router = useRouter();
const collStore = collapseStore();

const isCollapse = computed(() => collStore.getCollapse);

const toggleCollapse = () => {
    collStore.setCollapse(!collStore.collapse);
};

const handleRefresh = () => {
    router.go(0);
};

const handleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};
</script>

<style scoped lang="scss">
.layout-container {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}

.sidebar-container {
    background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.06);
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 100;
    overflow: hidden;
}

.sidebar-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
}

.main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #f0f2f5;
}

.header-container {
    height: 64px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    z-index: 99;
    border-bottom: 1px solid #f0f0f0;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.collapse-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #606266;
    
    &:hover {
        background: #f5f7fa;
        color: #e67e22;
    }
}

.header-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-action {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #606266;
    
    &:hover {
        background: #f5f7fa;
        color: #e67e22;
    }
}

.main-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    background: #f0f2f5;
}

.content-wrapper {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    min-height: calc(100vh - 112px);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

/* 路由切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
    transition: all 0.3s ease;
}

.fade-transform-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.fade-transform-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .sidebar-container {
        position: fixed;
        height: 100vh;
        z-index: 1000;
    }
    
    .header-container {
        padding: 0 16px;
    }
    
    .main-content {
        padding: 16px;
    }
    
    .content-wrapper {
        padding: 16px;
    }
}
</style>
