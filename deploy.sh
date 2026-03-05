#!/bin/bash

# ==========================================
# 阿里云服务器一键部署脚本 (Docker 版)
# ==========================================

# ⚠️ 请修改以下配置为您的服务器信息
SERVER_IP="47.103.9.13"           # 服务器公网 IP
SERVER_USER="root"            # 服务器用户名
PROJECT_DIR="/opt/homepage"  # 服务器上存放项目的路径

# 检查是否修改了默认 IP
if [ "$SERVER_IP" = "x.x.x.x" ]; then
  echo "❌ 错误：请先编辑 deploy.sh 文件，填入您的服务器 IP！"
  exit 1
fi

echo "🚀 开始部署到阿里云服务器 ($SERVER_IP)..."

# 0. 本地构建
echo "🔨 正在本地构建项目..."
# 强制指定 HTTPS 域名进行构建，解决 Mixed Content 问题
ASTRO_SITE="https://devinnest.top" npm run build
# if [ $? -ne 0 ]; then
#   echo "❌ 本地构建失败，请检查代码"
#   exit 1
# fi

# 1. 检查本地依赖
if ! command -v rsync &> /dev/null; then
    echo "❌ 未找到 rsync 命令，请先安装 (brew install rsync)"
    exit 1
fi

# 2. 同步项目文件到服务器
# 排除 node_modules, .git 等不需要的文件
echo "📦 正在同步代码到服务器..."
rsync -avz --progress --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.env' \
  --exclude '.DS_Store' \
  ./ "$SERVER_USER@$SERVER_IP:$PROJECT_DIR"

if [ $? -ne 0 ]; then
  echo "❌ 代码同步失败，请检查网络或 SSH 配置"
  exit 1
fi

# 3. 在服务器上执行 Docker 构建和启动
echo "🐳 正在服务器上构建并启动容器..."
ssh "$SERVER_USER@$SERVER_IP" "cd $PROJECT_DIR && \
  # 调试：检查 dist 目录是否存在
  if [ ! -d \"dist\" ]; then
    echo '❌ 错误：服务器上未找到 dist 目录，同步可能失败'
    ls -la
    exit 1
  fi && \
  # 防御性修正：确保 .dockerignore 不排除 dist
  if [ -f .dockerignore ]; then 
    sed -i '/^dist$/d' .dockerignore
    sed -i '/\/dist/d' .dockerignore
  fi && \
  # 确保 Docker 正在运行
  if ! command -v docker &> /dev/null; then
    echo '❌ 服务器未安装 Docker，正在尝试使用阿里云镜像源安装...'
    # 使用阿里云镜像源安装 Docker
    curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
  fi && \
  # 自动检测 Compose 命令并启动
  if docker compose version >/dev/null 2>&1; then
    echo "🐳 使用 docker compose 启动服务..."
    # 强制重新构建，不使用缓存，确保 CSS/JS 更新
    ASTRO_SITE='' docker compose build --no-cache
    ASTRO_SITE='' docker compose up -d --remove-orphans
  else
    echo "🐳 使用 docker-compose 启动服务..."
    # 强制重新构建，不使用缓存，确保 CSS/JS 更新
    ASTRO_SITE='' docker-compose build --no-cache
    ASTRO_SITE='' docker-compose up -d --remove-orphans
  fi && \
  echo '清理未使用的镜像...' && \
  docker image prune -f"

if [ $? -eq 0 ]; then
  echo ""
  echo "🎉 部署成功！"
  echo "👉 访问地址: http://$SERVER_IP"
else
  echo "❌ 服务器端执行失败"
  exit 1
fi
