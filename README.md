# 需求展示平台

一个全栈需求发布与管理平台，支持需求发布、订单管理、支付提现等功能。

## 技术栈

### 后端
- Node.js 18+
- Express + TypeScript
- MySQL 8.0
- Redis (可选)
- JWT 认证

### 前端
- React 18
- TypeScript
- Ant Design 5
- Vite

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- MySQL >= 8.0
- Redis >= 6.0 (可选)

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd requirement-platform

# 安装依赖
npm run install:all

# 配置环境变量
cp backend/.env.example backend/.env
# 编辑 backend/.env 文件，设置必要的环境变量

# 初始化数据库
mysql -u root -p < deploy/database/init.sql

# 启动开发服务器
npm run dev
```

### 访问地址
- 前端: http://localhost:5173
- 后端: http://localhost:3001
- API文档: http://localhost:3001/api-docs

## 主要功能

- ✅ 用户注册/登录
- ✅ 需求发布与管理
- ✅ 订单系统
- ✅ 支付与提现
- ✅ 公告管理
- ✅ 广告管理
- ✅ 数据开关控制
- ✅ 安全监控

## License

MIT