<template>
    <el-main>
        <!-- 搜索栏 -->
        <el-form :model="searchParm" :inline="true" size="default">
            <el-form-item>
                <el-input placeholder="请输入商品名称" v-model="searchParm.goodsName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="Search" @click="searchBtn">搜索</el-button>
                <el-button type="danger" plain icon="Close" @click="resetBtn">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格 -->
        <el-table :height="tableHeight" :data="tableList" border stripe>
            <el-table-column prop="image" label="菜品图片">
                <template #default="scope">
                    <el-image v-if="scope.row.image" style="width: 100px; height: 60px;"
                    :src="scope.row.image.split(',')[0]" />
                </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="菜品名称"></el-table-column>
            <el-table-column prop="categoryName"   label="分类"> </el-table-column>
       
            <el-table-column prop="goodsDesc" label="菜品描述"></el-table-column>
            <el-table-column prop="goodsmake" label="菜品制作"></el-table-column>
            <el-table-column prop="makeimage" label="制作图片"></el-table-column>
            <el-table-column prop="userName" label="发布人"></el-table-column>
        
            <el-table-column prop="status" label="上下架状态">
                <template #default="scope">
                    <el-switch v-model="scope.row.status" :active-value="'0'" :inactive-value="'1'" :before-change="beforeStatus" @change="changeStatus(scope.row.status, scope.row.goodsId)" />
                </template>
                </el-table-column>
                <el-table-column prop="setIndex" label="推荐首页">
                    <template #default="scope">
                        <el-switch v-model="scope.row.setIndex" :active-value="'1'" :inactive-value="'0'" :before-change="beforeSetIndex" @change="changeSetIndex(scope.row.setIndex, scope.row.goodsId)" />
                    </template>
                </el-table-column>
             
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="danger" icon="Delete" size="default"
                        @click="deleteBtn(scope.row.goodsId)">删除</el-button>
                    </template>
                </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="sizeChange" @current-change="currentChange"
        :current-page.sync="searchParm.currentPage"
        :page-sizes="[10, 20, 40, 80, 100]" :page-size="searchParm.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="searchParm.total" background>
        </el-pagination>
    </el-main>
</template>
<script setup lang="ts">

import { nextTick, onMounted, reactive, ref } from 'vue';

// 导入api
import { getGoodsListApi, upanddownApi, setIndexApi, deleteApi } from "@/api/goods/index";

// 引入消息弹窗组件
import useWarnConfirm from '@/hooks/useWarnConfirm';
const { global } = useWarnConfirm();

// 搜索栏绑定对象
const searchParm = reactive({
    currentPage:1,
    pageSize:10,
    goodsName:"",
    total:0,
});

// 表格分页高度
const tableHeight = ref(0);

// 表格数据
const tableList = ref([]);

// 删除
const deleteBtn = async (goodsId: string) => {
    console.log(goodsId);
    let confirm = await global.$warningConfirm("确认删除吗？");
    if (confirm) {
        let res = await deleteApi({
            goodsId: goodsId,//商品id
        });
        if (res && res.code == 200){
            getGoodsList();//刷新
        }
    }
};

// 获取表格数据
const getGoodsList = async () => {
    let res = await getGoodsListApi(searchParm);
    if(res && res.code == 200 ){
        console.log(res);
        tableList.value = res.data.records;
        searchParm.total = res.data.total;
    }
};
// 页容量改变时触发
const sizeChange = (size: number) => {
    searchParm.pageSize = size;
    getGoodsList();
};
// 页数改变时触发
const currentChange = (page: number) => {
    searchParm.currentPage = page;
    getGoodsList();
}

// 重置
const resetBtn = ()=>{
    searchParm.goodsName = '';
    getGoodsList();
}
// 搜索
const searchBtn = ()=> {
    getGoodsList();
}

onMounted(() => {
    getGoodsList();
    nextTick(() => {
        // 计算表格高度
        tableHeight.value = window.innerHeight - 200;
    });
});

// 上下架操作之前的事件--弹窗
const beforeStatus = async () => {
    let confirm = await global.$warningConfirm("确定上下架吗？");
    return new Promise((resolve, reject) => {
        if (confirm) {
            return resolve(confirm);
        } else {
            return reject(confirm);
        }
    });
};
// 上下架操作
const changeStatus = async (status: string, goodsId: string) => {
    let res = await upanddownApi({
        goodsId: goodsId,//商品id
        status:status//上下架参数
    });
    if( res && res.code == 200) {
        getGoodsList();//刷新列表
    }
};

// 推荐首页操作之前的事件
const beforeSetIndex = async () => {
    let confirm = await global.$warningConfirm("确定推荐首页吗？");
    return new Promise((resolve, reject) => {
        if(confirm) {
            return resolve(confirm);
        } else {
            return reject(confirm);
        }
    });
}

// 首页操作
const changeSetIndex = async (type: string, goodsId: string) => {
    console.log(type);
    console.log(goodsId);
    let res = await setIndexApi({
        goodsId: goodsId,
        setIndex:type,
    });
    if (res && res.code == 200) {
        getGoodsList();
    }
}


</script>
<style scoped></style>