<template>
    <el-main>
        <!-- 搜索栏 -->
        <el-form :model="searchParm" :inline="true" size="default">
            <el-form-item>
                <el-input v-model="searchParm.categoryName" placeholder="请输入分类名称" />
            </el-form-item>
            <el-form-item>
                <el-button icon="Search" @click="searchBtn">搜索</el-button>
                <el-button icon="Close" type="danger" plain @click="resetBtn">重置</el-button>
                <el-button type="primary" icon="Plus" @click="addBtn">新增</el-button>
            </el-form-item>
        </el-form>

        <!-- 弹框组件 -->
        <SysDialog :title="dialog.title" :width="dialog.width" :height="dialog.height" :visible="dialog.visible"
            @on-close="onClose" @on-confirm="commit">
            <!-- 弹窗内容--新增表单 -->
            <template v-slot:content>
                <el-form :model="addModel" ref="addForm" :rules="rules" label-width="100px" size="default">
                    <el-form-item prop="categoryName" label="分类名称:">
                        <el-input v-model="addModel.categoryName"></el-input>
                    </el-form-item>
                    <el-form-item prop="orderNum" label="分类序号:">
                        <el-input type="number" v-model="addModel.orderNum"></el-input>
                    </el-form-item>
                </el-form>
            </template>
        </SysDialog>

        <!-- 表格 -->
        <el-table :data="tableList" :height="tableHeight" border stripe>
            <el-table-column prop="categoryName" label="分类名称"></el-table-column>
            <el-table-column prop="orderNum" label="分类序号"></el-table-column>
            <el-table-column label="操作" width="220" align="center">
                <template #default="scope">
                    <el-button type="primary" icon="Plus" size="default" @click="editBtn(scope.row)">编辑</el-button>
                    <el-button type="danger" icon="Delete" size="default" @click="deleteBtn(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination @size-change="sizeChange" @current-change="currentChange"
            :current-page.sync="searchParm.currentPage" :page-sizes="[10, 20, 40, 80, 100]"
            :page-size="searchParm.pageSize" layout="total,sizes,prev,pager,next,jumper" :total="searchParm.total"
            background>
        </el-pagination>
    </el-main>
</template>

<script setup lang="ts">
//onMounted函数：进入管理员页面查询所有管理员数据
import { nextTick, onMounted, ref, reactive } from "vue";

// 引入分类数据
import { Category } from '@/api/category/CategoryModel'

// 引入弹窗表格
import useDialog from "@/hooks/useDialog";
import SysDialog from "@/components/SysDialog.vue";
import { ElMessage, FormInstance } from "element-plus";

// 导入接口api
import { addCategoryApi, editCategoryApi, listApi, deleteCategoryApi } from '@/api/category/index'

// 引入枚举
import { Title } from "@/type/BaseEnum";

// 引入使用警告弹窗数据
import useWarnConfirm from "@/hooks/useWarnConfirm";
// 获取全局属性
const { global } = useWarnConfirm()
// 弹框属性
const { dialog, onClose, onShow } = useDialog();

// 表单ref属性
const addForm = ref<FormInstance>();

//搜索框绑定的数据
// total：获取商品分类总数，以做分页功能
const searchParm = reactive({
    currentPage: 1,
    pageSize: 10,
    categoryName: "",
    total: 0
});

// 定义接收管理员列表参数tableList，表格数据
const tableList = ref([])

// 表格高度
const tableHeight = ref(0)

// 状态 0新增 1编辑
const tags = ref('')

// 新增按钮
const addBtn = () => {
    tags.value = '0'
    dialog.title = Title.ADD//将弹窗变成新增
    dialog.height = 120;
    // 弹框显示
    onShow();
};

// 提交表单
const commit = () => {
    addForm.value?.validate(async (valid) => {
        // 验证通过
        if (valid) {
            // 提交数据
            let res = null;
            if (tags.value == '0') {
                res = await addCategoryApi(addModel);
            } else {
                res = await editCategoryApi(addModel);
            }
            if (res && res.code == 200) {
                //信息提示
                ElMessage.success(res.msg)
                // 刷新表格
                getList()
                // 关闭弹窗
                onClose()
            }
        }
    })
};

//表单绑定的数据对象
const addModel = reactive({
    categoryId: "",
    categoryName: "",
    orderNum: ""
});

// 表单验证规则
const rules = reactive({
    categoryName: [
        { required: true, message: "请填写分类名称", trigger: "blur" },
    ],
    orderNum: [
        { required: true, message: "请填写分类序号", trigger: "blur" },
    ],
});

// 获取表格数据，查看读取数据
const getList = async () => {
    let res = await listApi(searchParm)
    if (res && res.code == 200) {
        console.log(res)
        // 设置表格数据
        tableList.value = res.data.records;
        // 设置分页总条数
        searchParm.total = res.data.total;
    }
}

// 加载数据
onMounted(() => {
    getList()
    // 计算表格高度
    tableHeight.value = window.innerHeight - 200
})

// 页面容量改变时触发
const sizeChange = (size: number) => {
    searchParm.pageSize = size;
    getList()
}
// 页数改变时触发
const currentChange = (page: number) => {
    searchParm.currentPage = page;
    getList()
}
//23
// 搜索
const searchBtn = () => {
    // 后端会自动根据是否传入categoryname分辨出是模糊查询，还是查询所有数据
    getList()
}
// 重置
const resetBtn = () => {
    searchParm.categoryName = ''//清空搜索框
    getList()//重新读取数据
}

//编辑
const editBtn = (row: Category) => {
    tags.value = '1'
    dialog.title = Title.EDIT//将弹窗变成编辑
    dialog.height = 150;
    //弹窗显示
    onShow();
    // 回显数据
    nextTick(() => {
        Object.assign(addModel, row)
    })
}

// 删除
const deleteBtn = async (row: Category) => {
    //确定信息
    let confirm = await global.$warningConfirm('确定删除该数据吗？')
    if (confirm) {
        let res = await deleteCategoryApi(row)
        if (res && res.code == 200) {
            ElMessage.success(res.msg)
            //刷新列表
            getList()
        }
    }
}

</script>

<style scoped></style>