<template>
    <el-main>
        <!-- 搜索栏 -->
        <el-form :model="searchParm" :inline="true" size="default">
            <el-from-item>
                <el-input placeholder="请输入商品名称" v-model="searchParm.goodsName"></el-input>
            </el-from-item>
            <el-from-item>
                <el-button icon="Search"></el-button>
                <el-button type="danger" plain icon="Close">重置</el-button>
            </el-from-item>
        </el-form>
    </el-main>
</template>
<script setup lang="ts">
import { onMounted,reactive } from 'vue';

// 导入api
import { getGoodsListApi } from "@/api/goods/index";

const searchParm = reactive({
    currentPage: 1,
    pageSize: 10,
    goodsName:"",
    total:0,
});

// 获取表格数据
const getGoodsList = async () => {
    let res = await getGoodsListApi(searchParm);
    if(res && res.code == 200){
        console.log(res);
    }
};

onMounted(()=>{
    getGoodsList();
})
</script>
<style scoped></style>