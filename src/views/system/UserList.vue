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
        <el-table :height="tableHeight"  :data="tableList" border stripe>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="nickName" label="昵称"></el-table-column>
            <el-table-column prop="phonr" label="电话"></el-table-column>
            <el-table-column prop="username" label="账户"></el-table-column>
            <el-table-column prop="status" label="停用">
                <template #default="scope">
                    <el-switch v-model="scope.row.status" :active-value="'0'" :inactive-value="'1'" />
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
import { getListApi } from "@/api/wxuser/index";
// 引入用户数据
import { WxUser } from "@/api/wxuser/WxUserModel";


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
const resetPas = (row: WxUser) => {
    console.log(row);
};
// 删除
const deleteBtn = (row: WxUser) => {
    console.log(row);

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
        tableHeight.value =window.innerHeight -200;

    });
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




</script>
<style scoped></style>