import React from 'react'
import { Link } from 'react-scroll'

interface SidebarItem {
  id: string
  title: string
}

interface SidebarProps {
  items: SidebarItem[]
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <div className="w-64 pr-4">
      <nav className="sticky top-6">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                to={item.id}
                smooth={true}
                duration={500}
                offset={-70}
                className="block cursor-pointer rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
