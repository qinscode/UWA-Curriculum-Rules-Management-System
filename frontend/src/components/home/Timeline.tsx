import React, { FC } from 'react'

interface TimelineItem {
  name: string
  description: string
  date: string
  dateTime: string
}

const timeline: TimelineItem[] = [
  {
    name: 'Deliverable v1.0',
    description:
      'In this phase, we gathered client requirements, confirmed the Minimum Viable Product (MVP), and designed the initial prototype. We also decided on the technology stack and initialized both the backend and frontend environments.',
    date: '10 Aug 2024',
    dateTime: '2024-08-10',
  },
  {
    name: 'Deliverable v2.0',
    description:
      'For the frontend, we implemented draggable and nestable requirement tree nodes. On the backend, we focused on Authentication and Authorization implementation, along with data modeling. We also built the structure for generating PDF and HTML documents.',
    date: '25 Aug 2024',
    dateTime: '2024-08-25',
  },
  {
    name: 'Deliverable v3.0',
    description:
      'This phase introduced the Manage Rules page, improvements to the numbering system, and optimizations to the database. Additionally, we developed the login and registration pages, ensuring a smooth user authentication process.',
    date: '20 Sep 2024',
    dateTime: '2024-09-20',
  },
  {
    name: 'Deliverable v4.0',
    description:
      'In the final phase, we implemented the Manage Course feature for admin use, enabling both admin and normal user access. We also integrated document generation capabilities. Extensive testing was conducted to fix bugs and ensure system stability before final deployment.',
    date: '15 Oct 2024',
    dateTime: '2024-10-15',
  },
]

const TimeLine: FC = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {timeline.map((item) => (
            <div key={item.name}>
              <time
                dateTime={item.dateTime}
                className="flex items-center text-sm font-semibold leading-6 text-indigo-600"
              >
                <svg viewBox="0 0 4 4" className="mr-4 h-1 w-1 flex-none" aria-hidden="true">
                  <circle cx={2} cy={2} r={2} fill="currentColor" />
                </svg>
                {item.date}
                <div
                  className="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                  aria-hidden="true"
                />
              </time>
              <p className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                {item.name}
              </p>
              <p className="mt-1 text-base leading-7 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TimeLine
