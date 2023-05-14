FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN --mount=type=secret,id=SECRET_KEYS \
    x=$(pwd) && \
    echo "Secret is: $(cat /run)" && \
    echo "The current working directory : $x" && \
    cat /run/secrets/SECRET_KEYS > /app/config/production.json

ENV PORT=3000

EXPOSE $PORT

CMD ["npm", "start"]
