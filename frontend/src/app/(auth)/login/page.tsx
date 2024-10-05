'use client'
import { type Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/Fields'
import { Logo } from '@/components/ui/Logo'
import { SlimLayout } from '@/components/ui/SlimLayout'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/services/authService' // Import the login service

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  // Handle form submission and login logic
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const token = await login(email, password) // Use the login service from authService.ts
      localStorage.setItem('token', token) // Store JWT token
      router.push('/manage-course') // Redirect to dashboard after successful login
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.') // Display error if login fails
    }
  }

  return (
    <SlimLayout>
      {/* go back button*/}
      <div className="mb-6 flex items-center">
        <button
          type="button"
          onClick={() => router.back()} // use router.back() to go back
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
        <Logo className="h-10 w-auto" />
      </div>
      <h2 className="mt-20 text-lg font-semibold text-gray-900">Sign in to your account</h2>
      <p className="mt-2 text-sm text-gray-700">
        Don’t have an account?{' '}
        <Link href={'/register'} className="font-medium text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-y-8">
        <TextField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div>
          <Button type="submit" color="blue" className="w-full">
            <span>
              Sign in <span aria-hidden="true">&rarr;</span>
            </span>
          </Button>
        </div>
      </form>
    </SlimLayout>
  )
}
