<template>
    <el-main>
        <!-- 搜索栏 -->
        <el-form :model="searchParm" :inline="true" size="default">
            <el-form-item>
                <el-input v-model="searchParm.nickName" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item>
                <el-button icon="Search" @click="searchBtn">搜索</el-button>
                <el-button icon="Close" type="danger" plain @click="resetBtn">重置</el-button>
                <el-button type="primary" icon="Plus" @click="addBtn" v-permission="['sys:adminUser:add']">新增</el-button>
            </el-form-item>
        </el-form>

        <!-- 新增弹框 -->
        <SysDialog :title="dialog.title" :width="dialog.width" :height="dialog.height" :visible="dialog.visible"
            @on-close="onClose" @on-confirm="commit">
            <!-- 弹窗内容--新增表单 -->
            <template v-slot:content>
                <el-form :model="addModel" ref="addRef" :rules="rules" :inline="false" label-width="80px" size="normal">
                    <el-form-item prop="nickName" label="姓名">
                        <el-input v-model="addModel.nickName"></el-input>
                    </el-form-item>
                    <el-form-item prop="sex" label="性别">
                        <el-radio-group v-model="addModel.sex">
                            <el-radio :label="'0'">男</el-radio>
                            <el-radio :label="'1'">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="phone" label="电话">
                        <el-input v-model="addModel.phone"></el-input>
                    </el-form-item>
                    <el-form-item prop="username" label="登录账户">
                        <el-input v-model="addModel.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password" label="密码">
                        <el-input v-model="addModel.password"></el-input>
                    </el-form-item>
                    <el-form-item prop="status" label="状态">
                        <el-radio-group v-model="addModel.status">
                            <el-radio :label="'0'">启用</el-radio>
                            <el-radio :label="'1'">停用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </template>
        </SysDialog>
        <!-- 管理员数据列表 -->
        <el-table :data="tableList" :height="tableHeight" border stripe>
            <el-table-column prop="nickName" label="姓名"></el-table-column>
            <el-table-column prop="sex" label="性别">
                <template #default="scope">
                    <el-tag v-if="scope.row.sex == '1'" type="danger" effect="dark">女</el-tag>
                    <el-tag v-if="scope.row.sex == '0'" effect="dark">男</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
            <el-table-column prop="username" label="账号"></el-table-column>
            <el-table-column prop="status" label="状态">
                <template #default="scope">
                    <el-tag v-if="scope.row.status == '1'" type="danger" effect="dark">停用</el-tag>
                    <el-tag v-if="scope.row.status == '0'" effect="dark">启用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="320" align="center">
                <template #default="scope">
                    <el-button type="success" icon="Setting" size="default"
                        @click="assignBtn(scope.row)">分配菜单</el-button>
                    <el-button type="primary" icon="Edit" size="default" @click="editBtn(scope.row)">编辑</el-button>
                    <el-button type="danger" icon="Delete" size="default" @click="deleteBtn(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination @size-change="sizeChange" @current-change="currentChange"
            :current-page.sync="searchParm.currentPage" :page-sizes="[10, 20, 40, 80, 100]"
            :page-size="searchParm.pageSize" layout="total,sizes,prev,pager,next,jumper" :total="searchParm.total"
            background></el-pagination>
            <!-- 分配菜单 -->
            <AssignTree ref="assignTree"></AssignTree>
    </el-main>
</template>

<script setup lang="ts">

import { nextTick, onMounted, reactive, ref } from "vue";

//引入弹窗组件
import SysDialog from "@/components/SysDialog.vue";
import useDialog from "@/hooks/useDialog";

// addRef用于在 Vue 组件中引用 
// Element Plus 的 <el-form> 组件的实例，
// 以便可以直接调用表单上的方法（如验证表单）或访问表单的属性。
import { ElMessage, FormInstance } from "element-plus";

// 引入管理员管理api接口
import { addAdminUserApi, deleteAdminApi, editAdminApi, getListApi } from "@/api/user/index";
// 引入·分配树
import AssignTree from "./AssignTree.vue";
const assignTree = ref()

