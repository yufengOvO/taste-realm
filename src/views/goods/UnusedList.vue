<template>
    <el-main>
        <!-- 搜索栏-->
        <el-form :model="searchParm" :inline="true" size="default">
            <el-form-item>
                <el-input placeholder="请输入商品名称" v-model="searchParm.goodsName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="Search" @click="searchBtn">搜索</el-button>
                <el-button type="danger" plain icon="Close" @click="resetBtn">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格-->
        <el-table :height="tableHeight" :data="tableList" border stripe>
            <el-table-column prop="image" label="商品图片">
                <template #default="scope">
                    <el-image v-if="scope.row.image" style="width:100px;height:60px"
                        :src="scope.row.image.split(',')[0]" />
                </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称">
            </el-table-column>
            <el-table-column prop="type" label="类型">
                <template #default="scope">
                    <el-tag type="danger" v-if="scope.row.type == '0'" size="default" effect="dark">闲置</el-tag>
                    <el-tag type="success" v-if="scope.row.type == '1'" size="default" effect="dark">求购</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="goodsPrice" label="商品价格">
            </el-table-column>
            <el-table-column prop="goodsDesc" label="商品描述">
            </el-table-column>
            <el-table-column prop="userName" label="发布人">
            </el-table-column>
            <el-table-column prop="phone" label="电话">
            </el-table-column>
            <el-table-column prop="wxNum" label="微信号">
            </el-table-column>
            <el-table-column prop="address" label="商品地址">
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template #default="scope">
                    <el-tag type="success" v-if="scope.row.status == '0'" size="default" effect="dark">上架</el-tag>
                    <el-tag type="success" v-if="scope.row.status == '1'" size="default" effect="dark">下架</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="setIndex" label="推荐首页">
                <template #default="scope">
                    <el-tag type="danger" v-if="scope.row.setIndex == '0'" size="default" effect="dark">未推荐</el-tag>
                    <el-tag type="success" v-if="scope.row.setIndex == ' 1'" size=" default" effect="dark">已推荐</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="sellStatus" label="出售状态">
                <template #default="scope">
                    <el-tag type="danger" v-if="scope.row.sellStatus == '0'" size=" default" effect="dark">未出售</el-tag>
                    <el-tag type="success" v-if="scope.row.sellStatus == '1'" size="default" effect="dark">已出售</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="danger" icon="Delete" size="default"
                        @click="deleteBtn(scope.row.goodsId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination @size-change="sizeChange" @current-change="currentChange"
            :current-page.sync="searchParm.currentPage" :page-sizes="[10, 20, 40, 80, 100]"
            :page-size="searchParm.pageSize" layout="total,sizes,prev,pager,next,jumper" :total="searchParm.total"
            background></el-pagination>

    </el-main>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, nextTick } from 'vue';

import { getGoodsListApi } from "@/api/goods/index";

// 搜索框绑定对象
const searchParm = reactive({
    currentPage: 1,
    pageSize: 10,
    goodsName: "",
    total: 0,
});

//搜索
const searchBtn = () => {
    //后端会自动根据是否传入nickname分辨出模糊查询，还是查询所有数据
    getGoodsList()
}
//重置
const resetBtn = () => {
    searchParm.goodsName = ''//清空搜索框
    getGoodsList()//重新读取数据
}


// 表格数据
const tableList = ref([]);
// 删除
const deleteBtn = (goodsId: string) => {
    console.log(goodsId);

};


// 获取表格数据
// 异步函数，用于获取商品列表  
const getGoodsList = async () => {
    // 调用API并等待结果  
    let res = await getGoodsListApi(searchParm);
    // 如果请求成功  
    if (res && res.code == 200) {
        // 打印结果  
        console.log(res);
        // 更新表格数据  
        tableList.value = res.data.records;
        // 更新商品总数  
        searchParm.total = res.data.total;
    }
};

// 组件挂载后执行的逻辑  
onMounted(() => {
    // 获取商品列表  
    getGoodsList();
    // 等待DOM更新后  
    nextTick(() => {
        // 设置表格高度  
        tableHeight.value = window.innerHeight - 200;
    });
});

//表格高度
const tableHeight = ref(0);

//页容量改变触发
const sizeChange = (size: number) => {
    searchParm.pageSize = size
    getGoodsList()
   
}
//页数改变触发
const currentChange = (page: number) => {
    searchParm.currentPage = page
    getGoodsList()

}

</script>
<style scoped></style>