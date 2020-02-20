FROM node:12.13.0-buster-slim
# Environment
ENV TINI_VERSION v0.18.0

# Woring directory
WORKDIR /app/
ARG NODE_ENV=production

ADD dist dist
ADD package.json package.json
ADD yarn.lock yarn.lock
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /tini

RUN yarn install --production && yarn cache clean

EXPOSE 10002
RUN chmod +x /tini

ENTRYPOINT ["/tini", "--"]
CMD [ "node", "./dist/server/www.js" ]
#CMD [ "tail", "-f", "/dev/null" ]
