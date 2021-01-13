FROM node:14.15.4

# コンテナ上の作業ディレクトリ作成
WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm ci
