# 味界探索 - 菜谱管理平台

一个基于 Vue 3 + TypeScript + Vite 的现代化菜谱后台管理系统，用于管理菜品分类、食材分类、用户权限等功能。

## 项目简介

本项目是一个菜谱管理平台的后台管理系统，主要面向管理员，提供以下核心功能：

### 核心功能

- **系统管理**
  - 管理员管理：增删改查管理员信息，分配菜单权限
  - 用户管理：查看、禁用、删除用户，重置密码
  - 菜单管理：动态配置系统菜单和按钮权限

- **菜品管理**
  - 菜品分类：管理菜品分类信息，支持图片上传
  - 食材分类：管理食材分类信息
  - 审核菜品：审核用户提交的菜品，支持上下架和推荐首页

- **权限控制**
  - 基于角色的菜单权限控制
  - 按钮级别的权限控制
  - 动态菜单加载

### 技术特点

- 响应式设计，支持移动端访问
- 现代化 UI 设计，使用 Element Plus 组件库
- 持久化状态管理，刷新不丢失数据
- 完善的错误处理和用户提示
- TypeScript 类型安全

## 技术栈

| 技术         | 版本    | 说明                            |
| ------------ | ------- | ------------------------------- |
| Vue 3        | ^3.4.19 | 渐进式 JavaScript 框架          |
| TypeScript   | ^5.2.2  | JavaScript 的超集，提供类型系统 |
| Vite         | ^5.1.4  | 下一代前端构建工具              |
| Element Plus | ^2.5.6  | Vue 3 UI 组件库                 |
| Pinia        | ^2.1.7  | Vue 状态管理库                  |
| Vue Router   | ^4.3.0  | Vue 路由管理                    |
| Axios        | ^1.3.6  | HTTP 请求库                     |
| Sass         | ^1.71.1 | CSS 预处理器                    |

## 项目结构

```
cook_pc/
├── public/                    # 静态资源
├── src/
│   ├── api/                   # API 接口定义
│   │   ├── category/          # 分类相关 API
│   │   ├── goods/             # 菜品相关 API
│   │   ├── menu/              # 菜单相关 API
│   │   ├── swiper/            # 轮播图相关 API
│   │   ├── user/              # 用户相关 API
│   │   └── wxuser/            # 微信用户相关 API
│   ├── assets/                # 静态资源（图片等）
│   ├── components/            # 公共组件
│   │   ├── HelloWorld.vue
│   │   └── SysDialog.vue      # 系统弹窗组件
│   ├── directives/            # 自定义指令
│   │   └── permission.ts      # 权限指令
│   ├── hooks/                 # 自定义 Hooks
│   │   ├── useDialog.ts       # 弹窗 Hook
│   │   └── useWarnConfirm.ts  # 确认弹窗 Hook
│   ├── http/                  # HTTP 请求封装
│   │   └── index.ts
│   ├── layout/                # 布局组件
│   │   ├── Index.vue          # 主布局
│   │   ├── Menu.vue           # 侧边栏菜单
│   │   ├── MenuItem.vue       # 菜单项组件
│   │   ├── MenuLogo.vue       # Logo 组件
│   │   ├── BreadCrumb.vue     # 面包屑导航
│   │   ├── Collapse.vue       # 折叠按钮
│   │   ├── Logout.vue         # 退出登录
│   │   └── dashboard.vue      # 仪表盘
│   ├── router/                # 路由配置
│   │   └── index.ts
│   ├── store/                 # 状态管理
│   │   ├── collapse/          # 折叠状态
│   │   ├── test/              # 测试状态
│   │   └── user/              # 用户状态
│   ├── style.css              # 全局样式
│   ├── type/                  # 类型定义
│   │   └── BaseEnum.ts
│   ├── utils/                 # 工具函数
│   │   └── warningConfirm.ts
│   ├── views/                 # 页面组件
│   │   ├── goods/             # 菜品管理页面
│   │   ├── login/             # 登录页面
│   │   └── system/            # 系统管理页面
│   ├── App.vue                # 根组件
│   └── main.ts                # 入口文件
├── index.html                 # HTML 模板
├── package.json               # 项目配置
├── tsconfig.json              # TypeScript 配置
├── tsconfig.node.json         # Node TypeScript 配置
└── vite.config.ts             # Vite 配置
```

## 环境要求

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0 或 **yarn**: >= 1.22.0
- **后端服务**: 需要配合后端 API 服务运行（默认端口 8089）

## 部署步骤

### 1. 克隆项目

```bash
git clone <项目地址>
cd cook_pc
```

### 2. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 3. 配置后端地址

编辑 `vite.config.ts` 文件，修改代理配置指向你的后端服务：

```typescript
server: {
  proxy: {
    "/api": {
      target: "http://localhost:8089",  // 修改为你的后端地址
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  },
},
```

### 4. 开发环境运行

```bash
npm run dev
```

启动后访问 http://localhost:8080

### 5. 生产环境构建

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 6. 预览构建结果

```bash
npm run preview
```

### 7. 部署到服务器

#### 方式一：使用 Nginx 部署

1. 将 `dist` 目录上传到服务器

2. 配置 Nginx：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # 处理 Vue Router 的 history 模式
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 代理后端 API
    location /api {
        proxy_pass http://localhost:8089;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. 重启 Nginx：

```bash
nginx -t  # 检查配置
nginx -s reload  # 重新加载
```

#### 方式二：使用 Docker 部署

1. 创建 Dockerfile：

```dockerfile
# 构建阶段
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. 创建 nginx.conf：

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://后端服务地址:8089;
    }
}
```

3. 构建并运行：

```bash
docker build -t cook-pc .
docker run -p 80:80 cook-pc
```

#### 方式三：使用 Vercel/Netlify 部署

1. 在项目根目录创建 `vercel.json` 或 `netlify.toml`

2. Vercel 配置示例：

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

3. 推送代码到 GitHub，连接 Vercel/Netlify 自动部署

## 环境变量配置

创建 `.env` 文件配置环境变量：

```env
# 开发环境
VITE_API_BASE_URL=/api
VITE_APP_TITLE=味界探索 - 菜谱管理平台

# 生产环境
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## 常见问题

### 1. 跨域问题

开发环境已在 `vite.config.ts` 中配置代理。生产环境需要在 Nginx 中配置反向代理。

### 2. 刷新后页面空白

确保 Nginx 配置了 `try_files $uri $uri/ /index.html;` 以支持 Vue Router 的 history 模式。

### 3. 接口请求失败

检查后端服务是否启动，代理配置是否正确。

### 4. 权限菜单不显示

确保用户已正确分配菜单权限，检查后端返回的菜单数据格式。

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 相关项目

- **后端仓库**: [taste-realm](https://github.com/yufengOvO/taste-realm-api)
- **小程序仓库**: [zhuanzhuanuniapp](https://github.com/yufengOvO/taste-realm-mobile)

