<template>
    <div class="logo-section" :class="{ 'collapsed': isCollapse }">
        <transition name="fade">
            <span v-show="!isCollapse" class="logo-title">{{ title }}</span>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { collapseStore } from '@/store/collapse/index';

const store = collapseStore()
const isCollapse = computed(() => store.getCollapse)
const title = ref("味界探索");
</script>

<style scoped>
.logo-section {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    background: linear-gradient(135deg, #e67e22, #f39c12);
    transition: all 0.3s ease;
    overflow: hidden;
}

.logo-section.collapsed {
    padding: 0;
}

.logo-title {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
