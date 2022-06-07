ARG NODE_VERSION=14.19.3
ARG BUILDER_OS_VERSION=bullseye
ARG RUNNER_OS_VERSION=slim

ARG BUILDER_IMAGE="node:${NODE_VERSION}-${BUILDER_OS_VERSION}"
ARG RUNNER_IMAGE="node:${NODE_VERSION}-${RUNNER_OS_VERSION}"

# BUILDER: Builds the Sapper application

FROM ${BUILDER_IMAGE} AS builder

WORKDIR /app

RUN npm install -g npm@8.11.0
RUN npm -v

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .
RUN npm run build

# DEPS: Build production deps only

FROM ${BUILDER_IMAGE} AS deps

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install -g npm@8.11.0
RUN npm ci --prod

# RUNNER: Only contains build/runtime artifacts

FROM ${RUNNER_IMAGE}

WORKDIR /app

COPY --from=deps /app .
COPY --from=builder /app/sapper sapper

EXPOSE 3000
CMD ["node", "sapper"]
