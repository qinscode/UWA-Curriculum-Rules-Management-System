# 使用官方 Node.js 18 Alpine 镜像作为基础镜像
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 Python 和构建工具 (某些 npm 包需要)
RUN apk add --no-cache python3 make g++

# 启用 Corepack 以使用正确的 Yarn 版本
RUN corepack enable

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 配置 Yarn 使用 node-modules 链接器而不是 PnP
RUN yarn config set nodeLinker node-modules

# 安装依赖
RUN yarn install --immutable

# 复制源代码和 public 目录
COPY . .

# 构建应用
RUN yarn build

# 生产镜像
FROM node:18-alpine AS production

# 设置工作目录
WORKDIR /app

# 安装 Python 和构建工具 (生产环境可能需要某些二进制包)
RUN apk add --no-cache python3 make g++

# 启用 Corepack 以使用正确的 Yarn 版本
RUN corepack enable

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 配置 Yarn 使用 node-modules 链接器而不是 PnP
RUN yarn config set nodeLinker node-modules

# 安装所有依赖 (包括 devDependencies，因为需要构建工具)
RUN yarn install --immutable

# 从构建阶段复制构建产物
COPY --from=builder /app/dist ./dist

# 直接从当前目录复制 public 目录
COPY public ./public

# 清理开发依赖和缓存以减小镜像大小
RUN yarn cache clean

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# 更改文件所有权
RUN chown -R nestjs:nodejs /app
USER nestjs

# 暴露端口
EXPOSE 6015

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:6015/api/health || exit 1

# 启动应用
CMD ["yarn", "start:prod"]
