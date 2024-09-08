'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/services/authService'
import React, { ComponentType } from 'react'

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter()

    useEffect(() => {
      if (!isAuthenticated()) {
        // If user is not authenticated, redirect to login
        router.push('/login')
      }
    }, [router])

    // If the user is not authenticated, we can return null (or a loading spinner)
    if (!isAuthenticated()) {
      return null
    }

    // If authenticated, render the wrapped component
    return <WrappedComponent {...props} />
  }

  return AuthComponent
}

export default withAuth
