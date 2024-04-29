import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',//解决控制台： Network: use--host to expose
    port: 8080,//配置端号口
    hmr: true,//开起热更新
    open: true,//启动浏览器打开
    proxy:{//跨域链接
      '/api':{
        target:'http://localhost:8089',
        changeOrigin:true,
        rewrite:(path)=> path.replace(/^\/api/,'')

      },

   }
  },
  // vite别名
  resolve:{
    alias:[
      {
        find:'@',
        replacement:resolve(__dirname,'src')
      }
    ]
  }
})
