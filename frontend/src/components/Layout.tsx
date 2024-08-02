// components/Layout.tsx
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@nextui-org/react";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isBordered>
        <NavbarBrand>
          <p className="font-bold text-inherit">Course Rules Management System (Demo)</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="/">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/manage-rules" color="foreground">
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
      </Navbar>
      <main className="flex-grow p-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}