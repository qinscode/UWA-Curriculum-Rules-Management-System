# 后端 Docker 容器化指南

本文档介绍如何使用 Docker 运行 UWA 课程规则管理系统的后端服务。

**注意：** 此配置假设您已有现成的 MySQL 数据库，不包含数据库容器。

## 📋 前置条件

确保您的系统已安装以下软件：

- Docker (版本 20.0+)
- 现有的 MySQL 数据库服务器

## 🚀 快速启动

### 1. 环境配置

复制环境变量模板并配置数据库连接：

```bash
cp env.example .env
```

**重要：** 请修改 `.env` 文件中的以下配置：
- `DB_HOST`: 数据库服务器地址
- `DB_USERNAME`: 数据库用户名
- `DB_PASSWORD`: 数据库密码
- `DB_DATABASE`: 数据库名称
- `JWT_SECRET`: 使用强密码

### 2. 启动服务

使用构建脚本一键启动：

```bash
# 使用构建脚本（推荐）
./docker-build.sh

# 或手动构建和运行
docker build -t curriculum-backend .
docker run -d --name curriculum-backend-container --env-file .env -p 6015:6015 curriculum-backend
```

### 3. 验证部署

服务启动后，您可以通过以下方式验证：

- **后端 API**: http://localhost:6015/api
- **健康检查**: http://localhost:6015/api/health

## 🏗️ 构建选项

### 仅构建后端镜像

```bash
docker build -t curriculum-backend .
```

### 生产环境构建

```bash
docker build -t curriculum-backend:prod --target production .
```

## 🔧 服务配置

### 服务列表

| 服务名 | 端口 | 描述 |
|--------|------|------|
| backend | 6015 | NestJS 后端应用 |

### 环境变量

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| DB_HOST | localhost | 数据库主机 |
| DB_PORT | 3306 | 数据库端口 |
| DB_USERNAME | your_db_username | 数据库用户名 |
| DB_PASSWORD | your_db_password | 数据库密码 |
| DB_DATABASE | your_db_name | 数据库名称 |
| JWT_SECRET | (需设置) | JWT 密钥 |
| JWT_EXPIRES_IN | 24h | JWT 过期时间 |
| NODE_ENV | production | 运行环境 |
| PORT | 6015 | 应用端口 |

## 📦 数据管理

### 数据库迁移

```bash
# 进入后端容器
docker exec -it curriculum-backend-container sh

# 运行迁移
yarn migration:run
```

### 数据库连接

确保您的数据库服务器允许来自 Docker 容器的连接。如果数据库运行在主机上，请使用 `host.docker.internal` 作为 `DB_HOST`（在 macOS 和 Windows 上）。

**Linux 用户：** 使用 `--add-host=host.docker.internal:host-gateway` 启动容器：

```bash
docker run -d \
  --name curriculum-backend-container \
  --env-file .env \
  --add-host=host.docker.internal:host-gateway \
  -p 6015:6015 \
  curriculum-backend
```

## 🔍 调试和监控

### 查看日志

```bash
# 查看容器日志
docker logs curriculum-backend-container

# 实时跟踪日志
docker logs curriculum-backend-container -f

# 查看最近 100 行日志
docker logs curriculum-backend-container --tail 100
```

### 进入容器

```bash
# 进入后端容器
docker exec -it curriculum-backend-container sh

# 查看容器状态
docker ps --filter name=curriculum-backend-container
```

### 健康检查

```bash
# 检查服务健康状态
curl http://localhost:6015/api/health

# 查看容器健康状态
docker ps --filter name=curriculum-backend-container
```

## 🛠️ 开发环境

### 开发模式启动

在开发环境中，建议本地运行后端，连接到现有数据库：

```bash
# 本地运行后端
yarn install
yarn start:dev
```

### 开发环境容器

如果需要在容器中进行开发，可以挂载源代码：

```bash
docker run -d \
  --name curriculum-backend-dev \
  --env-file .env \
  -p 6015:6015 \
  -v $(pwd)/src:/app/src \
  curriculum-backend \
  yarn start:dev
```

## 🚨 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   lsof -i :6015
   lsof -i :3306
   ```

2. **权限问题**
   ```bash
   # 重置权限
   sudo chown -R $USER:$USER .
   ```

3. **数据库连接失败**
   - 检查数据库服务器是否运行
   - 验证 `.env` 文件中的数据库配置
   - 确保防火墙允许数据库连接
   - 使用 `host.docker.internal` 连接主机数据库

4. **构建失败**
   ```bash
   # 清理构建缓存
   docker build --no-cache -t curriculum-backend .
   
   # 删除容器和镜像重新开始
   docker stop curriculum-backend-container
   docker rm curriculum-backend-container
   docker rmi curriculum-backend
   ```

### 性能优化

1. **内存限制**
   ```bash
   # 运行容器时设置内存限制
   docker run -d \
     --name curriculum-backend-container \
     --env-file .env \
     --memory="512m" \
     --memory-swap="1g" \
     -p 6015:6015 \
     curriculum-backend
   ```

2. **性能监控**
   ```bash
   # 监控容器资源使用
   docker stats curriculum-backend-container
   ```

## 🔐 生产环境部署

### 安全建议

1. 使用强密码和密钥
2. 启用防火墙规则
3. 定期更新镜像
4. 使用 HTTPS
5. 限制容器权限

### 部署脚本

```bash
#!/bin/bash
# deploy.sh

# 拉取最新代码
git pull origin main

# 构建新镜像
docker build -t curriculum-backend:latest .

# 停止旧容器
docker stop curriculum-backend-container 2>/dev/null || true
docker rm curriculum-backend-container 2>/dev/null || true

# 启动新容器
docker run -d \
  --name curriculum-backend-container \
  --env-file .env \
  --restart unless-stopped \
  -p 6015:6015 \
  curriculum-backend:latest

# 验证部署
sleep 30
curl -f http://localhost:6015/api/health || exit 1

echo "部署成功！"
```

## 📞 支持

如遇问题，请检查：

1. Docker 版本是否支持
2. 数据库连接配置是否正确
3. 系统资源使用情况
4. 网络连接状态
5. 容器日志输出信息

更多帮助请参考项目文档或联系开发团队。
