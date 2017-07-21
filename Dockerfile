FROM node:6.11.1
MAINTAINER Bobby Kotzev

ENV TZ=America/Los_Angeles
ENV appDir /srv/formatik/webtool

RUN mkdir -p ${appDir}
WORKDIR ${appDir}

COPY . ${appDir}

RUN npm install

COPY client/dist/. ${appDir}

ENTRYPOINT ["dotnet", "Octagon.Formatik.API.dll"]
