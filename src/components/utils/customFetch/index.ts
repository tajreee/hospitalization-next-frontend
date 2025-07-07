import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { CustomFetchBaseResponse, CustomFetchRequestInit } from './interface'
import { deleteCookie, getCookie } from 'cookies-next'

export async function customFetch<T = CustomFetchBaseResponse>(
  url: string,
  options: CustomFetchRequestInit = { uploadFile: false },
  cookies?: () => Promise<ReadonlyRequestCookies>
): Promise<T> {
  const headers: HeadersInit = {
    authorization: '',
    'Content-Type': 'application/json',
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL as string
  const fullUrl = baseUrl + url

  if (options.isAuthorized) {
    const token = cookies
      ? await getCookie('AT', { cookies }) // use server
      : await getCookie('AT') // use client
    headers['authorization'] = `Bearer ${token}`
  }

  if (options.uploadFile) {
    delete headers['Content-Type']
  }

  const rawResult = await fetch(fullUrl.toString(), {
    headers,
    ...options,
  })

  const result = await rawResult.json()

  if (result.message === 'Token expired') {
    deleteCookie('AT')
  }

  return result
}

export function customFetchBody(body: object) {
  return JSON.stringify(body)
}
