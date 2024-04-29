<template>
    <!-- logo图片 -->
    <div class="logo">
        <img :src="MenuLogo" alt="logo" style="border-radius: 50%;" />
        <span v-show="show" class="logo-title">{{ title }}</span>
    </div>
</template>
<script setup lang="ts">
// 导入asset文件夹下的logo图片
import MenuLogo from '@/assets/login1.jpg'
import { ref, watch } from "vue";

//导入共享数据
import { collapseStore } from '@/store/collapse/index';
const store = collapseStore()
//默认显示标题
const show = ref(true)
//监听共享数据的值发生改变，让show的值发生改变
watch(
    () => store.getCollapse,
    (collapsed: boolean) => {
        if (!collapsed) {
            setTimeout(() => {
                show.value = !collapsed;
            }, 300)
        } else {
            show.value = !collapsed
        }
    }
)

// logo标题
const title = ref("转转乐");
</script>
<style scoped>
.logo {
    display: flex;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: #ccffcc;
    text-align: center;
    cursor: pointer;
    align-items: center;

    /* 图片 */
    img {
        width: 40px;
        height: 40px;
        margin-left: 50px;
        margin-right: 12px;
    }

    /* 文字 */
    .loge-title {
        color: #FFF;
        font-weight: 800;
        line-height: 60px;
        font-size: 22px;
        font-family: FangSong;
    }
}
</style>