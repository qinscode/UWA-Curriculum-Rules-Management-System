// components/Layout.tsx
'use client'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from '@nextui-org/react'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const menuItems = ['Home', 'Manage Rules', 'Generate Documents', 'Settings']

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="sm:hidden"
          />
          <NavbarBrand>
            <p className="font-bold text-inherit">ACME</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          <NavbarItem>
            <Link color="foreground" href="/">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="/manage-rules" aria-current="page">
              Manage Rules
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/generate-documents">
              Generate Documents
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/settings">
              Settings
            </Link>
          </NavbarItem>
        </NavbarContent>
        {/* <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent> */}
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2 ? 'primary' : index === menuItems.length - 1 ? 'danger' : 'foreground'
                }
                className="w-full"
                href="#"
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
      <main className="flex-grow p-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  )
}
