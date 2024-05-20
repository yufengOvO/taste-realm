<template>
    <el-container class="mycontainer">
        <el-aside width="auto" class="aside">
            <!-- 对应菜单组件 -->
            <Menu></Menu>
        </el-aside>
        <el-container>
            <el-header class="header">
                <div class="header-left">
                    <!-- 使用折叠图标 -->
                    <Collapse></Collapse>
                    <!-- 使用面包屑导航组件 -->
                    <BreadCrumb></BreadCrumb>

                </div>
                <!-- 退出登录 -->
                <Logout></Logout>
            </el-header>
            <el-main class="mymain">
                <!-- 显示菜单页面 -->
                <router-view /></el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
// 引入退出登录
import Logout from "./Logout.vue";
// 导入菜单组件
import Menu from './Menu.vue';
//导入折叠图标
import Collapse from './Collapse.vue';
// 导入面包屑导航组件
import BreadCrumb from './BreadCrumb.vue';

</script>


<style scoped lang="scss">
.mycontainer {
    height: 100%;

    // .aside {
    //     //background-color: rgb(34, 34, 34);
    // }

    .header {
        background-color: #ccffcc;
        display: flex;
        align-items: center;
        color: #0c0c0c;
        justify-content: space-between;

        .header-left {
            display: flex;
            align-items: center;

        }
    }

    .mymain {
        //background-color: seagreen;
        padding: 0;
    }

}
</style>