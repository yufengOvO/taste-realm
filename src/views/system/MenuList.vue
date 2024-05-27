<template>
    <el-main>

        <!-- 新增按钮 -->
        <el-button type="primary" icon="Plus" @click="addBtn" size="default" >新增</el-button>

        <!-- 表格 -->
        <el-table :tree-props="{children:'children',hasChildren:'hasChildren'}" row-key="menuId" :data="tableList"  border stripe>
            <el-table-column prop="title" label="菜单名称"></el-table-column>
            <el-table-column prop="type" label="菜单类型">
                <template #default="scope">
                    <el-tag v-if="scope.row.type == '1'" type="success" size="default">菜单</el-tag>
                    <el-tag v-if="scope.row.type == '2'" type="danger" size="default">按钮</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="icon" label="图标">
                <template #default="scope">
                    <el-icon>
                        <!-- 动态组件展示图标 -->
                        <component v-if="scope.row.icon" :is="scope.row.icon"></component>
                    </el-icon>
                </template>
            </el-table-column>
            <el-table-column prop="parentName" label="上级菜单"></el-table-column>
            <el-table-column prop="path" label="路由"></el-table-column>
            <el-table-column prop="code" label="权限字段"></el-table-column>
            <el-table-column prop="orderNum" label="序号"></el-table-column>
            
            <el-table-column label="操作" width="220" align="center">
                <template #default="scope">
                    <el-button type="primary" icon="Edit" size="default" @click="editBtn(scope.row)">编辑</el-button>
                    <el-button type="danger" icon="Delete" size="default" @click="deleteBtn(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

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
                                <el-tree-select @check="nodeClick" v-model="addModel.parentId"  :props="defaultProps" :data="parentList"
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
import {reactive,ref,onMounted,nextTick} from "vue"
// 弹框属性
const {dialog, onClose, onShow } = useDialog();

import { ElMessage,FormInstance } from "element-plus";
// 表单ref属性
const addRef = ref<FormInstance>();

// 引入api
import { getParentApi,addApi,listApi,editApi,deleteApi } from "@/api/menu/index";

import {Menu} from "@/api/menu/MenuModel";

// 新增编辑的标识
const tags = ref("");

// 引入消息弹窗组件
import useWarnConfirm from "@/hooks/useWarnConfirm";
const { global } = useWarnConfirm();

const defaultProps = {
    children: 'children',//指定子树为节点对象的某个属性值
    label: 'title',//指定节点标签为节点对象的某个属性值
}

const addBtn = () =>{
    tags.value = "0";
    dialog.title='新增'
    dialog.height = 200;
    getParentList();
    // 展示弹框
    onShow();
    addRef.value?.resetFields();
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
            let res = null;
            if (tags.value == '0') {
                res = await addApi(addModel);
            } else {
                res = await editApi(addModel);
            }
            console.log(res);
            if(res && res.code == 200){
                ElMessage.success(res.msg);
                getList();
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

//表格数据 
const tableList = ref([])
// 获取表格数据
const getList = async () => {
    let res = await listApi()
    if (res && res.code == 200) {
        console.log(res)
        tableList.value = res.data;
    }
}
// 删除
const deleteBtn = async (row:Menu)=>{
    console.log(row)
    // 消息确定
    const confirm = await global.$warnConfirm('确定删除该数据吗？');
    if (confirm) {
        let res = await deleteApi(row);
        if (res && res.code == 200) {
            ElMessage.success(res.msg);
            getList();
        }
    }
    
}
// 编辑
const editBtn = (row:Menu)=>{
    tags.value = "1";
    dialog.title='编辑'
    //获取上级菜单 
    getParentList();
    nextTick(()=>{
        Object.assign(addModel,row);
    });
    // 展示弹框
    onShow();
    // 清空表单
    addRef.value?.resetFields();

}

onMounted(()=>{
    getList()
})

</script>
<style scoped></style>