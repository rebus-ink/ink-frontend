ARG NODE_VERSION=14.19.3
ARG OS_VERSION=bullseye

ARG BUILDER_IMAGE="node:${NODE_VERSION}-${OS_VERSION}"

FROM ${BUILDER_IMAGE}

WORKDIR /app

RUN npm install npm@8.11.0 --location=global

CMD ["/bin/bash"]
