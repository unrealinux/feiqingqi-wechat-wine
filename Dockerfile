FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY . .

# 创建必要的目录
RUN mkdir -p output logs

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "index.js"]
