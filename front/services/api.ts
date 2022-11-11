import axios, { AxiosInstance, CancelTokenStatic } from 'axios'

type Api = AxiosInstance & { cancelToken: CancelTokenStatic }

export const api = {
  ...axios.create({
    baseURL: process.env.BASE_URL,
  }),
  cancelToken: axios.CancelToken,
} as Api
