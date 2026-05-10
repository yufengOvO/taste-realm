<template>
    <div class="login-container">
        <!-- 背景装饰 -->
        <div class="bg-decoration">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
            <div class="circle circle-3"></div>
        </div>
        
        <!-- 登录卡片 -->
        <div class="login-card">
            <!-- 左侧装饰区域 -->
            <div class="login-left">
                <div class="brand-section">
                    <h1 class="brand-title">味界探索</h1>
                    <p class="brand-subtitle">菜谱管理平台</p>
                    <div class="features">
                        <div class="feature-item">
                            <el-icon><Check /></el-icon>
                            <span>智能菜谱管理</span>
                        </div>
                        <div class="feature-item">
                            <el-icon><Check /></el-icon>
                            <span>食材分类管理</span>
                        </div>
                        <div class="feature-item">
                            <el-icon><Check /></el-icon>
                            <span>用户权限控制</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 右侧登录表单 -->
            <div class="login-right">
                <div class="form-header">
                    <h2 class="form-title">欢迎回来</h2>
                    <p class="form-subtitle">请登录您的管理员账户</p>
                </div>
                
                <el-form 
                    class="login-form" 
                    :rules="rules" 
                    :model="loginModel" 
                    ref="form" 
                    :inline="false" 
                    size="large"
                >
                    <el-form-item prop="username">
                        <el-input 
                            placeholder="请输入用户名" 
                            v-model="loginModel.username"
                            prefix-icon="User"
                            class="custom-input"
                        />
                    </el-form-item>
                    
                    <el-form-item prop="password">
                        <el-input 
                            type="password" 
                            placeholder="请输入密码" 
                            v-model="loginModel.password"
                            prefix-icon="Lock"
                            show-password
                            class="custom-input"
                        />
                    </el-form-item>
                    
                    <el-form-item prop="code">
                        <div class="code-row">
                            <el-input 
                                placeholder="请输入验证码" 
                                v-model="loginModel.code"
                                prefix-icon="Key"
                                class="code-input custom-input"
                            />
                            <div class="code-image-wrapper" @click="getImg">
                                <img :src="imgsrc" class="code-image" alt="验证码" />
                                <div class="code-overlay">
                                    <el-icon><Refresh /></el-icon>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                    
                    <el-form-item>
                        <el-button 
                            class="login-btn" 
                            type="primary" 
                            size="large" 
                            @click="commit"
                            :loading="loading"
                        >
                            <span v-if="!loading">登 录</span>
                            <span v-else>登录中...</span>
                        </el-button>
                    </el-form-item>
                    
                    <div class="form-footer">
                        <el-button type="text" @click="resetBtn" class="reset-link">
                            重置表单
                        </el-button>
                    </div>
                </el-form>
            </div>
        </div>
        
        <!-- 底部版权信息 -->
        <div class="footer">
            <p>© 2024 味界探索菜谱管理平台 · 保留所有权利</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FormInstance } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { imageApi, lgoinApi } from "@/api/user/index";
import { userStore } from '@/store/user/index'
import { useRouter } from "vue-router";
import { Check, Refresh } from "@element-plus/icons-vue";

const router = useRouter()
const store = userStore()
const imgsrc = ref('')
const form = ref<FormInstance>();
const loading = ref(false)

const loginModel = reactive({
    username: "",
    password: "",
    code: "",
});

const getImg = async () => {
    let res = await imageApi()
    if (res && res.code == 200) {
        imgsrc.value = res.data;
    }
};

const rules = reactive({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
});

const commit = () => {
    form.value?.validate(async (valid) => {
        if (valid) {
            loading.value = true
            try {
                let res = await lgoinApi(loginModel)
                store.setUserId(res.data.userId)
                store.setMenuList(res.data.menuList)
                store.setCodeList(res.data.codeList)
                router.push({ path: "/dashboard" })
            } catch (error) {
                console.error('登录失败:', error)
            } finally {
                loading.value = false
            }
        }
    })
}

