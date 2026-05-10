<template>
    <el-breadcrumb class="breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item 
                v-for="(item, index) in tabs" 
                :key="item.path"
                :to="index === 0 ? { path: item.path } : null"
            >
                <span class="breadcrumb-item" :class="{ 'is-active': index === tabs.length - 1 }">
                    {{ item.meta.title }}
                </span>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref, watch } from "vue";
import { useRoute, RouteLocationMatched } from "vue-router";

const route = useRoute();
const tabs: Ref<RouteLocationMatched[]> = ref([]);

watch(
    () => route.path,
    () => getBredcrumb()
);

const getBredcrumb = () => {
    let mached = route.matched.filter((item) => item.meta && item.meta.title);
    const first = mached[0]
    if (first.path !== '/dashboard') {
        mached = [{ path: '/dashboard', meta: { title: '首页' } } as any].concat(mached)
    }
    tabs.value = mached
};

onMounted(() => {
    getBredcrumb()
})
</script>

<style scoped lang="scss">
.breadcrumb {
    display: flex;
    align-items: center;
}

:deep(.el-breadcrumb__inner) {
    color: #909399 !important;
    font-weight: 500 !important;
    font-size: 14px !important;
    transition: color 0.3s ease !important;
}

:deep(.el-breadcrumb__inner:hover) {
    color: #e67e22 !important;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
    color: #303133 !important;
    font-weight: 600 !important;
}

:deep(.el-breadcrumb__separator) {
    color: #c0c4cc !important;
    margin: 0 8px !important;
}

.breadcrumb-item {
    transition: color 0.3s ease;
}

.breadcrumb-item.is-active {
    color: #303133;
}

/* 面包屑动画 */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
    transition: all 0.3s ease;
}

.breadcrumb-enter-from,
.breadcrumb-leave-to {
    opacity: 0;
    transform: translateX(10px);
}

.breadcrumb-move {
    transition: all 0.3s ease;
}
</style>
