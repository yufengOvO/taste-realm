<template>
    <el-dialog 
        :model-value="props.visible" 
        :before-close="onClose" 
        :width="props.width + 'px'"
        append-to-body 
        :close-on-click-modal="false"
        class="custom-dialog"
    >
        <template #header>
            <div class="dialog-header">
                <div class="header-icon">
                    <el-icon><Edit /></el-icon>
                </div>
                <span class="dialog-title">{{ props.title }}</span>
            </div>
        </template>
        
        <div class="dialog-content" :style="{ height: height + 'px' }">
            <slot name="content"></slot>
        </div>
        
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="onClose" class="cancel-btn">
                    <el-icon><Close /></el-icon>
                    <span>取消</span>
                </el-button>
                <el-button type="primary" @click="onConfirm" class="confirm-btn">
                    <el-icon><Check /></el-icon>
                    <span>确定</span>
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { Edit, Close, Check } from "@element-plus/icons-vue";

interface DialogProps {
    title: string;
    visible: boolean;
    width: number;
    height: number;
}

const props = withDefaults(defineProps<DialogProps>(), {
    title: '标题',
    visible: false,
    width: 630,
    height: 280
});

const emit = defineEmits(["onClose", "onConfirm"]);

const onClose = () => {
    emit("onClose");
};

const onConfirm = () => {
    emit("onConfirm");
};
</script>

<style lang="scss">
.custom-dialog {
    border-radius: 16px !important;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
    
    .el-dialog__header {
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
    }
    
    .el-dialog__body {
        padding: 24px !important;
    }
    
    .el-dialog__footer {
        padding: 16px 24px !important;
        border-top: 1px solid #f0f0f0 !important;
    }
}

.dialog-header {
    background: linear-gradient(135deg, #e67e22, #f39c12);
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-icon {
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
}

.dialog-title {
    color: white;
    font-size: 18px;
    font-weight: 600;
}

.dialog-content {
    overflow-x: hidden;
    overflow-y: auto;
    padding: 4px 0;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.cancel-btn {
    border-radius: 8px !important;
    padding: 10px 20px !important;
    
    &:hover {
        color: #e67e22 !important;
        border-color: #e67e22 !important;
    }
}

.confirm-btn {
    border-radius: 8px !important;
    padding: 10px 24px !important;
    background: linear-gradient(135deg, #e67e22, #f39c12) !important;
    border: none !important;
    
    &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3) !important;
    }
}

.cancel-btn,
.confirm-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    
    .el-icon {
        font-size: 14px;
    }
}

/* 内部滚动条样式 */
.dialog-content::-webkit-scrollbar {
    width: 6px;
}

.dialog-content::-webkit-scrollbar-track {
    background: transparent;
}

.dialog-content::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 3px;
}

.dialog-content::-webkit-scrollbar-thumb:hover {
    background: #c0c4cc;
}
</style>
