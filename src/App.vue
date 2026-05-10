<template>
    <router-view />
</template>

<style lang="scss">
/* 全局过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* 页面切换动画 */
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
    transform: translateX(20px);
    opacity: 0;
}

.slide-fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
}

/* 全局鼠标样式 */
* {
    cursor: default;
}

a, button, .el-button, .el-menu-item, .el-sub-menu__title, [role="button"] {
    cursor: pointer;
}

input, textarea, [contenteditable] {
    cursor: text;
}

/* 选中文本颜色 */
::selection {
    background: rgba(230, 126, 34, 0.2);
    color: #e67e22;
}
</style>
