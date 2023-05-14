FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN --mount=type=secret,id=SECRET_KEYS \
    echo "Secret: $(cat /run/secrets/SECRET_KEYS)" && \
    cat /run/secrets/SECRET_KEYS > /app/config/production.json

COPY . .

ENV PORT=3000

EXPOSE $PORT

CMD ["npm", "start"]
