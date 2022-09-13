import request from 'supertest'

jest.mock('../logger')
jest.mock('../env')
jest.mock('../prisma', () => ({
  url_map: {
    upsert: jest.fn(() => ({
      short_url: 'valid-short-url'
    })),
    findFirst: jest.fn(() => ({
      original_url: 'an-original-url'
    }))
  }
}))

import { app } from '../'

describe('POST /tasks', () => {
  it('validBody_returns200', (done) => {
    request(app).post('/api/shortenUrl').send({
      origin: 'https://www.google.com/'
    }).expect(200, done)
  })

  it('invalidBody_returns400', (done) => {
    request(app).post('/api/shortenUrl').send({
      origin: 'not a url'
    }).expect(400, done)
  })

  it('invalidBody_returns400', (done) => {
    request(app).post('/api/shortenUrl').send({
      origin: 123
    }).expect(400, done)
  })
})


afterAll(() => {
  process.emit('SIGTERM')
})