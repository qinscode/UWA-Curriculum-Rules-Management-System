// components/Layout.tsx
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-gray-800 p-4 text-white">
        <h1 className="text-2xl font-bold">Course Rules Management System (Demo)</h1>
      </header>
      <nav className="bg-blue-500 p-4 text-white">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/manage-rules" className="hover:underline">
              Manage Rules
            </Link>
          </li>
          <li>
            <Link href="/generate-documents" className="hover:underline">
              Generate Documents
            </Link>
          </li>
          <li>
            <Link href="/settings" className="hover:underline">
              Settings
            </Link>
          </li>
        </ul>
      </nav>
      <main className="flex-grow bg-gray-100 p-8">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">{children}</div>
      </main>
    </div>
  )
}
