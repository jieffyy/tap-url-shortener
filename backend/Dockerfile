# The file should be built into the dist/ folder already
FROM node:18 AS builder
WORKDIR /usr/app/builder
COPY ./dist .
RUN npm i && npm run prisma:generate

FROM node:18-alpine

ARG NODE_ENV=production
ARG PORT=3001
ARG DB_URL
ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}
ENV DB_URL=${DB_URL}

WORKDIR /app
COPY --from=builder /usr/app/builder .
EXPOSE 3001
CMD ["npm", "run", "serve"]