FROM node:6.5.0

COPY . /app
WORKDIR /app

RUN apt-get update
RUN apt-get install imagemagick ghostscript
RUN npm --loglevel warn install

ENV NODE_ENV production

CMD ["node", "/app/app.js"]
