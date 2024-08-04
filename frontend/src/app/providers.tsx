'use client'

import { NextUIProvider } from '@nextui-org/react'
import { FC } from 'react'

const Providers: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <NextUIProvider>{children}</NextUIProvider>
}

export default Providers
