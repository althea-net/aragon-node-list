FROM ipfs/go-ipfs AS build

FROM node:10-alpine
COPY --from=build /usr/local/bin/ipfs /usr/local/bin/

USER root
RUN apk add --update --no-cache \
  bash \
  curl \
  git \
  alpine-sdk \
  python-dev

RUN npm install -g node-gyp --unsafe-perm=true --allow-root
RUN npm install -g scrypt --unsafe-perm=true --allow-root
RUN npm install -g @aragon/cli --unsafe-perm=true --allow-root

RUN mkdir /app
COPY . /app
RUN ls /app
WORKDIR /app
RUN yarn install

ENTRYPOINT ["aragon", "run"]
