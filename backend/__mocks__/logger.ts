import { NextFunction, Request, Response } from 'express'

const logger = {
  info: jest.fn(),
  error: jest.fn(),
}

const reqLogger = (_req: Request, _res: Response, next: NextFunction) => next()

export { logger, reqLogger }