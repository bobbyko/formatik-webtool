FROM node:6.11.2
MAINTAINER Bobby Kotzev

ENV TZ=America/Los_Angeles
ENV appDir /srv/formatik/webtool

RUN mkdir -p ${appDir}
WORKDIR ${appDir}

RUN npm install -g http-server

COPY dist/. ${appDir}

CMD http-server -p 8000 -d false --gzip true --cors -c3600
