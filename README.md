# 全栈待办事项管理系统

这是一个使用现代技术栈开发的全栈待办事项管理系统，包含 Web 管理端和微信小程序端。

## 项目结构

```
.
├── backend/               # Spring Boot 后端服务
├── web-admin/            # React.js Web管理端
└── miniapp/              # Taro.js + React 微信小程序
```

## 技术栈

### 后端

- Spring Boot
- MySQL
- MyBatis-Plus
- Spring Security

### Web 管理端

- React.js
- Ant Design
- Redux Toolkit
- Axios

### 微信小程序

- Taro.js
- React.js
- Taro UI

## 开发环境要求

- JDK 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

## 快速开始

### 后端服务

1. 进入 backend 目录
2. 配置 application.yml 中的数据库连接
3. 运行 `mvn spring-boot:run`

### Web 管理端

1. 进入 web-admin 目录
2. 运行 `npm install`
3. 运行 `npm start`

### 微信小程序

1. 进入 miniapp 目录
2. 运行 `npm install`
3. 运行 `npm run dev:weapp`

## 数据库设置

1. 安装 MySQL 数据库
2. 创建名为 `app_db` 的数据库
3. 后端服务首次运行时会自动创建表结构

## API 文档

启动后端服务后，可以通过以下地址访问 Swagger API 文档：
http://localhost:8080/swagger-ui.html