//引入管理员数据类的user
import { User } from "@/api/user/UserModel";
//引入枚举
import { Title } from "@/type/BaseEnum";

// import { nextTick } from "process"
//引入使用警告弹窗数据
import useWarnConfirm from '@/hooks/useWarnConfirm'
//获取全局
const { global } = useWarnConfirm()
const addRef = ref<FormInstance>()
//获取弹框属性
// const { dialog, onClose, onConfirm } = useDialog();
const { dialog, onClose } = useDialog();

//判断修改表单提交，还是新增表单提交标志
const tags = ref('')
//新增按钮
const addBtn = () => {
    tags.value = '0'//为“0”，新增
    dialog.title = Title.ADD  //弹窗变新增
    // 弹窗高度调高
    dialog.height = 300;
    // 弹窗可见
    dialog.visible = true;
};
// 分配菜单
const assignBtn = (row: User) => {
    console.log(row)
    assignTree.value.show(row)
}

//搜索框绑定的数据
const searchParm = reactive({
    nickName: "",
    pageSize: 10,
    currentPage: 1,
    total: 0
});

//表单数据
const tableList = ref([])

//表格高度
const tableHeight = ref(0)

//表单绑定的数据对象
const addModel = reactive({
    userId: "",
    username: "",
    password: "",
    nickName: "",
    phone: "",
    sex: "",
    status: "",
});

//表单验证规则
// 1.el-form-item加prop属性
// 2.编写表单验证规则 rules
// 3.表单要绑定 :rules="rules"
const rules = reactive({
    username: [{ required: true, message: "请输入登录账号", trigger: "blur" }],
    password: [{ required: true, message: "请输入登录密码", trigger: "blur" }],
    nickName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    phone: [{ required: true, message: "请输入电话", trigger: "blur" }],
    sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
});

// 提交表单
const commit = () => {
    addRef.value?.validate(async (valid) => {
        // 验证通过
        if (valid) {
            // console.log(addModel);
            //提交数据
            let res = null;
            if (tags.value == '0') {//标志为0，新增
                res = await addAdminUserApi(addModel);
            } else {
                //标志为1 编辑
                res = await editAdminApi(addModel);
            }
            // 提交表单
            if (res && res.code == 200) {
                //信息提示
                ElMessage.success(res.msg)
                //刷新表格
                getList()
                // 关闭弹窗
                dialog.visible = false;
            }
        }
    })
}


//查询管理员
const getList = async () => {
    let res = await getListApi(searchParm)
    if (res && res.code == 200) {
        console.log("-----------------");
        console.log(res)
        tableList.value = res.data.records;//管理员数据
        searchParm.total = res.data.total;//查询总条数

    }
}
//一进入管路员管理页面就查询管理员信息并显示列表
onMounted(() => {
    //计算机表格高度
    tableHeight.value = window.innerHeight - 200
    getList()
})

//编辑
const editBtn = (row: User) => {
    tags.value = '1'//1 表示编辑提交
    console.log(row)
    dialog.title = Title.EDIT//将编辑弹窗的标题换成编辑
    dialog.height = 300;//弹窗高度
    dialog.visible = true;//显示弹窗
    //显示数据
    nextTick(() => {
        Object.assign(addModel, row)
    })
}
//删除
const deleteBtn = async (row: User) => {
    console.log(row.userId)
    //消息提示
    console.log(global)
    const confirm = await global.$warningConfirm('你确定要删除该数据吗?')
    if (confirm) {
        let res = await deleteAdminApi(row.userId!)
        if (res && res.code == 200) {
            ElMessage.success(res.msg)
            getList()
        }
    }
}
//页容量改变触发
const sizeChange = (size: number) => {
    searchParm.pageSize = size
    getList()
    // console.log(size)
}
//页数改变触发
const currentChange = (page: number) => {
    searchParm.currentPage = page
    getList()
    // console.log(page)
}
//搜索
const searchBtn = () => {
    //后端会自动根据是否传入nickname分辨出模糊查询，还是查询所有数据
    getList()
}
//重置
const resetBtn = () => {
    searchParm.nickName = ''//清空搜索框
    getList()//重新读取数据
}
</script>

<style scoped></style>