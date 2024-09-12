'use client'

import React, { FC, ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { isAuthenticated, logout } from '@/services/authService' // Import auth functions
import { useRouter } from 'next/navigation'

interface NavigationItem {
  name: string
  href: string
  current?: boolean
}

const navigation: NavigationItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Manage Course', href: '/manage-course' },
  { name: 'Generate Documents', href: '/generate-documents' },
]

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

interface LayoutProps {
  children: ReactNode
}

// 正确的 Logo 组件路径，去掉了重复的 ".svglogo.svg"
const Logo = () => <img src="/uwa-logo.svg" alt="UWA Logo" width={100} height={100} />

const Layout: FC<LayoutProps> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false) // Track user login state
  const router = useRouter()

  // Check if the user is authenticated
  useEffect(() => {
    setLoggedIn(isAuthenticated())
  }, [])

  // Handle logout
  const handleLogout = () => {
    logout() // Clear user token
    setLoggedIn(false) // Update state
    router.push('/') // Redirect to home after logout
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <Disclosure as="nav" className="bg-white shadow-sm">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      {/* 使用 Logo 组件替换原来的 CRMS */}
                      <Logo />
                    </div>
                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'border-indigo-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
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
                            className="text-sm font-medium text-gray-500 hover:text-gray-700"
                          >
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-gray-500 hover:text-gray-700"
                          >
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href={'/login'}
                            className="text-sm font-medium text-gray-500 hover:text-gray-700"
                          >
                            Sign In
                          </Link>
                          <Link
                            href={'/register'}
                            className="text-sm font-medium text-gray-500 hover:text-gray-700"
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
          {/* DO NOT DELETE THIS DIV!!!!!!! */}
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
