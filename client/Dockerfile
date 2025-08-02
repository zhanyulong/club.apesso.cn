FROM node:16

USER node

RUN mkdir /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package.json .

RUN npm set-script prepare ""

RUN npm config set registry https://registry.npmmirror.com
RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "npm", "start" ]
