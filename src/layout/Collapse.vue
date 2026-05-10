<template>
    <div class="collapse-btn" @click="iconClick">
        <el-icon :size="20">
            <component :is="status ? 'Expand' : 'Fold'" />
        </el-icon>
    </div>
</template>

<script setup lang="ts">
import { collapseStore } from '@/store/collapse/index';
import { computed } from 'vue';
import { Expand, Fold } from "@element-plus/icons-vue";

const store = collapseStore()
const status = computed(() => {
    return store.getCollapse
})

const iconClick = () => {
    store.setCollapse(!store.collapse)
}
</script>

<style scoped lang="scss">
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
    
    &:active {
        transform: scale(0.95);
    }
    
    .el-icon {
        transition: transform 0.3s ease;
    }
}
</style>
