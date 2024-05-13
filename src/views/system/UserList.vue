<template>
    <el-main>
        <!-- 搜索栏 -->
        <el-form :model="searchParm" :inline="true" size="default">
            <el-form-item>
                <el-input placeholder="请输入电话" v-model="searchParm.phone"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="Search" @click="searchBtn">搜索</el-button>
                <el-button type="danger" plain icon="Close" @click="resetBtn">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格 -->
        <el-table :height="tableHeight" :data="tableList" border stripe>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="nickName" label="昵称"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
            <el-table-column prop="username" label="账户"></el-table-column>
            <el-table-column prop="status" label="停用">
                <template #default="scope">
                    <el-switch v-model="scope.row.status" :active-value="'0'" :inactive-value="'1'"
                        :before-change="beforeStatus" @change="changeStatus(scope.row.status, scope.row.userId)" />
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="250">
                <template #default="scope">
                    <el-button icon="Setting" type="success" size="default"
                        @click="resetPas(scope.row)">重置密码</el-button>
                    <el-button icon="Delete" type="danger" size="default" @click="deleteBtn(scope.row)">删除</el-button>
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

import { reactive, onMounted, ref, nextTick } from "vue";
// 引入api接口
import { getListApi, stopUserApi, updatePasseordApi, deleteApi } from "@/api/wxuser/index";
// 引入用户数据
import { WxUser } from "@/api/wxuser/WxUserModel";
// 引入消息弹窗
import useWarnConfirm from "@/hooks/useWarnConfirm";
// 引入消息提示组件
import { ElMessage } from "element-plus";
const { global } = useWarnConfirm();


//搜索参数
const searchParm = reactive({
    currentPage: 1,
    pageSize: 10,
    phone: "",
    total: 0,
});
// 表格高度
const tableHeight = ref(0);


// 表格数据
const tableList = ref([]);
// 重置密码
const resetPas = async (row: WxUser) => {
    let confirm = await global.$warningConfirm("确定重置密码吗？重置后的密码为【666666】");
    if (confirm) {
        let res = await updatePasseordApi({
            userId: row.userId,
        });
        if (res && res.code == 200) {
            ElMessage.success(res.msg)
            getList()
        }
    }
};
// 删除
const deleteBtn = async (row: WxUser) => {
    let confirm = await global.$warningConfirm("确定删除该用户吗？");
    if (confirm) {
        let res = await deleteApi({
            userId: row.userId,
        });
        if (res && res.code == 200) {
            ElMessage.success(res.msg)
            getList()
        }
    }

}
//搜索
const searchBtn = () => {
    //后端会自动根据是否传入nickname分辨出模糊查询，还是查询所有数据
    getList()
}
//重置
const resetBtn = () => {
    searchParm.phone = ''//清空搜索框
    getList()//重新读取数据
}
// 获取表格数据，查看读取数据
const getList = async () => {
    let res = await getListApi(searchParm);
    if (res && res.code == 200) {

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
    nextTick(() => {
        tableHeight.value = window.innerHeight - 200;

    });
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
        userId: goodsId,
        status: type
    });
    if (res && res.code == 200) {
        getList();
    }
}

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




</script>
<style scoped></style>