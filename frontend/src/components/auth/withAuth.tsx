'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/services/authService'
import React, { ComponentType } from 'react'

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      if (!isAuthenticated()) {
        router.push('/login')
      } else {
        setIsLoading(false)
      }
    }, [router])

    if (isLoading) {
      return <div>Loading...</div> // 或者您可以使用一个加载动画组件
    }

    return <WrappedComponent {...props} />
  }

  return AuthComponent
}

export default withAuth
