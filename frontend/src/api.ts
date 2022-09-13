import axios, { AxiosPromise } from "axios"
import ENV from "./env"

export type ShortenReqBody = {
  origin: string
}

export type ShortenResBody = {
  shortUrl: string
}

export function shortenUrl(d: ShortenReqBody): AxiosPromise<ShortenResBody> {
  return axios.post(`${ENV.BASE_API}/api/shortenUrl`, d)
}