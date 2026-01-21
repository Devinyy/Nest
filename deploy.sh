#!/bin/bash

# 1. 确保构建了最新版本
echo "🚀 开始构建..."
npm run build

# 2. 压缩产物（方便传输）
echo "📦 正在压缩 dist 目录..."
tar -czf dist.tar.gz dist/

# 3. 上传到服务器 (请替换 user, ip, path)
# SERVER_USER="root"
# SERVER_IP="your_server_ip"
# REMOTE_PATH="/var/www/homepage"

echo "✅ 构建完成！请执行以下命令上传并部署："
echo ""
echo "# 1. 上传文件"
echo "scp dist.tar.gz root@<服务器IP>:/tmp/"
echo ""
echo "# 2. 登录服务器并解压"
echo "ssh root@<服务器IP> 'rm -rf /var/www/html/* && tar -xzf /tmp/dist.tar.gz -C /var/www/html/ --strip-components=1 && rm /tmp/dist.tar.gz'"
echo ""
echo "🎉 部署完成！"
