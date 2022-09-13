import * as yup from 'yup'
import { Request, Response } from 'express'
import * as client from '@prisma/client'
import prisma from './prisma'
import { faker } from '@faker-js/faker'
import { nanoid } from 'nanoid'
import { logger } from './logger'

function isValidUrl(d: string): boolean {
  return yup.string().url().isValidSync(d)
}

export const shortenUrl = async (req: Request, res: Response) => {
  const { origin } = req.body

  if (!isValidUrl(origin)) {
    res.status(400)
    return
  }



  const shortUrl = `${faker.word.adjective()}-${nanoid()}`

  try {
    const dbModel = await prisma.url_map.upsert({
      where: {
        original_url: origin
      },
      update: {},
      create: {
        original_url: origin,
        short_url: shortUrl
      }
    })

    res.status(200).json({ shortUrl: dbModel.short_url })
  } catch (error) {
    logger.error('ERR_SHORTEN-URL_FAILED-UPDATE', { shortUrl, origin, error })
    res.status(503).json()
  }
}

export const findUrl = async (req: Request, res: Response) => {
  const { shortUrl } = req.params
  if (!shortUrl) {
    res.status(404)
    return
  }

  try {
    const dbModel = await prisma.url_map.findFirst({
      where: {
        short_url: shortUrl
      }
    })

    if (!dbModel) {
      res.status(404)
      return
    } else {
      res.redirect(dbModel.original_url)
      return
    }
  } catch (error) {
    logger.error('ERR_SHORTEN-URL_FAILED-FIND', { shortUrl, error })
    res.status(404)
    return
  }
}