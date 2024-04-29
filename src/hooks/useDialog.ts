import { reactive } from "vue";

// 将调用弹窗框时要重复的代码封装成一个单独的函数
// 方便代码复用
// 此过程类似Java抽象方法的实现类
export default function useDialog() {
    //弹框属性
    const dialog = reactive({
        title: "新增",
        visible: false,
        width: 630,
        height: 280
    });
    //弹框关闭
    const onClose = () => {
        dialog.visible = false
    };
    //弹框确定
    const onConfirm = () => {
        dialog.visible = false
    };
    //弹框显示
    const onShow = () => {
        dialog.visible = true;
    }
    return {
        dialog,
        onClose,
        onConfirm,
        onShow
    }
}