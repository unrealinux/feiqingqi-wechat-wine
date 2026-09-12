FROM node:20-alpine

# 说明：【已归档】本镜像运行的是第一代流水线（crawler → aggregator → generator → publisher）。
# 该流水线已整体归档到 archive/first-gen/，不再由 CI 构建/部署。
# 保留此文件仅为将来可能的复活参考；构建需在仓库根目录执行：
#     docker build -f archive/first-gen/Dockerfile .
# 项目当前实际使用的是本机渲染引擎（engine/），不需要容器化。

# 设置工作目录
WORKDIR /app

# 安装依赖
# 注：`--only=production` 在 npm 7+ 已废弃（被忽略并告警），正确写法是 --omit=dev
COPY package*.json ./
RUN npm ci --omit=dev

# 复制源代码（.dockerignore 已排除 .env，凭据不会进镜像）
COPY . .

# 创建必要的目录
RUN mkdir -p output logs

# 暴露端口
EXPOSE 3000

# 启动命令（归档路径，构建上下文须为仓库根）
CMD ["node", "archive/first-gen/index.js"]
