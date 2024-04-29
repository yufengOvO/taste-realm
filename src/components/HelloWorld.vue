<script setup lang="ts">
//测试pinia共享数据
import { testStore } from '@/store/test/index'
import { computed } from 'vue';
// 获取store
const store = testStore()
//从store里获取count
const count = computed(() => {
  return store.getCount
})
// 改变store里面的值
const addBtn = () => {
  store.setCount(++store.count)
}
</script>

<template>
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <el-button @click="addBtn">Default</el-button>
    <el-button type="primary">primary</el-button>
    <el-icon :size="20">
      <Edit />
    </el-icon>


    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
@/store/index