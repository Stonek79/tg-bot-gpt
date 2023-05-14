FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN --mount=type=secret,id=SECRET_KEYS \
    x=$(pwd) && \
    echo "The current working directory : $x" && \
    cat /run/secrets/SECRET_KEYS > /config/production.json

ENV PORT=3000

EXPOSE $PORT

CMD ["npm", "start"]
