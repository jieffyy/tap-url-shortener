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

function isValidUseCases(d: any): boolean {
  const num = parseInt(d)
  return !Number.isNaN(num) && num > 0
}

export const shortenUrl = async (req: Request, res: Response) => {
  // validUses: number
  // origin: string
  const { origin, validUses } = req.body

  if (!isValidUrl(origin) || !isValidUseCases(validUses)) {
    res.status(400).json()
    return
  }

  const shortUrl = `${faker.word.adjective()}-${nanoid()}`

  try {
    const dbModel = await prisma.url_map.create({
      data: {
        original_url: origin,
        short_url: shortUrl,
        valid_uses: validUses
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
    res.status(404).json()
    return
  }

  try {
    const dbModel = await prisma.url_map.findFirst({
      where: {
        short_url: shortUrl
      }
    })

    if (!dbModel || dbModel.valid_uses <= 0) {
      res.status(404).json()
      return
    }

    await prisma.url_map.update({
      where: {
        short_url: shortUrl
      },
      data: {
        valid_uses: {
          decrement: 1
        }
      }
    })

    res.redirect(dbModel.original_url)
    return
  } catch (error) {
    logger.error('ERR_SHORTEN-URL_FAILED-FIND', { shortUrl, error })
    res.status(404).json()
    return
  }
}