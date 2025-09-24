#!/bin/bash

# UWA 课程规则管理系统后端 Docker 构建脚本
# Backend Docker Build Script for UWA Curriculum Rules Management System

set -e  # 遇到错误时退出

echo "🏗️  开始构建 UWA 课程规则管理系统后端..."
echo "🏗️  Starting UWA Curriculum Rules Management System Backend build..."

# 检查 Docker 是否已安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# 创建 .env 文件（如果不存在）
if [ ! -f .env ]; then
    echo "📝 创建环境配置文件..."
    echo "📝 Creating environment configuration file..."
    cp env.example .env
    echo "⚠️  请编辑 .env 文件并设置正确的数据库连接信息"
    echo "⚠️  Please edit the .env file and set the correct database connection info"
    echo ""
    echo "📋 需要配置的重要变量："
    echo "📋 Important variables to configure:"
    echo "   DB_HOST=your_database_host"
    echo "   DB_USERNAME=your_database_username" 
    echo "   DB_PASSWORD=your_database_password"
    echo "   DB_DATABASE=your_database_name"
    echo "   JWT_SECRET=your_secure_jwt_secret"
    echo ""
    read -p "按回车键继续... Press Enter to continue..."
fi

# 选择构建类型
echo ""
echo "请选择构建选项："
echo "Please select build option:"
echo "1) 构建并运行容器 (推荐)"
echo "   Build and run container (Recommended)"
echo "2) 仅构建镜像"
echo "   Build image only"

read -p "请输入选项 (1-2): " choice

case $choice in
    1)
        echo "🔨 构建后端镜像..."
        echo "🔨 Building backend image..."
        docker build -t curriculum-backend .
        
        echo "🚀 启动后端容器..."
        echo "🚀 Starting backend container..."
        
        # 停止并删除已存在的容器
        docker stop curriculum-backend-container 2>/dev/null || true
        docker rm curriculum-backend-container 2>/dev/null || true
        
        # 运行新容器
        docker run -d \
          --name curriculum-backend-container \
          --env-file .env \
          -p 6015:6015 \
          --restart unless-stopped \
          curriculum-backend
        
        echo "⏳ 等待服务启动..."
        echo "⏳ Waiting for service to start..."
        sleep 15
        
        echo "🔍 检查容器状态..."
        echo "🔍 Checking container status..."
        docker ps --filter name=curriculum-backend-container
        
        echo ""
        echo "✅ 后端服务已启动！"
        echo "✅ Backend service is running!"
        echo "🌐 后端 API: http://localhost:6015/api"
        echo "🌐 Backend API: http://localhost:6015/api"
        echo "🏥 健康检查: http://localhost:6015/api/health"
        echo "🏥 Health check: http://localhost:6015/api/health"
        echo ""
        ;;
    2)
        echo "🔨 构建后端镜像..."
        echo "🔨 Building backend image..."
        docker build -t curriculum-backend .
        
        echo "✅ 后端镜像构建完成！"
        echo "✅ Backend image built successfully!"
        echo ""
        echo "🏃 手动运行命令:"
        echo "🏃 Manual run command:"
        echo "   docker run -d --name curriculum-backend-container --env-file .env -p 6015:6015 curriculum-backend"
        echo ""
        ;;
    *)
        echo "❌ 无效选项"
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "📋 有用的命令："
echo "📋 Useful commands:"
echo "   查看日志: docker logs curriculum-backend-container -f"
echo "   View logs: docker logs curriculum-backend-container -f"
echo "   停止容器: docker stop curriculum-backend-container"
echo "   Stop container: docker stop curriculum-backend-container"
echo "   重启容器: docker restart curriculum-backend-container"
echo "   Restart container: docker restart curriculum-backend-container"
echo "   删除容器: docker rm curriculum-backend-container"
echo "   Remove container: docker rm curriculum-backend-container"
echo ""
echo "📚 更多信息请查看 DOCKER-README.md"
echo "📚 For more information, see DOCKER-README.md"
