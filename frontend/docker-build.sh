#!/bin/bash

# UWA Curriculum Rules Management System - Frontend Docker Build Script
# 用于构建和管理前端Docker容器

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数定义
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Docker是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker 服务未运行，请启动 Docker"
        exit 1
    fi
}

# 构建镜像
build_image() {
    print_info "开始构建 UWA Curriculum Frontend 镜像..."
    
    # 标签名
    IMAGE_NAME="uwa-curriculum-frontend"
    IMAGE_TAG=${1:-"latest"}
    FULL_TAG="${IMAGE_NAME}:${IMAGE_TAG}"
    
    # 环境变量
    API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL:-"https://cab.fudong.dev/api"}
    
    print_info "构建镜像标签: ${FULL_TAG}"
    print_info "API Base URL: ${API_BASE_URL}"
    
    # 构建镜像
    if docker build \
        --build-arg NEXT_PUBLIC_API_BASE_URL="${API_BASE_URL}" \
        -t "${FULL_TAG}" .; then
        print_success "镜像构建成功: ${FULL_TAG}"
    else
        print_error "镜像构建失败"
        exit 1
    fi
    
    # 显示镜像信息
    print_info "镜像信息:"
    docker images "${IMAGE_NAME}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
}

# 运行容器
run_container() {
    IMAGE_NAME="uwa-curriculum-frontend"
    IMAGE_TAG=${1:-"latest"}
    FULL_TAG="${IMAGE_NAME}:${IMAGE_TAG}"
    CONTAINER_NAME="uwa-curriculum-frontend-container"
    
    # 环境变量
    API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL:-"https://cab.fudong.dev/api"}
    
    print_info "启动容器: ${CONTAINER_NAME}"
    print_info "API Base URL: ${API_BASE_URL}"
    
    # 停止并删除已存在的容器
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_warning "删除已存在的容器: ${CONTAINER_NAME}"
        docker stop "${CONTAINER_NAME}" || true
        docker rm "${CONTAINER_NAME}" || true
    fi
    
    # 运行新容器
    if docker run -d \
        --name "${CONTAINER_NAME}" \
        -p 6014:6014 \
        -e NEXT_PUBLIC_API_BASE_URL="${API_BASE_URL}" \
        -e NODE_ENV=production \
        -e PORT=6014 \
        --restart unless-stopped \
        "${FULL_TAG}"; then
        print_success "容器启动成功"
        print_info "访问地址: http://localhost:6014"
        print_info "查看日志: docker logs ${CONTAINER_NAME}"
    else
        print_error "容器启动失败"
        exit 1
    fi
}

# 停止容器
stop_container() {
    CONTAINER_NAME="uwa-curriculum-frontend-container"
    
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_info "停止容器: ${CONTAINER_NAME}"
        docker stop "${CONTAINER_NAME}"
        print_success "容器已停止"
    else
        print_warning "容器未运行: ${CONTAINER_NAME}"
    fi
}

# 查看日志
show_logs() {
    CONTAINER_NAME="uwa-curriculum-frontend-container"
    
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_info "显示容器日志: ${CONTAINER_NAME}"
        docker logs -f "${CONTAINER_NAME}"
    else
        print_error "容器不存在: ${CONTAINER_NAME}"
        exit 1
    fi
}

# 清理镜像和容器
cleanup() {
    IMAGE_NAME="uwa-curriculum-frontend"
    CONTAINER_NAME="uwa-curriculum-frontend-container"
    
    print_warning "清理容器和镜像..."
    
    # 停止并删除容器
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        docker stop "${CONTAINER_NAME}" || true
        docker rm "${CONTAINER_NAME}" || true
        print_info "已删除容器: ${CONTAINER_NAME}"
    fi
    
    # 删除镜像
    if docker images --format '{{.Repository}}' | grep -q "^${IMAGE_NAME}$"; then
        docker rmi "${IMAGE_NAME}" || true
        print_info "已删除镜像: ${IMAGE_NAME}"
    fi
    
    # 清理悬空镜像
    if docker images -f "dangling=true" -q | grep -q .; then
        docker rmi $(docker images -f "dangling=true" -q) || true
        print_info "已清理悬空镜像"
    fi
    
    print_success "清理完成"
}

# 显示状态
show_status() {
    CONTAINER_NAME="uwa-curriculum-frontend-container"
    IMAGE_NAME="uwa-curriculum-frontend"
    
    print_info "=== 容器状态 ==="
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        docker ps -a --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
        print_warning "容器不存在: ${CONTAINER_NAME}"
    fi
    
    echo ""
    print_info "=== 镜像信息 ==="
    if docker images --format '{{.Repository}}' | grep -q "^${IMAGE_NAME}$"; then
        docker images "${IMAGE_NAME}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
    else
        print_warning "镜像不存在: ${IMAGE_NAME}"
    fi
}

# 显示帮助
show_help() {
    echo "UWA Curriculum Rules Management System - Frontend Docker Build Script"
    echo ""
    echo "用法: $0 [命令] [选项]"
    echo ""
    echo "命令:"
    echo "  build [tag]     构建Docker镜像 (默认标签: latest)"
    echo "  run [tag]       运行Docker容器 (默认标签: latest)"
    echo "  stop            停止运行中的容器"
    echo "  logs            查看容器日志"
    echo "  status          显示容器和镜像状态"
    echo "  cleanup         清理容器和镜像"
    echo "  help            显示帮助信息"
    echo ""
    echo "环境变量:"
    echo "  NEXT_PUBLIC_API_BASE_URL  后端API基础URL (默认: https://cab.fudong.dev/api)"
    echo ""
    echo "示例:"
    echo "  $0 build                # 构建latest标签镜像"
    echo "  $0 build v1.0.0        # 构建v1.0.0标签镜像"
    echo "  $0 run                  # 运行latest标签容器"
    echo "  $0 run v1.0.0          # 运行v1.0.0标签容器"
    echo "  $0 stop                 # 停止容器"
    echo "  $0 logs                 # 查看日志"
    echo "  $0 status               # 显示状态"
    echo "  $0 cleanup              # 清理所有相关资源"
    echo ""
    echo "环境变量示例:"
    echo "  NEXT_PUBLIC_API_BASE_URL=http://backend:6015/api $0 build"
    echo "  NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api $0 run"
}

# 主逻辑
main() {
    # 检查Docker
    check_docker
    
    case "${1:-help}" in
        "build")
            build_image "$2"
            ;;
        "run")
            run_container "$2"
            ;;
        "stop")
            stop_container
            ;;
        "logs")
            show_logs
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            print_error "未知命令: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
