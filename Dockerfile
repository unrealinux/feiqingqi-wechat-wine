FROM node:20-alpine

# 说明：本镜像运行的是「第一代流水线」（crawler → aggregator → generator → publisher）。
# 该流水线目前停滞、且未经验证可用（见仓库 README 的「已知问题」）。
# 项目当前实际使用的渲染引擎（engine/）是本机工具，不需要容器化。
# 因此容器路径默认不在 CI 中运行（受 ENABLE_DOCKER_DEPLOY 开关控制）。

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

# 启动命令
CMD ["node", "index.js"]
