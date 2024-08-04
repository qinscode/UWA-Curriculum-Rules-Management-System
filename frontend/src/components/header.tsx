import {
  PhoneIcon,
  LifebuoyIcon,
  NewspaperIcon,
  ArrowDownTrayIcon,
  CogIcon,
  DocumentDuplicateIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline'
import { FC } from 'react'

const cards = [
  {
    name: 'Manage Rules',
    description: 'Create, edit, and delete course rules for your institution.',
    icon: DocumentDuplicateIcon,
  },
  {
    name: 'Generate Documents',
    description: 'Generate PDFs for specific courses or create a complete handbook.',
    icon: PaperClipIcon,
  },
  {
    name: 'System Settings',
    description:
      'Ratione et porro eligendi est sed ratione rerum itaque. Placeat accusantium impedit eum odit.',
    icon: CogIcon,
  },
  {
    name: 'Data Export',
    description:
      'Ratione et porro eligendi est sed ratione rerum itaque. Placeat accusantium impedit eum odit.',
    icon: ArrowDownTrayIcon,
  },
]

const Example: FC = () => {
  return (
    <>
      <div className="rounded-lg bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base font-semibold leading-7 text-indigo-600">Welcome to</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Course Rules Management System (Demo)
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            This centralized platform allows you to manage and update course rules efficiently. Use
            the navigation menu to access different features.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 md:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4 lg:gap-8">
          {cards.map((card) => (
            <div
              key={card.name}
              className="flex gap-x-4 rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10"
            >
              <card.icon className="h-7 w-5 flex-none text-indigo-400" aria-hidden="true" />
              <div className="text-base leading-7">
                <h3 className="font-semibold text-gray-600">{card.name}</h3>
                <p className="mt-2 text-gray-600">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Example
