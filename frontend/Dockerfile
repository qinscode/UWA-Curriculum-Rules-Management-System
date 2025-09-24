# 使用多阶段构建优化镜像大小
# 阶段1: 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 
COPY package.json ./

# 使用 npm 安装依赖（更稳定）
RUN npm install

# 复制源代码
COPY . .

# 设置构建时环境变量
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:6015/api
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# 构建应用
RUN npm run build

# 阶段2: 生产阶段
FROM node:18-alpine AS runner

# 设置工作目录
WORKDIR /app

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 从构建阶段复制构建产物
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 修改文件所有权
RUN chown -R nextjs:nodejs /app

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 6014

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=6014

# 启动应用
CMD ["node", "server.js"]
