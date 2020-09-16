
FROM node:14.10.1


# コンテナ上の作業ディレクトリ作成
WORKDIR /app

COPY package.json /app/package.json
RUN npm install
RUN npm install firebase
