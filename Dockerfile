FROM node:18-slim

RUN apt update -y
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev -y

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install

COPY . /app

RUN pnpm build

CMD ["pnpm", "start"]