<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb class="bread" separator="/">
    <!-- 读取面包屑标题 -->
    <el-breadcrumb-item v-for="item in tabs">{{ item.meta.title }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
  
<script setup lang="ts">
// 引入所需函数
import { onMounted, ref, Ref, watch } from "vue";
// 引入路由
import { useRoute, RouteLocationMatched } from "vue-router";
//获取当前路由
const route = useRoute();
//定义面包屑导航数据
const tabs: Ref<RouteLocationMatched[]> = ref([]);
//监听当前路由
watch(
  () => route.path,
  () => getBredcrumb()
);
//获取面包屑导航数据
const getBredcrumb = () => {
  //找出有title的数据--取出所有标题，有可能是多级的
  let mached = route.matched.filter((item) => item.meta && item.meta.title);
  // console.log(mached)
  const first = mached[0]
  // console.log(first)
  // 若点击的不是首页，则在第一级面包屑补上首页
  if (first.path !== '/dashboard') {
    mached = [{ path: '/dashboard', meta: { title: '首页' } } as any].concat(mached)
  }
  // 把读出来的面包屑标题赋值给tabs
  tabs.value = mached
};

// 调用面包屑方法--22行
onMounted(() => {
  getBredcrumb()
})

</script>
  
<style scoped lang="scss">
//修改字体颜色
:deep(.el-breadcrumb__inner) {
  color: #060606 !important;
}

.bread {
  margin-left: 20px;
}

// 修改字体大小
:deep(.el-breadcrumb__item) {
  font-size: 15px !important;
}
</style>
  