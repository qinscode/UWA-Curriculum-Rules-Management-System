'use client'

import React, { FC, ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { isAuthenticated, logout } from '@/services/authService' // Import auth functions
import { useRouter, usePathname } from 'next/navigation'

interface NavigationItem {
  name: string
  href: string
  current?: boolean
}

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false) // Track user login state
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setLoggedIn(isAuthenticated())
  }, [])

  // Handle logout
  const handleLogout = () => {
    logout() // Clear user token
    setLoggedIn(false) // Update state
    router.push('/') // Redirect to home after logout
  }

  // Get the current path and dynamically assign the `current` property
  const navigation: NavigationItem[] = [
    { name: 'Home', href: '/', current: pathname === '/' },
    {
      name: 'Manage Standard Rules',
      href: '/manage-preset-course',
      current: pathname === '/manage-preset-course',
    },
    {
      name: 'Manage Course',
      href: '/manage-course',
      current: pathname === '/manage-course',
    },
    {
      name: 'Generate Documents',
      href: '/generate-documents',
      current: pathname === '/generate-documents',
    },
  ]

  // Logo Component
  const Logo = () => <img src="/uwa-logo.svg" alt="UWA Logo" className="h-10 w-auto" />

  return (
    <>
      <div className="min-h-screen bg-white">
        <Disclosure as="nav" className="bg- white- h-18 shadow-lg">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      {/* Use Logo to replace CRMS */}
                      <Logo />
                    </div>
                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            'inline-flex items-center border-b-2 px-1 pt-1 text-base font-medium',
                            item.current
                              ? 'border-indigo-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-blue-900'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {/* Conditionally render Sign In/Register or profile/Logout */}
                    <div className="hidden sm:flex sm:space-x-4">
                      {loggedIn ? (
                        <>
                          <Link
                            href={'/profile'}
                            className="text-base font-medium text-gray-500 hover:text-gray-700"
                          >
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="text-base font-medium text-gray-500 hover:text-gray-700"
                          >
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href={'/login'}
                            className="text-base font-medium text-gray-500 hover:text-indigo-500"
                          >
                            Sign In
                          </Link>
                          <Link
                            href={'/register'}
                            className="text-base font-medium text-gray-500 hover:text-indigo-500"
                          >
                            Register
                          </Link>
                        </>
                      )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                      <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                        )}
                      </Disclosure.Button>
                    </div>
                  </div>
                </div>
              </div>

              <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 pb-3 pt-2">
                  {navigation.map((item) => (
                    <DisclosureButton
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                        'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </DisclosureButton>
                  ))}
                  {/* Conditionally render Sign In/Register or profile/Logout for Mobile */}
                  {loggedIn ? (
                    <>
                      <DisclosureButton
                        as="a"
                        href="/profile"
                        className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                      >
                        Profile
                      </DisclosureButton>
                      <DisclosureButton
                        as="button"
                        onClick={handleLogout}
                        className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                      >
                        Logout
                      </DisclosureButton>
                    </>
                  ) : (
                    <>
                      <DisclosureButton
                        as="a"
                        href="/login"
                        className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                      >
                        Sign In
                      </DisclosureButton>
                      <DisclosureButton
                        as="a"
                        href="/register"
                        className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                      >
                        Register
                      </DisclosureButton>
                    </>
                  )}
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>

        <div>
          <div className="py-6"></div>

          <main>
            <div className="mx-auto mb-7 max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}

export default Layout
