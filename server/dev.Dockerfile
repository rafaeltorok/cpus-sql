FROM node:20-alpine

WORKDIR /usr/src/app

# Install curl for the healthcheck
RUN apk add --no-cache curl

# Install dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci

ENV PORT=3001

EXPOSE 3001

USER node

# Change to the bind mounted host project folder
WORKDIR /usr/src/app/server

CMD ["npm", "run", "dev"]
