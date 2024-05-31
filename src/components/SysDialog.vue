<template>
    <!-- 弹出框+标题 -->
    <el-dialog :title="props.title" :model-value="props.visible" :before-close="onClose" :width="props.width + 'px'"
        append-to-body :close-on-click-modal="false">
        <!-- 内容 -->
        <div class="container" :style="{ height: height + 'px' }">
            <slot name="content">
            </slot>
        </div>
        <!-- 底部按钮 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button type="danger" @click="onClose">取消</el-button>
                <el-button type="primary" @click="onConfirm">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
    
<script setup lang="ts">
// 弹出框变量
interface DialogProps {
    title: string,//标题
    visible: boolean,//是否可见
    width: number,//宽度z
    height: number//高度
}
// 弹出框变量赋值
const props = withDefaults(defineProps<DialogProps>(), {
    title: '标题',
    visible: false,
    width: 630,
    height: 280
});
//   接收父组件传递的方法
const emit = defineEmits(["onClose", "onConfirm"]);
//定义弹框的关闭
const onClose = () => {
    emit("onClose");
};
//定义弹框的确定
const onConfirm = () => {
    emit("onConfirm");
};
</script>

<style scope lang="scss">
// 弹出框样式
.container {
    overflow-x: initial;
    overflow-y: auto;
}

.el-dialog {
    border-top-left-radius: 7px !important;
    border-top-right-radius: 7px !important;
    padding: 0;

    // 头部
    .el-dialog__header {
        margin-right: 0px;
        border-top-left-radius: 7px !important;
        border-top-right-radius: 7px !important;
        background-color: #304156 !important;
        padding: 10px;

        .el-dialog__title {
            color: #fff;
            font-size: 16px;
            font-weight: 600;
        }
    }

    .el-dialog__headerbtn {
        .el-dialog__close {
            color: #fff;
        }
    }

    // 主体内容
    .el-dialog__body {
        padding: 10px;
    }

 // 底部

    .el-dialog__footer {
        border-top: 1pxsolid#e8eaec !important;
        padding: 10px;
    }
}
</style>