onMounted(() => {
    getImg()
})

const resetBtn = () => {
    loginModel.password = ''
    loginModel.code = ''
    loginModel.username = ''
}
</script>

<style lang="scss" scoped>
.login-container {
    height: 100vh;
    width: 100vw;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
}

.bg-decoration {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    
    .circle {
        position: absolute;
        border-radius: 50%;
        background: rgba(230, 126, 34, 0.05);
        
        &.circle-1 {
            width: 300px;
            height: 300px;
            top: -50px;
            left: -50px;
            animation: float 6s ease-in-out infinite;
        }
        
        &.circle-2 {
            width: 200px;
            height: 200px;
            bottom: -30px;
            right: -30px;
            animation: float 8s ease-in-out infinite reverse;
        }
        
        &.circle-3 {
            width: 150px;
            height: 150px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: pulse 4s ease-in-out infinite;
        }
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-20px) rotate(5deg);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.5;
    }
    50% {
        transform: translate(-50%, -50%) scale(1.1);
        opacity: 0.8;
    }
}

.login-card {
    width: 900px;
    min-height: 520px;
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    display: flex;
    overflow: hidden;
    animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.login-left {
    width: 400px;
    background: linear-gradient(135deg, #e67e22 0%, #f39c12 100%);
    padding: 60px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
        top: -50%;
        left: -50%;
        animation: rotate 20s linear infinite;
    }
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.brand-section {
    position: relative;
    z-index: 1;
    text-align: center;
}

.brand-title {
    font-size: 32px;
    font-weight: 700;
    color: white;
    margin-bottom: 8px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.brand-subtitle {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 40px;
}

.features {
    text-align: left;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: white;
    margin-bottom: 16px;
    font-size: 15px;
    
    .el-icon {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.login-right {
    flex: 1;
    padding: 60px 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.form-header {
    margin-bottom: 40px;
}

.form-title {
    font-size: 28px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 8px;
}

.form-subtitle {
    font-size: 15px;
    color: #7f8c8d;
}

.login-form {
    .el-form-item {
        margin-bottom: 24px;
    }
}

.custom-input {
    :deep(.el-input__wrapper) {
        padding: 8px 16px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;
        
        &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        &.is-focus {
            box-shadow: 0 4px 16px rgba(230, 126, 34, 0.2);
        }
    }
}

.code-row {
    display: flex;
    gap: 16px;
    width: 100%;
}

.code-input {
    flex: 1;
}

.code-image-wrapper {
    width: 140px;
    height: 48px;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    
    &:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        
        .code-overlay {
            opacity: 1;
        }
    }
}

.code-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.code-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    .el-icon {
        color: white;
        font-size: 20px;
    }
}

.login-btn {
    width: 100%;
    height: 52px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    background: linear-gradient(135deg, #e67e22, #f39c12);
    border: none;
    letter-spacing: 4px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(230, 126, 34, 0.3);
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(230, 126, 34, 0.4);
    }
    
    &:active {
        transform: translateY(0);
    }
    
    :deep(.el-loading-spinner .circular) {
        width: 24px;
        height: 24px;
        
        .path {
            stroke: #ffffff;
        }
    }
}

.form-footer {
    text-align: center;
    margin-top: 16px;
}

.reset-link {
    color: #7f8c8d;
    font-size: 14px;
    
    &:hover {
        color: #e67e22;
    }
}

.footer {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    
    p {
        color: #909399;
        font-size: 13px;
    }
}

/* 响应式设计 */
@media (max-width: 960px) {
    .login-card {
        width: 90%;
        max-width: 440px;
        flex-direction: column;
        min-height: auto;
    }
    
    .login-left {
        width: 100%;
        padding: 40px 30px;
        
        .features {
            display: none;
        }
    }
    
    .login-right {
        padding: 40px 30px;
    }
}
</style>
