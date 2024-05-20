<template>
    <el-main>
        <!-- 新增按钮 -->
        <el-button type="primary" icon="Plus" @click="addBtn" size="default" >新增</el-button>
        <!-- 新增弹框 -->
        <SysDialog :title="dialog.title" :width="dialog.width" :height="dialog.height" :visible="dialog.visible"
            @onClose="onClose" @onConfirm="commit">
            <!-- 弹窗内容--新增表单 -->
            <template v-slot:content>
                <el-form :model="addModel" ref="addRef" :rules="rules" label-width="80px" :inline="false" size="default">
                    <el-form-item label="菜单类型">
                        <el-radio-group v-model="addModel.type">
                            <el-radio :label="1">菜单</el-radio>
                            <el-radio :label="2">按钮</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12" :offset="0">
                            <el-form-item label="上级菜单">
                                <el-tree-select @check="nodeClick" v-model="addModel.parentId" :data="parentList"
                                    :render-after-expand="false" show-checkbox check-strictly/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="0">
                            <el-form-item label="菜单名称">
                                <el-input v-model="addModel.title"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12" :offset="0">
                            <el-form-item label="权限字段">
                                <el-input v-model="addModel.code"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="0">
                            <el-form-item label="菜单序号">
                                <el-input v-model="addModel.orderNum"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="addModel.type != '2'">
                        <el-col :span="12" :offset="0">
                            <el-form-item label="路由">
                                <el-input v-model="addModel.path"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="0">
                            <el-form-item label="菜单图标">
                                <el-input v-model="addModel.icon"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
        </SysDialog>
    </el-main>
</template>
<script setup lang="ts">
//引入弹窗组件
import SysDialog from "@/components/SysDialog.vue";
import useDialog from "@/hooks/useDialog";
import {reactive,ref} from "vue"
// 弹框属性
const {dialog, onClose, onShow } = useDialog();

import { ElMessage,FormInstance } from "element-plus";
// 表单ref属性
const addRef = ref<FormInstance>();

// 引入api
import { getParentApi,addApi } from "@/api/menu/index"

const addBtn = () =>{
    dialog.height = 200;
    getParentList();
    // 展示弹框
    onShow();
}

const addModel = reactive({
    menuId:"",
    parentId:"",
    title:"",
    code:"",
    type:"",
    icon:"",
    path:"",
    parentName:"",
    orderNum:"",
})

// 上级菜单树的数据
const parentList = ref([]);
// 获取上级菜单数据
const getParentList = async () => {
    let res = await getParentApi();
    if (res && res.code == 200) {
        parentList.value =res.data;
    }
}

const nodeClick = (e:any) => {
    addModel.parentName = e.title; //获取菜单题名
}

// 提交新增表单
const commit = () =>{
    addRef.value?.validate(async (valid) => {
        if (valid) {
            let res = await addApi(addModel);
            console.log(res);
            if(res && res.code == 200){
                ElMessage.success(res.msg);
                onClose();
            }
        }
    });
};

// 表单验证
const rules = reactive({
    type: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
    parentId: [{ required: true, message: "请选择上级菜单", trigger: "change" }],
    title: [{ required: true, message: "请填写菜单标题", trigger: "change" }],
    code: [{ required: true, message: "请输入菜单权限字段", trigger: "change" }],
    icon: [{ required: true, message: "请填写菜单图标", trigger: "change" }],
    path: [{ required: true, message: "请填写菜单path", trigger: "change" }],
    orderNum: [{ required: true, message: "请填写序号", trigger: "change" }],
});

</script>
<style scoped></style>