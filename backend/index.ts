import { shortenUrl, findUrl } from './controller';
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import ENV from './env'
import { logger, reqLogger } from './logger'

// Read the configs
// Exit if the env is not setup
Object.keys(ENV).forEach((key) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!ENV[key]) {
    // eslint-disable-next-line no-console
    console.error(`Missing key: ${key}`)
    process.exit(1)
  }
})

// Run the server
const app = express()
const port = ENV.PORT

// Setup middleware
app.use(bodyParser.json())
app.use(reqLogger)
app.use(helmet())
app.use(
  cors({ origin: '*' }),
)

// Setup routes
app.post("/api/shortenUrl", shortenUrl)
app.get("/u/:shortUrl", findUrl)

// Run the server
const server = app.listen(port, () => {
  logger.info(`Application listening on port ${port}`)
})
process.on('SIGTERM', () => {
  server.close(() => `Server closed`)
})
process.on('SIGINT', () => {
  server.close(() => `Server closed`)
})

export { app }