FROM node:6.11.1
MAINTAINER Bobby Kotzev

ENV TZ=America/Los_Angeles
ENV appDir /srv/formatik/webtool

RUN mkdir -p ${appDir}
WORKDIR ${appDir}

RUN npm install -g http-server

COPY package.json ${appDir}

RUN npm install --only=production

COPY client/dist/. ${appDir}

CMD http-server -p 8000 -d false -i false --gzip true --cors -c3600
