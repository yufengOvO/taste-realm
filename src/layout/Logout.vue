<template>
    <el-dropdown>
        <span class="el-dropdown-link">
            <img class="userimg" src="@/assets/login2.jpg">
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="updatePassBtn">修改密码</el-dropdown-item>
                <el-dropdown-item @click="loginBth">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <!-- 修改密码弹窗 -->
    <SysDialog :title="dialog.title" :width="dialog.width" :height="dialog.height" :visible="dialog.visible"
        @onClose="onClose" @onConfirm="commit">
        <template v-slot:content>
            <el-form :model="addModel" ref="form" :rules="rules" label-width="80px" :inline="false" size="default">
                <el-form-item prop="oldPassword" label="旧密码">
                    <el-input v-model="addModel.oldPassword"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="新密码">
                    <el-input v-model="addModel.password"></el-input>
                </el-form-item>
                <el-form-item prop="newPassword" label="确认密码">
                    <el-input v-model="addModel.newPassword"></el-input>
                </el-form-item>
            </el-form>
        </template>
    </SysDialog>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, FormInstance } from "element-plus";
const form = ref<FormInstance>();
// 引入api
import { updatePasswordApi } from "@/api/user/index";
// 引入共享数据
import { userStore } from "@/store/user";
const store = userStore();

//引入弹窗组件
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
const { dialog, onClose, onShow } = useDialog();
// 引入警告弹窗数据
import useWarnConfirm from '@/hooks/useWarnConfirm'
// 获取全局属性
const { global } = useWarnConfirm()

const router = useRouter()
// 退出登录
const loginBth = async () => {
    const confirm = await global.$warningConfirm("确定退出登录吗？")
    if (confirm) {
        // 清空缓存
        sessionStorage.clear()
        // 跳转登录
        router.push({ name: 'login' })
    }

}
// 表单绑定对象‘
const addModel = reactive({
    userId: "",
    password: "",
    oldPassword: "",
    newPassword: ""
});
//表单验证规则
const rules = reactive({
    oldPassword: [{ required: true, message: "请输入旧密码", trigger: "change" }],
    password: [{ required: true, message: "请输入新密码", trigger: "change" }],
    newPassword: [{ required: true, message: "请输入确认密码", trigger: "change" }],
});



// 提交密码表单
const commit = () => {
    // 判断新密码与确认密码对比
    if (addModel.newPassword != addModel.password) {
        ElMessage.warning("新密码与确认密码不一致");
        return;
    }
    form.value?.validate(async (valid) => {
        if (valid) {
            let res = await updatePasswordApi(addModel);
            if (res && res.code == 200) {
                ElMessage.success(res.msg);
                // 清空缓存，重新登陆
                sessionStorage.clear();
                // 跳转登录
                router.push({ name: "login" });
            }
        }
    });

    ;
}
// 修改密码按钮
const updatePassBtn = () => {
    addModel.userId =store.getUserId;
    console.log(store.getUserId+"---------------------------")
    dialog.title = "修改密码";
    dialog.height = 180;
    onShow();
}

</script>
<style scoped>
.userimg {
    height: 55px;
    width: 55px;
    border-radius: 50%;
}
</style>