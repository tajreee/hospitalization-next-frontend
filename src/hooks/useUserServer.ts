import { cookies } from 'next/headers'
import { getCookie } from 'cookies-next'
import { customFetch } from '@/components/utils/customFetch'
import {
  User,
  ValidateTokenResponse,
} from '@/components/contexts/AuthContext/interface'

export default async function useUserServer(): Promise<User | undefined> {
  const AT = getCookie('AT', { cookies })
  if (!AT) {
    return undefined
  }

  try {
    console.log('Validating token on server side...')
    const response = await customFetch<ValidateTokenResponse>(
      '/auth/me',
      { isAuthorized: true },
      cookies
    )

    console.log('Token validation response:', response)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status, success, message, data } = response

    if (status !== 200) {
      return undefined
    }
    
    return data.user
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return undefined
  }
}
