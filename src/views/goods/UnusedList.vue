<template>
    <el-main>
        <!-- 搜索栏 -->
        <el-form :model="searchParm" :inline="true" size="default">
            <el-form-item>
                <el-input placeholder="请输入菜品名称" v-model="searchParm.goodsName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="Search" @click="searchBtn">搜索</el-button>
                <el-button type="danger" plain icon="Close" @click="resetBtn">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格 -->
        <el-table :height="tableHeight" :data="tableList" border stripe style="width: 100%">
            <el-table-column prop="image" label="菜品图片" width="150" align="center">
                <template #default="scope">
                    <el-image v-if="scope.row.image" style="width: 150px; height: 100px;" :src="scope.row.image" />
                </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="菜品名称" width="120" align="center"></el-table-column>
            <el-table-column prop="categoryName" label="分类" width="80" align="center"> </el-table-column>

            <el-table-column label="食材" width="120" align="center">
                <template #default="scope">
                    <div style="max-height: 50px; overflow-y: auto;"> <!-- 设定整个列表的最大高度和滚动条 -->
                        <div v-for="(category, index) in scope.row.goodsCategories" :key="index">
                            {{ category.ingredName }}
                        </div>
                    </div>
                </template>
            </el-table-column>

            <el-table-column prop="goodsDesc" label="简介" width="300" align="left">
                <template #default="scope">
                    <div style="max-height: 60px; overflow-y: auto;">{{ scope.row.goodsDesc }}</div>
                </template>
            </el-table-column>

            <el-table-column prop="make" label="步骤" width="300">
                <template #default="scope" align="left">
                    <div style="height: 80px; overflow-y: auto; white-space: pre-wrap;">
                        {{ scope.row.make }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="video" label="视频" width="200" align="center">
                <template #default="scope">
                    <video v-if="scope.row.video" controls width="150" height="100" :src="scope.row.video">
                    </video>
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="发布人" align="center" width="120"></el-table-column>
            <el-table-column prop="phone" label="电话" align="center" width="120"></el-table-column>
            <el-table-column prop="status" label="上下架状态" fixed="right" width="120">
                <template #default="scope">
                    <el-switch v-model="scope.row.status" :active-value="'0'" :inactive-value="'1'"
                        :before-change="beforeStatus" @change="changeStatus(scope.row.status, scope.row.goodsId)" />
                </template>
            </el-table-column>
            <el-table-column prop="setIndex" label="推荐首页" fixed="right" width="120">
                <template #default="scope">
                    <el-switch v-model="scope.row.setIndex" :active-value="'1'" :inactive-value="'0'"
                        :before-change="beforeSetIndex"
                        @change="changeSetIndex(scope.row.setIndex, scope.row.goodsId)" />
                </template>
            </el-table-column>

            <el-table-column label="操作" fixed="right" width="120">
                <template #default="scope">
                    <el-button type="danger" icon="Delete" size="default"
                        @click="deleteBtn(scope.row.goodsId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="sizeChange" @current-change="currentChange"
            :current-page.sync="searchParm.currentPage" :page-sizes="[10, 20, 40, 80, 100]"
            :page-size="searchParm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParm.total"
            background>
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
    currentPage: 1,
    pageSize: 10,
    goodsName: "",
    total: 0,
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
            goodsId: goodsId,//菜品id
        });
        if (res && res.code == 200) {
            getGoodsList();//刷新
        }
    }
};


// 获取表格数据
const getGoodsList = async () => {
    let res = await getGoodsListApi(searchParm);
    if (res && res.code == 200) {
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
const resetBtn = () => {
    searchParm.goodsName = '';
    getGoodsList();
}
// 搜索
const searchBtn = () => {
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
        goodsId: goodsId,//菜品id
        status: status//上下架参数
    });
    if (res && res.code == 200) {
        getGoodsList();//刷新列表
    }
};

// 推荐首页操作之前的事件
const beforeSetIndex = async () => {
    let confirm = await global.$warningConfirm("确定推荐首页吗？");
    return new Promise((resolve, reject) => {
        if (confirm) {
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
        setIndex: type,
    });
    if (res && res.code == 200) {
        getGoodsList();
    }
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
    
    .el-switch {
        .el-switch__core {
            border-radius: 12px;
        }
        
        &.is-checked .el-switch__core {
            background-color: #e67e22;
            border-color: #e67e22;
        }
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
    
    video {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
</style>