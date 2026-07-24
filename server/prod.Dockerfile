# Build stage
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY ./package*.json .
COPY ./src ./src
COPY ./tsconfig.json .
COPY ./types ./types

RUN npm install
RUN npm run tsc

# Production stage
FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY --chown=node:node ./package*.json .
COPY --chown=node:node ./dist ./dist
COPY --chown=node:node --from=build /usr/src/app/build ./build

RUN npm ci

EXPOSE 3001

ENV PORT=3001

CMD ["npm", "run", "start"]
