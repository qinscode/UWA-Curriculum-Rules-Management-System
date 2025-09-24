# UWA Curriculum Rules Management System - Frontend Docker 部署指南

本文档介绍如何使用 Docker 容器化和部署前端应用。

## 📋 前提条件

- Docker 已安装 (版本 20.10+)
- Docker Compose 已安装 (版本 2.0+)

## 🚀 快速开始

### 1. 构建镜像

```bash
# 使用脚本构建
yarn docker:build

# 或直接使用 Docker 命令
docker build -t uwa-curriculum-frontend .
```

### 2. 运行容器

```bash
# 使用脚本运行
yarn docker:run

# 或直接使用 Docker 命令
docker run -d -p 6014:6014 --name uwa-curriculum-frontend-container uwa-curriculum-frontend
```

### 3. 访问应用

应用将在 http://localhost:6014 上运行

## 🛠 可用命令

### NPM/Yarn 脚本

```bash
# Docker 相关命令
yarn docker:build          # 构建 Docker 镜像
yarn docker:run            # 运行 Docker 容器
yarn docker:stop           # 停止容器
yarn docker:logs           # 查看容器日志
yarn docker:status         # 查看容器状态
yarn docker:cleanup        # 清理容器和镜像

# Docker Compose 命令
yarn docker:dev            # 开发环境（仅前端）
yarn docker:prod           # 生产环境（前端 + Nginx）
```

### 构建脚本 (docker-build.sh)

```bash
# 构建镜像
./docker-build.sh build [tag]

# 运行容器
./docker-build.sh run [tag]

# 停止容器
./docker-build.sh stop

# 查看日志
./docker-build.sh logs

# 查看状态
./docker-build.sh status

# 清理资源
./docker-build.sh cleanup

# 显示帮助
./docker-build.sh help
```

## 🐳 Docker Compose 部署

### 开发环境

```bash
# 启动前端服务
docker-compose up frontend

# 后台运行
docker-compose up -d frontend
```

### 生产环境 (包含 Nginx)

```bash
# 启动前端 + Nginx
docker-compose --profile production up

# 后台运行
docker-compose --profile production up -d
```

生产环境配置包含：
- Next.js 前端应用 (端口 6014)
- Nginx 反向代理 (端口 80/443)
- 静态文件缓存
- Gzip 压缩
- 安全头设置

## 📁 文件结构

```
frontend/
├── Dockerfile              # Docker 镜像构建文件
├── .dockerignore           # Docker 构建忽略文件
├── docker-compose.yml      # Docker Compose 配置
├── nginx.conf              # Nginx 配置文件
├── docker-build.sh         # Docker 构建脚本
└── DOCKER-README.md        # 本文档
```

## ⚙️ 配置说明

### Dockerfile

- 使用多阶段构建优化镜像大小
- 基于 Node.js 18 Alpine 镜像
- 仅包含生产依赖
- 非 root 用户运行
- 暴露端口 6014

### Docker Compose

- **frontend**: Next.js 应用服务
- **nginx**: 反向代理服务（生产环境）
- **curriculum-network**: 自定义网络

### Nginx 配置

- 反向代理到 Next.js 应用
- 静态文件缓存 (1年)
- Gzip 压缩
- 安全头设置
- Health check 端点

## 🔧 环境变量

### 必需的环境变量

- **NEXT_PUBLIC_API_BASE_URL**: 后端 API 的基础 URL
  - 默认值: `http://localhost:6015/api`
  - 示例: `http://backend:6015/api` (容器间通信)
  - 示例: `https://api.your-domain.com/api` (生产环境)

### 配置方法

#### 1. 使用环境变量文件

创建 `.env.local` 文件：
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:6015/api
```

#### 2. 在 docker-compose.yml 中配置

```yaml
environment:
  - NODE_ENV=production
  - PORT=6014
  - NEXT_PUBLIC_API_BASE_URL=http://backend:6015/api
```

#### 3. 构建时传递参数

```bash
# 使用构建脚本
NEXT_PUBLIC_API_BASE_URL=http://backend:6015/api ./docker-build.sh build

# 使用 Docker 命令
docker build --build-arg NEXT_PUBLIC_API_BASE_URL=http://backend:6015/api -t uwa-frontend .
```

#### 4. 运行时传递环境变量

```bash
# 使用构建脚本
NEXT_PUBLIC_API_BASE_URL=http://backend:6015/api ./docker-build.sh run

# 使用 Docker 命令
docker run -e NEXT_PUBLIC_API_BASE_URL=http://backend:6015/api -p 6014:6014 uwa-frontend
```

## 🚨 故障排除

### 1. 构建失败

```bash
# 清理 Docker 缓存
docker system prune -a

# 重新构建
docker build --no-cache -t uwa-curriculum-frontend .
```

### 2. 端口冲突

```bash
# 检查端口占用
lsof -i :6014

# 或修改端口映射
docker run -p 8080:6014 uwa-curriculum-frontend
```

### 3. 容器无法启动

```bash
# 查看容器日志
docker logs uwa-curriculum-frontend-container

# 进入容器调试
docker exec -it uwa-curriculum-frontend-container sh
```

### 4. 内存不足

```bash
# 增加 Docker 内存限制
docker run --memory=2g uwa-curriculum-frontend
```

## 📊 监控和维护

### 查看资源使用

```bash
# 容器资源使用情况
docker stats

# 镜像大小
docker images uwa-curriculum-frontend
```

### 日志管理

```bash
# 查看实时日志
docker logs -f uwa-curriculum-frontend-container

# 查看最近的日志
docker logs --tail 100 uwa-curriculum-frontend-container
```

### 健康检查

访问 http://localhost/health 检查 Nginx 健康状态

## 🔄 更新部署

```bash
# 1. 停止当前容器
yarn docker:stop

# 2. 构建新镜像
yarn docker:build

# 3. 运行新容器
yarn docker:run
```

## 🌐 生产环境建议

1. **SSL 证书**: 在 nginx.conf 中启用 HTTPS 配置
2. **域名**: 修改 server_name 为实际域名
3. **环境变量**: 使用 .env 文件管理敏感信息
4. **日志**: 配置日志轮转和持久化存储
5. **备份**: 定期备份镜像和配置文件
6. **监控**: 集成监控系统 (Prometheus, Grafana)

## 📞 支持

如有问题，请联系开发团队或查阅项目文档。
