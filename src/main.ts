import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
// 导入路由
import router from './router/index'

//引入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import *as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 引入pinia
import { createPinia } from 'pinia'
// 实例化 Pinia
const pinia = createPinia()
// 使用持久化插件
pinia.use(piniaPluginPersistedstate)

//国际化-解决分页插件英文转中文
import zhCn from 'element-plus/es/locale/lang/zh-cn'
//引入警告
import warningConfirm from './utils/warningConfirm'

//使用路由
const app = createApp(App);
app.use(pinia)
    .use(ElementPlus, { locale: zhCn })
    .use(router)
    .mount('#app')
//app.use(ElementPlus).use(router).mount('#app')
//app.use(router).mount('#app')
//全局注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
//createApp(App).mount('#app')
//全局挂载警告弹窗
app.config.globalProperties.$warningConfirm = warningConfirm;