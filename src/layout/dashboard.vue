<template>
    <el-main>
        <!-- 搜索栏 -->
        <el-form :model="SwiperParm" :inline="true" size="default">
            <el-form-item>
                <el-input v-model="SwiperParm.title" placeholder="请输入图片标题" />
            </el-form-item>
            <el-form-item>
                <el-button icon="Search" @click="searchBtn">搜索</el-button>
                <el-button icon="Close" type="danger" plain @click="resetBtn">重置</el-button>
                <el-button type="primary" icon="Plus" @click="addBtn"
                    v-permission="['sys:adminUser:add']">新增</el-button>
            </el-form-item>
        </el-form>

        <!-- 新增弹框 -->
        <SysDialog :title="dialog.title" :width="dialog.width" :height="dialog.height" :visible="dialog.visible"
            @on-close="onClose" @on-confirm="commit">
            <!-- 弹窗内容--新增表单 -->
            <template v-slot:content>
                <el-form :model="addModel" ref="addRef" :rules="rules" :inline="false" label-width="80px" size="normal">
                    <el-form-item prop="title" label="标题:">
                        <el-input v-model="addModel.title"></el-input>
                    </el-form-item>
                    <el-form-item prop="orderNum" label="序号:">
                        <el-input type="number" v-model="addModel.orderNum"></el-input>
                    </el-form-item>
                    <el-form-item prop="status" label="状态:">
                        <el-radio-group v-model="addModel.status">
                            <el-radio :label="'0'">启用</el-radio>
                            <el-radio :label="'1'">停用</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-upload  class="upload-demo" drag action="/api/api/upload/uploadImage" multiple :limit="1"
                        @success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <div >将文件拖到此处，或<em>点击上传(只能上传一张哦)</em></div>
                        <div  slot="tip">只能上传jpg/png文件</div>
                    </el-upload>

                </el-form>
            </template>
        </SysDialog>

        <!-- 表格 -->
        <el-table :height="tableHeight" :data="tableList" border stripe>
            <el-table-column prop="images" label="图片">
                <template #default="scope">
                    <el-image v-if="scope.row.images" style="width: 100px; height: 60px;"
                        :src="scope.row.images.split(',')[0]" />
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="orderNum" label="序号"></el-table-column>
            <el-table-column prop="status" label="启用">
                <template #default="scope">
                    <el-switch v-model="scope.row.status" :active-value="'0'" :inactive-value="'1'"
                        :before-change="beforeStatus" @change="changeStatus(scope.row.status, scope.row.banId)" />
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="danger" icon="Delete" size="default"
                        @click="deleteBtn(scope.row.banId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination @size-change="sizeChange" @current-change="currentChange"
            :current-page.sync="SwiperParm.currentPage" :page-sizes="[10, 20, 40, 80, 100]"
            :page-size="SwiperParm.pageSize" layout="total,sizes,prev,pager,next,jumper" :total="SwiperParm.total"
            background></el-pagination>
        <!-- 分配菜单 -->
        <AssignTree ref="assignTree"></AssignTree>
    </el-main>
</template>

<script setup lang="ts">



import { onMounted, reactive, ref } from "vue";

//引入弹窗组件
import SysDialog from "@/components/SysDialog.vue";
import useDialog from "@/hooks/useDialog";

// addRef用于在 Vue 组件中引用 
// Element Plus 的 <el-form> 组件的实例，
// 以便可以直接调用表单上的方法（如验证表单）或访问表单的属性。
import { ElMessage, FormInstance } from "element-plus";

// 引入轮播管理api接口
import { stopUserApi, getSwiperListApi, addSwiperApi, deleteSwiperApi } from "@/api/swiper/index";


//引入枚举
import { Title } from "@/type/BaseEnum";


//引入使用警告弹窗数据
import useWarnConfirm from '@/hooks/useWarnConfirm'
//获取全局
const { global } = useWarnConfirm()
const addRef = ref<FormInstance>()
//获取弹框属性

const { dialog, onClose } = useDialog();

//判断修改表单提交，还是新增表单提交标志
const tags = ref('')
//新增按钮
const addBtn = () => {
    tags.value = '0'//为“0”，新增
    dialog.title = Title.ADD  //弹窗变新增
    // 弹窗高度调高
    dialog.height = 320;
    // 弹窗可见
    dialog.visible = true;
};


//搜索框绑定的数据
const SwiperParm = reactive({
    title: "",
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
    images: "",
    banId: "",
    title: "",
    status: "",
    orderNum: "",
});

//表单验证规则
// 1.el-form-item加prop属性
// 2.编写表单验证规则 rules
// 3.表单要绑定 :rules="rules"
const rules = reactive({
    title: [{ required: true, message: "请输入标题", trigger: "blur" }],
    orderNum: [{ required: true, message: "请输入序号", trigger: "blur" }],
    status: [{ required: true, message: "请选择状态", trigger: "blur" }],
});

//提取传入后端返回对的图片地址加上前缀
const handleAvatarSuccess = (response: any, file: any, fileList: any) => {
    console.log(response, file, fileList);
    const dataUrl = response.data; // 提取 data 属性的值  
    console.log(dataUrl); // 在控制台上打印 data 的值  
    addModel.images = "http://localhost:8088" + dataUrl
    return dataUrl; // 返回 data 的值（如果需要的话）  

};


