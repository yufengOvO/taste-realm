<template>
    <div class="logincontainer">
        <el-form class="loginform" :rules="rules" :model="loginModel" ref="form" :inline="false" size="large">
            <img style="width: 40px; height:40px;" src="../../assets/logo.jpg">
            <el-form-item>
                <div class="logintitle">
                    味界探索
                </div>
            </el-form-item>
            <el-form-item prop="username">
                <el-input placeholder="请输入用户名" v-model="loginModel.username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" placeholder="请输入密码" v-model="loginModel.password"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-row :gutter="20">

                    <el-col :span="16" :offset="0">
                        <el-input placeholder="请输入验证码" v-model="loginModel.code"></el-input>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <img @click="getImg" class="image " :src="imgsrc" />
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item>
                <el-row style="width: 100%;">
                    <el-col style="padding-right: 10px; padding-left:0px" :span="12" :offset="0">
                        <el-button style="width: 100%;" type="primary" size="large" @click="commit">登录</el-button>
                    </el-col>
                    <el-col style="padding-right: 0; padding-left:10px" :span="12" :offset="0">
                        <el-button style="width: 100%;" type="primary" size="large" @click="resetBtn">重置</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { FormInstance } from "element-plus";
import { onMounted, reactive, ref } from "vue";
// 引入api
import { imageApi, lgoinApi } from "@/api/user/index";

// 引入路由和共享数据
import { userStore } from '@/store/user/index'
import { useRouter } from "vue-router";
const router = useRouter()
const store = userStore()
// 验证码
const imgsrc = ref('')
// 表单的ref属性
const form = ref<FormInstance>();
// const表单绑定的对象
const loginModel = reactive({
    username: "",
    password: "",
    code: "",
});

// 获取验证码
const getImg = async () => {
    let res = await imageApi()
    if (res && res.code == 200) {
        console.log(res)
        imgsrc.value = res.data;
    }
};
// 表单验证
const rules = reactive({
    username: [{ required: true, message: '请填写账户', trigger: 'change' }],
    password: [{ required: true, message: '请填写密码', trigger: 'change' }],
    code: [{ required: true, message: '请填写验证码', trigger: 'change' }]
});

// 登录提交
const commit = () => {
    form.value?.validate(async (valid) => {
        if (valid) {
            let res = await lgoinApi(loginModel)
            store.setUserId(res.data.userId)
            // 设置权限菜单
            store.setMenuList(res.data.menuList)
            console.log(res.data)
            store.setCodeList(res.data.codeList)
            router.push({ path: "/dashboard" })
        }
    })
}
onMounted(() => {
    getImg()
})


const resetBtn =()=>{
    loginModel.password='',
    loginModel.code='',
    loginModel.username=''
}

</script>
<style lang="scss" scoped>
.logincontainer {
    height: 100vh;
    /* 使用视口高度 */
    background-color: #fff;
    background-image: url("../../assets/loginb.jpg");
    background-size: cover;
    /* 覆盖整个容器 */
    background-position: center;
    /* 图片居中 */
    display: flex;
    justify-content: center;
    align-items: center;

    .loginform {
        height: 360px;
        width: 420px;
        padding: 20px 35px;
        border-radius: 10px;
        background-color: #fff;


        .logintitle {
            display: flex;
            justify-content: center;
            color: #606266;
            width: 100%;
            font-size: 24px;
            font-weight: 600;

        }

        .image {
            height: 40px;
            width: 100%;
            cursor: pointer;
        }
    }
}
</style>
