<template>
    <div class="user-wrapper">
        <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-info">
                <div class="user-avatar">
                    <el-icon :size="20"><User /></el-icon>
                </div>
                <span class="user-name">管理员</span>
                <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="password">
                        <el-icon><Key /></el-icon>
                        <span>修改密码</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided command="logout">
                        <el-icon><SwitchButton /></el-icon>
                        <span>退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        
        <!-- 修改密码弹窗 -->
        <SysDialog 
            :title="dialog.title" 
            :width="dialog.width" 
            :height="dialog.height" 
            :visible="dialog.visible"
            @onClose="onClose" 
            @onConfirm="commit"
        >
            <template v-slot:content>
                <el-form 
                    :model="addModel" 
                    ref="form" 
                    :rules="rules" 
                    label-width="80px" 
                    :inline="false" 
                    size="default"
                >
                    <el-form-item prop="oldPassword" label="旧密码">
                        <el-input 
                            v-model="addModel.oldPassword" 
                            type="password" 
                            show-password
                            placeholder="请输入旧密码"
                        />
                    </el-form-item>
                    <el-form-item prop="password" label="新密码">
                        <el-input 
                            v-model="addModel.password" 
                            type="password" 
                            show-password
                            placeholder="请输入新密码"
                        />
                    </el-form-item>
                    <el-form-item prop="newPassword" label="确认密码">
                        <el-input 
                            v-model="addModel.newPassword" 
                            type="password" 
                            show-password
                            placeholder="请再次输入新密码"
                        />
                    </el-form-item>
                </el-form>
            </template>
        </SysDialog>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, FormInstance } from "element-plus";
import { User, ArrowDown, Key, SwitchButton } from "@element-plus/icons-vue";
import { updatePasswordApi } from "@/api/user/index";
import { userStore } from "@/store/user";
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
import useWarnConfirm from '@/hooks/useWarnConfirm'

const form = ref<FormInstance>();
const store = userStore();
const router = useRouter()
const { dialog, onClose, onShow } = useDialog();
const { global } = useWarnConfirm()

const handleCommand = (command: string) => {
    if (command === 'logout') {
        loginBth()
    } else if (command === 'password') {
        updatePassBtn()
    }
}

const loginBth = async () => {
    const confirm = await global.$warningConfirm("确定退出登录吗？")
    if (confirm) {
        sessionStorage.clear()
        router.push({ name: 'login' })
    }
}

const addModel = reactive({
    userId: "",
    password: "",
    oldPassword: "",
    newPassword: ""
});

const rules = reactive({
    oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
    password: [{ required: true, message: "请输入新密码", trigger: "blur" }],
    newPassword: [{ required: true, message: "请输入确认密码", trigger: "blur" }],
});

const commit = () => {
    if (addModel.newPassword != addModel.password) {
        ElMessage.warning("新密码与确认密码不一致");
        return;
    }
    form.value?.validate(async (valid) => {
        if (valid) {
            let res = await updatePasswordApi(addModel);
            if (res && res.code == 200) {
                ElMessage.success(res.msg);
                sessionStorage.clear();
                router.push({ name: "login" });
            }
        }
    });
}

const updatePassBtn = () => {
    addModel.userId = store.getUserId;
    dialog.title = "修改密码";
    dialog.height = 200;
    onShow();
}
</script>

<style scoped lang="scss">
.user-wrapper {
    display: flex;
    align-items: center;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        background: #f5f7fa;
    }
}

.user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e67e22, #f39c12);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 2px 8px rgba(230, 126, 34, 0.3);
}

.user-name {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
}

.dropdown-icon {
    font-size: 12px;
    color: #909399;
    transition: transform 0.3s ease;
}

:deep(.el-dropdown-menu__item) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    
    .el-icon {
        font-size: 16px;
    }
}
</style>