// 为 beforeAvatarUpload 函数的参数添加类型  
const beforeAvatarUpload = (file: File) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'; // 允许 PNG 格式  
    const isLt20M = file.size < 20 * 1024 * 1024; // 500kb  

    if (!isJPG) {
        ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式!');
        return false;
    }
    if (!isLt20M) {
        ElMessage.error('上传图片大小不能超过 20M!');
        return false;
    }
    return true;
};

// 提交表单
const commit = () => {
    addRef.value?.validate(async (valid) => {
        // 验证通过
        if (valid && addModel.images!="") {
            console.log(addModel)
            // console.log(addModel);
            //提交数据
            let res = null;
            if (tags.value == '0') {//标志为0，新增
                res = await addSwiperApi(addModel);
            }
            // 提交表单
            if (res && res.code == 200) {

                //信息提示
                ElMessage.success(res.msg)
           
                addModel.images = "";
                addModel.banId = "";
                addModel.title = "";
                addModel.status = "";
                addModel.orderNum = "";     //刷新表格
                getList()
                // 关闭弹窗
                dialog.visible = false;
            }
        }
        else{
            ElMessage.error("请填写完整")
        }
    })
}


//查询管理员
const getList = async () => {
    let res = await getSwiperListApi(SwiperParm)
    if (res && res.code == 200) {
        console.log("-----------------");
        console.log(res)
        tableList.value = res.data.records;//管理员数据
        SwiperParm.total = res.data.total;//查询总条数

    }
}
//一进入管路员管理页面就查询管理员信息并显示列表
onMounted(() => {
    //计算机表格高度
    tableHeight.value = window.innerHeight - 200
    getList()
})


// 停用之前
const beforeStatus = async () => {
    let confirm = await global.$warningConfirm("确定此操作吗？");
    return new Promise((resolve, reject) => {
        if (confirm) {
            return resolve(confirm);
        } else {
            return reject(confirm)
        }
    })

}
// 停用之后
const changeStatus = async (type: string, goodsId: string) => {
    let res = await stopUserApi({
        banId: goodsId,
        status: type
    });
    if (res && res.code == 200) {
        getList();
    }
}

// 删除
const deleteBtn = async (goodsId: string) => {
    let confirm = await global.$warningConfirm("确定删除该用户吗？");
    if (confirm) {
        let res = await deleteSwiperApi(
            {
                banId: goodsId,
            }
        );
        if (res && res.code == 200) {
            ElMessage.success(res.msg)
            getList()
        }
    }

}
//页容量改变触发
const sizeChange = (size: number) => {
    SwiperParm.pageSize = size
    getList()
    // console.log(size)
}
//页数改变触发
const currentChange = (page: number) => {
    SwiperParm.currentPage = page
    getList()
    // console.log(page)
}
//搜索
const searchBtn = () => {
    //后端会自动根据是否传入标题分辨出模糊查询，还是查询所有数据
    getList()
}
//重置
const resetBtn = () => {
    SwiperParm.title = ''//清空搜索框
    getList()//重新读取数据
}




</script>

<style scoped lang="scss">
/* 搜索栏样式 */
:deep(.el-form--inline) {
    background: #ffffff;
    padding: 20px 24px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    
    .el-form-item {
        margin-bottom: 0;
        margin-right: 16px;
    }
    
    .el-input__wrapper {
        border-radius: 8px;
    }
    
    .el-button {
        border-radius: 8px;
        padding: 10px 20px;
        
        &--primary {
            background: linear-gradient(135deg, #e67e22, #f39c12);
            border: none;
            box-shadow: 0 2px 8px rgba(230, 126, 34, 0.3);
            
            &:hover {
                opacity: 0.9;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(230, 126, 34, 0.4);
            }
        }
        
        &--danger {
            &.is-plain {
                background: #fef0f0;
                border-color: #fbc4c4;
                color: #f56c6c;
                
                &:hover {
                    background: #f56c6c;
                    border-color: #f56c6c;
                    color: #fff;
                }
            }
        }
    }
}

/* 表格样式 */
:deep(.el-table) {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    
    th.el-table__cell {
        background-color: #fafafa !important;
        color: #303133 !important;
        font-weight: 600 !important;
        font-size: 14px;
        border-bottom: 2px solid #ebeef5;
    }
    
    td.el-table__cell {
        border-bottom: 1px solid #ebeef5;
        color: #606266;
    }
    
    .el-table__row {
        transition: background-color 0.3s ease;
        
        &:hover {
            background-color: #fff8f0 !important;
        }
    }
    
    .el-image {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    
    .el-button {
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 13px;
        
        &--danger {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            border: none;
            
            &:hover {
                opacity: 0.9;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
            }
        }
    }
    
    .el-switch {
        .el-switch__core {
            border-radius: 12px;
        }
    }
}

/* 分页样式 */
:deep(.el-pagination) {
    margin-top: 24px;
    padding: 16px 0;
    justify-content: flex-end;
    
    .el-pagination__total {
        font-weight: 500;
    }
    
    .el-pager li {
        border-radius: 6px;
        margin: 0 2px;
        
        &.is-active {
            background: linear-gradient(135deg, #e67e22, #f39c12);
        }
    }
    
    .el-pagination__sizes {
        .el-input__wrapper {
            border-radius: 6px;
        }
    }
}

/* 上传组件样式 */
:deep(.el-upload) {
    .el-upload-dragger {
        border-radius: 12px;
        border: 2px dashed #dcdfe6;
        transition: all 0.3s ease;
        
        &:hover {
            border-color: #e67e22;
            background: #fff8f0;
        }
    }
}
</style>