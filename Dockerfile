FROM node:16-alpine

WORKDIR /app

RUN --mount=type=secret, id=SECRET_KEYS \
    x=$(pwd) && \
    echo "Directories is: $(cat /run/secrets/SECRET_KEYS)" && \
    echo "The current working directory: $x"

COPY package*.json ./

RUN npm ci

COPY . .

ENV PORT=3000

EXPOSE $PORT

CMD ["npm", "start"]
