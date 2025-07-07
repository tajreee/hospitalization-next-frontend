'use client'

import React, { createContext, useContext, useState } from 'react'
import {
  AuthContextInterface,
  AuthContextProviderProps,
  SignInPayload,
  SignInResponse,
  User,
} from '@/components/contexts/AuthContext/interface'
import { customFetch, customFetchBody } from '@/components/utils/customFetch'
import { deleteCookie, setCookie } from 'cookies-next/client'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({} as AuthContextInterface)

export const useAuthContext = () => useContext(AuthContext)

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
  user,
}) => {
  const router = useRouter()

  const [loggedUser, setLoggedUser] = useState<User | undefined>(user)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    user !== undefined && user !== null
  )

  async function login({
    email,
    password,
  }: SignInPayload): Promise<SignInResponse> {
    const response = await customFetch<SignInResponse>('/auth/login', {
      method: 'POST',
      body: customFetchBody({
        email,
        password,
      }),
    })

    if (!response.success) {
      setLoggedUser({} as User)
      setIsAuthenticated(false)

      throw new Error(response.message)
    }


    setIsAuthenticated(true)
    setCookie('AT', response.token)
    setLoggedUser(response.user)
    router.refresh()

    return response
  }

  async function logout() {
    deleteCookie('AT')
    setLoggedUser(undefined)
    setIsAuthenticated(false)
  }

  const contextValue = {
    user: loggedUser,
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
