'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/Fields'
import { Logo } from '@/components/ui/Logo'
import { SlimLayout } from '@/components/ui/SlimLayout'
import { register, login } from '@/services/authService'

export default function Register() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      await register({ username, email, password })
      // After successful registration, log the user in
      await login(email, password)
      // Redirect to the home page
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration')
    }
  }

  return (
    <SlimLayout>
      {/* go back button*/}
      <div className="mb-6 flex items-center">
        <button
          type="button"
          onClick={() => {
            router.push('/')
          }}
          className="flex items-center text-blue-600 hover:text-black"
        >
          <svg
            className="mr-2 h-16 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="h-10 w-auto" />
        </Link>
      </div>
      <h2 className="mt-20 text-lg font-semibold text-gray-900">Register</h2>
      <p className="mt-2 text-sm text-gray-700">
        Already registered?{' '}
        <Link href={'/login'} className="font-medium text-blue-600 hover:underline">
          Sign in
        </Link>{' '}
        to your account.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2"
      >
        <TextField
          className="col-span-full"
          label="Username"
          name="username"
          type="text"
          autoComplete="username"
          required
        />
        <TextField
          className="col-span-full"
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <TextField
          className="col-span-full"
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />

        {error && <div className="col-span-full text-sm text-red-500">{error}</div>}

        <div className="col-span-full">
          <Button type="submit" color="blue" className="w-full">
            <span>
              Sign up <span aria-hidden="true">&rarr;</span>
            </span>
          </Button>
        </div>
      </form>
    </SlimLayout>
  )
}
