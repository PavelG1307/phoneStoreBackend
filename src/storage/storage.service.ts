import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import * as uuid from 'uuid'
import * as sharp from 'sharp'
import axios, { AxiosInstance } from 'axios'
import { storageConstants } from "src/core/constants/storage"

@Injectable()
export class StorageService {
  http: AxiosInstance
  constructor() {
    this.http = axios.create()
    this.http.interceptors.response.use(
      (res) => {
        return res
      },
      async (error) => {
        const configQuery = error.config
        if (error.response.status === 401 && !storageConstants.retry) {
          configQuery._retry = true
          const newToken = await this.getCloudStorageToken()
          if (newToken) {
            configQuery.headers['X-Auth-Token'] = `${newToken}`
            return this.http(configQuery)
          } else {
            console.log('Не удалось обновить токен')
            return Promise.reject(error)
          }
        } else {
          return Promise.reject(error)
        }
      }
    )
  }

  async upload(file: Express.Multer.File) {
    if (file?.mimetype.split('/')[0] != 'image') {
      // throw new HttpException('Invalid image', HttpStatus.BAD_REQUEST)
    }
    const fileName = uuid.v4()
    const image = await sharp(file.buffer).webp().toBuffer()
    const smallImage = await sharp(image).resize(300).toBuffer()
    const relativeImagePath = `/images/${fileName}.webp`
    const relativeSmallImagePath = `/images/${fileName}x300.webp`
    const mimetype = 'image/webp'
    const path = await this.uploadToCDN(image, relativeImagePath, mimetype)
    const smallImagePath = await this.uploadToCDN(smallImage, relativeSmallImagePath, mimetype)
    return {
      full: path,
      small: smallImagePath
    }
  }

  private async uploadToCDN(buffer: Buffer, path: string, contextType: string): Promise<string | null> {
    const urlPath = `https://${storageConstants.storageId}.selcdn.ru/${storageConstants.container}${path}`
    const res = await this.http({
      method: 'put',
      url: urlPath,
      headers: {
        'X-Auth-Token': `${storageConstants['X-Auth-Token']}`,
        'content-type': `${contextType}`,
        'x-detect-content-type': 'true'
      },
      data: buffer,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    })
    if (res && res.status === 201) {
      return urlPath
    }
    throw new HttpException('Error upload images', HttpStatus.INTERNAL_SERVER_ERROR)
  }

  private async getCloudStorageToken(): Promise<string | null> {
    const res = await this.http({
      method: 'get',
      url: storageConstants.url,
      headers: {
        'X-Auth-User': storageConstants.user,
        'X-Auth-Key': storageConstants.password
      }
    })
    if (res.status === 204) {
      const XAuthToken: string = res.headers['x-auth-token']
      storageConstants['X-Auth-Token'] = XAuthToken
      return XAuthToken
    } else {
      console.log('Токен не обновлен - ', new Date())
      return null
    }
  }
  
}
