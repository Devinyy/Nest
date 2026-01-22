FROM docker.1panel.live/library/nginx:alpine

# 使用国内镜像源加速
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
# 注意：这里假设 dist 目录已经通过 rsync 同步到了 Docker 构建上下文（即项目根目录）
COPY dist /var/www/html

# 修复权限问题，确保 nginx 用户可以读取文件
RUN chmod -R 755 /var/www/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
